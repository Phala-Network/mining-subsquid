import {BigDecimal} from '@subsquid/big-decimal'
import assert from 'assert'
import {In} from 'typeorm'
import {
  Account,
  GlobalState,
  Miner,
  MinerState,
  StakePool,
  StakePoolStake,
  StakePoolWhitelist,
  TokenomicParameters,
  Worker,
} from './model'
import {Ctx, SerializedEvent} from './processor'
import {
  combineIds,
  getAccount,
  getStakePool,
  max,
  updateWorkerShare,
  updateWorkerSMinAndSMax,
} from './utils/common'

const processSerializedEvents = async (
  ctx: Ctx,
  serializedEvents: SerializedEvent[]
): Promise<void> => {
  const stakePoolIds = new Set<string>()
  const workerIds = new Set<string>()
  const minerIds = new Set<string>()
  const stakePoolStakeIds = new Set<string>()
  const stakePoolStakeStakePoolIds = new Set<string>()
  const stakePoolWhitelistIds = new Set<string>()

  for (const {name, params} of serializedEvents) {
    if (
      name === 'PhalaStakePool.PoolWorkerAdded' ||
      name === 'PhalaStakePool.PoolWorkerRemoved' ||
      name === 'PhalaStakePool.PoolCommissionSet' ||
      name === 'PhalaStakePool.PoolCapacitySet' ||
      name === 'PhalaStakePool.Contribution' ||
      name === 'PhalaStakePool.Withdrawal' ||
      name === 'PhalaStakePool.WithdrawalQueued' ||
      name === 'PhalaStakePool.PoolWhitelistCreated' ||
      name === 'PhalaStakePool.PoolWhitelistDeleted' ||
      name === 'PhalaStakePool.PoolWhitelistStakerAdded' ||
      name === 'PhalaStakePool.PoolWhitelistStakerRemoved' ||
      name === 'PhalaStakePool.RewardReceived' ||
      name === 'PhalaStakePool.RewardsWithdrawn' ||
      name === 'PhalaStakePool.OwnerRewardsWithdrawn' ||
      name === 'PhalaStakePool.StakerRewardsWithdrawn'
    ) {
      stakePoolIds.add(params.stakePoolId)
    }

    if (
      name === 'PhalaMining.MinerBound' ||
      name === 'PhalaMining.MinerUnbound' ||
      name === 'PhalaStakePool.PoolWorkerAdded' ||
      name === 'PhalaStakePool.PoolWorkerRemoved' ||
      name === 'PhalaStakePool.MiningStarted' ||
      name === 'PhalaRegistry.InitialScoreSet' ||
      name === 'PhalaRegistry.WorkerUpdated'
    ) {
      workerIds.add(params.workerId)
    }

    if (
      name === 'PhalaMining.MinerBound' ||
      name === 'PhalaMining.MinerUnbound' ||
      name === 'PhalaMining.MinerSettled' ||
      name === 'PhalaMining.MinerStarted' ||
      name === 'PhalaMining.MinerStopped' ||
      name === 'PhalaMining.MinerReclaimed' ||
      name === 'PhalaMining.BenchmarkUpdated' ||
      name === 'PhalaMining.MinerEnterUnresponsive' ||
      name === 'PhalaMining.MinerExitUnresponsive'
    ) {
      minerIds.add(params.minerId)
    }

    if (
      name === 'PhalaStakePool.Contribution' ||
      name === 'PhalaStakePool.Withdrawal' ||
      name === 'PhalaStakePool.WithdrawalQueued' ||
      name === 'PhalaStakePool.RewardsWithdrawn' ||
      name === 'PhalaStakePool.StakerRewardsWithdrawn'
    ) {
      stakePoolStakeIds.add(combineIds(params.stakePoolId, params.accountId))
    }

    if (name === 'PhalaStakePool.RewardReceived') {
      stakePoolStakeStakePoolIds.add(params.stakePoolId)
    }

    if (name === 'PhalaStakePool.PoolWhitelistStakerRemoved') {
      stakePoolWhitelistIds.add(
        combineIds(params.stakePoolId, params.accountId)
      )
    }
  }

  const globalState = await ctx.store.findOneOrFail(GlobalState, {
    where: {id: '0'},
  })
  const tokenomicParameters = await ctx.store.findOneOrFail(
    TokenomicParameters,
    {
      where: {id: '0'},
    }
  )
  // FIXME: Can't get all necessary account base on event
  const accounts: Map<string, Account> = await ctx.store
    .find(Account)
    .then((a) => new Map(a.map((a) => [a.id, a])))
  const stakePools: Map<string, StakePool> = await ctx.store
    .find(StakePool, {
      where: {id: In([...stakePoolIds])},
      relations: {owner: true},
    })
    .then((stakePools) => new Map(stakePools.map((s) => [s.id, s])))
  const workers: Map<string, Worker> = new Map(
    (
      await Promise.all([
        ctx.store.find(Worker, {
          where: {id: In([...workerIds])},
          relations: {stakePool: {owner: true}, miner: true},
        }),
        ctx.store.find(Worker, {
          where: {miner: {id: In([...minerIds])}},
          relations: {stakePool: {owner: true}, miner: true},
        }),
      ])
    )
      .flat()
      .map((w) => [w.id, w])
  )
  const miners: Map<string, Miner> = new Map(
    (
      await Promise.all([
        ctx.store.find(Miner, {
          where: {id: In([...minerIds])},
          relations: {stakePool: {owner: true}, worker: true},
        }),
        ctx.store.find(Miner, {
          where: {worker: {id: In([...workerIds])}},
          relations: {stakePool: {owner: true}, worker: true},
        }),
      ])
    )
      .flat()
      .map((m) => [m.id, m])
  )
  const stakePoolStakes: Map<string, StakePoolStake> = await ctx.store
    .find(StakePoolStake, {
      where: [
        {id: In([...stakePoolStakeIds])},
        {stakePool: {id: In([...stakePoolStakeStakePoolIds])}},
      ],
      relations: {stakePool: {owner: true}, account: true},
    })
    .then((stakePoolStakes) => new Map(stakePoolStakes.map((s) => [s.id, s])))
  const stakePoolWhitelists: Map<string, StakePoolWhitelist> = await ctx.store
    .find(StakePoolWhitelist, {
      where: {id: In([...stakePoolWhitelistIds])},
      relations: {stakePool: {owner: true}, account: true},
    })
    .then(
      (stakePoolWhitelists) =>
        new Map(stakePoolWhitelists.map((s) => [s.id, s]))
    )

  for (const {name, params, block} of serializedEvents) {
    const blockTime = new Date(block.timestamp)
    globalState.height = block.height
    ctx.log.debug(`#${block.height}`)
    ctx.log.debug(`Processing ${name} with params: ${JSON.stringify(params)}`)
    if (name === 'PhalaStakePool.PoolCreated') {
      const {stakePoolId, owner} = params
      const account = getAccount(accounts, owner)
      const stakePool = new StakePool({
        id: stakePoolId,
        pid: BigInt(stakePoolId),
        owner: account,
        commission: BigDecimal(0),
        freeStake: BigDecimal(0),
        releasingStake: BigDecimal(0),
        totalStake: BigDecimal(0),
        totalShares: BigDecimal(0),
        ownerReward: BigDecimal(0),
        activeStakeCount: 0,
        workerCount: 0,
        miningWorkerCount: 0,
        totalWithdrawal: BigDecimal(0),
        miningWorkerShare: BigDecimal(0),
        aprBase: BigDecimal(0),
        whitelistEnabled: false,
      })
      await ctx.store.save(account)
      await ctx.store.insert(stakePool)
      stakePools.set(stakePoolId, stakePool)
    } else if (name === 'PhalaStakePool.PoolCommissionSet') {
      const {stakePoolId, commission} = params
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      stakePool.commission = commission
      if (stakePool.totalStake.gt(0)) {
        stakePool.aprBase = stakePool.miningWorkerShare
          .times(BigDecimal(1).minus(stakePool.commission))
          .div(stakePool.totalStake)
      }
    } else if (name === 'PhalaStakePool.PoolCapacitySet') {
      const {stakePoolId, cap} = params
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      stakePool.capacity = cap
      stakePool.delegable = stakePool.capacity
        .minus(stakePool.totalStake)
        .plus(stakePool.totalWithdrawal)
    } else if (name === 'PhalaStakePool.PoolWorkerAdded') {
      const {stakePoolId, workerId} = params
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      const worker = workers.get(workerId)
      assert(worker?.miner) // NOTE: MinerBound happens before PoolWorkerAdded
      const miner = miners.get(worker.miner.id)
      assert(miner)
      stakePool.workerCount++
      worker.stakePool = stakePool
      miner.stakePool = stakePool
    } else if (name === 'PhalaStakePool.PoolWorkerRemoved') {
      const {stakePoolId, workerId} = params
      const worker = workers.get(workerId)
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      assert(worker?.stakePool?.id === stakePoolId)
      worker.stakePool = null
      stakePool.workerCount--
    } else if (name === 'PhalaStakePool.MiningStarted') {
      const {stakePoolId, workerId, amount} = params
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      const worker = workers.get(workerId)
      assert(worker)
      assert(worker.miner)
      const miner = miners.get(worker.miner.id)
      assert(miner)
      miner.stake = amount
      stakePool.freeStake = stakePool.freeStake.minus(amount)
    } else if (name === 'PhalaStakePool.Contribution') {
      const {stakePoolId, accountId, amount, shares} = params
      const account = getAccount(accounts, accountId)
      const stakePool = stakePools.get(stakePoolId)
      const stakePoolStakeId = combineIds(stakePoolId, accountId)
      const stakePoolStake = stakePoolStakes.get(stakePoolStakeId)
      assert(stakePool)
      stakePool.freeStake = stakePool.freeStake.plus(amount)
      stakePool.totalShares = stakePool.totalShares.plus(shares)
      stakePool.totalStake = stakePool.totalStake.plus(amount)
      stakePool.aprBase = stakePool.miningWorkerShare
        .times(BigDecimal(1).minus(stakePool.commission))
        .div(stakePool.totalStake)
      account.totalStake = account.totalStake.plus(amount)
      globalState.totalStake = globalState.totalStake.plus(amount)
      if (stakePool.delegable != null) {
        stakePool.delegable = stakePool.delegable.minus(amount)
      }
      if (stakePoolStake != null) {
        if (stakePoolStake.shares.eq(0)) {
          stakePool.activeStakeCount++
        }
        stakePoolStake.shares = stakePoolStake.shares.plus(shares)
        stakePoolStake.amount = stakePoolStake.amount.plus(amount)
      } else {
        stakePoolStakes.set(
          stakePoolStakeId,
          new StakePoolStake({
            id: stakePoolStakeId,
            stakePool,
            account: getAccount(accounts, accountId),
            amount,
            shares,
            reward: BigDecimal(0),
            withdrawalAmount: BigDecimal(0),
            withdrawalShares: BigDecimal(0),
          })
        )
      }
    } else if (name === 'PhalaStakePool.Withdrawal') {
      const {stakePoolId, accountId, amount, shares} = params
      const account = getAccount(accounts, accountId)
      const stakePool = stakePools.get(stakePoolId)
      const stakePoolStakeId = combineIds(stakePoolId, accountId)
      const stakePoolStake = stakePoolStakes.get(stakePoolStakeId)
      assert(stakePool)
      assert(stakePoolStake)
      account.totalStake = account.totalStake.minus(amount)
      globalState.totalStake = globalState.totalStake.minus(amount)
      stakePool.totalShares = stakePool.totalShares.minus(shares)
      stakePool.totalStake = stakePool.totalStake.minus(amount)
      stakePool.aprBase = stakePool.totalStake.eq(0)
        ? BigDecimal(0)
        : stakePool.miningWorkerShare
            .times(BigDecimal(1).minus(stakePool.commission))
            .div(stakePool.totalStake)
      stakePool.freeStake = stakePool.freeStake.minus(amount)
      stakePoolStake.shares = stakePoolStake.shares.minus(shares)
      stakePoolStake.amount = stakePoolStake.amount.minus(amount)
      if (stakePoolStake.shares.eq(0)) {
        stakePool.activeStakeCount--
      }
      if (stakePool.totalWithdrawal.gt(0)) {
        stakePool.totalWithdrawal = max(
          stakePool.totalWithdrawal.minus(amount),
          BigDecimal(0)
        )
      }
      if (stakePool.capacity != null) {
        stakePool.delegable = stakePool.capacity
          .minus(stakePool.totalStake)
          .plus(stakePool.totalWithdrawal)
      }
      if (stakePoolStake.withdrawalShares.gt(0)) {
        stakePoolStake.withdrawalShares = max(
          stakePoolStake.withdrawalShares.minus(shares),
          BigDecimal(0)
        )
      }
      if (stakePoolStake.withdrawalAmount.gt(0)) {
        stakePoolStake.withdrawalAmount = max(
          stakePoolStake.withdrawalAmount.minus(amount),
          BigDecimal(0)
        )
      }
    } else if (name === 'PhalaStakePool.WithdrawalQueued') {
      const {stakePoolId, accountId, shares} = params
      const stakePoolStakeId = combineIds(stakePoolId, accountId)
      const stakePool = stakePools.get(stakePoolId)
      const stakePoolStake = stakePoolStakes.get(stakePoolStakeId)
      assert(stakePool)
      assert(stakePoolStake)
      const {totalShares, totalStake} = stakePool
      const amount = shares.div(totalShares).times(totalStake).round(12, 0)
      // Replace previous withdrawal
      stakePool.totalWithdrawal = stakePool.totalWithdrawal.minus(
        stakePoolStake.withdrawalAmount
      )
      stakePoolStake.withdrawalShares = shares
      stakePoolStake.withdrawalAmount = amount
      stakePoolStake.withdrawalStartTime = blockTime
      stakePool.totalWithdrawal = stakePool.totalWithdrawal.plus(amount)
      if (stakePool.capacity != null) {
        stakePool.delegable = stakePool.capacity
          .minus(stakePool.totalStake)
          .plus(stakePool.totalWithdrawal)
      }
    } else if (name === 'PhalaStakePool.RewardReceived') {
      const {stakePoolId, toOwner, toStakers} = params
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      const {totalShares} = stakePool
      const ownerAccount = getAccount(accounts, stakePool.owner.id)
      stakePool.ownerReward = stakePool.ownerReward.plus(toOwner)
      ownerAccount.totalOwnerReward =
        ownerAccount.totalOwnerReward.plus(toOwner)
      for (const [, stakePoolStake] of stakePoolStakes) {
        if (stakePoolStake.stakePool.id === stakePoolId) {
          const account = getAccount(accounts, stakePoolStake.account.id)
          const {shares} = stakePoolStake
          const amount = toStakers.times(shares).div(totalShares).round(12, 0)
          stakePoolStake.reward = stakePoolStake.reward.plus(amount)
          account.totalStakeReward = account.totalStakeReward.plus(amount)
        }
      }
    } else if (name === 'PhalaStakePool.RewardsWithdrawn') {
      const {stakePoolId, accountId} = params
      const account = getAccount(accounts, accountId)
      const stakePoolStakeId = combineIds(stakePoolId, accountId)
      const stakePool = stakePools.get(stakePoolId)
      const stakePoolStake = stakePoolStakes.get(stakePoolStakeId)
      assert(stakePool)
      if (stakePool.owner.id === accountId) {
        const ownerReward = stakePool.ownerReward
        account.totalOwnerReward = account.totalOwnerReward.minus(ownerReward)
        stakePool.ownerReward = BigDecimal(0)
      }
      if (stakePoolStake != null) {
        const stakeReward = stakePoolStake.reward
        account.totalStakeReward = account.totalStakeReward.minus(stakeReward)
        stakePoolStake.reward = BigDecimal(0)
      }
    } else if (name === 'PhalaStakePool.OwnerRewardsWithdrawn') {
      const {stakePoolId} = params
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      const account = getAccount(accounts, stakePool.owner.id)
      const ownerReward = stakePool.ownerReward
      account.totalOwnerReward = account.totalOwnerReward.minus(ownerReward)
      stakePool.ownerReward = BigDecimal(0)
    } else if (name === 'PhalaStakePool.StakerRewardsWithdrawn') {
      const {stakePoolId, accountId} = params
      const stakePoolStakeId = combineIds(stakePoolId, accountId)
      const stakePool = stakePools.get(stakePoolId)
      const stakePoolStake = stakePoolStakes.get(stakePoolStakeId)
      assert(stakePool)
      assert(stakePoolStake)
      const account = getAccount(accounts, stakePoolStake.account.id)
      const stakeReward = stakePoolStake.reward
      account.totalStakeReward = account.totalStakeReward.minus(stakeReward)
      stakePoolStake.reward = BigDecimal(0)
    } else if (name === 'PhalaStakePool.PoolWhitelistCreated') {
      const {stakePoolId} = params
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      stakePool.whitelistEnabled = true
    } else if (name === 'PhalaStakePool.PoolWhitelistDeleted') {
      const {stakePoolId} = params
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      stakePool.whitelistEnabled = false
    } else if (name === 'PhalaStakePool.PoolWhitelistStakerAdded') {
      const {stakePoolId, accountId} = params
      const account = getAccount(accounts, accountId)
      const stakePool = stakePools.get(stakePoolId)
      assert(stakePool)
      const id = combineIds(stakePoolId, accountId)
      const stakePoolWhitelist = new StakePoolWhitelist({
        id,
        stakePool,
        account,
        createTime: blockTime,
      })
      stakePoolWhitelists.set(id, stakePoolWhitelist)
    } else if (name === 'PhalaStakePool.PoolWhitelistStakerRemoved') {
      const {stakePoolId, accountId} = params
      const id = combineIds(stakePoolId, accountId)
      const stakePoolWhitelist = stakePoolWhitelists.get(id)
      assert(stakePoolWhitelist)
      stakePoolWhitelists.delete(id)
      await ctx.store.remove(stakePoolWhitelist)
    } else if (name === 'PhalaMining.MinerBound') {
      // NOTE: MinerBound happens before PoolWorkerAdded
      const {minerId, workerId} = params
      let miner = miners.get(minerId)
      const worker = workers.get(workerId)
      assert(worker)
      if (miner == null) {
        miner = new Miner({
          id: minerId,
          isBound: true,
          state: MinerState.Ready,
          v: BigDecimal(0),
          ve: BigDecimal(0),
          pInit: 0,
          pInstant: 0,
          totalReward: BigDecimal(0),
          stake: BigDecimal(0),
        })
        miners.set(minerId, miner)
      }
      miner.isBound = true
      miner.worker = worker
      worker.miner = miner
    } else if (name === 'PhalaMining.MinerUnbound') {
      const {minerId, workerId} = params
      const miner = miners.get(minerId)
      const worker = workers.get(workerId)
      assert(worker)
      assert(miner?.worker?.id === workerId)
      worker.miner = null
      worker.share = null
      miner.isBound = false
    } else if (name === 'PhalaMining.MinerSettled') {
      const {minerId, v, payout} = params
      const miner = miners.get(minerId)
      assert(miner)
      assert(miner.stakePool)
      miner.totalReward = miner.totalReward.plus(payout)
      miner.v = v
      assert(miner.worker)
      const worker = workers.get(miner.worker.id)
      assert(worker)
      assert(worker.share)
      const stakePool = getStakePool(stakePools, miner.stakePool)
      const prevShare = worker.share
      updateWorkerShare(worker, miner)
      if (miner.state === MinerState.MiningIdle) {
        globalState.miningWorkerShare = globalState.miningWorkerShare
          .minus(prevShare)
          .plus(worker.share)
        stakePool.miningWorkerShare = stakePool.miningWorkerShare
          .minus(prevShare)
          .plus(worker.share)
        stakePool.aprBase = stakePool.miningWorkerShare
          .times(BigDecimal(1).minus(stakePool.commission))
          .div(stakePool.totalStake)
      }
    } else if (name === 'PhalaMining.MinerStarted') {
      const {minerId, initP, initV} = params
      const miner = miners.get(minerId)
      assert(miner)
      assert(miner.stakePool)
      assert(miner.worker)
      const stakePool = getStakePool(stakePools, miner.stakePool)
      stakePool.miningWorkerCount++
      miner.pInit = initP
      miner.ve = initV
      miner.v = initV
      miner.state = MinerState.MiningIdle
      const worker = workers.get(miner.worker.id)
      assert(worker)
      updateWorkerShare(worker, miner)
      globalState.miningWorkerShare = globalState.miningWorkerShare.plus(
        worker.share
      )
      stakePool.miningWorkerShare = stakePool.miningWorkerShare.plus(
        worker.share
      )
      stakePool.aprBase = stakePool.miningWorkerShare
        .times(BigDecimal(1).minus(stakePool.commission))
        .div(stakePool.totalStake)
    } else if (name === 'PhalaMining.MinerStopped') {
      const {minerId} = params
      const miner = miners.get(minerId)
      assert(miner)
      assert(miner.worker)
      assert(miner.stakePool)
      const stakePool = getStakePool(stakePools, miner.stakePool)
      const worker = workers.get(miner.worker.id)
      assert(worker)
      assert(worker.share)
      if (miner.state === MinerState.MiningIdle) {
        globalState.miningWorkerShare = globalState.miningWorkerShare.minus(
          worker.share
        )
        stakePool.miningWorkerShare = stakePool.miningWorkerShare.minus(
          worker.share
        )
        stakePool.aprBase = stakePool.miningWorkerShare
          .times(BigDecimal(1).minus(stakePool.commission))
          .div(stakePool.totalStake)
      }
      miner.state = MinerState.MiningCoolingDown
      miner.coolingDownStartTime = blockTime
      stakePool.miningWorkerCount--
      stakePool.releasingStake = stakePool.releasingStake.plus(miner.stake)
    } else if (name === 'PhalaMining.BenchmarkUpdated') {
      const {minerId, pInstant} = params
      const miner = miners.get(minerId)
      assert(miner)
      miner.pInstant = pInstant
      assert(miner.worker)
      const worker = workers.get(miner.worker.id)
      assert(worker)
      assert(worker.share)
      const prevShare = worker.share
      updateWorkerShare(worker, miner)
      if (miner.state === MinerState.MiningIdle) {
        globalState.miningWorkerShare = globalState.miningWorkerShare
          .minus(prevShare)
          .plus(worker.share)
        assert(miner.stakePool)
        const stakePool = getStakePool(stakePools, miner.stakePool)
        stakePool.miningWorkerShare = stakePool.miningWorkerShare
          .minus(prevShare)
          .plus(worker.share)
        stakePool.aprBase = stakePool.miningWorkerShare
          .times(BigDecimal(1).minus(stakePool.commission))
          .div(stakePool.totalStake)
      }
    } else if (name === 'PhalaMining.MinerEnterUnresponsive') {
      const {minerId} = params
      const miner = miners.get(minerId)
      assert(miner)
      miner.state = MinerState.MiningUnresponsive
      assert(miner.stakePool)
      const stakePool = getStakePool(stakePools, miner.stakePool)
      stakePool.miningWorkerCount--
      assert(miner.worker)
      const worker = workers.get(miner.worker.id)
      assert(worker)
      assert(worker.share)
      globalState.miningWorkerShare = globalState.miningWorkerShare.minus(
        worker.share
      )
      stakePool.miningWorkerShare = stakePool.miningWorkerShare.minus(
        worker.share
      )
      stakePool.aprBase = stakePool.miningWorkerShare
        .times(BigDecimal(1).minus(stakePool.commission))
        .div(stakePool.totalStake)
    } else if (name === 'PhalaMining.MinerExitUnresponsive') {
      const {minerId} = params
      const miner = miners.get(minerId)
      assert(miner)
      miner.state = MinerState.MiningIdle
      assert(miner.stakePool)
      const stakePool = getStakePool(stakePools, miner.stakePool)
      stakePool.miningWorkerCount++
      assert(miner.worker)
      const worker = workers.get(miner.worker.id)
      assert(worker)
      assert(worker.share)
      globalState.miningWorkerShare = globalState.miningWorkerShare.plus(
        worker.share
      )
      stakePool.miningWorkerShare = stakePool.miningWorkerShare.plus(
        worker.share
      )
      stakePool.aprBase = stakePool.miningWorkerShare
        .times(BigDecimal(1).minus(stakePool.commission))
        .div(stakePool.totalStake)
    } else if (name === 'PhalaMining.MinerReclaimed') {
      const {minerId} = params
      const miner = miners.get(minerId)
      assert(miner)
      miner.state = MinerState.Ready
      miner.coolingDownStartTime = null
      miner.stake = BigDecimal(0)
      try {
        assert(miner.stakePool)
        const stakePool = getStakePool(stakePools, miner.stakePool)
        stakePool.releasingStake = stakePool.releasingStake.minus(miner.stake)
        stakePool.freeStake = stakePool.freeStake.plus(miner.stake)
      } catch (e) {
        // Ignore stake pool free and releasing stake update error
      }
    } else if (name === 'PhalaRegistry.WorkerAdded') {
      const {workerId, confidenceLevel} = params
      const worker = new Worker({id: workerId, confidenceLevel})
      updateWorkerSMinAndSMax(worker, tokenomicParameters)
      workers.set(workerId, worker)
      await ctx.store.insert(worker)
    } else if (name === 'PhalaRegistry.WorkerUpdated') {
      const {workerId, confidenceLevel} = params
      const worker = workers.get(workerId)
      assert(worker)
      worker.confidenceLevel = confidenceLevel
      updateWorkerSMinAndSMax(worker, tokenomicParameters)
      if (worker.miner != null) {
        const miner = miners.get(worker.miner.id)
        assert(miner)
        updateWorkerShare(worker, miner)
      }
    } else if (name === 'PhalaRegistry.InitialScoreSet') {
      const {workerId, initialScore} = params
      const worker = workers.get(workerId)
      assert(worker)
      worker.initialScore = initialScore
      updateWorkerSMinAndSMax(worker, tokenomicParameters)
    }
  }

  await ctx.store.save(Array.from(accounts.values()))
  await ctx.store.save(Array.from(stakePools.values()))
  await ctx.store.save(Array.from(miners.values()))
  await ctx.store.save(Array.from(workers.values()))
  await ctx.store.save(Array.from(stakePoolStakes.values()))
  await ctx.store.insert(Array.from(stakePoolWhitelists.values()))
  await ctx.store.save(globalState)
}

export default processSerializedEvents

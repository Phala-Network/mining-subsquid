import {BigDecimal} from '@subsquid/big-decimal'
import {SubstrateBlock} from '@subsquid/substrate-processor'
import assert from 'assert'
import {readFile} from 'fs/promises'
import path from 'path'
import {START_BLOCK_HEIGHT, START_BLOCK_TIMESTAMP} from './constants'
import {
  Account,
  GlobalState,
  Miner,
  MinerState,
  StakePool,
  StakePoolStake,
  StakePoolWhitelist,
  Worker,
} from './model'
import {Ctx} from './processor'
import updateTokenomicParameters from './updateTokenomicParameters'
import {
  combineIds,
  getAccount,
  updateWorkerShare,
  updateWorkerSMinAndSMax,
} from './utils/common'
import {fromBits, JsonBigInt, toBalance} from './utils/converters'

interface StakePoolDump {
  pid: JsonBigInt
  owner: string
  payoutCommission: number | null
  cap: JsonBigInt | null
  ownerReward: JsonBigInt
  freeStake: JsonBigInt
  totalStake: JsonBigInt
  releasingStake: JsonBigInt
  totalShares: JsonBigInt
  workers: string[]
  withdrawQueue: Array<{
    user: string
    shares: JsonBigInt
    startTime: number
  }>
}

interface MinerDump {
  state: MinerState
  ve: JsonBigInt
  v: JsonBigInt
  benchmark: {
    pInit: number
    pInstant: number
  }
  coolDownStart: number
  stats: {totalReward: JsonBigInt}
}

interface WorkerDump {
  pubkey: string
  operator: string
  confidenceLevel: 1 | 2 | 3 | 4 | 5
  initialScore: number
}

type StakePoolStakeDump = [
  [JsonBigInt, string],
  {
    shares: JsonBigInt
    availableRewards: JsonBigInt
  }
]

const saveInitialState = async (
  ctx: Ctx,
  block: SubstrateBlock
): Promise<void> => {
  const tokenomicParameters = await updateTokenomicParameters(ctx, block)
  const readJson = async <T>(fileName: string): Promise<T> => {
    const file = await readFile(
      path.join(__dirname, `dump/${fileName}_${block.height - 1}.json`),
      'utf8'
    )
    return JSON.parse(file).result
  }
  const stakePoolsDump = await readJson<StakePoolDump[]>('stake_pools')
  const minersDump = await readJson<{[minerId in string]: MinerDump}>('miners')
  const workersDump = await readJson<WorkerDump[]>('workers')
  const minerBindingsDump = await readJson<{
    [minerId in string]?: string
  }>('miner_bindings')
  const minerStakesDump = await readJson<{[minerId in string]?: JsonBigInt}>(
    'miner_stakes'
  )
  const stakePoolStakesDump = await readJson<StakePoolStakeDump[]>(
    'stake_pool_stakes'
  )
  const stakePoolWhitelistsDump = await readJson<{[pid in string]: string[]}>(
    'stake_pool_whitelists'
  )

  const globalState = new GlobalState({
    id: '0',
    totalStake: BigDecimal(0),
    miningWorkerShare: BigDecimal(0),
    averageBlockTime: 12000,
    height: START_BLOCK_HEIGHT,
    lastRecordedBlockHeight: START_BLOCK_HEIGHT,
    lastRecordedBlockTime: new Date(START_BLOCK_TIMESTAMP),
  })
  const accounts = new Map<string, Account>()
  const stakePools = new Map<string, StakePool>()
  const stakePoolStakes = new Map<string, StakePoolStake>()
  const workers = new Map<string, Worker>(
    workersDump.map((w) => {
      const worker = new Worker({
        id: w.pubkey,
        confidenceLevel: w.confidenceLevel,
        initialScore: w.initialScore,
      })

      updateWorkerSMinAndSMax(worker, tokenomicParameters)

      return [w.pubkey, worker]
    })
  )
  const miners = new Map<string, Miner>(
    Object.entries(minersDump).map(([id, m]) => [
      id,
      new Miner({
        id,
        isBound: false,
        state: m.state,
        v: fromBits(m.v),
        ve: fromBits(m.ve),
        pInit: m.benchmark.pInit,
        pInstant: m.benchmark.pInstant,
        totalReward: toBalance(m.stats.totalReward),
        coolingDownStartTime:
          m.coolDownStart > 0 ? new Date(m.coolDownStart * 1000) : null,
        stake: BigDecimal(0),
      }),
    ])
  )

  for (const s of stakePoolsDump) {
    const stakePoolId = BigInt(s.pid).toString()
    const owner = getAccount(accounts, s.owner)
    const ownerReward = toBalance(s.ownerReward)
    const totalStake = toBalance(s.totalStake)
    owner.totalOwnerReward = owner.totalOwnerReward.plus(ownerReward)
    globalState.totalStake = globalState.totalStake.plus(totalStake)

    const stakePool = new StakePool({
      id: stakePoolId,
      pid: BigInt(s.pid),
      owner,
      commission:
        s.payoutCommission === null
          ? BigDecimal(0)
          : BigDecimal(s.payoutCommission).div(1e6),
      capacity: s.cap === null ? null : toBalance(s.cap),
      delegable: s.cap === null ? null : toBalance(s.cap).minus(totalStake),
      totalStake,
      freeStake: toBalance(s.freeStake),
      releasingStake: toBalance(s.releasingStake),
      totalShares: toBalance(s.totalShares),
      ownerReward,
      activeStakeCount: 0,
      workerCount: 0,
      miningWorkerCount: 0,
      totalWithdrawal: BigDecimal(0),
      aprBase: BigDecimal(0),
      miningWorkerShare: BigDecimal(0),
      whitelistEnabled: false,
    })

    for (const w of s.workers) {
      const worker = workers.get(w)
      assert(worker)
      worker.stakePool = stakePool
      stakePool.workerCount++
    }

    stakePools.set(stakePoolId, stakePool)
  }

  for (const [[pid, accountId], s] of stakePoolStakesDump) {
    const stakePoolId = BigInt(pid).toString()
    const id = combineIds(stakePoolId, accountId)
    const stakePool = stakePools.get(stakePoolId)
    const account = getAccount(accounts, accountId)
    assert(stakePool)
    const shares = toBalance(s.shares)
    const {totalShares, totalStake} = stakePool
    const amount = shares.eq(0)
      ? shares
      : shares.div(totalShares).times(totalStake).round(12, 0)
    const availableReward = toBalance(s.availableRewards)
    account.totalStake = account.totalStake.plus(amount)
    account.totalStakeReward = account.totalStakeReward.plus(availableReward)
    if (shares.gt(0)) {
      stakePool.activeStakeCount++
    }
    const stakePoolStake = new StakePoolStake({
      id,
      account,
      stakePool,
      amount,
      shares,
      reward: availableReward,
      withdrawalAmount: BigDecimal(0),
      withdrawalShares: BigDecimal(0),
    })

    stakePoolStakes.set(id, stakePoolStake)
  }

  for (const s of stakePoolsDump) {
    const stakePoolId = BigInt(s.pid).toString()
    const stakePool = stakePools.get(stakePoolId)
    assert(stakePool)
    for (const w of s.withdrawQueue) {
      const accountId = w.user
      const stakePoolStakeId = combineIds(stakePoolId, accountId)
      const stakePoolStake = stakePoolStakes.get(stakePoolStakeId)
      assert(stakePoolStake)
      const shares = toBalance(w.shares)
      const {totalStake, totalShares} = stakePool
      assert(shares.gt(0))
      const amount = shares.div(totalShares).times(totalStake).round(12, 0)
      stakePoolStake.withdrawalShares = shares
      stakePoolStake.withdrawalAmount = amount
      stakePoolStake.withdrawalStartTime = new Date(w.startTime * 1000)
      stakePool.totalWithdrawal = stakePool.totalWithdrawal.plus(amount)
      if (stakePool.delegable != null) {
        stakePool.delegable = stakePool.delegable.plus(amount)
      }
    }
  }

  const stakePoolWhitelists: StakePoolWhitelist[] = []
  for (const [pid, accountIds] of Object.entries(stakePoolWhitelistsDump)) {
    const stakePoolId = BigInt(pid).toString()
    const stakePool = stakePools.get(stakePoolId)
    assert(stakePool)
    stakePool.whitelistEnabled = true
    let createTime = START_BLOCK_TIMESTAMP
    const reversedAccountIds = [...accountIds].reverse()
    for (const accountId of reversedAccountIds) {
      const account = getAccount(accounts, accountId)
      stakePoolWhitelists.push(
        new StakePoolWhitelist({
          id: combineIds(stakePoolId, accountId),
          account,
          stakePool,
          // NOTE: a fake create time to keeping original order
          createTime: new Date(createTime--),
        })
      )
    }
  }

  await ctx.store.insert(Array.from(accounts.values()))
  await ctx.store.insert(Array.from(stakePools.values()))
  await ctx.store.insert(Array.from(workers.values()))
  await ctx.store.insert(Array.from(stakePoolStakes.values()))
  await ctx.store.insert(stakePoolWhitelists)

  for (const [id, m] of miners) {
    const stake = minerStakesDump[id]
    if (stake !== undefined) {
      m.stake = toBalance(stake)
    }

    const workerId = minerBindingsDump[id]
    if (workerId !== undefined) {
      const worker = workers.get(workerId)
      assert(worker?.stakePool)
      const stakePool = stakePools.get(worker.stakePool.id)
      assert(stakePool)
      worker.miner = m
      m.isBound = true
      m.worker = worker
      m.stakePool = worker.stakePool
      updateWorkerShare(worker, m)

      if (m.state === MinerState.MiningIdle) {
        stakePool.miningWorkerCount++
        globalState.miningWorkerShare = globalState.miningWorkerShare.plus(
          worker.share
        )
        stakePool.miningWorkerShare = stakePool.miningWorkerShare.plus(
          worker.share
        )
        stakePool.aprBase = stakePool.miningWorkerShare
          .times(BigDecimal(1).minus(stakePool.commission))
          .div(stakePool.totalStake)
      }
    }
  }

  await ctx.store.save(Array.from(stakePools.values()))
  await ctx.store.insert(Array.from(miners.values()))
  await ctx.store.save(Array.from(workers.values()))
  await ctx.store.insert(globalState)
}

export default saveInitialState

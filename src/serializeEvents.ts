import {BigDecimal} from '@subsquid/big-decimal'
import {toHex} from '@subsquid/substrate-processor'
import {BaseSerializedEvent, Ctx, SerializedEvent} from './processor'
import {
  PhalaMiningBenchmarkUpdatedEvent,
  PhalaMiningMinerBoundEvent,
  PhalaMiningMinerEnterUnresponsiveEvent,
  PhalaMiningMinerExitUnresponsiveEvent,
  PhalaMiningMinerReclaimedEvent,
  PhalaMiningMinerSettledEvent,
  PhalaMiningMinerStartedEvent,
  PhalaMiningMinerStoppedEvent,
  PhalaMiningMinerUnboundEvent,
  PhalaRegistryInitialScoreSetEvent,
  PhalaRegistryWorkerAddedEvent,
  PhalaRegistryWorkerUpdatedEvent,
  PhalaStakePoolContributionEvent,
  PhalaStakePoolMiningStartedEvent,
  PhalaStakePoolOwnerRewardsWithdrawnEvent,
  PhalaStakePoolPoolCapacitySetEvent,
  PhalaStakePoolPoolCommissionSetEvent,
  PhalaStakePoolPoolCreatedEvent,
  PhalaStakePoolPoolWhitelistCreatedEvent,
  PhalaStakePoolPoolWhitelistDeletedEvent,
  PhalaStakePoolPoolWhitelistStakerAddedEvent,
  PhalaStakePoolPoolWhitelistStakerRemovedEvent,
  PhalaStakePoolPoolWorkerAddedEvent,
  PhalaStakePoolPoolWorkerRemovedEvent,
  PhalaStakePoolRewardReceivedEvent,
  PhalaStakePoolRewardsWithdrawnEvent,
  PhalaStakePoolStakerRewardsWithdrawnEvent,
  PhalaStakePoolWithdrawalEvent,
  PhalaStakePoolWithdrawalQueuedEvent,
} from './types/events'
import {encodeAddress, fromBits, toBalance} from './utils/converters'

const serializeEvents = (ctx: Ctx): SerializedEvent[] => {
  const serializedEvents: SerializedEvent[] = []

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      let baseEvent: BaseSerializedEvent | undefined

      if (item.name === 'PhalaStakePool.PoolCreated') {
        const e = new PhalaStakePoolPoolCreatedEvent(ctx, item.event)
        const {owner, pid} = e.asV1131
        baseEvent = {
          name: item.name,
          params: {stakePoolId: String(pid), owner: encodeAddress(owner)},
        }
      } else if (item.name === 'PhalaStakePool.PoolCommissionSet') {
        const e = new PhalaStakePoolPoolCommissionSetEvent(ctx, item.event)
        const {pid, commission} = e.asV1131
        baseEvent = {
          name: item.name,
          params: {
            stakePoolId: String(pid),
            commission: BigDecimal(commission).div(1e6),
          },
        }
      } else if (item.name === 'PhalaStakePool.PoolCapacitySet') {
        const e = new PhalaStakePoolPoolCapacitySetEvent(ctx, item.event)
        const {pid, cap} = e.asV1131
        baseEvent = {
          name: item.name,
          params: {stakePoolId: String(pid), cap: toBalance(cap)},
        }
      } else if (item.name === 'PhalaStakePool.PoolWorkerAdded') {
        const e = new PhalaStakePoolPoolWorkerAddedEvent(ctx, item.event)
        const {pid, worker} = e.asV1170
        baseEvent = {
          name: item.name,
          params: {stakePoolId: String(pid), workerId: toHex(worker)},
        }
      } else if (item.name === 'PhalaStakePool.PoolWorkerRemoved') {
        const e = new PhalaStakePoolPoolWorkerRemovedEvent(ctx, item.event)
        const {pid, worker} = e.asV1090
        baseEvent = {
          name: item.name,
          params: {stakePoolId: String(pid), workerId: toHex(worker)},
        }
      } else if (item.name === 'PhalaStakePool.MiningStarted') {
        const e = new PhalaStakePoolMiningStartedEvent(ctx, item.event)
        const {pid, worker, amount} = e.asV1170
        baseEvent = {
          name: item.name,
          params: {
            stakePoolId: String(pid),
            workerId: toHex(worker),
            amount: toBalance(amount),
          },
        }
      } else if (item.name === 'PhalaStakePool.Contribution') {
        const e = new PhalaStakePoolContributionEvent(ctx, item.event)
        const {pid, user, amount, shares} = e.asV1160
        baseEvent = {
          name: item.name,
          params: {
            stakePoolId: String(pid),
            accountId: encodeAddress(user),
            amount: toBalance(amount),
            shares: toBalance(shares),
          },
        }
      } else if (item.name === 'PhalaStakePool.Withdrawal') {
        const e = new PhalaStakePoolWithdrawalEvent(ctx, item.event)
        const {pid, user, amount, shares} = e.asV1160
        baseEvent = {
          name: item.name,
          params: {
            stakePoolId: String(pid),
            accountId: encodeAddress(user),
            amount: toBalance(amount),
            shares: toBalance(shares),
          },
        }
      } else if (item.name === 'PhalaStakePool.WithdrawalQueued') {
        const e = new PhalaStakePoolWithdrawalQueuedEvent(ctx, item.event)
        const {pid, user, shares} = e.asV1090
        baseEvent = {
          name: item.name,
          params: {
            stakePoolId: String(pid),
            accountId: encodeAddress(user),
            shares: toBalance(shares),
          },
        }
      } else if (item.name === 'PhalaStakePool.RewardReceived') {
        const e = new PhalaStakePoolRewardReceivedEvent(ctx, item.event)
        const {pid, toOwner, toStakers} = e.asV1160
        baseEvent = {
          name: item.name,
          params: {
            stakePoolId: String(pid),
            toOwner: toBalance(toOwner),
            toStakers: toBalance(toStakers),
          },
        }
      } else if (item.name === 'PhalaStakePool.RewardsWithdrawn') {
        const e = new PhalaStakePoolRewardsWithdrawnEvent(ctx, item.event)
        const {pid, user, amount} = e.asV1131
        baseEvent = {
          name: item.name,
          params: {
            stakePoolId: String(pid),
            accountId: encodeAddress(user),
            amount: toBalance(amount),
          },
        }
      } else if (item.name === 'PhalaStakePool.OwnerRewardsWithdrawn') {
        const e = new PhalaStakePoolOwnerRewardsWithdrawnEvent(ctx, item.event)
        const {pid, user, amount} = e.asV1150
        baseEvent = {
          name: item.name,
          params: {
            stakePoolId: String(pid),
            accountId: encodeAddress(user),
            amount: toBalance(amount),
          },
        }
      } else if (item.name === 'PhalaStakePool.StakerRewardsWithdrawn') {
        const e = new PhalaStakePoolStakerRewardsWithdrawnEvent(ctx, item.event)
        const {pid, user, amount} = e.asV1150
        baseEvent = {
          name: item.name,
          params: {
            stakePoolId: String(pid),
            accountId: encodeAddress(user),
            amount: toBalance(amount),
          },
        }
      } else if (item.name === 'PhalaStakePool.PoolWhitelistStakerAdded') {
        const e = new PhalaStakePoolPoolWhitelistStakerAddedEvent(
          ctx,
          item.event
        )
        const {pid, staker} = e.asV1150
        baseEvent = {
          name: item.name,
          params: {stakePoolId: String(pid), accountId: encodeAddress(staker)},
        }
      } else if (item.name === 'PhalaStakePool.PoolWhitelistStakerRemoved') {
        const e = new PhalaStakePoolPoolWhitelistStakerRemovedEvent(
          ctx,
          item.event
        )
        const {pid, staker} = e.asV1150
        baseEvent = {
          name: item.name,
          params: {stakePoolId: String(pid), accountId: encodeAddress(staker)},
        }
      } else if (item.name === 'PhalaStakePool.PoolWhitelistCreated') {
        const e = new PhalaStakePoolPoolWhitelistCreatedEvent(ctx, item.event)
        const {pid} = e.asV1150
        baseEvent = {
          name: item.name,
          params: {stakePoolId: String(pid)},
        }
      } else if (item.name === 'PhalaStakePool.PoolWhitelistDeleted') {
        const e = new PhalaStakePoolPoolWhitelistDeletedEvent(ctx, item.event)
        const {pid} = e.asV1150
        baseEvent = {
          name: item.name,
          params: {stakePoolId: String(pid)},
        }
      } else if (item.name === 'PhalaMining.MinerBound') {
        const e = new PhalaMiningMinerBoundEvent(ctx, item.event)
        const {miner, worker} = e.asV1131
        baseEvent = {
          name: item.name,
          params: {minerId: encodeAddress(miner), workerId: toHex(worker)},
        }
      } else if (item.name === 'PhalaMining.MinerUnbound') {
        const e = new PhalaMiningMinerUnboundEvent(ctx, item.event)
        const {miner, worker} = e.asV1131
        baseEvent = {
          name: item.name,
          params: {minerId: encodeAddress(miner), workerId: toHex(worker)},
        }
      } else if (item.name === 'PhalaMining.MinerSettled') {
        const e = new PhalaMiningMinerSettledEvent(ctx, item.event)
        const {miner, vBits, payoutBits} = e.asV1131
        baseEvent = {
          name: item.name,
          params: {
            minerId: encodeAddress(miner),
            v: fromBits(vBits),
            payout: fromBits(payoutBits).round(12, 0),
          },
        }
      } else if (item.name === 'PhalaMining.MinerStarted') {
        const e = new PhalaMiningMinerStartedEvent(ctx, item.event)
        const {miner, initV, initP} = e.asV1170
        baseEvent = {
          name: item.name,
          params: {
            minerId: encodeAddress(miner),
            initV: fromBits(initV),
            initP,
          },
        }
      } else if (item.name === 'PhalaMining.MinerStopped') {
        const e = new PhalaMiningMinerStoppedEvent(ctx, item.event)
        const {miner} = e.asV1131
        baseEvent = {
          name: item.name,
          params: {minerId: encodeAddress(miner)},
        }
      } else if (item.name === 'PhalaMining.BenchmarkUpdated') {
        const e = new PhalaMiningBenchmarkUpdatedEvent(ctx, item.event)
        const {miner, pInstant} = e.asV1170
        baseEvent = {
          name: item.name,
          params: {minerId: encodeAddress(miner), pInstant},
        }
      } else if (item.name === 'PhalaMining.MinerEnterUnresponsive') {
        const e = new PhalaMiningMinerEnterUnresponsiveEvent(ctx, item.event)
        const {miner} = e.asV1131
        baseEvent = {name: item.name, params: {minerId: encodeAddress(miner)}}
      } else if (item.name === 'PhalaMining.MinerExitUnresponsive') {
        const e = new PhalaMiningMinerExitUnresponsiveEvent(ctx, item.event)
        const {miner} = e.asV1131
        baseEvent = {name: item.name, params: {minerId: encodeAddress(miner)}}
      } else if (item.name === 'PhalaMining.MinerReclaimed') {
        const e = new PhalaMiningMinerReclaimedEvent(ctx, item.event)
        const {miner} = e.asV1131
        baseEvent = {name: item.name, params: {minerId: encodeAddress(miner)}}
      } else if (item.name === 'PhalaMining.TokenomicParametersChanged') {
        baseEvent = {name: item.name, params: {}}
      } else if (item.name === 'PhalaRegistry.WorkerAdded') {
        const e = new PhalaRegistryWorkerAddedEvent(ctx, item.event)
        if (e.isV1182) {
          const {pubkey, confidenceLevel} = e.asV1182
          baseEvent = {
            name: item.name,
            params: {workerId: toHex(pubkey), confidenceLevel},
          }
        }
      } else if (item.name === 'PhalaRegistry.WorkerUpdated') {
        const e = new PhalaRegistryWorkerUpdatedEvent(ctx, item.event)
        if (e.isV1182) {
          const {pubkey, confidenceLevel} = e.asV1182
          baseEvent = {
            name: item.name,
            params: {workerId: toHex(pubkey), confidenceLevel},
          }
        }
      } else if (item.name === 'PhalaRegistry.InitialScoreSet') {
        const e = new PhalaRegistryInitialScoreSetEvent(ctx, item.event)
        const {pubkey, initScore} = e.asV1182
        baseEvent = {
          name: item.name,
          params: {workerId: toHex(pubkey), initialScore: initScore},
        }
      }

      if (baseEvent != null) {
        serializedEvents.push({...baseEvent, block: block.header})
      }
    }
  }

  return serializedEvents
}

export default serializeEvents

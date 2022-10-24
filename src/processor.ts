import {BigDecimal} from '@subsquid/big-decimal'
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
  SubstrateBlock,
} from '@subsquid/substrate-processor'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import config from './config'
import {START_BLOCK_HEIGHT} from './constants'
import processSerializedEvents from './processSerializedEvents'
import saveInitialState from './saveInitialState'
import serializeEvents from './serializeEvents'
import updateAverageBlockTime from './updateAverageBlockTime'

const processor = new SubstrateBatchProcessor()
  .setBlockRange(config.blockRange)
  .setBatchSize(config.batchSize)
  .setDataSource(config.dataSource)
  // PhalaStakePool
  .addEvent('PhalaStakePool.PoolCreated', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.PoolCommissionSet', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.PoolCapacitySet', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.PoolWorkerAdded', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.PoolWorkerRemoved', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.MiningStarted', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.Contribution', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.Withdrawal', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.WithdrawalQueued', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.RewardReceived', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.RewardsWithdrawn', {data: {event: {args: true}}})
  .addEvent('PhalaStakePool.OwnerRewardsWithdrawn', {
    data: {event: {args: true}},
  })
  .addEvent('PhalaStakePool.StakerRewardsWithdrawn', {
    data: {event: {args: true}},
  })
  .addEvent('PhalaStakePool.PoolWhitelistCreated', {
    data: {event: {args: true}},
  })
  .addEvent('PhalaStakePool.PoolWhitelistDeleted', {
    data: {event: {args: true}},
  })
  .addEvent('PhalaStakePool.PoolWhitelistStakerAdded', {
    data: {event: {args: true}},
  })
  .addEvent('PhalaStakePool.PoolWhitelistStakerRemoved', {
    data: {event: {args: true}},
  })
  // PhalaMining
  .addEvent('PhalaMining.MinerStarted', {data: {event: {args: true}}})
  .addEvent('PhalaMining.MinerStopped', {data: {event: {args: true}}})
  .addEvent('PhalaMining.MinerReclaimed', {data: {event: {args: true}}})
  .addEvent('PhalaMining.MinerEnterUnresponsive', {data: {event: {args: true}}})
  .addEvent('PhalaMining.MinerExitUnresponsive', {data: {event: {args: true}}})
  .addEvent('PhalaMining.MinerBound', {data: {event: {args: true}}})
  .addEvent('PhalaMining.MinerUnbound', {data: {event: {args: true}}})
  .addEvent('PhalaMining.MinerSettled', {data: {event: {args: true}}})
  .addEvent('PhalaMining.BenchmarkUpdated', {data: {event: {args: true}}})
  .addEvent('PhalaMining.TokenomicParametersChanged')
  .addEvent('PhalaRegistry.InitialScoreSet', {data: {event: {args: true}}})
  .addEvent('PhalaRegistry.WorkerAdded', {data: {event: {args: true}}})
  .addEvent('PhalaRegistry.WorkerUpdated', {data: {event: {args: true}}})

type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>
export type BaseSerializedEvent =
  // PhalaStakePool
  | {
      name: 'PhalaStakePool.PoolCreated'
      params: {stakePoolId: string; owner: string}
    }
  | {
      name: 'PhalaStakePool.PoolCommissionSet'
      params: {stakePoolId: string; commission: BigDecimal}
    }
  | {
      name: 'PhalaStakePool.PoolCapacitySet'
      params: {stakePoolId: string; cap: BigDecimal}
    }
  | {
      name: 'PhalaStakePool.PoolWorkerAdded'
      params: {stakePoolId: string; workerId: string}
    }
  | {
      name: 'PhalaStakePool.PoolWorkerRemoved'
      params: {stakePoolId: string; workerId: string}
    }
  | {
      name: 'PhalaStakePool.MiningStarted'
      params: {stakePoolId: string; workerId: string; amount: BigDecimal}
    }
  | {
      name: 'PhalaStakePool.Contribution'
      params: {
        stakePoolId: string
        accountId: string
        amount: BigDecimal
        shares: BigDecimal
      }
    }
  | {
      name: 'PhalaStakePool.Withdrawal'
      params: {
        stakePoolId: string
        accountId: string
        amount: BigDecimal
        shares: BigDecimal
      }
    }
  | {
      name: 'PhalaStakePool.WithdrawalQueued'
      params: {
        stakePoolId: string
        accountId: string
        shares: BigDecimal
      }
    }
  | {
      name: 'PhalaStakePool.RewardReceived'
      params: {stakePoolId: string; toOwner: BigDecimal; toStakers: BigDecimal}
    }
  | {
      name: 'PhalaStakePool.RewardsWithdrawn'
      params: {stakePoolId: string; accountId: string; amount: BigDecimal}
    }
  | {
      name: 'PhalaStakePool.OwnerRewardsWithdrawn'
      params: {stakePoolId: string; accountId: string; amount: BigDecimal}
    }
  | {
      name: 'PhalaStakePool.StakerRewardsWithdrawn'
      params: {stakePoolId: string; accountId: string; amount: BigDecimal}
    }
  | {name: 'PhalaStakePool.PoolWhitelistCreated'; params: {stakePoolId: string}}
  | {name: 'PhalaStakePool.PoolWhitelistDeleted'; params: {stakePoolId: string}}
  | {
      name: 'PhalaStakePool.PoolWhitelistStakerAdded'
      params: {stakePoolId: string; accountId: string}
    }
  | {
      name: 'PhalaStakePool.PoolWhitelistStakerRemoved'
      params: {stakePoolId: string; accountId: string}
    }

  // PhalaMining
  | {
      name: 'PhalaMining.MinerStarted'
      params: {minerId: string; initV: BigDecimal; initP: number}
    }
  | {name: 'PhalaMining.MinerStopped'; params: {minerId: string}}
  | {name: 'PhalaMining.MinerReclaimed'; params: {minerId: string}}
  | {name: 'PhalaMining.MinerEnterUnresponsive'; params: {minerId: string}}
  | {name: 'PhalaMining.MinerExitUnresponsive'; params: {minerId: string}}
  | {
      name: 'PhalaMining.MinerBound'
      params: {minerId: string; workerId: string}
    }
  | {
      name: 'PhalaMining.MinerUnbound'
      params: {minerId: string; workerId: string}
    }
  | {
      name: 'PhalaMining.MinerSettled'
      params: {minerId: string; payout: BigDecimal; v: BigDecimal}
    }
  | {
      name: 'PhalaMining.BenchmarkUpdated'
      params: {minerId: string; pInstant: number}
    }
  | {
      name: 'PhalaRegistry.InitialScoreSet'
      params: {workerId: string; initialScore: number}
    }
  | {
      name: 'PhalaRegistry.WorkerAdded'
      params: {workerId: string; confidenceLevel: number}
    }
  | {
      name: 'PhalaRegistry.WorkerUpdated'
      params: {workerId: string; confidenceLevel: number}
    }
  | {name: 'PhalaMining.TokenomicParametersChanged'; params: {}}

export type SerializedEvent = {block: SubstrateBlock} & BaseSerializedEvent

processor.run(new TypeormDatabase(), async (ctx) => {
  const startBlock = ctx.blocks[0].header
  if (startBlock.height === START_BLOCK_HEIGHT) {
    ctx.log.info('Saving initial state...')
    await saveInitialState(ctx, ctx.blocks[0].header)
    ctx.log.info('Initial state saved')
  }
  const serializedEvents = serializeEvents(ctx)
  await processSerializedEvents(ctx, serializedEvents)
  await updateAverageBlockTime(ctx)
})

import {BigDecimal} from '@subsquid/big-decimal'
import assert from 'assert'
import {DUST_LIMIT} from '../constants'
import {Account, Miner, StakePool, TokenomicParameters, Worker} from '../model'

export const getAccount = (m: Map<string, Account>, id: string): Account => {
  let acc = m.get(id)
  if (acc == null) {
    acc = new Account({
      id,
      totalStake: BigDecimal(0),
      totalOwnerReward: BigDecimal(0),
      totalStakeReward: BigDecimal(0),
    })
    m.set(id, acc)
  }
  return acc
}

export const getStakePool = (
  m: Map<string, StakePool>,
  stakePool: StakePool
): StakePool => {
  let acc = m.get(stakePool.id)
  if (acc == null) {
    acc = stakePool
    m.set(stakePool.id, stakePool)
  }

  return acc
}

export const combineIds = (...args: string[]): string => args.join('-')

export const removeDust = (amount: BigDecimal): BigDecimal => {
  if (amount.lte(DUST_LIMIT)) {
    return BigDecimal(0)
  }

  return amount
}

export const max = (a: BigDecimal, b: BigDecimal): BigDecimal =>
  a.gt(b) ? a : b

export const min = (a: BigDecimal, b: BigDecimal): BigDecimal =>
  a.lt(b) ? a : b

type ConfidenceLevel = 1 | 2 | 3 | 4 | 5
function assertConfidenceLevel(n: number): asserts n is ConfidenceLevel {
  assert(n === 1 || n === 2 || n === 3 || n === 4 || n === 5)
}
const confidenceScoreMap: Record<ConfidenceLevel, string> = {
  1: '1',
  2: '1',
  3: '1',
  4: '0.8',
  5: '0.7',
}

export const updateWorkerSMinAndSMax = (
  worker: Worker,
  tokenomicParameters: TokenomicParameters
): void => {
  const {vMax, phaRate, re, k} = tokenomicParameters
  const {initialScore, confidenceLevel} = worker
  if (typeof initialScore === 'number') {
    worker.sMin = k.times(BigDecimal(initialScore).sqrt()).round(12, 0)
    assertConfidenceLevel(confidenceLevel)
    const confidenceScore = confidenceScoreMap[confidenceLevel]
    worker.sMax = vMax
      .div(re.minus(1).times(confidenceScore).add(1))
      .minus(BigDecimal(initialScore).mul('0.3').div(phaRate))
      .round(12, 0)
  }
}

export function updateWorkerShare(
  worker: Worker,
  miner: Miner
): asserts worker is Worker & {share: BigDecimal} {
  const {v, pInstant} = miner
  const {confidenceLevel} = worker
  assertConfidenceLevel(confidenceLevel)
  const confidenceScore = confidenceScoreMap[confidenceLevel]
  const share = v
    .pow(2)
    .add(BigDecimal(2).mul(pInstant).mul(confidenceScore).pow(2))
    .sqrt()

  worker.share = share
}

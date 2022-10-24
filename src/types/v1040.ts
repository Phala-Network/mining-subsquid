import type {Result} from './support'

export interface TokenomicParams {
  phaRate: bigint
  rho: bigint
  budgetPerBlock: bigint
  vMax: bigint
  costK: bigint
  costB: bigint
  slashRate: bigint
  treasuryRatio: bigint
  heartbeatWindow: number
  rigK: bigint
  rigB: bigint
  re: bigint
  k: bigint
  kappa: bigint
}

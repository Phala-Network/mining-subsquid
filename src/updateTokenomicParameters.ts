import {SubstrateBlock} from '@subsquid/substrate-processor'
import assert from 'assert'
import {TokenomicParameters} from './model'
import {Ctx} from './processor'
import {PhalaMiningTokenomicParametersStorage} from './types/storage'
import {fromBits} from './utils/converters'

const updateTokenomicParameters = async (
  ctx: Ctx,
  block: SubstrateBlock
): Promise<TokenomicParameters> => {
  const storage = new PhalaMiningTokenomicParametersStorage(ctx, block)
  const value = await storage.getAsV1040()
  assert(value)
  const tokenomicParameters = new TokenomicParameters({
    id: '0',
    phaRate: fromBits(value.phaRate),
    budgetPerBlock: fromBits(value.budgetPerBlock),
    vMax: fromBits(value.vMax),
    treasuryRatio: fromBits(value.treasuryRatio),
    re: fromBits(value.re),
    k: fromBits(value.k),
  })

  await ctx.store.save(tokenomicParameters)

  return tokenomicParameters
}

export default updateTokenomicParameters

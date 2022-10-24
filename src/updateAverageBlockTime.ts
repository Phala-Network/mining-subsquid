import {GlobalState} from './model'
import {Ctx} from './processor'

const updateAverageBlockTime = async (ctx: Ctx): Promise<void> => {
  const globalState = await ctx.store.findOneByOrFail(GlobalState, {id: '0'})
  const latestBlock = ctx.blocks[ctx.blocks.length - 1].header
  const blockCount = latestBlock.height - globalState.lastRecordedBlockHeight
  if (blockCount < 100) return
  const duration =
    latestBlock.timestamp - globalState.lastRecordedBlockTime.getTime()

  globalState.averageBlockTime = Math.floor(duration / blockCount)
  globalState.lastRecordedBlockHeight = latestBlock.height
  globalState.lastRecordedBlockTime = new Date(latestBlock.timestamp)

  await ctx.store.save(globalState)
}

export default updateAverageBlockTime

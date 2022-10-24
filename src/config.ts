import {lookupArchive} from '@subsquid/archive-registry'
import {BlockRangeOption, DataSource} from '@subsquid/substrate-processor'
import {START_BLOCK_HEIGHT} from './constants'

const config: {
  batchSize: number
  dataSource: DataSource
  blockRange: Exclude<BlockRangeOption['range'], undefined>
} = {
  blockRange: {from: START_BLOCK_HEIGHT},
  batchSize: 500,
  dataSource: {
    archive: lookupArchive('khala', {release: 'FireSquid'}),
    chain: 'wss://khala-archive.phala.network/ws',
  },
}

export default config

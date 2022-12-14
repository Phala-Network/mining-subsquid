import {lookupArchive} from '@subsquid/archive-registry'
import {BlockRangeOption, DataSource} from '@subsquid/substrate-processor'
import {START_BLOCK_HEIGHT} from './constants'

const config: {
  dataSource: DataSource
  blockRange: Exclude<BlockRangeOption['range'], undefined>
} = {
  blockRange: {from: START_BLOCK_HEIGHT},
  dataSource: {
    archive: lookupArchive('khala', {release: 'FireSquid'}),
    chain: 'wss://priv-api.phala.network/khala/ws',
  },
}

console.log(config.dataSource.archive)

export default config

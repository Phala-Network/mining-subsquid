import {BigDecimal} from '@subsquid/big-decimal'
import * as ss58 from '@subsquid/ss58'
import {isHex} from '@subsquid/util-internal-hex'

export type JsonBigInt = string | number // Polkadot.js toJSON() BigInt type

export const toBigDecimal = (value: JsonBigInt | bigint): BigDecimal => {
  if (isHex(value)) {
    value = BigInt(value)
  }
  return BigDecimal(value)
}

export const toBalance = (value: JsonBigInt | bigint): BigDecimal =>
  toBigDecimal(value).div(1e12)

export const fromBits = (value: JsonBigInt | bigint): BigDecimal =>
  toBigDecimal(value).div(BigDecimal(2).pow(64))

export const encodeAddress = (bytes: Uint8Array): string =>
  ss58.codec('phala').encode(bytes)

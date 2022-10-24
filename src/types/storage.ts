import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result} from './support'
import * as v1 from './v1'
import * as v1040 from './v1040'
import * as v1090 from './v1090'

export class IdentityIdentityOfStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Information that is pertinent to identify the entity behind an account.
   * 
   *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Identity', 'IdentityOf') === '4858510e4d16a634a6efd37fc0fbc0a75e16596326ae6d014f4bfca201c459de'
  }

  /**
   *  Information that is pertinent to identify the entity behind an account.
   * 
   *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
   */
  async getAsV1(key: Uint8Array): Promise<v1.Registration | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Identity', 'IdentityOf', key)
  }

  async getManyAsV1(keys: Uint8Array[]): Promise<(v1.Registration | undefined)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Identity', 'IdentityOf', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(v1.Registration)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Identity', 'IdentityOf')
  }

  /**
   *  Information that is pertinent to identify the entity behind an account.
   * 
   *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
   */
  get isV1090() {
    return this._chain.getStorageItemTypeHash('Identity', 'IdentityOf') === 'eee9529c5197f7a5f8200e155d78bab0a612de49bd6c8941e539265edf54c3aa'
  }

  /**
   *  Information that is pertinent to identify the entity behind an account.
   * 
   *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
   */
  async getAsV1090(key: Uint8Array): Promise<v1090.Registration | undefined> {
    assert(this.isV1090)
    return this._chain.getStorage(this.blockHash, 'Identity', 'IdentityOf', key)
  }

  async getManyAsV1090(keys: Uint8Array[]): Promise<(v1090.Registration | undefined)[]> {
    assert(this.isV1090)
    return this._chain.queryStorage(this.blockHash, 'Identity', 'IdentityOf', keys.map(k => [k]))
  }

  async getAllAsV1090(): Promise<(v1090.Registration)[]> {
    assert(this.isV1090)
    return this._chain.queryStorage(this.blockHash, 'Identity', 'IdentityOf')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Identity', 'IdentityOf') != null
  }
}

export class PhalaMiningTokenomicParametersStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Tokenomic parameters used by Gatekeepers to compute the V promote.
   */
  get isV1040() {
    return this._chain.getStorageItemTypeHash('PhalaMining', 'TokenomicParameters') === '7e29f4ae3d65a80220e0c0baf372e7ffb44fb3981aa27fe6a83ce02eb0f439d9'
  }

  /**
   *  Tokenomic parameters used by Gatekeepers to compute the V promote.
   */
  async getAsV1040(): Promise<v1040.TokenomicParams | undefined> {
    assert(this.isV1040)
    return this._chain.getStorage(this.blockHash, 'PhalaMining', 'TokenomicParameters')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('PhalaMining', 'TokenomicParameters') != null
  }
}

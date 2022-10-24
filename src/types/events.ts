import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result} from './support'

export class IdentityIdentityClearedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Identity.IdentityCleared')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  A name was cleared, and the given balance returned. \[who, deposit\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Identity.IdentityCleared') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  A name was cleared, and the given balance returned. \[who, deposit\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A name was cleared, and the given balance returned.
   */
  get isV1090(): boolean {
    return this._chain.getEventHash('Identity.IdentityCleared') === '569627bf2a8105e3949fd62dcaae8174fb02f8afedb8e5d8a7fecda5d63b25c3'
  }

  /**
   * A name was cleared, and the given balance returned.
   */
  get asV1090(): {who: Uint8Array, deposit: bigint} {
    assert(this.isV1090)
    return this._chain.decodeEvent(this.event)
  }
}

export class IdentityIdentitySetEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Identity.IdentitySet')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  A name was set or reset (which will remove all judgements). \[who\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Identity.IdentitySet') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  A name was set or reset (which will remove all judgements). \[who\]
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A name was set or reset (which will remove all judgements).
   */
  get isV1090(): boolean {
    return this._chain.getEventHash('Identity.IdentitySet') === 'b8a0d2208835f6ada60dd21cd93533d703777b3779109a7c6a2f26bad68c2f3b'
  }

  /**
   * A name was set or reset (which will remove all judgements).
   */
  get asV1090(): {who: Uint8Array} {
    assert(this.isV1090)
    return this._chain.decodeEvent(this.event)
  }
}

export class IdentityJudgementGivenEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Identity.JudgementGiven')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  A judgement was given by a registrar. \[target, registrar_index\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Identity.JudgementGiven') === 'a86a85822cc09ae7b3b9587f12944d2954476832a499d679c195ffaa86c16212'
  }

  /**
   *  A judgement was given by a registrar. \[target, registrar_index\]
   */
  get asV1(): [Uint8Array, number] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A judgement was given by a registrar.
   */
  get isV1090(): boolean {
    return this._chain.getEventHash('Identity.JudgementGiven') === '0771fa05d0977d28db0dee420efa5c006fa01a48edbd0b5b50cba5ea1d98b1b8'
  }

  /**
   * A judgement was given by a registrar.
   */
  get asV1090(): {target: Uint8Array, registrarIndex: number} {
    assert(this.isV1090)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningBenchmarkUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.BenchmarkUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Benchmark Updated
   */
  get isV1170(): boolean {
    return this._chain.getEventHash('PhalaMining.BenchmarkUpdated') === '397d392fba3b9ae0effd8a1f1368bb353c9190b5eef023aa903e2c5aaf9c2056'
  }

  /**
   * Benchmark Updated
   */
  get asV1170(): {miner: Uint8Array, pInstant: number} {
    assert(this.isV1170)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningMinerBoundEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.MinerBound')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Miner & worker are bound. \[miner, worker\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerBound') === 'e54ae910805a8a9413af1a7f5885a5d0ba5f4e105175cd6b0ce2a8702ddf1861'
  }

  /**
   *  Miner & worker are bound. \[miner, worker\]
   */
  get asV1040(): [Uint8Array, Uint8Array] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Miner & worker are bound.
   * 
   * Affected states:
   * - [`MinerBindings`] for the miner account is pointed to the worker
   * - [`WorkerBindings`] for the worker is pointed to the miner account
   * - the miner info at [`Miners`] is updated with `Ready` state
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerBound') === '155e275cc52b608766efe0776ca792908d7669683141051c9b1c5381d14ef1d1'
  }

  /**
   * Miner & worker are bound.
   * 
   * Affected states:
   * - [`MinerBindings`] for the miner account is pointed to the worker
   * - [`WorkerBindings`] for the worker is pointed to the miner account
   * - the miner info at [`Miners`] is updated with `Ready` state
   */
  get asV1131(): {miner: Uint8Array, worker: Uint8Array} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningMinerEnterUnresponsiveEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.MinerEnterUnresponsive')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Miner enters unresponsive state. \[miner\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerEnterUnresponsive') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  Miner enters unresponsive state. \[miner\]
   */
  get asV1040(): Uint8Array {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Miner enters unresponsive state.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated from `MiningIdle` to `MiningUnresponsive`
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerEnterUnresponsive') === '5cbbb619afe1395a8eeba5c9c1bc02f2dca2bb47a2f53335232c2d95096bf3fc'
  }

  /**
   * Miner enters unresponsive state.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated from `MiningIdle` to `MiningUnresponsive`
   */
  get asV1131(): {miner: Uint8Array} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningMinerExitUnresponsiveEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.MinerExitUnresponsive')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Miner returns to responsive state \[miner\]
   */
  get isV1091(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerExitUnresponsive') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   * Miner returns to responsive state \[miner\]
   */
  get asV1091(): Uint8Array {
    assert(this.isV1091)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Miner returns to responsive state.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated from `MiningUnresponsive` to `MiningIdle`
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerExitUnresponsive') === '5cbbb619afe1395a8eeba5c9c1bc02f2dca2bb47a2f53335232c2d95096bf3fc'
  }

  /**
   * Miner returns to responsive state.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated from `MiningUnresponsive` to `MiningIdle`
   */
  get asV1131(): {miner: Uint8Array} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningMinerReclaimedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.MinerReclaimed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Miner is reclaimed, with its slash settled. \[miner, original_stake, slashed\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerReclaimed') === '0f263bfdefa394edfb38d20d33662423a2e0902235b599f9b2b0292f157f0902'
  }

  /**
   *  Miner is reclaimed, with its slash settled. \[miner, original_stake, slashed\]
   */
  get asV1040(): [Uint8Array, bigint, bigint] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Miner is reclaimed, with its slash settled.
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerReclaimed') === 'b2e0bf41e7f7ee2f60305a2d67d5b94dee97ed25acd0e7b8aad3bbc58848e265'
  }

  /**
   * Miner is reclaimed, with its slash settled.
   */
  get asV1131(): {miner: Uint8Array, originalStake: bigint, slashed: bigint} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningMinerSettledEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.MinerSettled')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Miner settled successfully. \[miner, v, payout\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerSettled') === '0f263bfdefa394edfb38d20d33662423a2e0902235b599f9b2b0292f157f0902'
  }

  /**
   *  Miner settled successfully. \[miner, v, payout\]
   */
  get asV1040(): [Uint8Array, bigint, bigint] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Miner settled successfully.
   * 
   * It results in the v in [`Miners`] being updated. It also indicates the downstream
   * stake pool has received the mining reward (payout), and the treasury has received the
   * tax.
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerSettled') === '76e2c6595b90cdd18f68df3b37575e908064c95f276f32cb6723c115410570e0'
  }

  /**
   * Miner settled successfully.
   * 
   * It results in the v in [`Miners`] being updated. It also indicates the downstream
   * stake pool has received the mining reward (payout), and the treasury has received the
   * tax.
   */
  get asV1131(): {miner: Uint8Array, vBits: bigint, payoutBits: bigint} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningMinerStartedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.MinerStarted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Miner starts mining. \[miner\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerStarted') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  Miner starts mining. \[miner\]
   */
  get asV1040(): Uint8Array {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A miner starts mining.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated with `MiningIdle` state
   * - [`NextSessionId`] for the miner is incremented
   * - [`Stakes`] for the miner is updated
   * - [`OnlineMiners`] is incremented
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerStarted') === '5cbbb619afe1395a8eeba5c9c1bc02f2dca2bb47a2f53335232c2d95096bf3fc'
  }

  /**
   * A miner starts mining.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated with `MiningIdle` state
   * - [`NextSessionId`] for the miner is incremented
   * - [`Stakes`] for the miner is updated
   * - [`OnlineMiners`] is incremented
   */
  get asV1131(): {miner: Uint8Array} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A miner starts mining.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated with `MiningIdle` state
   * - [`NextSessionId`] for the miner is incremented
   * - [`Stakes`] for the miner is updated
   * - [`OnlineMiners`] is incremented
   */
  get isV1170(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerStarted') === 'd4b307f4fa783435cb06a98b9e4d163a3444252f78222d8635bac53227a2926e'
  }

  /**
   * A miner starts mining.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated with `MiningIdle` state
   * - [`NextSessionId`] for the miner is incremented
   * - [`Stakes`] for the miner is updated
   * - [`OnlineMiners`] is incremented
   */
  get asV1170(): {miner: Uint8Array, initV: bigint, initP: number} {
    assert(this.isV1170)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningMinerStoppedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.MinerStopped')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Miner stops mining. \[miner\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerStopped') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  Miner stops mining. \[miner\]
   */
  get asV1040(): Uint8Array {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Miner stops mining.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated with `MiningCoolingDown` state
   * - [`OnlineMiners`] is decremented
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerStopped') === '5cbbb619afe1395a8eeba5c9c1bc02f2dca2bb47a2f53335232c2d95096bf3fc'
  }

  /**
   * Miner stops mining.
   * 
   * Affected states:
   * - the miner info at [`Miners`] is updated with `MiningCoolingDown` state
   * - [`OnlineMiners`] is decremented
   */
  get asV1131(): {miner: Uint8Array} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningMinerUnboundEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.MinerUnbound')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Miner & worker are unbound. \[miner, worker\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerUnbound') === 'e54ae910805a8a9413af1a7f5885a5d0ba5f4e105175cd6b0ce2a8702ddf1861'
  }

  /**
   *  Miner & worker are unbound. \[miner, worker\]
   */
  get asV1040(): [Uint8Array, Uint8Array] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Miner & worker are unbound.
   * 
   * Affected states:
   * - [`MinerBindings`] for the miner account is removed
   * - [`WorkerBindings`] for the worker is removed
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaMining.MinerUnbound') === '155e275cc52b608766efe0776ca792908d7669683141051c9b1c5381d14ef1d1'
  }

  /**
   * Miner & worker are unbound.
   * 
   * Affected states:
   * - [`MinerBindings`] for the miner account is removed
   * - [`WorkerBindings`] for the worker is removed
   */
  get asV1131(): {miner: Uint8Array, worker: Uint8Array} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaMiningTokenomicParametersChangedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaMining.TokenomicParametersChanged')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Tokenomic parameter changed.
   */
  get isV1090(): boolean {
    return this._chain.getEventHash('PhalaMining.TokenomicParametersChanged') === '01f2f9c28aa1d4d36a81ff042620b6677d25bf07c2bf4acc37b58658778a4fca'
  }

  /**
   * Tokenomic parameter changed.
   */
  get asV1090(): null {
    assert(this.isV1090)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaRegistryInitialScoreSetEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaRegistry.InitialScoreSet')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1182(): boolean {
    return this._chain.getEventHash('PhalaRegistry.InitialScoreSet') === '9178da6c60711edb6a539f26f333d754493f4e28ed8719c2f7892f1fe44e9b03'
  }

  get asV1182(): {pubkey: Uint8Array, initScore: number} {
    assert(this.isV1182)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaRegistryWorkerAddedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaRegistry.WorkerAdded')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1160(): boolean {
    return this._chain.getEventHash('PhalaRegistry.WorkerAdded') === '98e1831cdc7afe0dd8966284b7cee8ea75fc4fd6863a6d40e24a40480576f3a2'
  }

  get asV1160(): {pubkey: Uint8Array} {
    assert(this.isV1160)
    return this._chain.decodeEvent(this.event)
  }

  get isV1182(): boolean {
    return this._chain.getEventHash('PhalaRegistry.WorkerAdded') === 'fece23d904013d68e6f2bcd30d560888a8f9ef5c1194a230ccfe4ebcd8fd8aaa'
  }

  get asV1182(): {pubkey: Uint8Array, confidenceLevel: number} {
    assert(this.isV1182)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaRegistryWorkerUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaRegistry.WorkerUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1160(): boolean {
    return this._chain.getEventHash('PhalaRegistry.WorkerUpdated') === '98e1831cdc7afe0dd8966284b7cee8ea75fc4fd6863a6d40e24a40480576f3a2'
  }

  get asV1160(): {pubkey: Uint8Array} {
    assert(this.isV1160)
    return this._chain.decodeEvent(this.event)
  }

  get isV1182(): boolean {
    return this._chain.getEventHash('PhalaRegistry.WorkerUpdated') === 'fece23d904013d68e6f2bcd30d560888a8f9ef5c1194a230ccfe4ebcd8fd8aaa'
  }

  get asV1182(): {pubkey: Uint8Array, confidenceLevel: number} {
    assert(this.isV1182)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolContributionEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.Contribution')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  \[pid, user, amount\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaStakePool.Contribution') === 'd357793d55b7a7f611ebd0d666a704245d42575af9ed4be93753feee425797a0'
  }

  /**
   *  \[pid, user, amount\]
   */
  get asV1040(): [bigint, Uint8Array, bigint] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Someone contributed to a pool
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   * - the locking ledger of the contributor at [`StakeLedger`]
   * - when there was any request in the withdraw queue, the action may trigger withdrawals
   *   ([`Withdrawal`](#variant.Withdrawal) event)
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaStakePool.Contribution') === 'c74e602209144c7d8c0d4ba393b82daa25b4a92ec11c714c522c63ef7965071d'
  }

  /**
   * Someone contributed to a pool
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   * - the locking ledger of the contributor at [`StakeLedger`]
   * - when there was any request in the withdraw queue, the action may trigger withdrawals
   *   ([`Withdrawal`](#variant.Withdrawal) event)
   */
  get asV1131(): {pid: bigint, user: Uint8Array, amount: bigint} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Someone contributed to a pool
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   * - the locking ledger of the contributor at [`StakeLedger`]
   * - when there was any request in the withdraw queue, the action may trigger withdrawals
   *   ([`Withdrawal`](#variant.Withdrawal) event)
   */
  get isV1160(): boolean {
    return this._chain.getEventHash('PhalaStakePool.Contribution') === '9505ed8255acf2383138ec1d4bc2e9340bcfad91006cfdf9f1bb16911b7e8dcd'
  }

  /**
   * Someone contributed to a pool
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   * - the locking ledger of the contributor at [`StakeLedger`]
   * - when there was any request in the withdraw queue, the action may trigger withdrawals
   *   ([`Withdrawal`](#variant.Withdrawal) event)
   */
  get asV1160(): {pid: bigint, user: Uint8Array, amount: bigint, shares: bigint} {
    assert(this.isV1160)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolMiningStartedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.MiningStarted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The amount of stakes for a worker to start mine
   */
  get isV1170(): boolean {
    return this._chain.getEventHash('PhalaStakePool.MiningStarted') === '3fc05699bb0352c7a8b8388ecc2140be70e6e6943d5df40c853f148bad7835bc'
  }

  /**
   * The amount of stakes for a worker to start mine
   */
  get asV1170(): {pid: bigint, worker: Uint8Array, amount: bigint} {
    assert(this.isV1170)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolOwnerRewardsWithdrawnEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.OwnerRewardsWithdrawn')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Similar to event `RewardsWithdrawn` but only affected states:
   *  - the stake related fields in [`StakePools`]
   */
  get isV1150(): boolean {
    return this._chain.getEventHash('PhalaStakePool.OwnerRewardsWithdrawn') === 'c74e602209144c7d8c0d4ba393b82daa25b4a92ec11c714c522c63ef7965071d'
  }

  /**
   * Similar to event `RewardsWithdrawn` but only affected states:
   *  - the stake related fields in [`StakePools`]
   */
  get asV1150(): {pid: bigint, user: Uint8Array, amount: bigint} {
    assert(this.isV1150)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolPoolCapacitySetEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.PoolCapacitySet')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  \[pid, cap\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolCapacitySet') === 'efcf289f77ecffc8935a91c45f3a610a5323ca19a52608e16110fb0029033cd7'
  }

  /**
   *  \[pid, cap\]
   */
  get asV1040(): [bigint, bigint] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * The stake capacity of the pool is updated
   * 
   * Affected states:
   * - the `cap` field in [`StakePools`] is updated
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolCapacitySet') === 'a87d0aee1155f25dee021b1bbfe934015082d92b9cb56be362d0c7f8c6b91215'
  }

  /**
   * The stake capacity of the pool is updated
   * 
   * Affected states:
   * - the `cap` field in [`StakePools`] is updated
   */
  get asV1131(): {pid: bigint, cap: bigint} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolPoolCommissionSetEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.PoolCommissionSet')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  The real commission ratio is commission/1_000_000u32. \[pid, commission\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolCommissionSet') === 'b57e136df7099b4d95c82d61169a7dca2b6b7da2952d6383cedc8494d541669a'
  }

  /**
   *  The real commission ratio is commission/1_000_000u32. \[pid, commission\]
   */
  get asV1040(): [bigint, number] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * The commission of a pool is updated
   * 
   * The commission ratio is represented by an integer. The real value is
   * `commission / 1_000_000u32`.
   * 
   * Affected states:
   * - the `payout_commission` field in [`StakePools`] is updated
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolCommissionSet') === 'f9fd566d432542f7d455c2c329ace5fed0f06ab260c0f1a71f38b55f59535a53'
  }

  /**
   * The commission of a pool is updated
   * 
   * The commission ratio is represented by an integer. The real value is
   * `commission / 1_000_000u32`.
   * 
   * Affected states:
   * - the `payout_commission` field in [`StakePools`] is updated
   */
  get asV1131(): {pid: bigint, commission: number} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolPoolCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.PoolCreated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  \[owner, pid\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolCreated') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  /**
   *  \[owner, pid\]
   */
  get asV1040(): [Uint8Array, bigint] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A pool is created under an owner
   * 
   * Affected states:
   * - a new entry in [`StakePools`] with the pid
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolCreated') === '443db31f743a70c8cb7b298e12205d1672956da603edac4d4439cd0cb47151ce'
  }

  /**
   * A pool is created under an owner
   * 
   * Affected states:
   * - a new entry in [`StakePools`] with the pid
   */
  get asV1131(): {owner: Uint8Array, pid: bigint} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolPoolWhitelistCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.PoolWhitelistCreated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A pool contribution whitelist is added
   * - lazy operated when the first staker is added to the whitelist
   */
  get isV1150(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolWhitelistCreated') === '15b8ba175316d055bb1de5f91f6ab44e684ba1a815854b2993f0826794d4be6f'
  }

  /**
   * A pool contribution whitelist is added
   * - lazy operated when the first staker is added to the whitelist
   */
  get asV1150(): {pid: bigint} {
    assert(this.isV1150)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolPoolWhitelistDeletedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.PoolWhitelistDeleted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The pool contribution whitelist is deleted
   * - lazy operated when the last staker is removed from the whitelist
   */
  get isV1150(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolWhitelistDeleted') === '15b8ba175316d055bb1de5f91f6ab44e684ba1a815854b2993f0826794d4be6f'
  }

  /**
   * The pool contribution whitelist is deleted
   * - lazy operated when the last staker is removed from the whitelist
   */
  get asV1150(): {pid: bigint} {
    assert(this.isV1150)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolPoolWhitelistStakerAddedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.PoolWhitelistStakerAdded')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A staker is added to the pool contribution whitelist
   */
  get isV1150(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolWhitelistStakerAdded') === '878e163cf2bf9490c1cc3cd41821175e05b15c1873eef6163ce7ef9cecb30b12'
  }

  /**
   * A staker is added to the pool contribution whitelist
   */
  get asV1150(): {pid: bigint, staker: Uint8Array} {
    assert(this.isV1150)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolPoolWhitelistStakerRemovedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.PoolWhitelistStakerRemoved')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A staker is removed from the pool contribution whitelist
   */
  get isV1150(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolWhitelistStakerRemoved') === '878e163cf2bf9490c1cc3cd41821175e05b15c1873eef6163ce7ef9cecb30b12'
  }

  /**
   * A staker is removed from the pool contribution whitelist
   */
  get asV1150(): {pid: bigint, staker: Uint8Array} {
    assert(this.isV1150)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolPoolWorkerAddedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.PoolWorkerAdded')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  \[pid, worker\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolWorkerAdded') === '62ab179c459e900954ede92a01f149d553e9317efc7d0129525f40d631e8b38f'
  }

  /**
   *  \[pid, worker\]
   */
  get asV1040(): [bigint, Uint8Array] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A worker is added to the pool
   * 
   * Affected states:
   * - the `worker` is added to the vector `workers` in [`StakePools`]
   * - the worker in the [`WorkerAssignments`] is pointed to `pid`
   * - the worker-miner binding is updated in `mining` pallet ([`WorkerBindings`](mining::pallet::WorkerBindings),
   *   [`MinerBindings`](mining::pallet::MinerBindings))
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolWorkerAdded') === '3eddad70bc8df6b13283af1a5095e74f20ea2ecaeb63ab0291ae1f7f937c817b'
  }

  /**
   * A worker is added to the pool
   * 
   * Affected states:
   * - the `worker` is added to the vector `workers` in [`StakePools`]
   * - the worker in the [`WorkerAssignments`] is pointed to `pid`
   * - the worker-miner binding is updated in `mining` pallet ([`WorkerBindings`](mining::pallet::WorkerBindings),
   *   [`MinerBindings`](mining::pallet::MinerBindings))
   */
  get asV1131(): {pid: bigint, worker: Uint8Array} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A worker is added to the pool
   * 
   * Affected states:
   * - the `worker` is added to the vector `workers` in [`StakePools`]
   * - the worker in the [`WorkerAssignments`] is pointed to `pid`
   * - the worker-miner binding is updated in `mining` pallet ([`WorkerBindings`](mining::pallet::WorkerBindings),
   *   [`MinerBindings`](mining::pallet::MinerBindings))
   */
  get isV1170(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolWorkerAdded') === '816729d64276f474dc5ebaf960f292a6665bd6bc750eb85436a8e8554ca2e8e6'
  }

  /**
   * A worker is added to the pool
   * 
   * Affected states:
   * - the `worker` is added to the vector `workers` in [`StakePools`]
   * - the worker in the [`WorkerAssignments`] is pointed to `pid`
   * - the worker-miner binding is updated in `mining` pallet ([`WorkerBindings`](mining::pallet::WorkerBindings),
   *   [`MinerBindings`](mining::pallet::MinerBindings))
   */
  get asV1170(): {pid: bigint, worker: Uint8Array, miner: Uint8Array} {
    assert(this.isV1170)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolPoolWorkerRemovedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.PoolWorkerRemoved')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A worker is removed from a pool.
   */
  get isV1090(): boolean {
    return this._chain.getEventHash('PhalaStakePool.PoolWorkerRemoved') === '3eddad70bc8df6b13283af1a5095e74f20ea2ecaeb63ab0291ae1f7f937c817b'
  }

  /**
   * A worker is removed from a pool.
   */
  get asV1090(): {pid: bigint, worker: Uint8Array} {
    assert(this.isV1090)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolRewardReceivedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.RewardReceived')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The amount of reward that distributed to owner and stakers
   */
  get isV1160(): boolean {
    return this._chain.getEventHash('PhalaStakePool.RewardReceived') === 'ae6b7d16510f97a08b26da4e220f708f64330be952422280b4486922498b1e73'
  }

  /**
   * The amount of reward that distributed to owner and stakers
   */
  get asV1160(): {pid: bigint, toOwner: bigint, toStakers: bigint} {
    assert(this.isV1160)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolRewardsWithdrawnEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.RewardsWithdrawn')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  \[pid, user, amount\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaStakePool.RewardsWithdrawn') === 'd357793d55b7a7f611ebd0d666a704245d42575af9ed4be93753feee425797a0'
  }

  /**
   *  \[pid, user, amount\]
   */
  get asV1040(): [bigint, Uint8Array, bigint] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Pending rewards were withdrawn by a user
   * 
   * The reward and slash accumulator is resolved, and the reward is sent to the user
   * account.
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaStakePool.RewardsWithdrawn') === 'c74e602209144c7d8c0d4ba393b82daa25b4a92ec11c714c522c63ef7965071d'
  }

  /**
   * Pending rewards were withdrawn by a user
   * 
   * The reward and slash accumulator is resolved, and the reward is sent to the user
   * account.
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   */
  get asV1131(): {pid: bigint, user: Uint8Array, amount: bigint} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolStakerRewardsWithdrawnEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.StakerRewardsWithdrawn')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Similar to event `ewardsWithdrawn` but only affected states:
   *  - the user staking account at [`PoolStakers`]
   */
  get isV1150(): boolean {
    return this._chain.getEventHash('PhalaStakePool.StakerRewardsWithdrawn') === 'c74e602209144c7d8c0d4ba393b82daa25b4a92ec11c714c522c63ef7965071d'
  }

  /**
   * Similar to event `ewardsWithdrawn` but only affected states:
   *  - the user staking account at [`PoolStakers`]
   */
  get asV1150(): {pid: bigint, user: Uint8Array, amount: bigint} {
    assert(this.isV1150)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolWithdrawalEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.Withdrawal')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  \[pid, user, amount\]
   */
  get isV1040(): boolean {
    return this._chain.getEventHash('PhalaStakePool.Withdrawal') === 'd357793d55b7a7f611ebd0d666a704245d42575af9ed4be93753feee425797a0'
  }

  /**
   *  \[pid, user, amount\]
   */
  get asV1040(): [bigint, Uint8Array, bigint] {
    assert(this.isV1040)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some stake was withdrawn from a pool
   * 
   * The lock in [`Balances`](pallet_balances::pallet::Pallet) is updated to release the
   * locked stake.
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   * - the locking ledger of the contributor at [`StakeLedger`]
   */
  get isV1131(): boolean {
    return this._chain.getEventHash('PhalaStakePool.Withdrawal') === 'c74e602209144c7d8c0d4ba393b82daa25b4a92ec11c714c522c63ef7965071d'
  }

  /**
   * Some stake was withdrawn from a pool
   * 
   * The lock in [`Balances`](pallet_balances::pallet::Pallet) is updated to release the
   * locked stake.
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   * - the locking ledger of the contributor at [`StakeLedger`]
   */
  get asV1131(): {pid: bigint, user: Uint8Array, amount: bigint} {
    assert(this.isV1131)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some stake was withdrawn from a pool
   * 
   * The lock in [`Balances`](pallet_balances::pallet::Pallet) is updated to release the
   * locked stake.
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   * - the locking ledger of the contributor at [`StakeLedger`]
   */
  get isV1160(): boolean {
    return this._chain.getEventHash('PhalaStakePool.Withdrawal') === '9505ed8255acf2383138ec1d4bc2e9340bcfad91006cfdf9f1bb16911b7e8dcd'
  }

  /**
   * Some stake was withdrawn from a pool
   * 
   * The lock in [`Balances`](pallet_balances::pallet::Pallet) is updated to release the
   * locked stake.
   * 
   * Affected states:
   * - the stake related fields in [`StakePools`]
   * - the user staking account at [`PoolStakers`]
   * - the locking ledger of the contributor at [`StakeLedger`]
   */
  get asV1160(): {pid: bigint, user: Uint8Array, amount: bigint, shares: bigint} {
    assert(this.isV1160)
    return this._chain.decodeEvent(this.event)
  }
}

export class PhalaStakePoolWithdrawalQueuedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PhalaStakePool.WithdrawalQueued')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A withdrawal request is queued by adding or replacing an old one.
   */
  get isV1090(): boolean {
    return this._chain.getEventHash('PhalaStakePool.WithdrawalQueued') === '1a90b37fe35b57535681edf54bc9a7b3c018e99bc657c379f89e9e2e3f46780e'
  }

  /**
   * A withdrawal request is queued by adding or replacing an old one.
   */
  get asV1090(): {pid: bigint, user: Uint8Array, shares: bigint} {
    assert(this.isV1090)
    return this._chain.decodeEvent(this.event)
  }
}

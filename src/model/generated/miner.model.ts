import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {StakePool} from "./stakePool.model"
import {Worker} from "./worker.model"
import {MinerState} from "./_minerState"

@Entity_()
export class Miner {
  constructor(props?: Partial<Miner>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("bool", {nullable: false})
  isBound!: boolean

  @Index_()
  @ManyToOne_(() => StakePool, {nullable: true})
  stakePool!: StakePool | undefined | null

  @Index_()
  @ManyToOne_(() => Worker, {nullable: true})
  worker!: Worker | undefined | null

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  stake!: BigDecimal

  @Column_("varchar", {length: 18, nullable: false})
  state!: MinerState

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  v!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  ve!: BigDecimal

  @Column_("int4", {nullable: false})
  pInit!: number

  @Column_("int4", {nullable: false})
  pInstant!: number

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  totalReward!: BigDecimal

  @Column_("timestamp with time zone", {nullable: true})
  coolingDownStartTime!: Date | undefined | null
}

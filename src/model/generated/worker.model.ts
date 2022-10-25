import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {StakePool} from "./stakePool.model"
import {Miner} from "./miner.model"

@Entity_()
export class Worker {
  constructor(props?: Partial<Worker>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => StakePool, {nullable: true})
  stakePool!: StakePool | undefined | null

  @Index_()
  @ManyToOne_(() => Miner, {nullable: true})
  miner!: Miner | undefined | null

  @Column_("int4", {nullable: false})
  confidenceLevel!: number

  @Column_("int4", {nullable: true})
  initialScore!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: true})
  sMin!: BigDecimal | undefined | null

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: true})
  sMax!: BigDecimal | undefined | null

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: true})
  share!: BigDecimal | undefined | null
}

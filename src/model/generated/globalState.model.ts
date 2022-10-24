import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class GlobalState {
  constructor(props?: Partial<GlobalState>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  height!: number

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  totalStake!: BigDecimal

  @Column_("int4", {nullable: false})
  lastRecordedBlockHeight!: number

  @Column_("timestamp with time zone", {nullable: false})
  lastRecordedBlockTime!: Date

  @Column_("int4", {nullable: false})
  averageBlockTime!: number

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  miningWorkerShare!: BigDecimal
}

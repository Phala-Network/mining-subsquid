import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {StakePool} from "./stakePool.model"

@Entity_()
export class StakePoolStake {
  constructor(props?: Partial<StakePoolStake>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Index_()
  @ManyToOne_(() => StakePool, {nullable: true})
  stakePool!: StakePool

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  amount!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  shares!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  reward!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  withdrawalAmount!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  withdrawalShares!: BigDecimal

  @Column_("timestamp with time zone", {nullable: true})
  withdrawalStartTime!: Date | undefined | null
}

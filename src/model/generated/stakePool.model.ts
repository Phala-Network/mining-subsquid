import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {StakePoolStake} from "./stakePoolStake.model"
import {Worker} from "./worker.model"
import {Miner} from "./miner.model"
import {StakePoolWhitelist} from "./stakePoolWhitelist.model"

@Entity_()
export class StakePool {
  constructor(props?: Partial<StakePool>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_({unique: true})
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  pid!: bigint

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  commission!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: true})
  capacity!: BigDecimal | undefined | null

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: true})
  delegable!: BigDecimal | undefined | null

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  freeStake!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  releasingStake!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  totalStake!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  totalShares!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  ownerReward!: BigDecimal

  @Column_("int4", {nullable: false})
  activeStakeCount!: number

  @Column_("int4", {nullable: false})
  workerCount!: number

  @Column_("int4", {nullable: false})
  miningWorkerCount!: number

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  miningWorkerShare!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  aprBase!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  totalWithdrawal!: BigDecimal

  @Column_("bool", {nullable: false})
  whitelistEnabled!: boolean

  @OneToMany_(() => StakePoolStake, e => e.stakePool)
  stakes!: StakePoolStake[]

  @OneToMany_(() => Worker, e => e.stakePool)
  workers!: Worker[]

  @OneToMany_(() => Miner, e => e.stakePool)
  miners!: Miner[]

  @OneToMany_(() => StakePoolWhitelist, e => e.stakePool)
  whitelists!: StakePoolWhitelist[]
}

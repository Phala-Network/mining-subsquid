import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {StakePool} from "./stakePool.model"
import {StakePoolWhitelist} from "./stakePoolWhitelist.model"
import {StakePoolStake} from "./stakePoolStake.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  totalStake!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  totalStakeReward!: BigDecimal

  @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
  totalOwnerReward!: BigDecimal

  @OneToMany_(() => StakePool, e => e.owner)
  ownedStakePools!: StakePool[]

  @OneToMany_(() => StakePoolWhitelist, e => e.account)
  whitelistedStakePools!: StakePoolWhitelist[]

  @OneToMany_(() => StakePoolStake, e => e.account)
  stakes!: StakePoolStake[]
}

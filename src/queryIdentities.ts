import {Account, IdentityLevel} from './model'
import {Ctx} from './processor'
import {IdentityIdentityOfStorage} from './types/storage'
import {getAccount} from './utils/common'
import {decodeAddress} from './utils/converters'

const queryIdentities = async (
  ctx: Ctx,
  accountIds: string[],
  accounts: Map<string, Account>
): Promise<void> => {
  const storage = new IdentityIdentityOfStorage(
    ctx,
    ctx.blocks[ctx.blocks.length - 1].header
  )
  const res = await storage.getManyAsV1090(accountIds.map(decodeAddress))
  for (let i = 0; i < res.length; i++) {
    const account = getAccount(accounts, accountIds[i])
    const registration = res[i]
    if (registration != null) {
      if ('value' in registration.info.display) {
        account.identityDisplay = Buffer.from(
          registration.info.display.value
        ).toString()
      } else {
        account.identityDisplay = null
      }
      if (registration.judgements.length > 0) {
        account.identityLevel =
          IdentityLevel[registration.judgements[0][1].__kind]
      } else {
        account.identityLevel = IdentityLevel.Unknown
      }
    } else {
      account.identityLevel = IdentityLevel.Unknown
      account.identityDisplay = null
    }
  }
}

export default queryIdentities

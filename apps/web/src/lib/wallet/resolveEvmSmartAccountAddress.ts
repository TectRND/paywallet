import { createThirdwebClient } from 'thirdweb'
import { defineChain } from 'thirdweb/chains'
import { predictSmartAccountAddress } from 'thirdweb/wallets/smart'

export async function resolveEvmSmartAccountAddress(args: {
  chainId: number
  factoryAddress: string
  adminAddress: string
  accountSalt: string
}) {
  const secretKey = process.env.THIRDWEB_SECRET_KEY
  if (!secretKey) throw new Error('Missing THIRDWEB_SECRET_KEY')

  const client = createThirdwebClient({ secretKey })
  const chain = defineChain({ id: args.chainId })

  const address = await predictSmartAccountAddress({
    client,
    chain,
    factoryAddress: args.factoryAddress as `0x${string}`,
    adminAddress: args.adminAddress as `0x${string}`,
    accountSalt: args.accountSalt,
  })

  return address
}

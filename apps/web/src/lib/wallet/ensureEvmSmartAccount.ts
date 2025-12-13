import { getPayloadClient } from '@/lib/payload'
import { getEngineConfig } from '@/lib/thirdweb/engine'
import { resolveEvmSmartAccountAddress } from '@/lib/wallet/resolveEvmSmartAccountAddress'

export async function ensureEvmSmartAccount(customerId: string, chainId = 1) {
  const payload = await getPayloadClient()
  const cfg = await getEngineConfig()

  const customer = await payload.findByID({ collection: 'customers', id: customerId })
  if (customer.evmAccount) {
    return await payload.findByID({ collection: 'evm_smart_accounts', id: customer.evmAccount as string })
  }

  const factoryAddress = cfg.factoryByChainId[chainId]
  if (!factoryAddress) throw new Error(`No AccountFactory configured for chainId=${chainId}`)

  const adminAddress = cfg.backendWalletAddress
  const accountSalt = `cust:${customerId}`

  const smartAccountAddress = await resolveEvmSmartAccountAddress({
    chainId,
    factoryAddress,
    adminAddress,
    accountSalt,
  })

  const evmDoc = await payload.create({
    collection: 'evm_smart_accounts',
    data: {
      customer: customerId,
      smartAccountAddress,
      salt: accountSalt,
      factoryAddress,
      adminAddress,
      supportedChainIds: [1, 56, 8453, 42161, 137],
      custodyMode: 'backend',
      aaConfigVersion: 'v1',
    },
  })

  await payload.update({
    collection: 'customers',
    id: customerId,
    data: { evmAccount: evmDoc.id },
  })

  return evmDoc
}

import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getEngineConfig } from '@/lib/thirdweb/engine'
import { resolveEvmSmartAccountAddress } from '@/lib/wallet/resolveEvmSmartAccountAddress'

export async function GET(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.collection !== 'customers') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cfg = await getEngineConfig()
  const url = new URL(req.url)
  const chainId = Number(url.searchParams.get('chainId') ?? '1')

  const factoryAddress = cfg.factoryByChainId[chainId]
  if (!factoryAddress) {
    return NextResponse.json({ error: `No factory configured for chainId=${chainId}` }, { status: 400 })
  }

  const accountSalt = `cust:${user.id}`
  const adminAddress = cfg.backendWalletAddress

  const smartAccountAddress = await resolveEvmSmartAccountAddress({
    chainId,
    factoryAddress,
    adminAddress,
    accountSalt,
  })

  return NextResponse.json({
    ok: true,
    chainId,
    smartAccountAddress,
    accountSalt,
    adminAddress,
    factoryAddress,
  })
}

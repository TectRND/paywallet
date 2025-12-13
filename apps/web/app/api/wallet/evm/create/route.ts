import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { ensureEvmSmartAccount } from '@/lib/wallet/ensureEvmSmartAccount'

export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.collection !== 'customers') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const chainId = Number(url.searchParams.get('chainId') ?? '1')

  const evm = await ensureEvmSmartAccount(user.id, chainId)
  return NextResponse.json({ ok: true, evm })
}

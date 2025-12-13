import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { createSolanaWallet } from '@/lib/thirdweb/solana'

export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.collection !== 'customers') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const customer = await payload.findByID({ collection: 'customers', id: user.id })
  if (customer.solWallet) {
    const sol = await payload.findByID({ collection: 'sol_server_wallets', id: customer.solWallet as string })
    return NextResponse.json({ ok: true, sol })
  }

  const tw = await createSolanaWallet(`cust_${user.id}`)

  const solDoc = await payload.create({
    collection: 'sol_server_wallets',
    data: {
      customer: user.id,
      thirdwebWalletId: tw.id,
      publicKey: tw.address,
      network: 'solana:mainnet',
      custodyMode: 'backend',
    },
  })

  await payload.update({
    collection: 'customers',
    id: user.id,
    data: { solWallet: solDoc.id },
  })

  return NextResponse.json({ ok: true, sol: solDoc })
}

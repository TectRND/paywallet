import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getEngineConfig, enginePOST } from '@/lib/thirdweb/engine'
import { ensureEvmSmartAccount } from '@/lib/wallet/ensureEvmSmartAccount'

type Body = {
  chainId: number
  to: string
  valueWei: string
}

export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const cfg = await getEngineConfig()

  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.collection !== 'customers') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { chainId, to, valueWei } = (await req.json()) as Body
  const evm = await ensureEvmSmartAccount(user.id, chainId)

  const idempotencyKey = `engine:intent:${user.id}:${Date.now()}:${Math.random().toString(16).slice(2)}`

  const txDoc = await payload.create({
    collection: 'transactions',
    data: {
      customer: user.id,
      networkType: 'evm',
      chainId,
      type: 'transfer',
      status: 'created',
      source: 'engine',
      idempotencyKey,
      from: evm.smartAccountAddress,
      to,
      asset: 'native',
      amount: valueWei,
    },
  })

  const resp = await enginePOST<{ result: { queueId: string } }>(
    `/backend-wallet/${chainId}/send-transaction-batch-atomic`,
    { transactions: [{ toAddress: to, value: valueWei, data: '0x' }] },
    cfg,
    {
      'x-backend-wallet-address': cfg.backendWalletAddress,
      'x-smart-account-address': evm.smartAccountAddress,
    },
  )

  await payload.update({
    collection: 'transactions',
    id: txDoc.id,
    data: { engineQueueId: resp.result.queueId, status: 'submitted' },
  })

  return NextResponse.json({ ok: true, queueId: resp.result.queueId, transactionId: txDoc.id })
}

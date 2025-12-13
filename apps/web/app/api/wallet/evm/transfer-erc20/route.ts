import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getEngineConfig, enginePOST } from '@/lib/thirdweb/engine'
import { ensureEvmSmartAccount } from '@/lib/wallet/ensureEvmSmartAccount'

type Body = {
  chainId: number
  tokenAddress: string
  to: string
  amountWei: string
}

export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const cfg = await getEngineConfig()

  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.collection !== 'customers') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { chainId, tokenAddress, to, amountWei } = (await req.json()) as Body
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
      asset: tokenAddress.toLowerCase(),
      amount: amountWei,
    },
  })

  const resp = await enginePOST<{ result: { queueId: string } }>(
    `/contract/${chainId}/${tokenAddress}/write`,
    { functionName: 'transfer(address,uint256)', args: [to, amountWei] },
    cfg,
    {
      'x-backend-wallet-address': cfg.backendWalletAddress,
      // Prefer salt-based routing; Engine will derive / deploy as needed
      'x-account-salt': `cust:${user.id}`,
    },
  )

  await payload.update({
    collection: 'transactions',
    id: txDoc.id,
    data: { engineQueueId: resp.result.queueId, status: 'submitted' },
  })

  return NextResponse.json({ ok: true, queueId: resp.result.queueId, transactionId: txDoc.id })
}

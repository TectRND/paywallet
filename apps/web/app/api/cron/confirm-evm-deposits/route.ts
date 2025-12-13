import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getEngineConfig } from '@/lib/thirdweb/engine'
import { getLatestBlockNumber } from '@/lib/evm/rpc'

function assertCronAuth(req: Request) {
  const token = req.headers.get('x-cron-token')
  if (!token || token !== process.env.CRON_TOKEN) {
    throw new Error('Unauthorized cron')
  }
}

export async function POST(req: Request) {
  try {
    assertCronAuth(req)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const cfg = await getEngineConfig()

  const pending = await payload.find({
    collection: 'transactions',
    where: {
      and: [
        { networkType: { equals: 'evm' } },
        { type: { equals: 'deposit' } },
        { status: { equals: 'pending' } },
      ],
    },
    limit: 500,
    sort: 'blockTimestamp',
  })

  const latestCache = new Map<number, number>()
  let confirmed = 0
  let updated = 0
  let skipped = 0

  for (const tx of pending.docs as any[]) {
    const chainId = Number(tx.chainId)
    const rpcUrl = cfg.rpcByChainId[chainId]
    if (!rpcUrl) {
      skipped++
      continue
    }

    if (!latestCache.has(chainId)) {
      latestCache.set(chainId, await getLatestBlockNumber(chainId, rpcUrl))
    }
    const latest = latestCache.get(chainId)!

    const blockNumber = Number(tx.blockNumber ?? 0)
    const required = Number(tx.confirmationsRequired ?? 12)
    const conf = Math.max(0, latest - blockNumber)

    if (conf >= required) {
      await payload.update({
        collection: 'transactions',
        id: tx.id,
        data: { confirmations: conf, status: 'confirmed' },
      })
      confirmed++
    } else {
      await payload.update({
        collection: 'transactions',
        id: tx.id,
        data: { confirmations: conf },
      })
      updated++
    }
  }

  return NextResponse.json({ ok: true, checked: pending.docs.length, confirmed, updated, skipped })
}

import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { fetchTransferEvents } from '@/lib/thirdweb/insight'
import { topicToAddress, hexToBigInt } from '@/lib/evm/parseTransfer'

function assertCronAuth(req: Request) {
  const token = req.headers.get('x-cron-token')
  if (!token || token !== process.env.CRON_TOKEN) {
    throw new Error('Unauthorized cron')
  }
}

export async function POST(req: Request) {
  try {
    assertCronAuth(req)
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()

  // Active allowlist tokens
  const allow = await payload.find({
    collection: 'token_allowlist',
    where: { isActive: { equals: true } },
    limit: 5000,
  })

  // All EVM smart accounts (we match deposits by to-address)
  const evmAccounts = await payload.find({ collection: 'evm_smart_accounts', limit: 20000 })

  const addrToCustomer = new Map<string, string>()
  for (const a of evmAccounts.docs as any[]) {
    addrToCustomer.set(String(a.smartAccountAddress).toLowerCase(), String(a.customer))
  }

  // group allowlist by chain
  const byChain = new Map<number, any[]>()
  for (const t of allow.docs as any[]) {
    const chainId = Number(t.chainId)
    byChain.set(chainId, [...(byChain.get(chainId) ?? []), t])
  }

  let created = 0
  let skipped = 0

  for (const [chainId, tokens] of byChain.entries()) {
    // load state
    const stateRes = await payload.find({
      collection: 'indexer_state',
      where: { chainId: { equals: chainId } },
      limit: 1,
    })
    const lastTs = Number((stateRes.docs[0] as any)?.lastBlockTimestamp ?? 0)
    let maxTs = lastTs

    for (const token of tokens) {
      const tokenAddress = String(token.contractAddress).toLowerCase()
      const confReq = Number(token.confirmationsRequired ?? 12)

      const resp = await fetchTransferEvents({
        chainId,
        tokenAddress,
        fromTimestamp: lastTs,
        limit: 1000,
      })

      for (const ev of resp.data) {
        const to = topicToAddress(ev.topics?.[2] ?? '').toLowerCase()
        const customerId = addrToCustomer.get(to)
        if (!customerId) continue

        const txHash = String(ev.transaction_hash)
        const logIndex = Number(ev.log_index)
        const blockTs = Number(ev.block_timestamp)
        const blockNumber = Number(ev.block_number)
        maxTs = Math.max(maxTs, blockTs)

        const amount = hexToBigInt(String(ev.data)).toString()
        const from = topicToAddress(ev.topics?.[1] ?? '')

        const idempotencyKey = `insight:${chainId}:${txHash}:${logIndex}`

        // Upsert by idempotencyKey
        const existing = await payload.find({
          collection: 'transactions',
          where: { idempotencyKey: { equals: idempotencyKey } },
          limit: 1,
        })

        if (existing.docs.length) {
          skipped++
          continue
        }

        await payload.create({
          collection: 'transactions',
          data: {
            customer: customerId,
            networkType: 'evm',
            chainId,
            type: 'deposit',
            status: 'pending',
            source: 'insight',
            idempotencyKey,
            transactionHash: txHash,
            logIndex,
            blockTimestamp: blockTs,
            blockNumber,
            confirmationsRequired: confReq,
            confirmations: 0,
            from,
            to,
            asset: tokenAddress,
            amount,
            rawWebhook: ev,
          },
        })

        created++
      }
    }

    // advance timestamp with small overlap for safety
    const nextTs = Math.max(0, maxTs - 30)
    if (!stateRes.docs.length) {
      await payload.create({ collection: 'indexer_state', data: { chainId, lastBlockTimestamp: nextTs } })
    } else {
      await payload.update({
        collection: 'indexer_state',
        id: (stateRes.docs[0] as any).id,
        data: { lastBlockTimestamp: nextTs },
      })
    }
  }

  return NextResponse.json({ ok: true, created, skipped })
}

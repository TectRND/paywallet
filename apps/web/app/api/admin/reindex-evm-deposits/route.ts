import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.collection !== 'admins') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as { chainId: number; fromTimestamp: number }
  const chainId = Number(body.chainId)
  const fromTimestamp = Number(body.fromTimestamp)

  const existing = await payload.find({
    collection: 'indexer_state',
    where: { chainId: { equals: chainId } },
    limit: 1,
  })

  if (!existing.docs.length) {
    await payload.create({ collection: 'indexer_state', data: { chainId, lastBlockTimestamp: fromTimestamp } })
  } else {
    await payload.update({
      collection: 'indexer_state',
      id: (existing.docs[0] as any).id,
      data: { lastBlockTimestamp: fromTimestamp },
    })
  }

  return NextResponse.json({ ok: true })
}

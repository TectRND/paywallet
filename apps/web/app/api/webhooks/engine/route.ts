import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { isExpired, isValidEngineSignature } from '@/lib/security/engineWebhooks'

const rank: Record<string, number> = {
  created: 0,
  queued: 1,
  submitted: 2,
  sent: 3,
  errored: 4,
  mined: 5,
  cancelled: 6,
}

export async function POST(req: Request) {
  const secret = process.env.ENGINE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Missing ENGINE_WEBHOOK_SECRET' }, { status: 500 })

  const signature = req.headers.get('X-Engine-Signature') ?? ''
  const timestamp = req.headers.get('X-Engine-Timestamp') ?? ''
  const bodyText = await req.text()

  if (!signature || !timestamp) return NextResponse.json({ error: 'Missing signature headers' }, { status: 400 })
  if (isExpired(timestamp)) return NextResponse.json({ error: 'Expired' }, { status: 400 })
  if (!isValidEngineSignature(bodyText, timestamp, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(bodyText) as any
  const queueId = event.queueId as string | undefined
  if (!queueId) return NextResponse.json({ error: 'Missing queueId' }, { status: 400 })

  const engineStatus = event.status as string | undefined // sent|mined|errored|cancelled
  const onchainStatus = event.onchainStatus as string | undefined // success|reverted
  const transactionHash = event.transactionHash as string | undefined
  const errorMessage = event.errorMessage as string | undefined

  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'transactions',
    where: { engineQueueId: { equals: queueId } },
    limit: 1,
  })

  if (!found.docs.length) {
    // Optionally store stubs; for now acknowledge to prevent retries storm
    return NextResponse.json({ ok: true, ignored: true })
  }

  const doc: any = found.docs[0]
  const current = doc.engineStatus ?? 'created'
  const next = engineStatus ?? current

  if (rank[next] >= rank[current]) {
    // Map to app status
    let status: any = doc.status
    if (next === 'mined') status = onchainStatus === 'reverted' ? 'reverted' : 'confirmed'
    else if (next === 'errored') status = 'failed'
    else if (next === 'sent') status = 'submitted'
    else if (next === 'cancelled') status = 'failed'

    await payload.update({
      collection: 'transactions',
      id: doc.id,
      data: {
        engineStatus: next,
        status,
        transactionHash: transactionHash ?? doc.transactionHash,
        errorMessage: errorMessage ?? doc.errorMessage,
        rawWebhook: event,
      },
    })
  }

  return NextResponse.json({ ok: true })
}

import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

type TokenRow = {
  chainId: number
  symbol: string
  name?: string
  contractAddress: string
  decimals: number
  confirmationsRequired?: number
  isActive?: boolean
}

export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.collection !== 'admins') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as {
    tokens: TokenRow[]
    mode?: 'upsert' | 'insert-only'
    setInactiveMissing?: boolean
  }

  const mode = body.mode ?? 'upsert'
  const setInactiveMissing = body.setInactiveMissing ?? false

  const incoming = (body.tokens ?? [])
    .map((t) => ({
      ...t,
      contractAddress: t.contractAddress.toLowerCase(),
      confirmationsRequired: t.confirmationsRequired ?? 12,
      isActive: t.isActive ?? true,
    }))
    .filter((t) => t.chainId && t.symbol && t.contractAddress && Number.isFinite(t.decimals))

  const existing = await payload.find({ collection: 'token_allowlist', limit: 5000 })

  const existingByKey = new Map<string, any>()
  for (const doc of existing.docs as any[]) {
    const key = `${doc.chainId}:${String(doc.contractAddress).toLowerCase()}`
    existingByKey.set(key, doc)
  }

  let created = 0
  let updated = 0
  let inactivated = 0
  const seen = new Set<string>()

  for (const t of incoming) {
    const key = `${t.chainId}:${t.contractAddress}`
    seen.add(key)
    const found = existingByKey.get(key)

    if (!found) {
      await payload.create({
        collection: 'token_allowlist',
        data: {
          chainId: t.chainId,
          symbol: t.symbol,
          name: t.name ?? '',
          contractAddress: t.contractAddress,
          decimals: t.decimals,
          confirmationsRequired: t.confirmationsRequired,
          isActive: t.isActive,
        },
      })
      created++
      continue
    }

    if (mode === 'insert-only') continue

    await payload.update({
      collection: 'token_allowlist',
      id: found.id,
      data: {
        symbol: t.symbol,
        name: t.name ?? found.name,
        decimals: t.decimals,
        confirmationsRequired: t.confirmationsRequired,
        isActive: t.isActive,
      },
    })
    updated++
  }

  if (setInactiveMissing) {
    for (const doc of existing.docs as any[]) {
      const key = `${doc.chainId}:${String(doc.contractAddress).toLowerCase()}`
      if (!seen.has(key) && doc.isActive) {
        await payload.update({
          collection: 'token_allowlist',
          id: doc.id,
          data: { isActive: false },
        })
        inactivated++
      }
    }
  }

  return NextResponse.json({ ok: true, received: incoming.length, created, updated, inactivated })
}

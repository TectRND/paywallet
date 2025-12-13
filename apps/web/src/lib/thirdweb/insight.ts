export function insightBase(chainId: number) {
  return `https://${chainId}.insight.thirdweb.com`
}

export function insightHeaders() {
  const clientId = process.env.THIRDWEB_INSIGHT_CLIENT_ID
  if (!clientId) throw new Error('Missing THIRDWEB_INSIGHT_CLIENT_ID')
  return { 'x-client-id': clientId }
}

export type InsightEvent = {
  chain_id: number
  block_number: number | string
  block_timestamp: number | string
  transaction_hash: string
  log_index: number | string
  address: string
  data: string
  topics: string[]
  decoded?: any
}

export async function fetchTransferEvents(args: {
  chainId: number
  tokenAddress: string
  fromTimestamp: number
  limit?: number
}) {
  const limit = args.limit ?? 1000
  const url = new URL(
    `${insightBase(args.chainId)}/v1/events/${args.tokenAddress}/Transfer(address,address,uint256)`,
  )
  url.searchParams.set('filter_block_timestamp_gte', String(args.fromTimestamp))
  url.searchParams.set('sort_by', 'block_timestamp')
  url.searchParams.set('sort_order', 'asc')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('decode', 'true')

  const res = await fetch(url.toString(), { headers: insightHeaders() })
  if (!res.ok) throw new Error(`Insight events fetch failed: ${res.status}`)
  return (await res.json()) as { data: InsightEvent[]; meta?: any }
}

import Link from 'next/link'
import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { txUrl } from '@/lib/evm/explorers'

type Search = {
  pending?: string
  chainId?: string
  symbol?: string
}

export default async function DepositsPage({ searchParams }: { searchParams: Search }) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: headers() })
  if (!user || user.collection !== 'customers') {
    return <main style={{ padding: 24 }}>Unauthorized</main>
  }

  const pendingOnly = searchParams.pending === '1'
  const chainIdFilter = searchParams.chainId ? Number(searchParams.chainId) : null
  const symbolFilter = searchParams.symbol ? searchParams.symbol.toUpperCase() : null

  const allow = await payload.find({
    collection: 'token_allowlist',
    where: { isActive: { equals: true } },
    limit: 5000,
  })

  const allowDocs = allow.docs as any[]
  const metaByKey = new Map<string, any>()
  const chains = Array.from(new Set(allowDocs.map((d) => Number(d.chainId)))).sort((a, b) => a - b)
  const symbols = Array.from(new Set(allowDocs.map((d) => String(d.symbol).toUpperCase()))).sort()

  for (const t of allowDocs) {
    metaByKey.set(`${t.chainId}:${String(t.contractAddress).toLowerCase()}`, t)
  }

  const and: any[] = [
    { customer: { equals: user.id } },
    { type: { equals: 'deposit' } },
    { networkType: { equals: 'evm' } },
  ]
  if (pendingOnly) and.push({ status: { equals: 'pending' } })
  if (chainIdFilter) and.push({ chainId: { equals: chainIdFilter } })

  if (symbolFilter) {
    const matches = allowDocs
      .filter((t) => String(t.symbol).toUpperCase() === symbolFilter)
      .filter((t) => !chainIdFilter || Number(t.chainId) === chainIdFilter)
      .map((t) => String(t.contractAddress).toLowerCase())

    if (matches.length) {
      and.push({ asset: { in: matches } })
    } else {
      // no matches -> return empty quickly
      return (
        <main style={{ padding: 24 }}>
          <h1>Deposits</h1>
          <Filters pendingOnly={pendingOnly} chainId={chainIdFilter} symbol={symbolFilter} chains={chains} symbols={symbols} />
          <p>No deposits match your filters.</p>
        </main>
      )
    }
  }

  const txs = await payload.find({
    collection: 'transactions',
    where: { and },
    sort: '-blockTimestamp',
    limit: 200,
  })

  return (
    <main style={{ padding: 24 }}>
      <h1>Deposits</h1>

      <Filters pendingOnly={pendingOnly} chainId={chainIdFilter} symbol={symbolFilter} chains={chains} symbols={symbols} />

      <table cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">When</th>
            <th align="left">Chain</th>
            <th align="left">Asset</th>
            <th align="left">Amount (raw)</th>
            <th align="left">Status</th>
            <th align="left">Confirmations</th>
            <th align="left">Explorer</th>
          </tr>
        </thead>
        <tbody>
          {(txs.docs as any[]).map((tx) => {
            const key = `${tx.chainId}:${String(tx.asset).toLowerCase()}`
            const meta = metaByKey.get(key)
            const url = txUrl(Number(tx.chainId), tx.transactionHash)
            const req = Number(tx.confirmationsRequired ?? meta?.confirmationsRequired ?? 0)
            const conf = Number(tx.confirmations ?? 0)

            return (
              <tr key={tx.id} style={{ borderTop: '1px solid #ddd' }}>
                <td>{tx.blockTimestamp ? new Date(tx.blockTimestamp * 1000).toLocaleString() : '-'}</td>
                <td>{tx.chainId}</td>
                <td>{meta?.symbol ?? 'TOKEN'}</td>
                <td style={{ fontFamily: 'monospace' }}>{tx.amount}</td>
                <td>{tx.status}</td>
                <td>{req ? `${conf}/${req}` : conf}</td>
                <td>{url ? <Link href={url} target="_blank">View</Link> : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

function Filters(props: {
  pendingOnly: boolean
  chainId: number | null
  symbol: string | null
  chains: number[]
  symbols: string[]
}) {
  const { pendingOnly, chainId, symbol, chains, symbols } = props

  return (
    <form method="get" style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '12px 0 20px' }}>
      <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input type="checkbox" name="pending" value="1" defaultChecked={pendingOnly} />
        Pending only
      </label>

      <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        Chain
        <select name="chainId" defaultValue={chainId ?? ''}>
          <option value="">All</option>
          {chains.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        Token
        <select name="symbol" defaultValue={symbol ?? ''}>
          <option value="">All</option>
          {symbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Apply</button>
    </form>
  )
}

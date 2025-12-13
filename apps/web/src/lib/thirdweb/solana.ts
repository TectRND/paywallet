const SOLANA_API = 'https://api.thirdweb.com/v1/solana'

function thirdwebHeaders() {
  const key = process.env.THIRDWEB_SECRET_KEY
  if (!key) throw new Error('Missing THIRDWEB_SECRET_KEY')
  return {
    'x-secret-key': key,
    'content-type': 'application/json',
  }
}

export type ThirdwebSolWallet = {
  id: string
  address: string
  label?: string
}

export async function createSolanaWallet(label: string): Promise<ThirdwebSolWallet> {
  const res = await fetch(`${SOLANA_API}/wallets`, {
    method: 'POST',
    headers: thirdwebHeaders(),
    body: JSON.stringify({ label }),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`thirdweb solana wallet create failed (${res.status}): ${JSON.stringify(json)}`)

  return {
    id: json.id ?? json.wallet?.id,
    address: json.address ?? json.wallet?.address,
    label,
  }
}

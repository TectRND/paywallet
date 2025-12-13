import { getPayloadClient } from '@/lib/payload'

export type EngineConfig = {
  engineUrl: string
  engineAccessToken: string
  backendWalletAddress: string
  factoryByChainId: Record<number, string>
  rpcByChainId: Record<number, string>
}

export async function getEngineConfig(): Promise<EngineConfig> {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'engine_settings' })

  const factoryByChainId: Record<number, string> = {}
  for (const row of (settings as any).accountFactories ?? []) {
    factoryByChainId[Number(row.chainId)] = String(row.factoryAddress)
  }

  const rpcByChainId: Record<number, string> = {}
  for (const row of (settings as any).rpcUrls ?? []) {
    rpcByChainId[Number(row.chainId)] = String(row.rpcUrl)
  }

  return {
    engineUrl: String((settings as any).engineUrl),
    engineAccessToken: String((settings as any).engineAccessToken),
    backendWalletAddress: String((settings as any).backendWalletAddress),
    factoryByChainId,
    rpcByChainId,
  }
}

function headers(token: string, extra?: Record<string, string>) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...extra,
  }
}

export async function enginePOST<T>(
  path: string,
  body: any,
  cfg: EngineConfig,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const res = await fetch(`${cfg.engineUrl}${path}`, {
    method: 'POST',
    headers: headers(cfg.engineAccessToken, extraHeaders),
    body: JSON.stringify(body),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(`Engine POST ${path} failed (${res.status}): ${JSON.stringify(json)}`)
  }
  return json as T
}

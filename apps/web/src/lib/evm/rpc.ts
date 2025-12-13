import { createPublicClient, http } from 'viem'
import { mainnet, bsc, base, arbitrum, polygon } from 'viem/chains'

const chainMap: Record<number, any> = {
  1: mainnet,
  56: bsc,
  8453: base,
  42161: arbitrum,
  137: polygon,
}

export async function getLatestBlockNumber(chainId: number, rpcUrl: string) {
  const chain = chainMap[chainId]
  if (!chain) throw new Error(`Unsupported chainId ${chainId}`)
  const client = createPublicClient({ chain, transport: http(rpcUrl) })
  const bn = await client.getBlockNumber()
  return Number(bn)
}

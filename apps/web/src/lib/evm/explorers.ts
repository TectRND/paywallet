export function explorerBase(chainId: number) {
  switch (chainId) {
    case 1:
      return 'https://etherscan.io'
    case 56:
      return 'https://bscscan.com'
    case 8453:
      return 'https://basescan.org'
    case 42161:
      return 'https://arbiscan.io'
    case 137:
      return 'https://polygonscan.com'
    default:
      return ''
  }
}

export function txUrl(chainId: number, hash?: string) {
  const base = explorerBase(chainId)
  if (!base || !hash) return ''
  return `${base}/tx/${hash}`
}

export function addressUrl(chainId: number, address?: string) {
  const base = explorerBase(chainId)
  if (!base || !address) return ''
  return `${base}/address/${address}`
}

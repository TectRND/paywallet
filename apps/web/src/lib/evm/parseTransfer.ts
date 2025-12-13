export function topicToAddress(topic: string) {
  const hex = topic.toLowerCase().replace(/^0x/, '')
  // topic is 32 bytes, address is last 20 bytes
  return `0x${hex.slice(24)}`
}

export function hexToBigInt(hex: string) {
  return BigInt(hex)
}

import crypto from 'crypto'

export function generateEngineSignature(body: string, timestamp: string, secret: string) {
  const payload = `${timestamp}.${body}`
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

export function isValidEngineSignature(body: string, timestamp: string, signature: string, secret: string) {
  const expected = generateEngineSignature(body, timestamp, secret)
  // normalize
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(signature, 'utf8')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export function isExpired(timestamp: string, expirationSeconds = 300) {
  const now = Math.floor(Date.now() / 1000)
  const ts = Number(timestamp)
  if (!Number.isFinite(ts)) return true
  return now - ts > expirationSeconds
}

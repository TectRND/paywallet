import type { ReactNode } from 'react'

export default function PayloadRouteGroupLayout({ children }: { children: ReactNode }) {
  // This route group isolates Payload's /admin and /api routes from your public app
  return children
}

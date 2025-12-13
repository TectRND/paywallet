import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl
  const cookie = req.headers.get('cookie') ?? ''

  if (pathname.startsWith('/admin')) {
    const res = await fetch(`${origin}/api/auth/admins/me`, { headers: { cookie } })
    if (res.ok) return NextResponse.next()
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/account')) {
    const res = await fetch(`${origin}/api/auth/customers/me`, { headers: { cookie } })
    if (res.ok) return NextResponse.next()
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

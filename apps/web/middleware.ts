import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PATH = '/admin';
const ACCOUNT_PATH = '/account';

function hasSessionCookie(req: NextRequest, key: string) {
  const token = req.cookies.get(key)?.value;
  return Boolean(token && token.length > 0);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith(ADMIN_PATH)) {
    const hasAdminSession = hasSessionCookie(req, 'admin-session');
    if (!hasAdminSession) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith(ACCOUNT_PATH)) {
    const hasCustomerSession = hasSessionCookie(req, 'customer-session');
    if (!hasCustomerSession) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*']
};

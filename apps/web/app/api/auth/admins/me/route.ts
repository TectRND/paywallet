import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/src/lib/payload';

export async function GET(request: Request) {
  const payload = await getPayloadClient();
  const authResult = await payload.auth({ headers: request.headers });
  if (!authResult.user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: authResult.user });
}

import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, adminCookieOptions, createAdminToken, getAdminPassword } from '@/lib/admin/session'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string }
  const expected = getAdminPassword()

  if (!expected || body.password !== expected) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), adminCookieOptions)
  return response
}

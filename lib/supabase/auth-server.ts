import { NextResponse } from 'next/server'

export type SupabaseAuthUser = {
  id: string
  email?: string
}

export function isPublicSupabaseConfigured() {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function getAuthConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) throw new Error('Supabase Auth is not configured.')
  return { url: url.replace(/\/$/, ''), anonKey }
}

export async function getUserFromRequest(request: Request): Promise<SupabaseAuthUser | null> {
  const authorization = request.headers.get('authorization')
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token) return null

  const { url, anonKey } = getAuthConfig()
  const res = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) return null
  const user = (await res.json()) as SupabaseAuthUser
  return user?.id ? user : null
}

export async function requireUser(request: Request) {
  if (!isPublicSupabaseConfigured()) {
    return {
      response: NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 }),
      user: null,
    }
  }

  const user = await getUserFromRequest(request)
  if (!user) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      user: null,
    }
  }
  return { response: null, user }
}

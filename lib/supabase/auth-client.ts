'use client'

const SESSION_KEY = 'matchu:supabase-session'

type AuthUser = {
  id: string
  email?: string
}

export type AuthSession = {
  access_token: string
  refresh_token?: string
  expires_at?: number
  user: AuthUser
}

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) throw new Error('Supabase Auth is not configured.')
  return { url: url.replace(/\/$/, ''), anonKey }
}

async function authFetch<T>(path: string, init: RequestInit = {}) {
  const { url, anonKey } = getConfig()
  const headers = new Headers(init.headers)
  headers.set('apikey', anonKey)
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json')

  const res = await fetch(`${url}/auth/v1${path}`, { ...init, headers })
  const data = (await res.json().catch(() => ({}))) as T & { msg?: string; error_description?: string; error?: string }
  if (!res.ok) {
    throw new Error(data.error_description ?? data.msg ?? data.error ?? 'Auth request failed.')
  }
  return data
}

function persistSession(session: AuthSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('matchu-auth-change'))
}

function normalizeSession(data: Record<string, unknown>): AuthSession {
  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 3600
  const user = data.user as AuthUser
  return {
    access_token: String(data.access_token),
    refresh_token: data.refresh_token ? String(data.refresh_token) : undefined,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    user,
  }
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export async function getAuthSession() {
  const session = getStoredSession()
  if (!session) return null
  if (session.expires_at && session.expires_at - Math.floor(Date.now() / 1000) < 120 && session.refresh_token) {
    return refreshSession(session.refresh_token)
  }
  return session
}

export async function signUpWithEmail(email: string, password: string) {
  const data = await authFetch<Record<string, unknown>>('/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (data.access_token) {
    const session = normalizeSession(data)
    persistSession(session)
    await ensureProfile(session)
    return session
  }
  return null
}

export async function signInWithEmail(email: string, password: string) {
  const data = await authFetch<Record<string, unknown>>('/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  const session = normalizeSession(data)
  persistSession(session)
  await ensureProfile(session)
  return session
}

export async function refreshSession(refreshToken: string) {
  const data = await authFetch<Record<string, unknown>>('/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  const session = normalizeSession(data)
  persistSession(session)
  return session
}

export async function signOut() {
  const session = getStoredSession()
  persistSession(null)
  if (!session) return
  try {
    await authFetch('/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
  } catch {
    // Local sign-out should still succeed if the remote request fails.
  }
}

export function authHeader(session: AuthSession | null): Record<string, string> {
  return session ? { Authorization: `Bearer ${session.access_token}` } : {}
}

async function ensureProfile(session: AuthSession) {
  await fetch('/api/me', { headers: authHeader(session) })
}

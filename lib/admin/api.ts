import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from './session'
import { isSupabaseConfigured } from '@/lib/supabase/rest'

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export function requireSupabase() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 503 }
    )
  }
  return null
}

export function routeError(error: unknown) {
  console.error(error)
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Unexpected server error' },
    { status: 500 }
  )
}

import { NextResponse } from 'next/server'
import { ensureUserProfile, updateUserProfile } from '@/lib/backend/user-repository'
import { requireUser } from '@/lib/supabase/auth-server'
import { routeError } from '@/lib/admin/api'
import { isSupabaseConfigured } from '@/lib/supabase/rest'

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }
  const { user, response } = await requireUser(request)
  if (response) return response

  try {
    const profile = await ensureUserProfile(user)
    return NextResponse.json({ profile })
  } catch (error) {
    return routeError(error)
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }
  const { user, response } = await requireUser(request)
  if (response) return response

  try {
    await ensureUserProfile(user)
    const payload = (await request.json()) as Record<string, unknown>
    const profile = await updateUserProfile(user, payload)
    return NextResponse.json({ profile })
  } catch (error) {
    return routeError(error)
  }
}

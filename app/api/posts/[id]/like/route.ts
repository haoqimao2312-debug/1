import { NextResponse } from 'next/server'
import { routeError } from '@/lib/admin/api'
import { togglePostLike } from '@/lib/backend/user-repository'
import { requireUser } from '@/lib/supabase/auth-server'
import { isSupabaseConfigured } from '@/lib/supabase/rest'

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }
  const { user, response } = await requireUser(request)
  if (response) return response

  try {
    const { id } = await context.params
    const result = await togglePostLike(user, id)
    return NextResponse.json(result)
  } catch (error) {
    return routeError(error)
  }
}

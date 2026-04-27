import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { adminDeletePost, adminUpdatePost } from '@/lib/backend/user-repository'
import type { CommunityPostStatus } from '@/lib/backend/user-types'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const { id } = await context.params
    const body = (await request.json()) as { status?: CommunityPostStatus }
    if (!body.status || !['published', 'hidden', 'deleted'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const post = await adminUpdatePost(id, body.status)
    return NextResponse.json({ post })
  } catch (error) {
    return routeError(error)
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const { id } = await context.params
    await adminDeletePost(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return routeError(error)
  }
}

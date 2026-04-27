import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { adminListPosts } from '@/lib/backend/user-repository'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const posts = await adminListPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    return routeError(error)
  }
}

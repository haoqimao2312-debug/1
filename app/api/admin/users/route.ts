import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { adminListUsers } from '@/lib/backend/user-repository'
import { mapUserProfileRow } from '@/lib/backend/user-types'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const users = await adminListUsers()
    return NextResponse.json({ users: users.map((user) => mapUserProfileRow(user)) })
  } catch (error) {
    return routeError(error)
  }
}

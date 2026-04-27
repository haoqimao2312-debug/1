import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { adminListProfiles, upsertProfile } from '@/lib/backend/repository'
import { normalizeProfilePayload } from '@/lib/backend/normalize'
import { mapProfileRow } from '@/lib/backend/types'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const rows = await adminListProfiles()
    return NextResponse.json({ profiles: rows.map(mapProfileRow) })
  } catch (error) {
    return routeError(error)
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const payload = (await request.json()) as Record<string, unknown>
    const rows = await upsertProfile(normalizeProfilePayload(payload))
    return NextResponse.json({ profile: mapProfileRow(rows[0]) })
  } catch (error) {
    return routeError(error)
  }
}

import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { adminListProfiles, deleteById, upsertProfile } from '@/lib/backend/repository'
import { normalizeProfilePayload } from '@/lib/backend/normalize'
import { mapProfileRow } from '@/lib/backend/types'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const { id } = await context.params
    const rows = await adminListProfiles()
    const profile = rows.find((row) => row.id === id)
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    return NextResponse.json({ profile: mapProfileRow(profile) })
  } catch (error) {
    return routeError(error)
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const { id } = await context.params
    const payload = (await request.json()) as Record<string, unknown>
    const rows = await upsertProfile(normalizeProfilePayload({ ...payload, id }))
    return NextResponse.json({ profile: mapProfileRow(rows[0]) })
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
    await deleteById('profiles', id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return routeError(error)
  }
}

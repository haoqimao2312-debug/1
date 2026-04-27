import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { adminListPersonas, upsertPersona } from '@/lib/backend/repository'
import { normalizePersonaPayload } from '@/lib/backend/normalize'
import { mapChatPersonaRow } from '@/lib/backend/types'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const rows = await adminListPersonas()
    return NextResponse.json({ personas: rows.map((row) => mapChatPersonaRow(row)) })
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
    const rows = await upsertPersona(normalizePersonaPayload(payload))
    return NextResponse.json({ persona: mapChatPersonaRow(rows[0]) })
  } catch (error) {
    return routeError(error)
  }
}

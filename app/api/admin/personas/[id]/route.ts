import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { adminListPersonas, adminListScripts, deleteById, upsertPersona } from '@/lib/backend/repository'
import { normalizePersonaPayload } from '@/lib/backend/normalize'
import { mapChatPersonaRow } from '@/lib/backend/types'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const { id } = await context.params
    const rows = await adminListPersonas()
    const persona = rows.find((row) => row.id === id)
    if (!persona) return NextResponse.json({ error: 'Persona not found' }, { status: 404 })
    const scripts = await adminListScripts(id)
    return NextResponse.json({ persona: mapChatPersonaRow(persona, scripts) })
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
    const rows = await upsertPersona(normalizePersonaPayload({ ...payload, id }))
    return NextResponse.json({ persona: mapChatPersonaRow(rows[0]) })
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
    await deleteById('chat_personas', id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return routeError(error)
  }
}

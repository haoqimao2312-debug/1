import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { adminListScripts, deleteById, upsertScript } from '@/lib/backend/repository'
import { normalizeScriptPayload } from '@/lib/backend/normalize'
import { mapChatScriptRow } from '@/lib/backend/types'

export async function GET(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const url = new URL(request.url)
    const rows = await adminListScripts(url.searchParams.get('personaId') ?? undefined)
    return NextResponse.json({ scripts: rows.map(mapChatScriptRow) })
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
    const rows = await upsertScript(normalizeScriptPayload(payload))
    return NextResponse.json({ script: mapChatScriptRow(rows[0]) })
  } catch (error) {
    return routeError(error)
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const payload = (await request.json()) as Record<string, unknown>
    const id = typeof payload.id === 'string' ? payload.id : ''
    if (!id) return NextResponse.json({ error: 'Script id is required' }, { status: 400 })
    const rows = await upsertScript(normalizeScriptPayload(payload))
    return NextResponse.json({ script: mapChatScriptRow(rows[0]) })
  } catch (error) {
    return routeError(error)
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Script id is required' }, { status: 400 })
    await deleteById('chat_scripts', id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return routeError(error)
  }
}

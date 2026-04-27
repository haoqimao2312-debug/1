import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { getFallbackPersona, getFallbackProfiles } from '@/lib/backend/fallback'
import { personaToRows, profileToRow } from '@/lib/backend/normalize'
import { upsertPersona, upsertProfile, upsertScript } from '@/lib/backend/repository'

export async function POST() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const profiles = getFallbackProfiles()
    for (const profile of profiles) {
      await upsertProfile(profileToRow(profile))
    }

    const xiaoyu = getFallbackPersona('xiaoyu')
    let scripts = 0
    if (xiaoyu) {
      const rows = personaToRows(xiaoyu)
      await upsertPersona(rows.personaRow)
      for (const script of rows.scriptRows) {
        await upsertScript(script)
        scripts += 1
      }
    }

    return NextResponse.json({ ok: true, profiles: profiles.length, personas: xiaoyu ? 1 : 0, scripts })
  } catch (error) {
    return routeError(error)
  }
}

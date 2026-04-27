import {
  eqFilter,
  isSupabaseConfigured,
  restPath,
  supabaseFetch,
} from '@/lib/supabase/rest'
import {
  mapChatPersonaRow,
  mapProfileRow,
  type ChatPersonaData,
  type ChatPersonaRow,
  type ChatScriptRow,
  type ProfileCardData,
  type ProfileRow,
} from './types'
import { getFallbackPersona, getFallbackProfiles } from './fallback'

const PROFILE_SELECT =
  'id,display_name,age,location,distance,mbti,profession,bio,tags,compatibility,avatar_gradient_from,avatar_gradient_to,face_tone,hair_color,photo_url,chat_preview,chat_time,unread_count,online,verified,compatible_tags,status,sort_order,created_at,updated_at'

const PERSONA_SELECT =
  'id,profile_id,display_name,age,subtitle,avatar,bio,photo_url,opening_messages,fallback_replies,compatible_tags,status,sort_order,created_at,updated_at'

const SCRIPT_SELECT =
  'id,persona_id,keywords,emotions,turn_range_start,turn_range_end,replies,once,enabled,sort_order,created_at,updated_at'

export async function listPublicProfiles(): Promise<{ profiles: ProfileCardData[]; source: 'supabase' | 'mock' }> {
  if (!isSupabaseConfigured()) {
    return { profiles: getFallbackProfiles(), source: 'mock' }
  }

  try {
    const query = new URLSearchParams({
      select: PROFILE_SELECT,
      status: 'eq.published',
      order: 'sort_order.asc,created_at.asc',
    })
    const rows = await supabaseFetch<ProfileRow[]>(restPath('profiles', query.toString()))
    return { profiles: rows.map(mapProfileRow), source: 'supabase' }
  } catch (error) {
    console.error('[profiles] falling back to mock data', error)
    return { profiles: getFallbackProfiles(), source: 'mock' }
  }
}

export async function getPublicPersona(
  id: string
): Promise<{ persona: ChatPersonaData | null; source: 'supabase' | 'mock' }> {
  if (!isSupabaseConfigured()) {
    return { persona: getFallbackPersona(id), source: 'mock' }
  }

  try {
    const personaQuery = new URLSearchParams({
      select: PERSONA_SELECT,
      id: `eq.${id}`,
      status: 'eq.published',
      limit: '1',
    })
    const personaRows = await supabaseFetch<ChatPersonaRow[]>(
      restPath('chat_personas', personaQuery.toString())
    )
    const row = personaRows[0]
    if (!row) return { persona: getFallbackPersona(id), source: 'mock' }

    const scriptQuery = new URLSearchParams({
      select: SCRIPT_SELECT,
      persona_id: `eq.${id}`,
      enabled: 'eq.true',
      order: 'sort_order.asc,created_at.asc',
    })
    const scripts = await supabaseFetch<ChatScriptRow[]>(
      restPath('chat_scripts', scriptQuery.toString())
    )

    return { persona: mapChatPersonaRow(row, scripts), source: 'supabase' }
  } catch (error) {
    console.error('[persona] falling back to mock data', error)
    return { persona: getFallbackPersona(id), source: 'mock' }
  }
}

export async function adminListProfiles() {
  const query = new URLSearchParams({
    select: PROFILE_SELECT,
    order: 'sort_order.asc,created_at.desc',
  })
  return supabaseFetch<ProfileRow[]>(restPath('profiles', query.toString()))
}

export async function adminListPersonas() {
  const query = new URLSearchParams({
    select: PERSONA_SELECT,
    order: 'sort_order.asc,created_at.desc',
  })
  return supabaseFetch<ChatPersonaRow[]>(restPath('chat_personas', query.toString()))
}

export async function adminListScripts(personaId?: string) {
  const query = new URLSearchParams({
    select: SCRIPT_SELECT,
    order: 'sort_order.asc,created_at.desc',
  })
  if (personaId) query.set('persona_id', `eq.${personaId}`)
  return supabaseFetch<ChatScriptRow[]>(restPath('chat_scripts', query.toString()))
}

export async function upsertProfile(row: ProfileRow) {
  return supabaseFetch<ProfileRow[]>(restPath('profiles', `on_conflict=id&select=${PROFILE_SELECT}`), {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: JSON.stringify(row),
  })
}

export async function upsertPersona(row: ChatPersonaRow) {
  return supabaseFetch<ChatPersonaRow[]>(
    restPath('chat_personas', `on_conflict=id&select=${PERSONA_SELECT}`),
    {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: JSON.stringify(row),
    }
  )
}

export async function upsertScript(row: ChatScriptRow) {
  return supabaseFetch<ChatScriptRow[]>(
    restPath('chat_scripts', `on_conflict=id&select=${SCRIPT_SELECT}`),
    {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: JSON.stringify(row),
    }
  )
}

export async function patchById<T>(table: string, id: string, payload: Record<string, unknown>) {
  return supabaseFetch<T[]>(restPath(table, `${eqFilter('id', id)}&select=*`), {
    method: 'PATCH',
    prefer: 'return=representation',
    body: JSON.stringify(payload),
  })
}

export async function deleteById(table: string, id: string) {
  return supabaseFetch<void>(restPath(table, eqFilter('id', id)), {
    method: 'DELETE',
  })
}

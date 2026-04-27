import { randomUUID } from 'crypto'
import type {
  ChatPersonaRow,
  ChatScriptRow,
  ChatScriptRule,
  ProfileRow,
  ProfileStatus,
  ProfileTag,
} from './types'

function text(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback
}

function numberValue(value: unknown, fallback: number) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function boolValue(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function statusValue(value: unknown): ProfileStatus {
  return value === 'published' ? 'published' : 'draft'
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => text(item)).filter(Boolean)
}

function tagList(value: unknown): ProfileTag[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const raw = item as Record<string, unknown>
      const emoji = text(raw.emoji)
      const label = text(raw.label)
      return label ? { emoji, label } : null
    })
    .filter((item): item is ProfileTag => Boolean(item))
}

function idValue(value: unknown) {
  const id = text(value)
  return id || randomUUID()
}

export function normalizeProfilePayload(input: Record<string, unknown>): ProfileRow {
  return {
    id: idValue(input.id),
    display_name: text(input.displayName, 'Untitled'),
    age: numberValue(input.age, 24),
    location: text(input.location, '同城'),
    distance: text(input.distance, '同城'),
    mbti: text(input.mbti, 'INFP'),
    profession: text(input.profession, '自由职业'),
    bio: text(input.bio),
    tags: tagList(input.tags),
    compatibility: Math.max(0, Math.min(100, numberValue(input.compatibility, 75))),
    avatar_gradient_from: text(input.avatarGradientFrom, '#ff8fbc'),
    avatar_gradient_to: text(input.avatarGradientTo, '#a970ff'),
    face_tone: text(input.faceTone, '#ffe0d0'),
    hair_color: text(input.hairColor, '#3a1f1a'),
    photo_url: text(input.photo) || null,
    chat_preview: text(input.chatPreview, '很高兴认识你'),
    chat_time: text(input.chatTime, '刚刚'),
    unread_count: numberValue(input.unread, 0),
    online: boolValue(input.online),
    verified: boolValue(input.verified),
    compatible_tags: stringList(input.compatibleTags),
    status: statusValue(input.status),
    sort_order: numberValue(input.sortOrder, 0),
  }
}

export function normalizePersonaPayload(input: Record<string, unknown>): ChatPersonaRow {
  return {
    id: idValue(input.id),
    profile_id: text(input.profileId) || null,
    display_name: text(input.displayName, 'Untitled'),
    age: input.age == null || input.age === '' ? null : numberValue(input.age, 24),
    subtitle: text(input.subtitle),
    avatar: text(input.avatar, '💬'),
    bio: text(input.bio),
    photo_url: text(input.photo) || null,
    opening_messages: stringList(input.openingMessages),
    fallback_replies: stringList(input.fallbackReplies),
    compatible_tags: stringList(input.compatibleTags),
    status: statusValue(input.status),
    sort_order: numberValue(input.sortOrder, 0),
  }
}

export function normalizeScriptPayload(input: Record<string, unknown>): ChatScriptRow {
  const turnRange = Array.isArray(input.turnRange) ? input.turnRange : null

  return {
    id: idValue(input.id),
    persona_id: text(input.personaId),
    keywords: stringList(input.keywords),
    emotions: stringList(input.emotions),
    turn_range_start: turnRange ? numberValue(turnRange[0], 0) : null,
    turn_range_end: turnRange ? numberValue(turnRange[1], 0) : null,
    replies: stringList(input.replies),
    once: boolValue(input.once),
    enabled: input.enabled == null ? true : boolValue(input.enabled),
    sort_order: numberValue(input.sortOrder, 0),
  }
}

export function profileToRow(profile: {
  id: string
  displayName: string
  age: number
  location: string
  distance: string
  mbti: string
  profession: string
  bio: string
  tags: ProfileTag[]
  compatibility: number
  avatarGradientFrom: string
  avatarGradientTo: string
  faceTone: string
  hairColor: string
  photo?: string
  chatPreview: string
  chatTime: string
  unread?: number
  online?: boolean
  verified?: boolean
  compatibleTags?: string[]
  sortOrder?: number
}): ProfileRow {
  return normalizeProfilePayload({
    ...profile,
    status: 'published',
  })
}

export function personaToRows(persona: {
  id: string
  profileId?: string | null
  displayName: string
  age?: number | null
  subtitle: string
  avatar: string
  bio: string
  photo?: string | null
  openingMessages: string[]
  fallbackReplies: string[]
  compatibleTags: string[]
  sortOrder: number
  scripts: ChatScriptRule[]
}) {
  const personaRow = normalizePersonaPayload({
    ...persona,
    status: 'published',
  })
  const scriptRows = persona.scripts.map((script) =>
    normalizeScriptPayload({
      ...script,
      personaId: persona.id,
    })
  )
  return { personaRow, scriptRows }
}

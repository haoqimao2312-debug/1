export type ProfileStatus = 'draft' | 'published'

export type ProfileTag = {
  emoji: string
  label: string
}

export type ProfileCardData = {
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
  status?: ProfileStatus
  sortOrder?: number
}

export type ChatScriptRule = {
  id: string
  personaId: string
  keywords: string[]
  emotions: string[]
  turnRange?: [number, number] | null
  replies: string[]
  once: boolean
  enabled: boolean
  sortOrder: number
}

export type ChatPersonaData = {
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
  status: ProfileStatus
  sortOrder: number
  scripts: ChatScriptRule[]
}

export type ProfileRow = {
  id: string
  display_name: string
  age: number
  location: string
  distance: string
  mbti: string
  profession: string
  bio: string
  tags: ProfileTag[] | null
  compatibility: number
  avatar_gradient_from: string
  avatar_gradient_to: string
  face_tone: string
  hair_color: string
  photo_url: string | null
  chat_preview: string
  chat_time: string
  unread_count: number | null
  online: boolean
  verified: boolean
  compatible_tags: string[] | null
  status: ProfileStatus
  sort_order: number
  created_at?: string
  updated_at?: string
}

export type ChatPersonaRow = {
  id: string
  profile_id: string | null
  display_name: string
  age: number | null
  subtitle: string
  avatar: string
  bio: string
  photo_url: string | null
  opening_messages: string[] | null
  fallback_replies: string[] | null
  compatible_tags: string[] | null
  status: ProfileStatus
  sort_order: number
  created_at?: string
  updated_at?: string
}

export type ChatScriptRow = {
  id: string
  persona_id: string
  keywords: string[] | null
  emotions: string[] | null
  turn_range_start: number | null
  turn_range_end: number | null
  replies: string[] | null
  once: boolean
  enabled: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export function mapProfileRow(row: ProfileRow): ProfileCardData {
  return {
    id: row.id,
    displayName: row.display_name,
    age: row.age,
    location: row.location,
    distance: row.distance,
    mbti: row.mbti,
    profession: row.profession,
    bio: row.bio,
    tags: row.tags ?? [],
    compatibility: row.compatibility,
    avatarGradientFrom: row.avatar_gradient_from,
    avatarGradientTo: row.avatar_gradient_to,
    faceTone: row.face_tone,
    hairColor: row.hair_color,
    photo: row.photo_url ?? undefined,
    chatPreview: row.chat_preview,
    chatTime: row.chat_time,
    unread: row.unread_count ?? undefined,
    online: row.online,
    verified: row.verified,
    compatibleTags: row.compatible_tags ?? [],
    status: row.status,
    sortOrder: row.sort_order,
  }
}

export function mapChatScriptRow(row: ChatScriptRow): ChatScriptRule {
  return {
    id: row.id,
    personaId: row.persona_id,
    keywords: row.keywords ?? [],
    emotions: row.emotions ?? [],
    turnRange:
      row.turn_range_start != null && row.turn_range_end != null
        ? [row.turn_range_start, row.turn_range_end]
        : null,
    replies: row.replies ?? [],
    once: row.once,
    enabled: row.enabled,
    sortOrder: row.sort_order,
  }
}

export function mapChatPersonaRow(
  row: ChatPersonaRow,
  scripts: ChatScriptRow[] = []
): ChatPersonaData {
  return {
    id: row.id,
    profileId: row.profile_id,
    displayName: row.display_name,
    age: row.age,
    subtitle: row.subtitle,
    avatar: row.avatar,
    bio: row.bio,
    photo: row.photo_url,
    openingMessages: row.opening_messages ?? [],
    fallbackReplies: row.fallback_replies ?? [],
    compatibleTags: row.compatible_tags ?? [],
    status: row.status,
    sortOrder: row.sort_order,
    scripts: scripts.map(mapChatScriptRow),
  }
}

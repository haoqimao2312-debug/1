import { previewUsers, matchOrder } from '@/lib/mock-data/users/preview-users'
import { xiaoyu } from '@/lib/mock-data/users/xiaoyu'
import type { ChatPersonaData, ChatScriptRule, ProfileCardData } from './types'

export const fallbackProfiles: ProfileCardData[] = matchOrder.map((profile, index) => ({
  ...profile,
  compatibleTags: profile.tags.map((tag) => tag.label),
  status: 'published',
  sortOrder: index,
}))

export function getFallbackProfiles(): ProfileCardData[] {
  return fallbackProfiles
}

export function getFallbackPersona(id: string): ChatPersonaData | null {
  if (id !== xiaoyu.id) return null

  const profile = previewUsers.find((user) => user.id === id)
  const scripts: ChatScriptRule[] = xiaoyu.scripted.map((script, index) => {
    const triggers = script.triggers as
      | { keywords?: string[]; emotions?: string[]; turnRange?: [number, number] }
      | undefined

    return {
      id: `${xiaoyu.id}-script-${index + 1}`,
      personaId: xiaoyu.id,
      keywords: triggers?.keywords ?? [],
      emotions: triggers?.emotions ?? [],
      turnRange: triggers?.turnRange ?? null,
      replies: script.replies,
      once: script.once ?? false,
      enabled: true,
      sortOrder: index,
    }
  })

  return {
    id: xiaoyu.id,
    profileId: profile?.id ?? null,
    displayName: xiaoyu.displayName,
    age: xiaoyu.age,
    subtitle: xiaoyu.subtitle,
    avatar: xiaoyu.avatar,
    bio: xiaoyu.bio,
    photo: profile?.photo ?? null,
    openingMessages: xiaoyu.openingMessages,
    fallbackReplies: xiaoyu.fallbackReplies,
    compatibleTags: xiaoyu.compatibleTags,
    status: 'published',
    sortOrder: 0,
    scripts,
  }
}

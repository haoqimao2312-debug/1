import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile } from '@/lib/ai/types'

type UserState = {
  profile: UserProfile
  addAnswer: (questionId: string, option: 'A' | 'B' | 'C' | 'D', newTags: string[]) => void
  completeQuiz: (profileId: string, displayName: string) => void
  reset: () => void
}

const emptyProfile: UserProfile = {
  answers: [],
  tags: [],
  profileId: null,
  profileDisplayName: null,
  completedAt: null,
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: emptyProfile,
      addAnswer: (questionId, option, newTags) =>
        set((s) => ({
          profile: {
            ...s.profile,
            answers: [...s.profile.answers, { questionId, option }],
            tags: Array.from(new Set([...s.profile.tags, ...newTags])),
          },
        })),
      completeQuiz: (profileId, displayName) =>
        set((s) => ({
          profile: {
            ...s.profile,
            profileId,
            profileDisplayName: displayName,
            completedAt: Date.now(),
          },
        })),
      reset: () => set({ profile: emptyProfile }),
    }),
    { name: 'matchu:user-profile' }
  )
)

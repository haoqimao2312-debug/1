import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

type ThemeStore = {
  theme: Theme
  toggle: () => void
  set: (t: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggle: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      set: (t) => set({ theme: t }),
    }),
    { name: 'matchu-theme' },
  ),
)

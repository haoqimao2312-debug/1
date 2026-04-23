import { create } from 'zustand'

export type ToastItem = {
  id: string
  text: string
  emoji?: string
}

type ToastState = {
  toasts: ToastItem[]
  show: (text: string, emoji?: string) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  show: (text, emoji) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    set((s) => ({ toasts: [...s.toasts, { id, text, emoji }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 2200)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

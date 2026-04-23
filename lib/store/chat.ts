import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage } from '@/lib/ai/types'

type ChatState = {
  messages: Record<string, ChatMessage[]>
  isTyping: Record<string, boolean>
  addMessage: (userId: string, msg: ChatMessage) => void
  appendToLastAssistant: (userId: string, delta: string) => void
  setTyping: (userId: string, typing: boolean) => void
  reset: (userId: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: {},
      isTyping: {},
      addMessage: (userId, msg) =>
        set((s) => ({
          messages: { ...s.messages, [userId]: [...(s.messages[userId] ?? []), msg] },
        })),
      appendToLastAssistant: (userId, delta) =>
        set((s) => {
          const arr = s.messages[userId] ?? []
          if (arr.length === 0) return {}
          const last = arr[arr.length - 1]
          if (last.role !== 'assistant') return {}
          const updated = { ...last, content: last.content + delta }
          return {
            messages: { ...s.messages, [userId]: [...arr.slice(0, -1), updated] },
          }
        }),
      setTyping: (userId, typing) =>
        set((s) => ({ isTyping: { ...s.isTyping, [userId]: typing } })),
      reset: (userId) =>
        set((s) => ({
          messages: { ...s.messages, [userId]: [] },
          isTyping: { ...s.isTyping, [userId]: false },
        })),
    }),
    { name: 'matchu:chat' }
  )
)

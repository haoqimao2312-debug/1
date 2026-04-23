import type { ZodSchema } from 'zod'

export type Role = 'system' | 'user' | 'assistant'
export type Message = { role: Role; content: string }

export interface AIProvider {
  stream(opts: {
    messages: Message[]
    temperature?: number
    maxTokens?: number
  }): AsyncIterable<string>

  json<T>(opts: {
    messages: Message[]
    schema: ZodSchema<T>
  }): Promise<T>
}

export type PersonalityTag = string

export type UserProfile = {
  answers: { questionId: string; option: 'A' | 'B' | 'C' | 'D' }[]
  tags: PersonalityTag[]
  profileId: string | null
  profileDisplayName: string | null
  completedAt: number | null
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

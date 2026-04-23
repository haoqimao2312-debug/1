import type { AIProvider, Message } from './types'
import type { ZodSchema } from 'zod'

export class MockProvider implements AIProvider {
  async *stream(_opts: {
    messages: Message[]
    temperature?: number
    maxTokens?: number
  }): AsyncIterable<string> {
    yield '（Mock 尚未实现）'
  }

  async json<T>(_opts: {
    messages: Message[]
    schema: ZodSchema<T>
  }): Promise<T> {
    throw new Error('Mock.json not yet implemented')
  }
}

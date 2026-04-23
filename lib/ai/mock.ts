import type { AIProvider, Message } from './types'
import type { ZodSchema } from 'zod'

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export async function* streamText(
  fullText: string,
  opts: { firstTokenDelayMs?: number; charDelayMs?: number } = {}
): AsyncIterable<string> {
  const firstDelay = opts.firstTokenDelayMs ?? 400 + Math.random() * 300
  const charDelay = opts.charDelayMs ?? 35
  await delay(firstDelay)
  // 以字符为单位流式吐出（中英文混合友好）
  for (const ch of Array.from(fullText)) {
    yield ch
    await delay(charDelay + Math.random() * 20)
  }
}

export class MockProvider implements AIProvider {
  async *stream(opts: {
    messages: Message[]
    temperature?: number
    maxTokens?: number
  }): AsyncIterable<string> {
    // 业务层会用 streamText 定制内容；这里提供一个兜底默认
    const last = opts.messages[opts.messages.length - 1]?.content ?? ''
    const text = last.length > 0 ? `收到：${last}` : '嗯，你说。'
    yield* streamText(text)
  }

  async json<T>(opts: { messages: Message[]; schema: ZodSchema<T> }): Promise<T> {
    throw new Error('MockProvider.json 需业务层显式实现（见 lib/ai/business.ts）')
  }
}

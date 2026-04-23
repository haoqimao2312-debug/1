import type { AIProvider } from './types'
import { MockProvider } from './mock'

function selectProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'mock'
  switch (provider) {
    case 'mock':
      return new MockProvider()
    // 未来扩展：
    // case 'deepseek': return new DeepSeekProvider()
    // case 'openai':   return new OpenAIProvider()
    default:
      console.warn(`[ai] Unknown AI_PROVIDER "${provider}", falling back to mock`)
      return new MockProvider()
  }
}

export const aiProvider: AIProvider = selectProvider()

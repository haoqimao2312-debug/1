export type DetectedEmotion = 'tired' | 'happy' | 'sad' | 'curious' | 'greeting' | 'neutral'

const TIRED = /累|疲|困|烦|心累|崩|emo|难受|压力|烦死|麻了/
const HAPPY = /哈哈|嘿嘿|开心|笑|喜欢|可爱|好耶|yeah|真的太/
const SAD = /哭|难过|伤心|委屈|想哭|失落/
const CURIOUS = /\?|？|为啥|为什么|怎么|咋|呢$/
const GREETING = /^(你好|hi|hello|嗨|早|晚上好|在吗|在嘛|来了|hey)/i

export function detectEmotion(text: string): DetectedEmotion {
  if (GREETING.test(text)) return 'greeting'
  if (HAPPY.test(text)) return 'happy'
  if (SAD.test(text)) return 'sad'
  if (TIRED.test(text)) return 'tired'
  if (CURIOUS.test(text)) return 'curious'
  return 'neutral'
}

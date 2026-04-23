import { streamText } from './mock'
import { quizQuestions } from '@/lib/mock-data/quiz'

export type QuizTurnInput = {
  questionId: string
  chosenOption: 'A' | 'B' | 'C' | 'D'
  historyTags: string[]
}

export type QuizTurnResult = {
  newTags: string[]
  commentaryStream: AsyncIterable<string>
  profileHint?: string
  questionIndex: number
  totalQuestions: number
}

// 简单的点评模板。真 LLM 替换时保留函数签名即可。
const commentaryPool: Record<string, string[]> = {
  外向驱动: ['你在社交里是那种「续命型」选手 🔋', '你看起来是"有人在就亮"的人呀'],
  内向补能: ['看出来了，你在社交里是个「补能型」选手 🌙', '你需要给自己留点白，这很棒'],
  共情: ['你的接收天线调得很细，能接住别人的情绪', '共情力拉满，是会被依赖的那种人'],
  俏皮: ['你语气里自带 BGM 欸，能想象聊天时很热闹', '看起来是"表情包不离手"的那种'],
  深度: ['你不是话多，是想得多', '你聊起真的感兴趣的东西应该停不下来'],
  克制: ['不爱多说但每句都算数，这种人少见', '你是那种"嗯"就够用的人'],
  稳重: ['你很少被情绪带跑，这在关系里很稀有', '你给人的是那种"靠谱"的安全感'],
  行动型: ['计划是路牌，心情是油门，能感觉到', '你不太纠结"要不要"，你纠结"几点出门"'],
  温柔: ['你对人是那种带回音的温柔', '连拒绝都会让人觉得好像也没关系'],
  真诚: ['你没什么滤镜，这最难得', '你让人想把真话说出口'],
}

function pickCommentary(newTags: string[], fallback: string): string {
  for (const tag of newTags) {
    const pool = commentaryPool[tag]
    if (pool && pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)]
    }
  }
  return fallback
}

export async function analyzeQuizTurn(input: QuizTurnInput): Promise<QuizTurnResult> {
  const qIndex = quizQuestions.findIndex((q) => q.id === input.questionId)
  const question = quizQuestions[qIndex]
  if (!question) throw new Error(`Quiz question not found: ${input.questionId}`)
  const option = question.options.find((o) => o.key === input.chosenOption)
  if (!option) throw new Error(`Option not found: ${input.chosenOption}`)

  const newTags = option.tags
  const allTags = Array.from(new Set([...input.historyTags, ...newTags]))

  const commentary = pickCommentary(
    newTags,
    '收到，正在慢慢拼出你的样子…'
  )

  // 每 3 题给一次"已识别 N/10 维度"提示
  const answered = qIndex + 1
  const dims = Math.min(10, Math.round((allTags.length / 3) * 1.2))
  const profileHint =
    answered % 3 === 0
      ? `+1 ${newTags[0] ?? ''} 倾向 · 已识别 ${dims}/10 维度`
      : undefined

  return {
    newTags,
    commentaryStream: streamText(commentary),
    profileHint,
    questionIndex: qIndex,
    totalQuestions: quizQuestions.length,
  }
}

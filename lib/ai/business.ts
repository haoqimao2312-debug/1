import { streamText } from './mock'
import { quizQuestions } from '@/lib/mock-data/quiz'
import { xiaoyu, type ScriptedReply } from '@/lib/mock-data/users/xiaoyu'
import { detectEmotion, type DetectedEmotion } from './emotion'
import type { ChatMessage } from './types'

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

function pickScriptedReply(
  lastUserText: string,
  usedReplies: Set<string>
): string {
  const emotion = detectEmotion(lastUserText)

  // 优先级 1: 关键词匹配
  const keywordMatches = xiaoyu.scripted.filter((s: ScriptedReply) =>
    s.triggers?.keywords?.some((k) => lastUserText.includes(k))
  )
  // 优先级 2: 情绪匹配
  const emotionMatches = xiaoyu.scripted.filter((s: ScriptedReply) =>
    emotion !== 'neutral' && s.triggers?.emotions?.includes(emotion)
  )

  const candidates = [...keywordMatches, ...emotionMatches]
  for (const group of candidates) {
    const fresh = group.replies.filter((r) => !usedReplies.has(r))
    const pool = fresh.length > 0 ? fresh : group.replies
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)]
  }

  // 兜底
  const fresh = xiaoyu.fallbackReplies.filter((r) => !usedReplies.has(r))
  const pool = fresh.length > 0 ? fresh : xiaoyu.fallbackReplies
  return pool[Math.floor(Math.random() * pool.length)]
}

export async function xiaoyuReply(opts: {
  chatHistory: ChatMessage[]
}): Promise<{ stream: AsyncIterable<string>; fullText: string }> {
  const lastUser = [...opts.chatHistory].reverse().find((m) => m.role === 'user')
  const used = new Set(opts.chatHistory.filter((m) => m.role === 'assistant').map((m) => m.content))

  const text = lastUser
    ? pickScriptedReply(lastUser.content, used)
    : xiaoyu.fallbackReplies[0]

  return { stream: streamText(text), fullText: text }
}

export type AssistStyle = 'care' | 'playful' | 'direct'

export type AssistSuggestion = {
  style: AssistStyle
  emoji: string
  label: string
  text: string
}

type StylePool = {
  style: AssistStyle
  emoji: string
  label: string
  byEmotion: Partial<Record<DetectedEmotion, string[]>>
  default: string[]
}

const stylePools: StylePool[] = [
  {
    style: 'care',
    emoji: '🫂',
    label: '关心',
    byEmotion: {
      tired: [
        '辛苦你了，今晚想吃点什么我陪你念叨',
        '先歇会儿 不用马上回我',
        '抱抱 这种天我真的也扛不住',
      ],
      sad: ['我在听 你说', '不着急 慢慢讲', '你不孤单 我在的'],
      greeting: ['嗨呀 你怎么样 今天好吗', '刚想问你一句 你就来了'],
    },
    default: [
      '你还好吗',
      '最近是不是挺累',
      '我很在意你说的那个 能不能多讲一点',
    ],
  },
  {
    style: 'playful',
    emoji: '✨',
    label: '俏皮',
    byEmotion: {
      tired: [
        '把累意识传给我试试 我替你分担三成',
        '那就一起躺 但允许我吐槽两句',
        '累的时候最需要一个能胡说八道的人 (就是我)',
      ],
      happy: [
        '嘿嘿 我就知道你今天状态不错',
        '你这么开心 是不是有什么好事没告诉我',
        '被你传染了 也跟着咧嘴',
      ],
      greeting: ['哎嗨～ 你终于出现了', '我等你一整天了 (假的 但很想说)'],
    },
    default: [
      '欸 你这样说我就放心了',
      '你讲的这个 我要拿小本本记一下',
      '你有没有觉得 你一开口气氛就变好',
    ],
  },
  {
    style: 'direct',
    emoji: '🎯',
    label: '推进',
    byEmotion: {
      tired: [
        '讲讲看是什么事 能解决我们一起想',
        '有什么我能帮上的 直说',
      ],
      curious: ['你真正想问的是什么 告诉我', '这个我倒有想法 你先说完'],
      greeting: ['嗨 最近还顺吗', '你主动说 说明有事 对吧'],
    },
    default: [
      '你现在想做什么',
      '我接住了 下一步你想怎么走',
      '说清楚点 我好帮你想',
    ],
  },
]

function pickSuggestion(pool: StylePool, emotion: DetectedEmotion, tags: string[]): AssistSuggestion {
  const byEmo = pool.byEmotion[emotion] ?? []
  const source = byEmo.length > 0 ? byEmo : pool.default
  // 标签微调：内向/克制 → 偏短句；外放/话题感 → 偏长句
  const preferShort = tags.some((t) => ['内向补能', '克制', '内向', '独处友好'].includes(t))
  const sorted = [...source].sort((a, b) => (preferShort ? a.length - b.length : b.length - a.length))
  const text = sorted[Math.floor(Math.random() * Math.min(2, sorted.length))]
  return { style: pool.style, emoji: pool.emoji, label: pool.label, text }
}

export async function assistSuggest(opts: {
  chatHistory: ChatMessage[]
  userTags: string[]
}): Promise<{ suggestions: AssistSuggestion[] }> {
  const lastAssistant = [...opts.chatHistory].reverse().find((m) => m.role === 'assistant')
  const emotion = lastAssistant ? detectEmotion(lastAssistant.content) : 'neutral'
  return {
    suggestions: stylePools.map((p) => pickSuggestion(p, emotion, opts.userTags)),
  }
}

// 契合度算法（MVP 假算法）
export function computeCompatibility(userTags: string[], compatibleTags: string[]): number {
  if (compatibleTags.length === 0) return 75
  const hits = compatibleTags.filter((t) => userTags.includes(t)).length
  return Math.round(60 + 35 * (hits / compatibleTags.length))
}

'use client'
import { useEffect, useState } from 'react'
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'
import { QuizProgress } from '@/components/quiz/QuizProgress'
import { ChatHeader } from '@/components/quiz/ChatHeader'
import { MessageBubble } from '@/components/quiz/MessageBubble'
import { OptionGroup } from '@/components/quiz/OptionGroup'
import { ProfilePeek } from '@/components/quiz/ProfilePeek'
import { TypingIndicator } from '@/components/quiz/TypingIndicator'
import { ProfileResultCard } from '@/components/quiz/ProfileResultCard'
import { quizQuestions } from '@/lib/mock-data/quiz'
import { selectProfile, type Profile } from '@/lib/mock-data/profiles'
import { analyzeQuizTurn } from '@/lib/ai/business'
import { useUserStore } from '@/lib/store/user'

type Turn =
  | { type: 'ai-greeting'; text: string }
  | { type: 'ai-question'; text: string; qIndex: number }
  | { type: 'ai-commentary'; text: string; streaming: boolean; hint?: string }
  | { type: 'user-pick'; text: string }
  | { type: 'options'; qIndex: number; disabledKey?: 'A' | 'B' | 'C' | 'D' }

export default function OnboardPage() {
  const addAnswer = useUserStore((s) => s.addAnswer)
  const completeQuiz = useUserStore((s) => s.completeQuiz)
  const reset = useUserStore((s) => s.reset)
  const profile = useUserStore((s) => s.profile)

  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [resultProfile, setResultProfile] = useState<Profile | null>(null)

  // 重置并播放开场
  useEffect(() => {
    reset()
    void beginQuiz()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function beginQuiz() {
    setTurns([{ type: 'ai-greeting', text: '你好呀，我是心遇 AI 😊 接下来我会通过聊天了解你，比填表有趣多啦～' }])
    await sleep(600)
    await askQuestion(0)
  }

  async function askQuestion(idx: number) {
    const q = quizQuestions[idx]
    setTurns((t) => [...t, { type: 'ai-question', text: q.prompt, qIndex: idx }])
    await sleep(300)
    setTurns((t) => [...t, { type: 'options', qIndex: idx }])
    setCurrentIdx(idx)
  }

  async function handlePick(qIndex: number, key: 'A' | 'B' | 'C' | 'D') {
    if (busy) return
    setBusy(true)
    const q = quizQuestions[qIndex]
    const opt = q.options.find((o) => o.key === key)!

    // 禁用该题选项组 + 插入用户气泡
    setTurns((t) =>
      t.map((x, i, arr) =>
        i === arr.length - 1 && x.type === 'options' && x.qIndex === qIndex
          ? { ...x, disabledKey: key }
          : x
      )
    )
    setTurns((t) => [...t, { type: 'user-pick', text: `${key} · ${opt.label}` }])

    // 写入 store
    addAnswer(q.id, key, opt.tags)

    // 调 Mock AI
    const result = await analyzeQuizTurn({
      questionId: q.id,
      chosenOption: key,
      historyTags: useUserStore.getState().profile.tags,
    })

    // 点评流式
    setTurns((t) => [...t, { type: 'ai-commentary', text: '', streaming: true, hint: result.profileHint }])
    for await (const chunk of result.commentaryStream) {
      setTurns((t) => {
        const copy = [...t]
        const last = copy[copy.length - 1]
        if (last.type === 'ai-commentary') {
          copy[copy.length - 1] = { ...last, text: last.text + chunk }
        }
        return copy
      })
    }
    setTurns((t) => {
      const copy = [...t]
      const last = copy[copy.length - 1]
      if (last.type === 'ai-commentary') copy[copy.length - 1] = { ...last, streaming: false }
      return copy
    })

    await sleep(500)

    // 下一题或结束
    const next = qIndex + 1
    if (next < quizQuestions.length) {
      await askQuestion(next)
    } else {
      const latestTags = useUserStore.getState().profile.tags
      const p = selectProfile(latestTags)
      completeQuiz(p.id, p.displayName)
      setResultProfile(p)
    }
    setBusy(false)
  }

  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <ChatHeader name="心遇 AI" sub={resultProfile ? '已识别你的画像' : '正在深度了解你'} />
        {!resultProfile && (
          <QuizProgress current={Math.min(currentIdx + 1, quizQuestions.length)} total={quizQuestions.length} />
        )}
        <div className="flex-1 overflow-y-auto pb-6">
          {turns.map((t, i) => {
            if (t.type === 'ai-greeting' || t.type === 'ai-question') {
              return <MessageBubble key={i} role="ai">{t.text}</MessageBubble>
            }
            if (t.type === 'user-pick') {
              return <MessageBubble key={i} role="you">{t.text}</MessageBubble>
            }
            if (t.type === 'ai-commentary') {
              return (
                <div key={i}>
                  {t.text.length === 0 ? (
                    <TypingIndicator />
                  ) : (
                    <MessageBubble role="ai">{t.text}{t.streaming && <span className="inline-block w-[2px] h-[1em] align-middle bg-white ml-0.5 animate-pulse" />}</MessageBubble>
                  )}
                  {!t.streaming && t.hint && <ProfilePeek text={t.hint} />}
                </div>
              )
            }
            if (t.type === 'options') {
              return (
                <OptionGroup
                  key={i}
                  options={quizQuestions[t.qIndex].options}
                  selectedKey={t.disabledKey}
                  disabled={Boolean(t.disabledKey)}
                  onPick={(k) => handlePick(t.qIndex, k)}
                />
              )
            }
            return null
          })}
          {resultProfile && <ProfileResultCard profile={resultProfile} tags={profile.tags} />}
        </div>
      </AppBody>
    </Phone>
  )
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

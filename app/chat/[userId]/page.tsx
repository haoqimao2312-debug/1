'use client'
import { useEffect, useRef, useState, use } from 'react'
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { InputBar } from '@/components/chat/InputBar'
import { AssistDrawer } from '@/components/chat/AssistDrawer'
import { xiaoyu } from '@/lib/mock-data/users/xiaoyu'
import {
  xiaoyuReply,
  assistSuggest,
  computeCompatibility,
  type AssistSuggestion,
} from '@/lib/ai/business'
import { useChatStore } from '@/lib/store/chat'
import { useUserStore } from '@/lib/store/user'
import type { ChatMessage } from '@/lib/ai/types'

export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const messages = useChatStore((s) => s.messages[userId] ?? [])
  const isTyping = useChatStore((s) => s.isTyping[userId] ?? false)
  const addMessage = useChatStore((s) => s.addMessage)
  const appendToLastAssistant = useChatStore((s) => s.appendToLastAssistant)
  const setTyping = useChatStore((s) => s.setTyping)
  const userProfile = useUserStore((s) => s.profile)

  const [input, setInput] = useState('')
  const [assistOpen, setAssistOpen] = useState(false)
  const [assistLoading, setAssistLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AssistSuggestion[]>([])
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const compatibility = computeCompatibility(userProfile.tags, xiaoyu.compatibleTags)

  // 首次进入且没有消息时，注入开场白
  useEffect(() => {
    if (userId !== 'xiaoyu') return
    if (messages.length === 0) {
      void seedOpening()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  async function seedOpening() {
    for (let i = 0; i < xiaoyu.openingMessages.length; i++) {
      const text = xiaoyu.openingMessages[i]
      await sleep(i === 0 ? 300 : 900)
      setTyping(userId, true)
      await sleep(700 + Math.random() * 400)
      setTyping(userId, false)
      addMessage(userId, {
        id: `open-${i}-${Date.now()}`,
        role: 'assistant',
        content: text,
        createdAt: Date.now(),
      })
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || busy) return
    setBusy(true)
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: Date.now(),
    }
    addMessage(userId, userMsg)
    setInput('')

    await sleep(300)
    setTyping(userId, true)
    await sleep(800 + Math.random() * 1200)
    setTyping(userId, false)

    const history = [...useChatStore.getState().messages[userId]!, userMsg].slice(-10)
    const reply = await xiaoyuReply({ chatHistory: history })
    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    }
    addMessage(userId, assistantMsg)
    for await (const chunk of reply.stream) {
      appendToLastAssistant(userId, chunk)
    }
    setBusy(false)
  }

  async function openAssist() {
    setAssistOpen(true)
    setAssistLoading(true)
    try {
      const { suggestions } = await assistSuggest({
        chatHistory: messages.slice(-10),
        userTags: userProfile.tags,
      })
      setSuggestions(suggestions)
    } catch {
      // 兜底
      setSuggestions([
        { style: 'care', emoji: '🫂', label: '关心', text: '你还好吗' },
        { style: 'playful', emoji: '✨', label: '俏皮', text: '在呢在呢 我在摸鱼' },
        { style: 'direct', emoji: '🎯', label: '推进', text: '说说看怎么了' },
      ])
    } finally {
      setAssistLoading(false)
    }
  }

  function handlePickSuggestion(text: string) {
    setInput(text)
    setAssistOpen(false)
  }

  if (userId !== 'xiaoyu') {
    return (
      <Phone>
        <StatusBar />
        <AppBody>
          <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
            用户不存在
          </div>
        </AppBody>
      </Phone>
    )
  }

  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <ChatHeader
          name={xiaoyu.displayName}
          subtitle={xiaoyu.subtitle}
          avatar={xiaoyu.avatar}
          compatibility={compatibility}
        />
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
          {messages.map((m, i) => (
            <MessageBubble key={m.id} role={m.role} streaming={i === messages.length - 1 && busy && m.role === 'assistant' && m.content.length > 0}>
              {m.content}
            </MessageBubble>
          ))}
          {isTyping && <TypingIndicator />}
        </div>
        <InputBar
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onOpenAssist={openAssist}
          disabled={busy}
        />
      </AppBody>
      <AssistDrawer
        open={assistOpen}
        loading={assistLoading}
        suggestions={suggestions}
        onPick={handlePickSuggestion}
        onClose={() => setAssistOpen(false)}
      />
    </Phone>
  )
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

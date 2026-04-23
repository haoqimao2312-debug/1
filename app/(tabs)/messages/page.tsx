'use client'
import { useChatStore } from '@/lib/store/chat'
import { useToastStore } from '@/lib/store/toast'
import { previewUsers } from '@/lib/mock-data/users/preview-users'
import { xiaoyu } from '@/lib/mock-data/users/xiaoyu'
import { CompatibilityHero } from '@/components/messages/CompatibilityHero'
import { AIAssistHint } from '@/components/messages/AIAssistHint'
import { ChatListItem } from '@/components/messages/ChatListItem'

export default function MessagesPage() {
  const messages = useChatStore((s) => s.messages[xiaoyu.id] ?? [])
  const show = useToastStore((s) => s.show)

  const xiaoyuLast = messages[messages.length - 1]
  const xiaoyuPreview = xiaoyuLast
    ? xiaoyuLast.content.length > 30
      ? xiaoyuLast.content.slice(0, 30) + '…'
      : xiaoyuLast.content
    : '啊 你来啦～'
  const xiaoyuTime = xiaoyuLast
    ? new Date(xiaoyuLast.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    : '刚刚'
  const xiaoyuUnread = messages.filter((m) => m.role === 'assistant').length > 0 ? 0 : 2

  function openPreview(name: string) {
    show(`${name} 仅演示。点小雨可以和 AI 真实聊天`, '💭')
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <div className="text-[16px] font-semibold">消息 · 心遇</div>
        <button
          onClick={() => show('搜索即将开放', '🔍')}
          className="w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--ink-dim)]"
          aria-label="搜索"
        >
          🔍
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <CompatibilityHero />

        <div className="px-5 pt-2 pb-1 text-[11px] tracking-[0.1em] text-[var(--ink-faint)]">
          AI 助聊 · 智能推荐
        </div>
        <AIAssistHint />

        <div className="px-5 pt-4 pb-1 text-[11px] tracking-[0.1em] text-[var(--ink-faint)]">
          最近聊天
        </div>
        <div>
          <ChatListItem
            href="/chat/xiaoyu"
            displayName={xiaoyu.displayName}
            time={xiaoyuTime}
            preview={xiaoyuPreview}
            unread={xiaoyuUnread}
            online
            avatarFrom="#ff5ea0"
            avatarTo="#a970ff"
            faceTone="#ffd8c0"
            hairColor="#3a2030"
          />
          {previewUsers.map((u) => (
            <ChatListItem
              key={u.id}
              onClick={() => openPreview(u.displayName)}
              displayName={u.displayName}
              compatibility={u.compatibility}
              time={u.chatTime}
              preview={u.chatPreview}
              unread={u.unread}
              online={u.online}
              avatarFrom={u.avatarGradientFrom}
              avatarTo={u.avatarGradientTo}
              faceTone={u.faceTone}
              hairColor={u.hairColor}
            />
          ))}
        </div>

        <div className="h-4" />
      </div>
    </>
  )
}

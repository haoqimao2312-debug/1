'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChatListAvatar } from './ChatListAvatar'

type Props = {
  href?: string
  onClick?: () => void
  displayName: string
  compatibility?: number
  time: string
  preview: ReactNode
  unread?: number
  online?: boolean
  avatarFrom: string
  avatarTo: string
  faceTone?: string
  hairColor?: string
  photo?: string
}

export function ChatListItem({
  href,
  onClick,
  displayName,
  compatibility,
  time,
  preview,
  unread,
  online,
  avatarFrom,
  avatarTo,
  faceTone,
  hairColor,
  photo,
}: Props) {
  const body = (
    <div className="flex items-center gap-3 px-4 py-3 active:bg-white/5 transition">
      <ChatListAvatar
        from={avatarFrom}
        to={avatarTo}
        faceTone={faceTone}
        hairColor={hairColor}
        online={online}
        photo={photo}
        alt={displayName}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="font-semibold truncate">{displayName}</div>
            {compatibility != null && (
              <span
                className="shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  background: 'rgba(232, 184, 111, 0.2)',
                  color: '#e8b86f',
                }}
              >
                {compatibility}%
              </span>
            )}
          </div>
          <div className="text-[11px] text-[var(--ink-faint)] shrink-0">{time}</div>
        </div>
        <div className="text-[12px] text-[var(--ink-dim)] truncate mt-0.5">{preview}</div>
      </div>
      {unread != null && unread > 0 && (
        <div
          className="shrink-0 min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
          style={{ background: 'var(--grad-pink)' }}
        >
          {unread}
        </div>
      )}
    </div>
  )

  if (href) return <Link href={href}>{body}</Link>
  return (
    <button onClick={onClick} className="w-full text-left">
      {body}
    </button>
  )
}

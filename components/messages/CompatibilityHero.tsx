'use client'
import { useToastStore } from '@/lib/store/toast'
import { ChatListAvatar } from './ChatListAvatar'

const DIMENSIONS = [
  { name: '性格',    value: 95 },
  { name: '三观',    value: 88 },
  { name: '兴趣',    value: 94 },
  { name: '节奏',    value: 90 },
  { name: '依恋',    value: 89 },
  { name: '生活圈',   value: 96 },
]

export function CompatibilityHero() {
  const show = useToastStore((s) => s.show)
  return (
    <div
      onClick={() => show('契合度报告详情即将开放', '💌')}
      className="mx-4 my-3 p-4 rounded-3xl glass-strong cursor-pointer active:scale-[0.99] transition"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-[11px] tracking-[0.15em] text-[var(--ink-dim)]"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          NEW · 契合度解读卡
        </div>
        <div className="text-2xl font-bold text-grad-love">92<sup className="text-xs">%</sup></div>
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <ChatListAvatar from="#5df0ff" to="#7c3aed" faceTone="#f8d8b8" hairColor="#2a3040" size={44} />
        <div className="text-lg" style={{ color: '#ff8f6b' }}>♥</div>
        <ChatListAvatar from="#ff8fbc" to="#a970ff" faceTone="#ffe0d0" hairColor="#3a1f1a" size={44} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {DIMENSIONS.map((d) => (
          <div key={d.name} className="text-center py-2 rounded-xl bg-white/5">
            <div className="text-[10px] text-[var(--ink-faint)]">{d.name}</div>
            <div className="text-[15px] font-semibold text-grad-love" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {d.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

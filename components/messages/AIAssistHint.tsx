'use client'
import Link from 'next/link'

export function AIAssistHint() {
  return (
    <Link
      href="/chat/xiaoyu"
      className="mx-4 flex items-center gap-3 p-3 rounded-2xl glass active:bg-white/10 transition"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 text-white"
        style={{ background: 'var(--grad-love)' }}
      >
        ♥
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-semibold text-[14px]">心遇 AI 助手</div>
          <div className="text-[11px] text-[var(--ink-faint)] shrink-0">刚刚</div>
        </div>
        <div className="text-[12px] text-[var(--ink-dim)] truncate">
          <span style={{ color: '#ff8f6b' }}>[AI]</span> 林念念回复了你 3 小时没回，要来看看吗？
        </div>
      </div>
      <div
        className="shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
        style={{ background: 'var(--grad-pink)' }}
      >
        1
      </div>
    </Link>
  )
}

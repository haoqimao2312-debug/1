'use client'
import { Sparkles, Send } from 'lucide-react'

export function InputBar({
  value,
  onChange,
  onSend,
  onOpenAssist,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onOpenAssist: () => void
  disabled?: boolean
}) {
  return (
    <div className="px-3 py-3 border-t border-white/10 flex items-center gap-2">
      <button
        onClick={onOpenAssist}
        disabled={disabled}
        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full glass text-[13px] font-semibold disabled:opacity-40"
      >
        <Sparkles size={14} className="text-[var(--pink)]" />
        AI 助聊
      </button>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !disabled && value.trim()) onSend()
        }}
        placeholder="说点什么…"
        className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-white/8 border border-white/10 text-[14px] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--pink)]/50"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-40"
        style={{ background: 'var(--grad-love)' }}
        aria-label="发送"
      >
        <Send size={16} />
      </button>
    </div>
  )
}

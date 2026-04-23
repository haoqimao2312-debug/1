export function QuizProgress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between text-[12px] text-[var(--ink-dim)] mb-2">
        <span>性格画像 · 第 {current}/{total} 题</span>
        <span className="text-[var(--pink)] font-semibold" style={{ fontFamily: 'JetBrains Mono' }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: 'var(--grad-love)' }}
        />
      </div>
    </div>
  )
}

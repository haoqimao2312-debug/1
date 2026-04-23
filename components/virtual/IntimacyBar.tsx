const MILESTONES = [
  { label: '文字', active: true },
  { label: '视频', active: true },
  { label: '场景', active: true, current: true },
  { label: '真人', active: false },
]

export function IntimacyBar({ value = 72 }: { value?: number }) {
  return (
    <div className="mx-4 my-3 p-4 rounded-2xl glass">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold flex items-center gap-1.5">
          <span style={{ color: '#ff8f6b' }}>♥</span> 亲密度
        </div>
        <div className="text-[13px] font-semibold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <span className="text-grad-love">{value}</span>
          <span className="text-[var(--ink-faint)]"> / 100</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: 'var(--grad-love)' }} />
      </div>
      <div className="flex items-center justify-between text-[11px]">
        {MILESTONES.map((m) => (
          <span
            key={m.label}
            className={`${
              m.current
                ? 'text-grad-love font-semibold'
                : m.active
                ? 'text-[var(--ink-dim)]'
                : 'text-[var(--ink-faint)]'
            }`}
          >
            {m.active ? (m.current ? '◉ ' : '✓ ') : '○ '}
            {m.label}
          </span>
        ))}
      </div>
    </div>
  )
}

'use client'

type ActionKey = 'rewind' | 'pass' | 'like' | 'super' | 'boost'

const actions: { key: ActionKey; glyph: string; label: string; color: string }[] = [
  { key: 'rewind', glyph: '↺', label: '撤回',    color: '#b8a8d8' },
  { key: 'pass',   glyph: '✕', label: '跳过',    color: '#ff8fbc' },
  { key: 'like',   glyph: '♥', label: '喜欢',    color: '#ff5ea0' },
  { key: 'super',  glyph: '★', label: '超级',    color: '#5df0ff' },
  { key: 'boost',  glyph: '⚡', label: '加速',    color: '#ffd176' },
]

export function MatchActions({
  disabled,
  onAction,
}: {
  disabled?: boolean
  onAction: (k: ActionKey) => void
}) {
  return (
    <div className="flex items-center justify-around px-4 pt-2 pb-4">
      {actions.map((a) => (
        <button
          key={a.key}
          disabled={disabled}
          onClick={() => onAction(a.key)}
          className={`
            w-12 h-12 rounded-full glass-strong flex items-center justify-center text-lg
            active:scale-90 transition disabled:opacity-40
            ${a.key === 'like' ? 'w-14 h-14 text-2xl' : ''}
          `}
          style={{ color: a.color }}
          aria-label={a.label}
        >
          {a.glyph}
        </button>
      ))}
    </div>
  )
}

export type { ActionKey }

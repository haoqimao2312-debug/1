'use client'
import { useToastStore } from '@/lib/store/toast'

const BUTTONS = [
  { key: 'mic',   glyph: '🎤', msg: '麦克风控制即将开放（Phase 3）',       color: '#e8b86f' },
  { key: 'scene', glyph: '🌸', msg: '更多场景：海边 / 雪山 / 露台 即将开放', color: '#ff8f6b' },
  { key: 'gift',  glyph: '🎁', msg: '虚拟礼物系统即将开放',                  color: '#ffd176' },
  { key: 'end',   glyph: '✕',  msg: '（演示模式下无通话可结束）',              color: '#ff5e5e' },
]

export function CallControls() {
  const show = useToastStore((s) => s.show)
  return (
    <div className="flex items-center justify-around px-4 pt-1 pb-3">
      {BUTTONS.map((b) => (
        <button
          key={b.key}
          onClick={() => show(b.msg, b.glyph)}
          className={`
            w-12 h-12 rounded-full glass-strong flex items-center justify-center text-lg
            active:scale-90 transition
            ${b.key === 'end' ? 'bg-red-500/60' : ''}
          `}
          style={b.key === 'end' ? undefined : { color: b.color }}
          aria-label={b.key}
        >
          {b.glyph}
        </button>
      ))}
    </div>
  )
}

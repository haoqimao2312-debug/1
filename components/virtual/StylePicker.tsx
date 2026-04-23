'use client'
import { useState } from 'react'
import { useToastStore } from '@/lib/store/toast'

const STYLES = [
  { id: 'anime',   emoji: '🌸', label: '日漫风',  locked: false },
  { id: '3d',      emoji: '🎭', label: '3D 写实', locked: false },
  { id: 'soft',    emoji: '✨', label: '轻美化',  locked: false },
  { id: 'guofeng', emoji: '🏮', label: '国风',    locked: true },
  { id: 'cyber',   emoji: '🔮', label: '赛博',    locked: true },
]

export function StylePicker() {
  const [active, setActive] = useState('anime')
  const show = useToastStore((s) => s.show)
  return (
    <div className="mx-4 my-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="text-[13px] font-semibold">你的虚拟形象风格</div>
        <div
          className="text-[11px] text-[var(--ink-dim)]"
          onClick={() => show('风格商店即将开放', '🎨')}
        >
          切换风格 ›
        </div>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        {STYLES.map((s) => {
          const isActive = s.id === active
          return (
            <button
              key={s.id}
              onClick={() => {
                if (s.locked) {
                  show(`${s.label} 风格 SVIP 专享`, '♛')
                } else {
                  setActive(s.id)
                }
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] transition flex items-center gap-1 ${
                isActive
                  ? 'bg-[rgba(255,143,107,0.18)] border border-[rgba(255,143,107,0.38)] text-[var(--ink)]'
                  : 'glass text-[var(--ink-dim)]'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
              {s.locked && <span className="text-[10px] ml-0.5">🔒</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

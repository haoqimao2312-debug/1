'use client'
import { useState } from 'react'

const chips = ['✦ 为你精选', '附近', '同频', '新人', '兴趣']

export function MatchFilter() {
  const [active, setActive] = useState(0)
  return (
    <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto">
      {chips.map((c, i) => {
        const isActive = i === active
        return (
          <button
            key={c}
            onClick={() => setActive(i)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] transition ${
              isActive
                ? 'bg-[rgba(255,143,107,0.18)] border border-[rgba(255,143,107,0.38)] text-[var(--ink)]'
                : 'glass text-[var(--ink-dim)]'
            }`}
          >
            {c}
          </button>
        )
      })}
    </div>
  )
}

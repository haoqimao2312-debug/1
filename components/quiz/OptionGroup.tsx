'use client'
import { motion } from 'framer-motion'
import type { QuizOption } from '@/lib/mock-data/quiz'

export function OptionGroup({
  options,
  selectedKey,
  onPick,
  disabled,
}: {
  options: QuizOption[]
  selectedKey?: 'A' | 'B' | 'C' | 'D'
  onPick: (key: 'A' | 'B' | 'C' | 'D') => void
  disabled?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-2 flex flex-col gap-2"
    >
      {options.map((o) => {
        const isSelected = selectedKey === o.key
        return (
          <button
            key={o.key}
            disabled={disabled}
            onClick={() => onPick(o.key)}
            className={`text-left flex items-center gap-3 px-4 py-3 rounded-2xl border transition ${
              isSelected
                ? 'bg-[rgba(255,94,160,0.18)] border-[rgba(255,94,160,0.45)]'
                : 'bg-[var(--glass)] border-[var(--glass-border)] hover:bg-white/12 active:scale-[0.98]'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[13px] font-bold ${
                isSelected ? 'text-[var(--pink)]' : 'text-[var(--ink-dim)]'
              } bg-white/10`}
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              {o.key}
            </span>
            <span className="text-[14px]">{o.label}</span>
          </button>
        )
      })}
    </motion.div>
  )
}

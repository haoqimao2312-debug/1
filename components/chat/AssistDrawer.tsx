'use client'
import { AnimatePresence, motion } from 'framer-motion'
import type { AssistSuggestion } from '@/lib/ai/business'

export function AssistDrawer({
  open,
  loading,
  suggestions,
  onPick,
  onClose,
}: {
  open: boolean
  loading: boolean
  suggestions: AssistSuggestion[]
  onPick: (text: string) => void
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50 rounded-t-3xl glass-strong p-4 pt-6 pb-8"
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="text-[13px] font-semibold mb-3 text-[var(--ink-dim)]">
              ✦ AI 助聊 · 三种语气供你选
            </div>
            {loading ? (
              <div className="py-8 text-center text-[var(--ink-dim)] text-[13px]">
                正在想…
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.style}
                    onClick={() => onPick(s.text)}
                    className="text-left flex items-start gap-3 px-4 py-3 rounded-2xl glass hover:bg-white/14 active:scale-[0.99] transition"
                  >
                    <span className="text-lg shrink-0">{s.emoji}</span>
                    <span className="flex-1">
                      <span className="block text-[11px] text-[var(--ink-dim)] mb-0.5">
                        {s.label}
                      </span>
                      <span className="block text-[14px] leading-relaxed">{s.text}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

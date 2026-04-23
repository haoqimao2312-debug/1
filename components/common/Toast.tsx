'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '@/lib/store/toast'

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-strong px-4 py-2.5 rounded-full text-[13px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.35)] flex items-center gap-2"
          >
            {t.emoji && <span className="text-base leading-none">{t.emoji}</span>}
            <span>{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

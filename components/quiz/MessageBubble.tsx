'use client'
import { motion } from 'framer-motion'

export function MessageBubble({
  role,
  children,
}: { role: 'ai' | 'you'; children: React.ReactNode }) {
  const isAI = role === 'ai'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2 ${isAI ? 'justify-start' : 'justify-end'} px-5 py-1.5`}
    >
      {isAI && (
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center text-sm shrink-0"
          style={{ background: 'var(--grad-love)' }}
        >
          ♥
        </div>
      )}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 text-[14px] leading-relaxed rounded-2xl ${
          isAI
            ? 'bg-white/8 border border-white/10 rounded-tl-sm'
            : 'text-white rounded-tr-sm'
        }`}
        style={isAI ? undefined : { background: 'var(--grad-love)' }}
      >
        {children}
      </div>
    </motion.div>
  )
}

'use client'
import { motion } from 'framer-motion'

export function MessageBubble({
  role,
  children,
  streaming,
}: { role: 'user' | 'assistant'; children: React.ReactNode; streaming?: boolean }) {
  const isAI = role === 'assistant'
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isAI ? 'justify-start' : 'justify-end'} px-4 py-1`}
    >
      {isAI && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
          style={{ background: 'var(--grad-love)' }}
        >
          🌧️
        </div>
      )}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 text-[14px] leading-relaxed rounded-2xl ${
          isAI
            ? 'bg-white/8 border border-white/10 rounded-tl-sm'
            : 'text-white rounded-tr-sm'
        }`}
        style={isAI ? undefined : { background: 'var(--grad-love)' }}
      >
        {children}
        {streaming && (
          <span className="inline-block w-[2px] h-[1em] align-middle bg-white ml-0.5 animate-pulse" />
        )}
      </div>
    </motion.div>
  )
}

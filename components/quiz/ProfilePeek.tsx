'use client'
import { motion } from 'framer-motion'

export function ProfilePeek({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="mx-5 my-2 px-4 py-2.5 rounded-2xl flex items-center gap-3 glass-strong"
    >
      <div className="text-xl">🌙</div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold">{text}</div>
      </div>
    </motion.div>
  )
}

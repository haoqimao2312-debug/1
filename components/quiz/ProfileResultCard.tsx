'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Profile } from '@/lib/mock-data/profiles'
import { Button } from '@/components/common/Button'

export function ProfileResultCard({ profile, tags }: { profile: Profile; tags: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-5 my-4 p-6 rounded-3xl glass-strong flex flex-col gap-4"
    >
      <div
        className="self-center w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-[0_14px_40px_rgba(169,112,255,0.45)]"
        style={{ background: 'var(--grad-love)' }}
      >
        ✦
      </div>
      <div className="text-center">
        <div
          className="text-2xl font-semibold text-grad-love"
          style={{ fontFamily: 'Instrument Serif, Noto Serif SC, serif' }}
        >
          {profile.displayName}
        </div>
        <div className="text-[13px] text-[var(--ink-dim)] mt-1">{profile.subtitle}</div>
      </div>
      <p className="text-[14px] leading-relaxed text-[var(--ink-dim)]">{profile.commentary}</p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {tags.slice(0, 8).map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 rounded-full text-[11px] bg-white/10 border border-white/15"
          >
            {t}
          </span>
        ))}
      </div>
      <Link href="/chat/xiaoyu">
        <Button className="w-full">进入心遇</Button>
      </Link>
    </motion.div>
  )
}

'use client'
import { motion, type PanInfo } from 'framer-motion'
import type { PreviewUser } from '@/lib/mock-data/users/preview-users'
import { PortraitSvg } from './PortraitSvg'

export function MatchCard({
  user,
  isTop,
  stackOffset,
  onSwipe,
}: {
  user: PreviewUser
  isTop: boolean
  stackOffset: number  // 0 for top, 1 for one behind, 2 for two behind
  onSwipe?: (dir: 'left' | 'right') => void
}) {
  function handleDragEnd(_e: unknown, info: PanInfo) {
    if (!isTop || !onSwipe) return
    if (info.offset.x > 120) onSwipe('right')
    else if (info.offset.x < -120) onSwipe('left')
  }

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{
        scale: 1 - stackOffset * 0.04,
        y: stackOffset * 10,
        opacity: stackOffset <= 2 ? 1 - stackOffset * 0.15 : 0,
      }}
      whileDrag={{ rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      style={{ zIndex: 10 - stackOffset }}
      className="absolute inset-0 rounded-3xl overflow-hidden"
    >
      <div className="absolute inset-0">
        <PortraitSvg
          from={user.avatarGradientFrom}
          to={user.avatarGradientTo}
          faceTone={user.faceTone}
          hairColor={user.hairColor}
          className="w-full h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />

      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur text-[12px] font-semibold">
          ♥ {user.compatibility}% 契合
        </span>
        {user.verified && (
          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur text-[12px]">✓ 已认证</span>
        )}
      </div>

      <div className="absolute left-4 right-4 bottom-4 text-white pointer-events-none">
        <div className="text-2xl font-semibold">
          {user.displayName} <span className="text-base font-normal opacity-80">{user.age}</span>
        </div>
        <div className="text-[12px] opacity-85 mt-0.5">
          📍 {user.location} · {user.distance} · {user.mbti} · {user.profession}
        </div>
        <div className="text-[13px] italic opacity-90 my-2">{user.bio}</div>
        <div className="flex flex-wrap gap-1.5">
          {user.tags.map((t) => (
            <span
              key={t.label}
              className="px-2 py-0.5 rounded-full text-[11px] bg-white/15 border border-white/20"
            >
              {t.emoji} {t.label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

'use client'
import { me } from '@/lib/mock-data/users/me'
import { useUserStore } from '@/lib/store/user'

export function ProfileHero() {
  const profileDisplayName = useUserStore((s) => s.profile.profileDisplayName)
  const mbtiOrProfile = profileDisplayName || me.mbti

  return (
    <div className="flex flex-col items-center gap-2 pt-2 pb-4">
      <div className="relative">
        <div
          className="w-[84px] h-[84px] rounded-full overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${me.avatarGradientFrom}, ${me.avatarGradientTo})` }}
        >
          <svg viewBox="0 0 84 84" width="100%" height="100%">
            <ellipse cx="42" cy="36" rx="16" ry="20" fill={me.faceTone} />
            <path
              d="M 22 32 Q 22 14 42 12 Q 62 14 62 32 Q 62 24 55 20 Q 48 16 42 16 Q 36 16 29 20 Q 22 24 22 32 Z"
              fill={me.hairColor}
            />
            <ellipse cx="35" cy="38" rx="2.5" ry="3" fill="#2a0a4a" />
            <ellipse cx="49" cy="38" rx="2.5" ry="3" fill="#2a0a4a" />
            <path d="M 36 48 Q 42 52 48 48" stroke="#d07060" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 20 84 L 25 64 Q 42 58 59 64 L 64 84 Z" fill={me.hairColor} />
          </svg>
        </div>
        {me.verified && (
          <div
            className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs border-2 border-[#1a0f14]"
            style={{ background: 'var(--grad-love)' }}
          >
            ✓
          </div>
        )}
      </div>
      <div
        className="text-[22px] leading-tight mt-1"
        style={{ fontFamily: 'Instrument Serif, Noto Serif SC, serif', fontStyle: 'italic' }}
      >
        {me.displayName} <span className="text-sm opacity-70 not-italic">· {me.age}</span>
      </div>
      <div className="text-[12px] text-[var(--ink-dim)]">
        📍 {me.location} · {me.profession}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {me.verified && (
          <span
            className="px-2 py-0.5 rounded-full text-[11px] border"
            style={{
              background: 'rgba(212, 168, 112, 0.15)',
              borderColor: 'rgba(212, 168, 112, 0.38)',
              color: '#d4a870',
            }}
          >
            ✓ 实名认证
          </span>
        )}
        <span
          className="px-2 py-0.5 rounded-full text-[11px] text-white font-semibold"
          style={{ background: 'var(--grad-love)' }}
        >
          {mbtiOrProfile}
        </span>
        {me.hotUser && (
          <span
            className="px-2 py-0.5 rounded-full text-[11px] border"
            style={{
              background: 'rgba(255, 143, 107, 0.15)',
              borderColor: 'rgba(255, 143, 107, 0.38)',
              color: '#ff8f6b',
            }}
          >
            ♥ 热门用户
          </span>
        )}
      </div>
    </div>
  )
}

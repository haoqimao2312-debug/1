'use client'
import { useToastStore } from '@/lib/store/toast'
import { ProfileHero } from '@/components/me/ProfileHero'
import { ProfileStats } from '@/components/me/ProfileStats'
import { SvipCard } from '@/components/me/SvipCard'
import { ProfileMenu } from '@/components/me/ProfileMenu'

export default function MePage() {
  const show = useToastStore((s) => s.show)
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-3">
        <div className="page-title">我的</div>
        <button
          onClick={() => show('设置即将开放（Phase 4）', '⚙')}
          className="topbar-icon-box"
          aria-label="设置"
        >
          ⚙
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ProfileHero />
        <ProfileStats />
        <SvipCard />
        <ProfileMenu />
        <div className="h-4" />
      </div>
    </>
  )
}

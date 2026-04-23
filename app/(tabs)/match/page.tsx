'use client'
import { useState } from 'react'
import { matchOrder } from '@/lib/mock-data/users/preview-users'
import { MatchFilter } from '@/components/match/MatchFilter'
import { MatchCard } from '@/components/match/MatchCard'
import { MatchActions, type ActionKey } from '@/components/match/MatchActions'
import { EmptyMatchState } from '@/components/match/EmptyMatchState'
import { useToastStore } from '@/lib/store/toast'

export default function MatchPage() {
  const [idx, setIdx] = useState(0)
  const show = useToastStore((s) => s.show)
  const remaining = matchOrder.slice(idx)
  const done = idx >= matchOrder.length

  function swipeNext(dir: 'left' | 'right') {
    const user = remaining[0]
    if (!user) return
    show(dir === 'right' ? `已喜欢 · ${user.displayName}` : `已跳过 · ${user.displayName}`, dir === 'right' ? '♥' : '✕')
    setIdx((i) => i + 1)
  }

  function handleAction(a: ActionKey) {
    if (a === 'like') swipeNext('right')
    else if (a === 'pass') swipeNext('left')
    else if (a === 'rewind') show('撤回是 SVIP 专享，即将开放', '♛')
    else if (a === 'super') show('超级喜欢是 SVIP 专享，即将开放', '♛')
    else if (a === 'boost') show('曝光加速是 SVIP 专享，即将开放', '♛')
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <div className="text-[16px] font-semibold">探索 · 今日推荐</div>
        <button
          onClick={() => show('偏好设置即将开放', '⚙')}
          className="w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--ink-dim)]"
          aria-label="设置"
        >
          ⚙
        </button>
      </div>

      <MatchFilter />

      {done ? (
        <EmptyMatchState onRefresh={() => setIdx(0)} />
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center px-4 py-2 min-h-0">
            <div className="relative w-full aspect-[3/4] max-h-[520px]">
              {remaining.slice(0, 3).reverse().map((user, revIndex) => {
                const stackOffset = remaining.slice(0, 3).length - 1 - revIndex
                const isTop = stackOffset === 0
                return (
                  <MatchCard
                    key={user.id}
                    user={user}
                    isTop={isTop}
                    stackOffset={stackOffset}
                    onSwipe={isTop ? swipeNext : undefined}
                  />
                )
              })}
            </div>
          </div>

          <MatchActions onAction={handleAction} />
        </>
      )}
    </>
  )
}

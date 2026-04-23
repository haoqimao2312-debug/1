'use client'
import { Button } from '@/components/common/Button'

export function EmptyMatchState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
      <div className="text-5xl">🌙</div>
      <div className="text-xl font-semibold">今日推荐已看完</div>
      <div className="text-[13px] text-[var(--ink-dim)] max-w-xs">
        明天这个时候再来，会有新的人等你。<br />
        或者现在先去和小雨聊聊？
      </div>
      <Button onClick={onRefresh} variant="glass">重置推荐</Button>
    </div>
  )
}

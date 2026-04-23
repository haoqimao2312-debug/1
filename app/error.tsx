'use client'
import { Button } from '@/components/common/Button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="text-5xl">😵‍💫</div>
      <div className="text-xl font-semibold">出了一点小问题</div>
      <div className="text-[13px] text-[var(--ink-dim)] max-w-xs">
        刷新一下试试。如果一直这样 —— 把这个告诉开发者：<br />
        <code className="text-[var(--pink)]">{error.message}</code>
      </div>
      <Button onClick={reset}>再试一次</Button>
    </div>
  )
}

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function ChatHeader({
  name,
  subtitle,
  avatar,
  compatibility,
}: {
  name: string
  subtitle: string
  avatar: string
  compatibility: number
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
      <Link href="/" className="p-1 -ml-1 text-[var(--ink-dim)]">
        <ChevronLeft size={22} />
      </Link>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
        style={{ background: 'var(--grad-love)' }}
      >
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{name}</div>
        <div className="text-[12px] text-[var(--ink-dim)] truncate">{subtitle}</div>
      </div>
      <div
        className="px-2.5 py-1 rounded-full glass text-[12px] font-semibold"
        style={{ fontFamily: 'JetBrains Mono' }}
      >
        契合 <span className="text-grad-love">{compatibility}%</span>
      </div>
    </div>
  )
}

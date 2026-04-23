'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type TabKey = 'explore' | 'messages' | 'tools' | 'virtual' | 'me'

const tabs: { key: TabKey; icon: string; label: string; path: string }[] = [
  { key: 'explore',  icon: '◉', label: '探索',    path: '/match' },
  { key: 'messages', icon: '♥', label: '消息',    path: '/messages' },
  { key: 'tools',    icon: '✦', label: 'AI 工具', path: '/tools' },
  { key: 'virtual',  icon: '◐', label: '虚拟',    path: '/virtual' },
  { key: 'me',       icon: '◆', label: '我的',    path: '/me' },
]

export function TabBar() {
  const pathname = usePathname() ?? ''
  const activeKey = tabs.find((t) => pathname.startsWith(t.path))?.key
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-30 flex items-stretch justify-around pt-2 pb-5 px-2 glass-strong border-t border-white/10"
      style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
    >
      {tabs.map((t) => {
        const isActive = t.key === activeKey
        return (
          <Link
            key={t.key}
            href={t.path}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5"
          >
            <span
              className={`text-[18px] leading-none ${isActive ? 'text-grad-love' : 'text-[var(--ink-faint)]'}`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {t.icon}
            </span>
            <span
              className={`text-[10px] ${isActive ? 'text-grad-love font-semibold' : 'text-[var(--ink-faint)]'}`}
            >
              {t.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

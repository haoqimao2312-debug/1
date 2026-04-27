'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

const links = [
  { href: '/admin', label: '概览' },
  { href: '/admin/profiles', label: '匹配资料' },
  { href: '/admin/personas', label: '聊天人设' },
  { href: '/admin/scripts', label: '聊天脚本' },
  { href: '/admin/users', label: '用户' },
  { href: '/admin/posts', label: '帖子' },
]

export function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] text-[#281b22]">
      <header className="sticky top-0 z-30 border-b border-[#dfd1c6] bg-[#fffaf5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <Link href="/admin" className="font-serif text-2xl font-black">
            MatchU Admin
          </Link>
          <nav className="flex flex-1 items-center gap-2">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    active ? 'bg-[#281b22] text-white' : 'text-[#6a5058] hover:bg-[#efe4dc]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <button
            onClick={logout}
            className="rounded-lg border border-[#d8c5b9] px-3 py-2 text-sm font-semibold text-[#7a3d4a] hover:bg-[#fff0f2]"
          >
            退出
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  )
}

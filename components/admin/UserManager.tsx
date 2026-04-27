'use client'

import { useEffect, useMemo, useState } from 'react'
import type { AppUserProfile } from '@/lib/backend/user-types'
import { parseJsonResponse } from './form-utils'

export function UserManager() {
  const [users, setUsers] = useState<AppUserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const verified = useMemo(() => users.filter((user) => user.verified).length, [users])

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await parseJsonResponse<{ users: AppUserProfile[] }>(await fetch('/api/admin/users'))
      setUsers(data.users)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="font-serif text-3xl font-black">前台用户</h1>
        <p className="text-sm text-[#7c626a]">{users.length} 个用户资料，{verified} 个认证用户</p>
      </div>
      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</div>}
      <div className="overflow-hidden rounded-2xl border border-[#dfd1c6] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f0e6df] text-xs uppercase tracking-wide text-[#7c626a]">
            <tr>
              <th className="px-4 py-3">用户</th>
              <th className="px-4 py-3">资料</th>
              <th className="px-4 py-3">统计</th>
              <th className="px-4 py-3">注册时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-[#7c626a]" colSpan={4}>加载中...</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="border-t border-[#eee2da]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={user.avatarUrl || '/icon-192.png'} alt="" className="h-11 w-11 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold">{user.displayName}</div>
                      <div className="text-xs text-[#7c626a]">{user.email || user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs leading-relaxed text-[#5c4650]">
                  {user.city || '-'} · {user.profession || '-'} · {user.mbti || '-'}
                  <div className="mt-1 max-w-md truncate">{user.bio || '暂无简介'}</div>
                </td>
                <td className="px-4 py-3 text-xs text-[#5c4650]">
                  {user.stats.likesReceived} 赞 · {user.stats.matches} 匹配 · 最高 {user.stats.highestCompatibility}%
                </td>
                <td className="px-4 py-3 text-xs text-[#7c626a]">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

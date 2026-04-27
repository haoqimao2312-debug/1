'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { parseJsonResponse } from './form-utils'

export function SeedButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function seed() {
    setLoading(true)
    setMessage('')
    try {
      const data = await parseJsonResponse<{ profiles: number; personas: number; scripts: number }>(
        await fetch('/api/admin/seed', { method: 'POST' })
      )
      setMessage(`已导入 ${data.profiles} 资料 / ${data.personas} 人设 / ${data.scripts} 脚本`)
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '导入失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-right">
      <button
        onClick={seed}
        disabled={loading}
        className="rounded-xl bg-[#281b22] px-4 py-3 text-sm font-black text-white shadow-sm disabled:opacity-50"
      >
        {loading ? '导入中...' : '导入当前 Mock 数据'}
      </button>
      {message && <div className="mt-2 max-w-xs text-xs font-semibold text-[#7c626a]">{message}</div>}
    </div>
  )
}

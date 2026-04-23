'use client'
import { useEffect, useState } from 'react'

export function StorageWarning() {
  const [blocked, setBlocked] = useState(false)
  useEffect(() => {
    try {
      localStorage.setItem('__matchu_probe__', '1')
      localStorage.removeItem('__matchu_probe__')
    } catch {
      setBlocked(true)
    }
  }, [])
  if (!blocked) return null
  return (
    <div className="fixed top-0 inset-x-0 z-[100] text-center text-[12px] py-1.5 bg-[var(--pink)] text-white">
      浏览器禁用了本地存储，测评和聊天历史将无法保留
    </div>
  )
}

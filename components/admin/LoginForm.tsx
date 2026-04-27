'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    setLoading(false)
    if (!res.ok) {
      setError('密码不正确')
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/12 bg-white/10 p-6 shadow-2xl backdrop-blur">
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-pink-200/70">MatchU Admin</p>
        <h1 className="font-serif text-3xl font-black text-white">运营后台登录</h1>
      </div>
      <label className="mb-2 block text-sm font-semibold text-white/75">后台密码</label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mb-4 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-pink-300"
        placeholder="输入 ADMIN_PASSWORD"
      />
      {error && <p className="mb-4 text-sm font-semibold text-rose-200">{error}</p>}
      <button
        disabled={loading || !password}
        className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? '登录中...' : '进入后台'}
      </button>
      <p className="mt-4 text-xs leading-relaxed text-white/45">
        开发环境未配置 ADMIN_PASSWORD 时，默认密码为 matchu-admin。
      </p>
    </form>
  )
}

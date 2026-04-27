'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CommunityPostData, CommunityPostStatus } from '@/lib/backend/user-types'
import { parseJsonResponse } from './form-utils'

export function PostManager() {
  const [posts, setPosts] = useState<CommunityPostData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const hidden = useMemo(() => posts.filter((post) => post.status === 'hidden').length, [posts])

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await parseJsonResponse<{ posts: CommunityPostData[] }>(await fetch('/api/admin/posts'))
      setPosts(data.posts)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  async function setStatus(id: string, status: CommunityPostStatus) {
    await parseJsonResponse(await fetch(`/api/admin/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }))
    await load()
  }

  async function remove(id: string) {
    if (!window.confirm('确定永久删除这条帖子吗？')) return
    await parseJsonResponse(await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' }))
    await load()
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="font-serif text-3xl font-black">社区帖子</h1>
        <p className="text-sm text-[#7c626a]">{posts.length} 条帖子，{hidden} 条已下架</p>
      </div>
      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</div>}
      <div className="grid gap-4">
        {loading ? (
          <div className="rounded-2xl border border-[#dfd1c6] bg-white p-6 text-[#7c626a]">加载中...</div>
        ) : posts.map((post) => (
          <article key={post.id} className="rounded-2xl border border-[#dfd1c6] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={post.avatar || '/icon-192.png'} alt="" className="h-11 w-11 rounded-xl object-cover" />
                <div>
                  <div className="font-bold">{post.name}</div>
                  <div className="text-xs text-[#7c626a]">{post.time} · {post.mood || '无心情标签'}</div>
                </div>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-bold ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : post.status === 'hidden' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>
                {post.status === 'published' ? '已发布' : post.status === 'hidden' ? '已下架' : '已删除'}
              </span>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-[#4d3942]">{post.content}</p>
            {post.images.length > 0 && (
              <div className="mb-4 flex gap-2">
                {post.images.map((image) => (
                  <img key={image} src={image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                ))}
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-[#7c626a]">
              <span>{post.likes} 赞 · {post.comments} 评论</span>
              <div className="flex gap-2">
                <button onClick={() => setStatus(post.id, 'published')} className="rounded-lg border px-2 py-1 font-semibold">恢复</button>
                <button onClick={() => setStatus(post.id, 'hidden')} className="rounded-lg border px-2 py-1 font-semibold">下架</button>
                <button onClick={() => remove(post.id)} className="rounded-lg border border-rose-200 px-2 py-1 font-semibold text-rose-700">删除</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

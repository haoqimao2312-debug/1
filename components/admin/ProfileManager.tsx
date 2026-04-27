'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import type { ProfileCardData } from '@/lib/backend/types'
import { listToText, parseJsonResponse, tagsToText, textToList, textToTags } from './form-utils'

type ProfileForm = Omit<ProfileCardData, 'tags' | 'compatibleTags'> & {
  tagsText: string
  compatibleTagsText: string
}

const emptyForm: ProfileForm = {
  id: '',
  displayName: '',
  age: 24,
  location: '',
  distance: '',
  mbti: '',
  profession: '',
  bio: '',
  tagsText: '',
  compatibility: 75,
  avatarGradientFrom: '#ff8fbc',
  avatarGradientTo: '#a970ff',
  faceTone: '#ffe0d0',
  hairColor: '#3a1f1a',
  photo: '',
  chatPreview: '',
  chatTime: '刚刚',
  unread: 0,
  online: false,
  verified: false,
  compatibleTagsText: '',
  status: 'draft',
  sortOrder: 0,
}

export function ProfileManager() {
  const [profiles, setProfiles] = useState<ProfileCardData[]>([])
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const published = useMemo(() => profiles.filter((item) => item.status === 'published').length, [profiles])

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await parseJsonResponse<{ profiles: ProfileCardData[] }>(await fetch('/api/admin/profiles'))
      setProfiles(data.profiles)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  function edit(profile: ProfileCardData) {
    setEditingId(profile.id)
    setForm({
      ...emptyForm,
      ...profile,
      photo: profile.photo ?? '',
      unread: profile.unread ?? 0,
      status: profile.status ?? 'draft',
      sortOrder: profile.sortOrder ?? 0,
      tagsText: tagsToText(profile.tags),
      compatibleTagsText: listToText(profile.compatibleTags),
    })
  }

  function reset() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const body = new FormData()
    body.append('file', file)
    try {
      const data = await parseJsonResponse<{ url: string }>(
        await fetch('/api/admin/uploads/profile-photo', { method: 'POST', body })
      )
      setForm((current) => ({ ...current, photo: data.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    }
  }

  function payload(next = form) {
    return {
      ...next,
      age: Number(next.age),
      compatibility: Number(next.compatibility),
      unread: Number(next.unread ?? 0),
      sortOrder: Number(next.sortOrder ?? 0),
      tags: textToTags(next.tagsText),
      compatibleTags: textToList(next.compatibleTagsText),
    }
  }

  async function save(event?: FormEvent) {
    event?.preventDefault()
    setSaving(true)
    setError('')
    try {
      const endpoint = editingId ? `/api/admin/profiles/${editingId}` : '/api/admin/profiles'
      const method = editingId ? 'PATCH' : 'POST'
      await parseJsonResponse(await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload()),
      }))
      reset()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!window.confirm('确定删除这条资料吗？')) return
    await parseJsonResponse(await fetch(`/api/admin/profiles/${id}`, { method: 'DELETE' }))
    if (editingId === id) reset()
    await load()
  }

  async function toggle(profile: ProfileCardData) {
    const nextStatus = profile.status === 'published' ? 'draft' : 'published'
    await parseJsonResponse(await fetch(`/api/admin/profiles/${profile.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profile, status: nextStatus }),
    }))
    await load()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="font-serif text-3xl font-black">匹配资料</h1>
            <p className="text-sm text-[#7c626a]">{profiles.length} 条资料，{published} 条已发布</p>
          </div>
          <button onClick={reset} className="rounded-xl bg-[#281b22] px-4 py-2 text-sm font-black text-white">
            新建资料
          </button>
        </div>
        {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</div>}
        <div className="overflow-hidden rounded-2xl border border-[#dfd1c6] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f0e6df] text-xs uppercase tracking-wide text-[#7c626a]">
              <tr>
                <th className="px-4 py-3">资料</th>
                <th className="px-4 py-3">排序</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6 text-[#7c626a]" colSpan={4}>加载中...</td></tr>
              ) : profiles.map((profile) => (
                <tr key={profile.id} className="border-t border-[#eee2da]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={profile.photo || '/icon-192.png'} alt="" className="h-11 w-11 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold">{profile.displayName} · {profile.age}</div>
                        <div className="text-xs text-[#7c626a]">{profile.location} · {profile.profession}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{profile.sortOrder ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${profile.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                      {profile.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => edit(profile)} className="rounded-lg border px-2 py-1 font-semibold">编辑</button>
                      <button onClick={() => toggle(profile)} className="rounded-lg border px-2 py-1 font-semibold">
                        {profile.status === 'published' ? '下架' : '发布'}
                      </button>
                      <button onClick={() => remove(profile.id)} className="rounded-lg border border-rose-200 px-2 py-1 font-semibold text-rose-700">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <form onSubmit={save} className="rounded-2xl border border-[#dfd1c6] bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-serif text-2xl font-black">{editingId ? '编辑资料' : '新建资料'}</h2>
        <div className="grid gap-3">
          <Field label="ID"><input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editingId} className="admin-input" /></Field>
          <Field label="昵称"><input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="admin-input" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="年龄"><input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} className="admin-input" /></Field>
            <Field label="契合度"><input type="number" value={form.compatibility} onChange={(e) => setForm({ ...form, compatibility: Number(e.target.value) })} className="admin-input" /></Field>
          </div>
          <Field label="地区"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="admin-input" /></Field>
          <Field label="距离"><input value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} className="admin-input" /></Field>
          <Field label="职业"><input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} className="admin-input" /></Field>
          <Field label="MBTI"><input value={form.mbti} onChange={(e) => setForm({ ...form, mbti: e.target.value })} className="admin-input" /></Field>
          <Field label="Bio"><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="admin-input min-h-20" /></Field>
          <Field label="标签（每行：emoji|文字）"><textarea value={form.tagsText} onChange={(e) => setForm({ ...form, tagsText: e.target.value })} className="admin-input min-h-24" /></Field>
          <Field label="兼容标签（逗号或换行）"><textarea value={form.compatibleTagsText} onChange={(e) => setForm({ ...form, compatibleTagsText: e.target.value })} className="admin-input min-h-20" /></Field>
          <Field label="照片 URL"><input value={form.photo ?? ''} onChange={(e) => setForm({ ...form, photo: e.target.value })} className="admin-input" /></Field>
          <input type="file" accept="image/*" onChange={upload} className="text-sm" />
          <Field label="消息预览"><input value={form.chatPreview} onChange={(e) => setForm({ ...form, chatPreview: e.target.value })} className="admin-input" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="消息时间"><input value={form.chatTime} onChange={(e) => setForm({ ...form, chatTime: e.target.value })} className="admin-input" /></Field>
            <Field label="排序"><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="admin-input" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!!form.online} onChange={(e) => setForm({ ...form, online: e.target.checked })} /> 在线</label>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!!form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} /> 认证</label>
          </div>
          <Field label="状态">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProfileCardData['status'] })} className="admin-input">
              <option value="draft">草稿</option>
              <option value="published">发布</option>
            </select>
          </Field>
          <button disabled={saving || !form.displayName} className="rounded-xl bg-[#281b22] px-4 py-3 text-sm font-black text-white disabled:opacity-50">
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-[#5c4650]">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  )
}

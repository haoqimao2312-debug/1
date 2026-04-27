'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { ChatPersonaData, ProfileCardData } from '@/lib/backend/types'
import { listToText, parseJsonResponse, textToList } from './form-utils'

type PersonaForm = Omit<ChatPersonaData, 'openingMessages' | 'fallbackReplies' | 'compatibleTags' | 'scripts'> & {
  openingMessagesText: string
  fallbackRepliesText: string
  compatibleTagsText: string
}

const emptyForm: PersonaForm = {
  id: '',
  profileId: '',
  displayName: '',
  age: 24,
  subtitle: '',
  avatar: '💬',
  bio: '',
  photo: '',
  openingMessagesText: '',
  fallbackRepliesText: '',
  compatibleTagsText: '',
  status: 'draft',
  sortOrder: 0,
}

export function PersonaManager() {
  const [profiles, setProfiles] = useState<ProfileCardData[]>([])
  const [personas, setPersonas] = useState<ChatPersonaData[]>([])
  const [form, setForm] = useState<PersonaForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const published = useMemo(() => personas.filter((item) => item.status === 'published').length, [personas])

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [profileData, personaData] = await Promise.all([
        parseJsonResponse<{ profiles: ProfileCardData[] }>(await fetch('/api/admin/profiles')),
        parseJsonResponse<{ personas: ChatPersonaData[] }>(await fetch('/api/admin/personas')),
      ])
      setProfiles(profileData.profiles)
      setPersonas(personaData.personas)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setEditingId(null)
    setForm(emptyForm)
  }

  function edit(persona: ChatPersonaData) {
    setEditingId(persona.id)
    setForm({
      ...emptyForm,
      ...persona,
      profileId: persona.profileId ?? '',
      age: persona.age ?? 24,
      photo: persona.photo ?? '',
      openingMessagesText: listToText(persona.openingMessages),
      fallbackRepliesText: listToText(persona.fallbackReplies),
      compatibleTagsText: listToText(persona.compatibleTags),
    })
  }

  function applyProfile(profileId: string) {
    const profile = profiles.find((item) => item.id === profileId)
    setForm((current) => ({
      ...current,
      profileId,
      displayName: current.displayName || profile?.displayName || '',
      age: current.age || profile?.age || 24,
      photo: current.photo || profile?.photo || '',
      compatibleTagsText: current.compatibleTagsText || listToText(profile?.compatibleTags ?? profile?.tags.map((tag) => tag.label)),
    }))
  }

  function payload() {
    return {
      ...form,
      age: form.age === null || form.age === undefined ? null : Number(form.age),
      sortOrder: Number(form.sortOrder ?? 0),
      openingMessages: textToList(form.openingMessagesText),
      fallbackReplies: textToList(form.fallbackRepliesText),
      compatibleTags: textToList(form.compatibleTagsText),
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const endpoint = editingId ? `/api/admin/personas/${editingId}` : '/api/admin/personas'
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
    if (!window.confirm('确定删除这个人设吗？相关脚本也会删除。')) return
    await parseJsonResponse(await fetch(`/api/admin/personas/${id}`, { method: 'DELETE' }))
    if (editingId === id) reset()
    await load()
  }

  async function toggle(persona: ChatPersonaData) {
    const nextStatus = persona.status === 'published' ? 'draft' : 'published'
    await parseJsonResponse(await fetch(`/api/admin/personas/${persona.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...persona, status: nextStatus }),
    }))
    await load()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="font-serif text-3xl font-black">聊天人设</h1>
            <p className="text-sm text-[#7c626a]">{personas.length} 个人设，{published} 个已发布</p>
          </div>
          <button onClick={reset} className="rounded-xl bg-[#281b22] px-4 py-2 text-sm font-black text-white">
            新建人设
          </button>
        </div>
        {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</div>}
        <div className="overflow-hidden rounded-2xl border border-[#dfd1c6] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f0e6df] text-xs uppercase tracking-wide text-[#7c626a]">
              <tr>
                <th className="px-4 py-3">人设</th>
                <th className="px-4 py-3">关联资料</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6 text-[#7c626a]" colSpan={4}>加载中...</td></tr>
              ) : personas.map((persona) => (
                <tr key={persona.id} className="border-t border-[#eee2da]">
                  <td className="px-4 py-3">
                    <div className="font-bold">{persona.avatar} {persona.displayName}</div>
                    <div className="text-xs text-[#7c626a]">{persona.subtitle || persona.id}</div>
                  </td>
                  <td className="px-4 py-3">{persona.profileId || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${persona.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                      {persona.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => edit(persona)} className="rounded-lg border px-2 py-1 font-semibold">编辑</button>
                      <button onClick={() => toggle(persona)} className="rounded-lg border px-2 py-1 font-semibold">
                        {persona.status === 'published' ? '下架' : '发布'}
                      </button>
                      <button onClick={() => remove(persona.id)} className="rounded-lg border border-rose-200 px-2 py-1 font-semibold text-rose-700">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <form onSubmit={save} className="rounded-2xl border border-[#dfd1c6] bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-serif text-2xl font-black">{editingId ? '编辑人设' : '新建人设'}</h2>
        <div className="grid gap-3">
          <Field label="ID"><input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editingId} className="admin-input" /></Field>
          <Field label="关联资料">
            <select value={form.profileId ?? ''} onChange={(e) => applyProfile(e.target.value)} className="admin-input">
              <option value="">不关联</option>
              {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.displayName} ({profile.id})</option>)}
            </select>
          </Field>
          <Field label="昵称"><input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="admin-input" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="年龄"><input type="number" value={form.age ?? ''} onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : null })} className="admin-input" /></Field>
            <Field label="排序"><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="admin-input" /></Field>
          </div>
          <Field label="头像符号"><input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="admin-input" /></Field>
          <Field label="副标题"><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="admin-input" /></Field>
          <Field label="Bio"><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="admin-input min-h-20" /></Field>
          <Field label="照片 URL"><input value={form.photo ?? ''} onChange={(e) => setForm({ ...form, photo: e.target.value })} className="admin-input" /></Field>
          <Field label="开场白（每行一条）"><textarea value={form.openingMessagesText} onChange={(e) => setForm({ ...form, openingMessagesText: e.target.value })} className="admin-input min-h-24" /></Field>
          <Field label="兜底回复（每行一条）"><textarea value={form.fallbackRepliesText} onChange={(e) => setForm({ ...form, fallbackRepliesText: e.target.value })} className="admin-input min-h-24" /></Field>
          <Field label="兼容标签（逗号或换行）"><textarea value={form.compatibleTagsText} onChange={(e) => setForm({ ...form, compatibleTagsText: e.target.value })} className="admin-input min-h-20" /></Field>
          <Field label="状态">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ChatPersonaData['status'] })} className="admin-input">
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

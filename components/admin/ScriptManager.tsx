'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { ChatPersonaData, ChatScriptRule } from '@/lib/backend/types'
import { listToText, parseJsonResponse, textToList } from './form-utils'

type ScriptForm = Omit<ChatScriptRule, 'keywords' | 'emotions' | 'replies' | 'turnRange'> & {
  keywordsText: string
  emotionsText: string
  repliesText: string
  turnStart: string
  turnEnd: string
}

const emptyForm: ScriptForm = {
  id: '',
  personaId: '',
  keywordsText: '',
  emotionsText: '',
  repliesText: '',
  turnStart: '',
  turnEnd: '',
  once: false,
  enabled: true,
  sortOrder: 0,
}

export function ScriptManager() {
  const [personas, setPersonas] = useState<ChatPersonaData[]>([])
  const [scripts, setScripts] = useState<ChatScriptRule[]>([])
  const [form, setForm] = useState<ScriptForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [personaFilter, setPersonaFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const enabledCount = useMemo(() => scripts.filter((item) => item.enabled).length, [scripts])

  useEffect(() => {
    void load()
  }, [personaFilter])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const personaPromise = parseJsonResponse<{ personas: ChatPersonaData[] }>(await fetch('/api/admin/personas'))
      const scriptUrl = personaFilter ? `/api/admin/scripts?personaId=${encodeURIComponent(personaFilter)}` : '/api/admin/scripts'
      const scriptPromise = parseJsonResponse<{ scripts: ChatScriptRule[] }>(await fetch(scriptUrl))
      const [personaData, scriptData] = await Promise.all([personaPromise, scriptPromise])
      setPersonas(personaData.personas)
      setScripts(scriptData.scripts)
      if (!form.personaId && personaData.personas[0]) {
        setForm((current) => ({ ...current, personaId: personaData.personas[0].id }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setEditingId(null)
    setForm({ ...emptyForm, personaId: personaFilter || personas[0]?.id || '' })
  }

  function edit(script: ChatScriptRule) {
    setEditingId(script.id)
    setForm({
      id: script.id,
      personaId: script.personaId,
      keywordsText: listToText(script.keywords),
      emotionsText: listToText(script.emotions),
      repliesText: listToText(script.replies),
      turnStart: script.turnRange?.[0] == null ? '' : String(script.turnRange[0]),
      turnEnd: script.turnRange?.[1] == null ? '' : String(script.turnRange[1]),
      once: script.once,
      enabled: script.enabled,
      sortOrder: script.sortOrder,
    })
  }

  function payload() {
    const turnRange = form.turnStart !== '' && form.turnEnd !== ''
      ? [Number(form.turnStart), Number(form.turnEnd)]
      : null
    return {
      id: form.id,
      personaId: form.personaId,
      keywords: textToList(form.keywordsText),
      emotions: textToList(form.emotionsText),
      replies: textToList(form.repliesText),
      turnRange,
      once: form.once,
      enabled: form.enabled,
      sortOrder: Number(form.sortOrder ?? 0),
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const method = editingId ? 'PATCH' : 'POST'
      await parseJsonResponse(await fetch('/api/admin/scripts', {
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
    if (!window.confirm('确定删除这条脚本吗？')) return
    await parseJsonResponse(await fetch(`/api/admin/scripts?id=${encodeURIComponent(id)}`, { method: 'DELETE' }))
    if (editingId === id) reset()
    await load()
  }

  async function toggle(script: ChatScriptRule) {
    await parseJsonResponse(await fetch('/api/admin/scripts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...script, enabled: !script.enabled }),
    }))
    await load()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="font-serif text-3xl font-black">聊天脚本</h1>
            <p className="text-sm text-[#7c626a]">{scripts.length} 条脚本，{enabledCount} 条启用</p>
          </div>
          <button onClick={reset} className="rounded-xl bg-[#281b22] px-4 py-2 text-sm font-black text-white">
            新建脚本
          </button>
        </div>
        <div className="mb-4 max-w-xs">
          <select value={personaFilter} onChange={(e) => setPersonaFilter(e.target.value)} className="admin-input bg-white">
            <option value="">全部人设</option>
            {personas.map((persona) => <option key={persona.id} value={persona.id}>{persona.displayName}</option>)}
          </select>
        </div>
        {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</div>}
        <div className="overflow-hidden rounded-2xl border border-[#dfd1c6] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f0e6df] text-xs uppercase tracking-wide text-[#7c626a]">
              <tr>
                <th className="px-4 py-3">触发</th>
                <th className="px-4 py-3">回复</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6 text-[#7c626a]" colSpan={4}>加载中...</td></tr>
              ) : scripts.map((script) => (
                <tr key={script.id} className="border-t border-[#eee2da] align-top">
                  <td className="px-4 py-3">
                    <div className="font-bold">{personas.find((p) => p.id === script.personaId)?.displayName ?? script.personaId}</div>
                    <div className="mt-1 text-xs text-[#7c626a]">关键词：{script.keywords.join('、') || '-'}</div>
                    <div className="text-xs text-[#7c626a]">情绪：{script.emotions.join('、') || '-'}</div>
                  </td>
                  <td className="max-w-md px-4 py-3 text-xs leading-relaxed text-[#5c4650]">
                    {script.replies.slice(0, 3).join(' / ')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${script.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                      {script.enabled ? '启用' : '停用'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => edit(script)} className="rounded-lg border px-2 py-1 font-semibold">编辑</button>
                      <button onClick={() => toggle(script)} className="rounded-lg border px-2 py-1 font-semibold">{script.enabled ? '停用' : '启用'}</button>
                      <button onClick={() => remove(script.id)} className="rounded-lg border border-rose-200 px-2 py-1 font-semibold text-rose-700">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <form onSubmit={save} className="rounded-2xl border border-[#dfd1c6] bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-serif text-2xl font-black">{editingId ? '编辑脚本' : '新建脚本'}</h2>
        <div className="grid gap-3">
          <Field label="ID"><input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editingId} className="admin-input" /></Field>
          <Field label="人设">
            <select value={form.personaId} onChange={(e) => setForm({ ...form, personaId: e.target.value })} className="admin-input">
              <option value="">请选择人设</option>
              {personas.map((persona) => <option key={persona.id} value={persona.id}>{persona.displayName} ({persona.id})</option>)}
            </select>
          </Field>
          <Field label="关键词（逗号或换行）"><textarea value={form.keywordsText} onChange={(e) => setForm({ ...form, keywordsText: e.target.value })} className="admin-input min-h-20" /></Field>
          <Field label="情绪（tired,happy,sad,curious,greeting）"><input value={form.emotionsText} onChange={(e) => setForm({ ...form, emotionsText: e.target.value })} className="admin-input" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="轮次开始"><input type="number" value={form.turnStart} onChange={(e) => setForm({ ...form, turnStart: e.target.value })} className="admin-input" /></Field>
            <Field label="轮次结束"><input type="number" value={form.turnEnd} onChange={(e) => setForm({ ...form, turnEnd: e.target.value })} className="admin-input" /></Field>
          </div>
          <Field label="回复（每行一条）"><textarea value={form.repliesText} onChange={(e) => setForm({ ...form, repliesText: e.target.value })} className="admin-input min-h-28" /></Field>
          <Field label="排序"><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="admin-input" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.once} onChange={(e) => setForm({ ...form, once: e.target.checked })} /> 只触发一次</label>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} /> 启用</label>
          </div>
          <button disabled={saving || !form.personaId || !form.repliesText.trim()} className="rounded-xl bg-[#281b22] px-4 py-3 text-sm font-black text-white disabled:opacity-50">
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

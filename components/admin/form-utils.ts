import type { ProfileTag } from '@/lib/backend/types'

export function listToText(items: string[] | undefined | null) {
  return (items ?? []).join('\n')
}

export function textToList(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function tagsToText(tags: ProfileTag[] | undefined | null) {
  return (tags ?? []).map((tag) => `${tag.emoji}|${tag.label}`).join('\n')
}

export function textToTags(value: string): ProfileTag[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [emoji, ...labelParts] = line.split('|')
      const label = labelParts.join('|').trim()
      return label ? { emoji: emoji.trim(), label } : { emoji: '', label: emoji.trim() }
    })
    .filter((tag) => tag.label)
}

export async function parseJsonResponse<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed: ${res.status}`)
  }
  return data
}

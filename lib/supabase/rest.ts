const REST_PREFIX = '/rest/v1'

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }

  return {
    url: url.replace(/\/$/, ''),
    serviceRoleKey,
  }
}

type SupabaseFetchOptions = RequestInit & {
  prefer?: string
}

export async function supabaseFetch<T>(path: string, options: SupabaseFetchOptions = {}): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseConfig()
  const headers = new Headers(options.headers)
  headers.set('apikey', serviceRoleKey)
  headers.set('Authorization', `Bearer ${serviceRoleKey}`)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.prefer) {
    headers.set('Prefer', options.prefer)
  }

  const res = await fetch(`${url}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase request failed ${res.status}: ${text}`)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export function restPath(table: string, query = '') {
  return `${REST_PREFIX}/${table}${query ? `?${query}` : ''}`
}

export function eqFilter(column: string, value: string) {
  return `${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`
}

export async function uploadToPublicBucket(opts: {
  bucket: string
  path: string
  bytes: ArrayBuffer
  contentType: string
}) {
  const { url, serviceRoleKey } = getSupabaseConfig()
  const safePath = opts.path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  const res = await fetch(`${url}/storage/v1/object/${opts.bucket}/${safePath}`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': opts.contentType,
      'x-upsert': 'true',
    },
    body: opts.bytes,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase storage upload failed ${res.status}: ${text}`)
  }

  return `${url}/storage/v1/object/public/${opts.bucket}/${safePath}`
}

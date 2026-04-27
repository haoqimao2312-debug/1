import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { isSupabaseConfigured, uploadToPublicBucket } from '@/lib/supabase/rest'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const SUPABASE_BUCKETS = {
  avatars: 'user-avatars',
  posts: 'post-images',
} as const

export function getStorageRoot() {
  return process.env.SERVER_STORAGE_ROOT || 'G:\\xinyu'
}

export function getStoragePublicUrl(relativePath: string) {
  return `/api/uploads/${relativePath.split(path.sep).join('/')}`
}

export async function saveUploadedImage(file: File, folder: 'avatars' | 'posts') {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Only JPEG, PNG, WEBP, and GIF images are allowed.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be smaller than 5MB.')
  }

  const ext = extensionForType(file.type)
  const filename = `${Date.now()}-${randomUUID()}.${ext}`
  const relativePath = `${folder}/${filename}`

  if (shouldUseSupabaseStorage()) {
    const bucket = SUPABASE_BUCKETS[folder]
    const url = await uploadToPublicBucket({
      bucket,
      path: filename,
      bytes: await file.arrayBuffer(),
      contentType: file.type,
    })

    return {
      relativePath: `${bucket}/${filename}`,
      url,
      provider: 'supabase' as const,
    }
  }

  const absoluteDir = path.join(/*turbopackIgnore: true*/ getStorageRoot(), folder)
  const absolutePath = path.join(absoluteDir, filename)

  await mkdir(absoluteDir, { recursive: true })
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()))

  return {
    relativePath,
    url: getStoragePublicUrl(relativePath),
    provider: 'local' as const,
  }
}

function shouldUseSupabaseStorage() {
  const driver = process.env.SERVER_STORAGE_DRIVER
  if (driver === 'local') return false
  if (driver === 'supabase') return true
  return isSupabaseConfigured()
}

function extensionForType(type: string) {
  switch (type) {
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/gif':
      return 'gif'
    default:
      return 'jpg'
  }
}

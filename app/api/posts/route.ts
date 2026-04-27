import { NextResponse } from 'next/server'
import { createPost, listPublishedPosts } from '@/lib/backend/user-repository'
import { saveUploadedImage } from '@/lib/storage/local'
import { getUserFromRequest, requireUser } from '@/lib/supabase/auth-server'
import { isSupabaseConfigured } from '@/lib/supabase/rest'
import { routeError } from '@/lib/admin/api'

export async function GET(request: Request) {
  const user = isSupabaseConfigured() ? await getUserFromRequest(request).catch(() => null) : null
  const result = await listPublishedPosts(user?.id)
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }
  const { user, response } = await requireUser(request)
  if (response) return response

  try {
    const form = await request.formData()
    const content = String(form.get('content') ?? '').trim()
    const mood = String(form.get('mood') ?? '').trim()
    if (!content) return NextResponse.json({ error: 'Content is required.' }, { status: 400 })

    const files = form.getAll('images').filter((item): item is File => item instanceof File).slice(0, 3)
    const uploads = []
    for (const file of files) {
      uploads.push(await saveUploadedImage(file, 'posts'))
    }

    const post = await createPost(user, {
      mood,
      content,
      imageUrls: uploads.map((upload) => upload.url),
    })
    return NextResponse.json({ post, uploads })
  } catch (error) {
    return routeError(error)
  }
}

import { NextResponse } from 'next/server'
import { routeError } from '@/lib/admin/api'
import { ensureUserProfile, setUserAvatar } from '@/lib/backend/user-repository'
import { saveUploadedImage } from '@/lib/storage/local'
import { requireUser } from '@/lib/supabase/auth-server'
import { isSupabaseConfigured } from '@/lib/supabase/rest'

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }
  const { user, response } = await requireUser(request)
  if (response) return response

  try {
    await ensureUserProfile(user)
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'A file field is required.' }, { status: 400 })
    }
    const upload = await saveUploadedImage(file, 'avatars')
    const profile = await setUserAvatar(user, upload.url)
    return NextResponse.json({ profile, upload })
  } catch (error) {
    return routeError(error)
  }
}

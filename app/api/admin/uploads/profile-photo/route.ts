import { NextResponse } from 'next/server'
import { requireAdmin, requireSupabase, routeError } from '@/lib/admin/api'
import { uploadToPublicBucket } from '@/lib/supabase/rest'

export async function POST(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  const missingSupabase = requireSupabase()
  if (missingSupabase) return missingSupabase

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'A file field is required' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ext.replace(/[^a-z0-9]/g, '') || 'jpg'
    const path = `${Date.now()}-${crypto.randomUUID()}.${safeExt}`
    const url = await uploadToPublicBucket({
      bucket: 'profile-photos',
      path,
      bytes: await file.arrayBuffer(),
      contentType: file.type || 'application/octet-stream',
    })

    return NextResponse.json({ url })
  } catch (error) {
    return routeError(error)
  }
}

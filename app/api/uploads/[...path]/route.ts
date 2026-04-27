import { readFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { getStorageRoot } from '@/lib/storage/local'

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await context.params
  const relative = parts.join(path.sep)
  const root = path.resolve(/*turbopackIgnore: true*/ getStorageRoot())
  const absolute = path.resolve(root, relative)

  if (!absolute.startsWith(root)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  try {
    const bytes = await readFile(absolute)
    return new NextResponse(bytes, {
      headers: {
        'Content-Type': contentTypeFor(absolute),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}

function contentTypeFor(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  return 'image/jpeg'
}

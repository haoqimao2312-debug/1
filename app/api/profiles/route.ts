import { NextResponse } from 'next/server'
import { listPublicProfiles } from '@/lib/backend/repository'

export async function GET() {
  const result = await listPublicProfiles()
  return NextResponse.json(result)
}

import { NextResponse } from 'next/server'
import { getPublicPersona } from '@/lib/backend/repository'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const result = await getPublicPersona(id)

  if (!result.persona) {
    return NextResponse.json({ error: 'Persona not found' }, { status: 404 })
  }

  return NextResponse.json(result)
}

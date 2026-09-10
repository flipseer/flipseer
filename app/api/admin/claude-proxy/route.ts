// app/api/admin/claude-proxy/route.ts
// Server-side proxy for Claude API — keeps API key server-side only
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  // Simple admin check
  const auth = request.headers.get('x-admin-secret')
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const apiKey = process.env.ANTHROPIC_API_KEY || ''
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set', content: [] }, { status: 500 })
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: body.system,
      messages: body.messages,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('Anthropic error:', data)
    return NextResponse.json({ error: data.error?.message || 'Anthropic API error', content: [], status: res.status }, { status: res.status })
  }
  return NextResponse.json(data)
}

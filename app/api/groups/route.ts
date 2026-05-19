import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — search groups by name
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ groups: [] })
  }

  const { data, error } = await supabase
    .from('groups')
    .select(`
      id, name, description, invite_code, created_at,
      group_members(count)
    `)
    .ilike('name', `%${query}%`)
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ groups: data })
}

// POST — create group
export async function POST(request: NextRequest) {
  const { name, description, creator_id } = await request.json()

  if (!name || !creator_id) {
    return NextResponse.json({ error: 'Name and creator_id required' }, { status: 400 })
  }

  // Create group
  const { data: group, error } = await supabase
    .from('groups')
    .insert({ name, description, creator_id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-join creator
  await supabase.from('group_members').insert({
    group_id: group.id,
    user_id: creator_id,
  })

  return NextResponse.json({ group })
}

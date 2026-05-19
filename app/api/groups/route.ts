import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    if (!query) return NextResponse.json({ groups: [] })

    const { data, error } = await supabase
      .from('groups')
      .select('id, name, description, invite_code, created_at')
      .ilike('name', `%${query}%`)
      .limit(10)

    if (error) throw error
    return NextResponse.json({ groups: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { name, description, creator_id } = await request.json()
    if (!name || !creator_id) {
      return NextResponse.json({ error: 'Name and creator_id required' }, { status: 400 })
    }

    const { data: group, error } = await supabase
      .from('groups')
      .insert({ name, description, creator_id })
      .select()
      .single()

    if (error) throw error

    await supabase.from('group_members').insert({
      group_id: group.id,
      user_id: creator_id,
    })

    return NextResponse.json({ group })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

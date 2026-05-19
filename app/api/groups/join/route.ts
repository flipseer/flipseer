import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { invite_code, user_id } = await request.json()
    if (!invite_code || !user_id) {
      return NextResponse.json({ error: 'invite_code and user_id required' }, { status: 400 })
    }

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name')
      .eq('invite_code', invite_code)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
    }

    const { error } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id })

    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 })
    }
    if (error) throw error

    return NextResponse.json({ group })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

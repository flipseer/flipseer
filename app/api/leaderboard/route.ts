import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getCached, TTL } from '@/lib/redis'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get('group_id')
    const cacheKey = groupId
      ? `leaderboard:group:${groupId}`
      : 'leaderboard:global'
    const ttl = TTL.LEADERBOARD

    const data = await getCached(
      cacheKey,
      async () => {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        if (groupId) {
          const { data: members } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', groupId)

          const memberIds = members?.map(m => m.user_id) ?? []

          const { data, error } = await supabase
            .from('profiles')
            .select('id, username, total_points, streak, rank, rank_icon, accuracy_pct, country')
            .in('id', memberIds)
            .order('total_points', { ascending: false })
            .limit(100)

          if (error) throw error
          return data
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, total_points, streak, rank, rank_icon, accuracy_pct, country')
          .order('total_points', { ascending: false })
          .limit(100)

        if (error) throw error
        return data
      },
      ttl
    )

    return NextResponse.json(data, {
      headers: { 'X-Cache': 'HIT' }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

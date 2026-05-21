import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getCached, TTL } from '@/lib/redis'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const data = await getCached(
      'matches:upcoming',
      async () => {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .in('status', ['upcoming', 'locked'])
          .order('kickoff', { ascending: true })

        if (error) throw error
        return data
      },
      TTL.MATCHES
    )

    return NextResponse.json(data, {
      headers: { 'X-Cache': 'HIT' }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

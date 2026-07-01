import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const COUNTRY_NAMES: Record<string, string> = {
  'IN':'India','ID':'Indonesia','NG':'Nigeria','BR':'Brazil','AR':'Argentina',
  'GB':'England','FR':'France','DE':'Germany','ES':'Spain','PT':'Portugal',
  'MX':'Mexico','US':'USA','GH':'Ghana','MA':'Morocco','JP':'Japan',
  'KR':'South Korea','AU':'Australia','PK':'Pakistan','BD':'Bangladesh',
  'SA':'Saudi Arabia','TR':'Turkey','EG':'Egypt','ZA':'South Africa',
  'NO':'Norway','SN':'Senegal',
}

const FLAGS: Record<string, string> = {
  'IN':'🇮🇳','ID':'🇮🇩','NG':'🇳🇬','BR':'🇧🇷','AR':'🇦🇷',
  'GB':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','FR':'🇫🇷','DE':'🇩🇪','ES':'🇪🇸','PT':'🇵🇹',
  'MX':'🇲🇽','US':'🇺🇸','GH':'🇬🇭','MA':'🇲🇦','JP':'🇯🇵',
  'KR':'🇰🇷','AU':'🇦🇺','PK':'🇵🇰','BD':'🇧🇩','SA':'🇸🇦',
  'TR':'🇹🇷','EG':'🇪🇬','ZA':'🇿🇦','NO':'🇳🇴','SN':'🇸🇳',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    // Get all profiles for global + nation rank
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, country, total_points')
      .gt('total_points', 0)

    const sorted = (allProfiles || []).sort((a: any, b: any) => b.total_points - a.total_points)
    const globalRank = sorted.findIndex((p: any) => p.id === profile.id) + 1

    // Nation rank
    const nationProfiles = sorted.filter((p: any) => p.country === profile.country)
    const nationRank = nationProfiles.findIndex((p: any) => p.id === profile.id) + 1

    // Exact score count
    const { count: exactScores } = await supabase
      .from('predictions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .gt('exact_bonus', 0)

    return NextResponse.json({
      username: profile.username,
      country: profile.country || null,
      flag: FLAGS[profile.country] || null,
      nationName: COUNTRY_NAMES[profile.country] || null,
      globalRank,
      nationRank: nationRank > 0 ? nationRank : null,
      totalPoints: profile.total_points || 0,
      accuracyPct: profile.accuracy_pct || 0,
      predictionCount: profile.prediction_count || 0,
      correctCount: profile.correct_count || 0,
      bestStreak: profile.best_streak || 0,
      exactScores: exactScores || 0,
      rank: profile.rank || 'Rookie',
      rankIcon: profile.rank_icon || '🥉',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

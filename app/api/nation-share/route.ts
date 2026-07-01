import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const COUNTRY_NAMES: Record<string, string> = {
  'IN':'India','ID':'Indonesia','NG':'Nigeria','BR':'Brazil','AR':'Argentina',
  'GB':'England','FR':'France','DE':'Germany','ES':'Spain','PT':'Portugal',
  'MX':'Mexico','US':'USA','GH':'Ghana','MA':'Morocco','JP':'Japan',
  'KR':'South Korea','AU':'Australia','PK':'Pakistan','BD':'Bangladesh',
  'SA':'Saudi Arabia','TR':'Turkey','EG':'Egypt','SN':'Senegal',
  'ZA':'South Africa','NO':'Norway','SE':'Sweden',
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
    const code = searchParams.get('code')?.toUpperCase()
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get all profiles to build nation rankings
    const { data: profiles } = await supabase
      .from('profiles')
      .select('country, total_points, prediction_count')
      .gt('total_points', 0)

    const map: Record<string, { points: number; forecasters: number }> = {}
    ;(profiles || []).forEach((p: any) => {
      const c = p.country || 'OTHER'
      if (!map[c]) map[c] = { points: 0, forecasters: 0 }
      map[c].points += p.total_points || 0
      map[c].forecasters += 1
    })

    const ranked = Object.entries(map).sort((a, b) => b[1].points - a[1].points)
    const nationIdx = ranked.findIndex(([c]) => c === code)
    const nationRank = nationIdx + 1
    const nationData = map[code]

    // Find closest rival (nation ranked just above this one)
    const rivalEntry = nationIdx > 0 ? ranked[nationIdx - 1] : null
    const rivalCode = rivalEntry?.[0]
    const rivalPoints = rivalEntry?.[1].points || 0
    const pointsNeeded = rivalPoints - (nationData?.points || 0)

    return NextResponse.json({
      code,
      name: COUNTRY_NAMES[code] || code,
      flag: FLAGS[code] || '🌍',
      rank: nationRank,
      points: nationData?.points || 0,
      forecasters: nationData?.forecasters || 0,
      rival: rivalCode ? {
        code: rivalCode,
        name: COUNTRY_NAMES[rivalCode] || rivalCode,
        flag: FLAGS[rivalCode] || '🌍',
        points: rivalPoints,
        pointsNeeded: Math.max(0, pointsNeeded),
      } : null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

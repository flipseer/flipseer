Same problem as match pages — all data loads client-side, Google sees empty content.

Fix `app/epl/page.tsx` — convert it to a server component that fetches data and passes it to EPLClient. Replace the entire file with this:

```tsx
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import EPLClient from './EPLClient'

export const metadata: Metadata = {
  title: 'Premier League 2026/27 Predictions | Flipseer',
  description: 'Predict every Premier League 2026/27 match. 380 fixtures, 20 clubs. Arsenal, Man City, Liverpool and more. Build your permanent football reputation. Free forever.',
  keywords: 'Premier League predictions 2026, EPL predictions, football prediction app, Arsenal predictions, Man City predictions',
  alternates: { canonical: 'https://flipseer.com/epl' },
  openGraph: {
    title: 'Premier League 2026/27 Predictions | Flipseer',
    description: '380 EPL matches. Predict before kickoff. Build your permanent Football Reputation. Free.',
    url: 'https://flipseer.com/epl',
    images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default async function EPLPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: upcomingMatches } = await supabase
    .from('matches')
    .select('id, home_team, away_team, kickoff, status, round')
    .eq('competition', 'EPL 2026/27')
    .in('status', ['upcoming', 'live'])
    .order('kickoff', { ascending: true })
    .limit(8)

  const { count: completedCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .eq('competition', 'EPL 2026/27')
    .eq('status', 'completed')

  const { count: upcomingCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .eq('competition', 'EPL 2026/27')
    .in('status', ['upcoming', 'live'])

  const matches = upcomingMatches || []

  return (
    <>
      {/* SERVER-RENDERED SEO CONTENT */}
      <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        <h1>Premier League 2026/27 Predictions — Flipseer</h1>
        <p>
          Predict all 380 Premier League 2026/27 matches before kickoff.
          {completedCount ? ` ${completedCount} matches completed so far.` : ''}
          {upcomingCount ? ` ${upcomingCount} upcoming matches to predict.` : ''}
          {' '}Arsenal, Manchester City, Liverpool, Chelsea and all 20 EPL clubs.
          Build your permanent football reputation. Free forever. No betting.
        </p>
        {matches.length > 0 && (
          <ul>
            {matches.map((m: any) => (
              <li key={m.id}>{m.home_team} vs {m.away_team} — {m.round?.replace('Regular Season - ', 'Matchweek ')}</li>
            ))}
          </ul>
        )}
      </div>
      <EPLClient />
    </>
  )
}
```

Push this. Then do the same pattern for `/champions-league`, `/ghana-premier-league`, `/india`, `/indonesia` pages — each one needs server-side data fetch + hidden SEO block.

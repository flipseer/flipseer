import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import GhanaClient from './GhanaClient'

export const metadata: Metadata = {
  title: 'Ghana Football Predictions | GPL 2026/27 | Flipseer',
  description: 'Ghanaian football fans predict Ghana Premier League, EPL and UCL matches on Flipseer. Asante Kotoko, Hearts of Oak, Medeama and all GPL clubs. Represent Ghana in the Nation Battle. Free forever.',
  keywords: 'Ghana football predictions, Ghana Premier League, Asante Kotoko, Hearts of Oak, GPL predictions',
  alternates: { canonical: 'https://flipseer.com/ghana' },
  openGraph: {
    title: 'Ghana Football Predictions | GPL 2026/27 | Flipseer',
    description: 'Predict Ghana PL matches. Represent Ghana in the global Nation Battle. Free forever. No betting.',
    url: 'https://flipseer.com/ghana',
    images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
  },
}

export const dynamic = 'force-dynamic'

export default async function GhanaPage() {
  let upcomingMatches: any[] = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('matches')
      .select('id, home_team, away_team, kickoff, round')
      .eq('competition', 'Ghana PL 2026/27')
      .in('status', ['upcoming', 'live'])
      .order('kickoff', { ascending: true })
      .limit(8)
    upcomingMatches = data || []
  } catch {}

  const clubs = [
    'Asante Kotoko', 'Hearts of Oak', 'Medeama', 'Dreams FC',
    'Bibiani Gold Stars', 'Bechem United', 'Aduana Stars', 'Berekum Chelsea',
    'Samartex', 'Nations FC', 'Young Apostles', 'Vision FC',
    'Karela United', 'Accra Lions', 'Holy Stars', 'Debibi United',
    'Nsoatreman', 'Bofoakwa Tano',
  ]

  return (
    <>
      <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        <h1>Ghana Football Predictions — GPL 2026/27 | Flipseer</h1>
        <p>Predict Ghana Premier League 2026/27 matches before kickoff. Asante Kotoko, Hearts of Oak, Medeama, Dreams FC and all 18 GPL clubs. Represent Ghana in the global Nation Battle. Free forever. No betting.</p>
        {upcomingMatches.length > 0 && (
          <ul>
            {upcomingMatches.map((m: any) => (
              <li key={m.id}>{m.home_team} vs {m.away_team}</li>
            ))}
          </ul>
        )}
        <ul>{clubs.map(c => <li key={c}>{c}</li>)}</ul>
      </div>
      <GhanaClient />
    </>
  )
}

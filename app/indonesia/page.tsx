import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import IndonesiaClient from './IndonesiaClient'

export const metadata: Metadata = {
  title: 'Liga 1 Indonesia 2026/27 Predictions | Flipseer',
  description: 'Prediksi Liga 1 Indonesia 2026/27. Arema, Bali United, Persebaya, Persib dan 14 klub lainnya. Bangun reputasi sepakbolamu selamanya. Gratis.',
  keywords: 'Liga 1 predictions, Liga 1 2026, Indonesia football, Arema, Bali United, Persebaya, prediksi bola',
  alternates: { canonical: 'https://flipseer.com/indonesia' },
  openGraph: {
    title: 'Liga 1 Indonesia 2026/27 | Flipseer',
    description: 'Prediksi setiap pertandingan Liga 1. Bangun reputasi sepakbolamu yang permanen. Gratis selamanya.',
    url: 'https://flipseer.com/indonesia',
    images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
  },
}

export const dynamic = 'force-dynamic'

export default async function IndonesiaPage() {
  let upcomingMatches: any[] = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('matches')
      .select('id, home_team, away_team, kickoff, round')
      .eq('competition', 'Liga 1 2026/27')
      .in('status', ['upcoming', 'live'])
      .order('kickoff', { ascending: true })
      .limit(8)
    upcomingMatches = data || []
  } catch {}

  const clubs = [
    'Arema FC', 'Bali United', 'Persebaya Surabaya', 'Persija Jakarta',
    'PSM Makassar', 'Persib Bandung', 'Bhayangkara FC', 'PSIM Yogyakarta',
    'Persik Kediri', 'Dewa United', 'PSS Sleman', 'Persita Tangerang',
    'Adhyaksa', 'PSBS Biak', 'Madura United', 'Barito Putera',
    'Semen Padang', 'PSIS Semarang',
  ]

  return (
    <>
      <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        <h1>Liga 1 Indonesia 2026/27 Predictions — Flipseer</h1>
        <p>Predict every Liga 1 Indonesia 2026/27 match before kickoff. Arema FC, Bali United, Persebaya Surabaya, Persib Bandung and all 18 Liga 1 clubs. Build your permanent football reputation. Free forever. No betting.</p>
        {upcomingMatches.length > 0 && (
          <ul>
            {upcomingMatches.map((m: any) => (
              <li key={m.id}>{m.home_team} vs {m.away_team}</li>
            ))}
          </ul>
        )}
        <ul>{clubs.map(c => <li key={c}>{c}</li>)}</ul>
      </div>
      <IndonesiaClient />
    </>
  )
}

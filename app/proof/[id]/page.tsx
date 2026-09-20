import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import ProofCardClient from './ProofCardClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

async function getPrediction(id: string) {
  const { data } = await supabase
    .from('predictions')
    .select(`
      id, predicted_home_score, predicted_away_score,
      predicted_outcome, confidence, created_at,
      profiles:user_id (username, total_points, accuracy_pct, rank, country),
      matches:match_id (home_team, away_team, kickoff, competition, actual_home_score, actual_away_score, status)
    `)
    .eq('id', id)
    .single()
  return data
}

function getResult(pred: any) {
  const match = pred.matches
  if (!match || match.status !== 'completed') return 'pending'
  const ah = match.actual_home_score
  const aa = match.actual_away_score
  const ph = pred.predicted_home_score
  const pa = pred.predicted_away_score
  if (ph === ah && pa === aa) return 'exact'
  const actualOutcome = ah > aa ? 'home' : aa > ah ? 'away' : 'draw'
  if (pred.predicted_outcome === actualOutcome) return 'correct'
  return 'wrong'
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const pred = await getPrediction(params.id)
  if (!pred) return { title: 'Prediction | Flipseer' }

  const profile = pred.profiles as any
  const match = pred.matches as any
  const result = getResult(pred)

  const resultLabel = result === 'exact' ? '✓ EXACT SCORE' : result === 'correct' ? '✓ CORRECT' : result === 'wrong' ? '✗ WRONG' : '⏳ PENDING'
  const title = `${profile?.username} predicted ${match?.home_team} vs ${match?.away_team} — ${resultLabel}`
  const desc = `${pred.predicted_home_score}-${pred.predicted_away_score} · ${pred.confidence}% confidence · Locked before kickoff on Flipseer`
  const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://flipseer.com'}/api/og/proof?id=${params.id}`

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://flipseer.com/proof/${params.id}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImage],
    },
  }
}

export default async function ProofPage({ params }: { params: { id: string } }) {
  const pred = await getPrediction(params.id)
  if (!pred) return (
    <main style={{ background: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚽</div>
        <p style={{ color: '#6B7280' }}>Prediction not found</p>
        <a href="/predict" style={{ color: '#8B5CF6', textDecoration: 'none', fontSize: '14px' }}>← Back to predictions</a>
      </div>
    </main>
  )

  const result = getResult(pred)
  return <ProofCardClient prediction={pred} result={result} />
}

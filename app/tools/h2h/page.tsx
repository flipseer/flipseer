// app/tools/h2h/page.tsx
import { createClient } from '@supabase/supabase-js'
import H2HClient from './H2HClient'

export const metadata = {
  title: 'Head to Head Stats | Flipseer',
  description: 'Generate shareable head-to-head comparison cards for Liga 1, ISL, EPL and more. See last 5 results, win rates, and make your prediction on Flipseer.',
}

async function getTeams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Pull distinct teams from matches, with their logos
  const { data } = await supabase
    .from('matches')
    .select('home_team, home_team_logo, competition')
    .not('home_team', 'is', null)
    .order('home_team')

  if (!data) return []

  // Deduplicate by team name, keep logo + competition
  const seen = new Map<string, { name: string; logo: string; competition: string }>()
  for (const row of data) {
    if (!seen.has(row.home_team)) {
      seen.set(row.home_team, {
        name: row.home_team,
        logo: row.home_team_logo || '',
        competition: row.competition || '',
      })
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export default async function H2HPage() {
  const teams = await getTeams()

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#071408', color: '#F0FFF4', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1A4A1A', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="/" style={{ color: '#2E9E5E', textDecoration: 'none', fontWeight: 700, fontSize: '14px', letterSpacing: '2px' }}>
          ⚽ FLIPSEER
        </a>
        <span style={{ color: '#374151' }}>/</span>
        <span style={{ color: '#9CA3AF', fontSize: '14px' }}>H2H Generator</span>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 20px 0' }}>
        <div style={{ fontSize: '11px', color: '#2E9E5E', fontWeight: 700, letterSpacing: '3px', marginBottom: '12px' }}>
          FREE TOOL
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-1px' }}>
          Head-to-Head<br />Card Generator
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px' }}>
          Pick two teams. Get last 5 results, win rates, and a shareable card for WhatsApp, Instagram and X.
        </p>

        <H2HClient teams={teams} />
      </div>
    </main>
  )
}

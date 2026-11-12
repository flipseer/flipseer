import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'UCL 2026/27 Predictions | Champions League | Flipseer',
  description: 'Predict every UEFA Champions League 2026/27 match. Build your permanent Football Reputation. Free forever. No betting.',
  keywords: 'UCL predictions, Champions League 2026 predictions, football prediction UEFA',
  alternates: { canonical: 'https://flipseer.com/ucl' },
  openGraph: {
    title: 'UCL 2026/27 Predictions | Flipseer',
    description: 'Predict every UCL match. Build your permanent Football Reputation.',
    url: 'https://flipseer.com/ucl',
    images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
  },
}

export const dynamic = 'force-dynamic'

async function getMatches() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const [upcoming, recent] = await Promise.all([
      supabase
        .from('matches')
        .select('id, home_team, away_team, kickoff, slug, round')
        .eq('competition', 'UCL 2026/27')
        .in('status', ['upcoming', 'live'])
        .order('kickoff', { ascending: true })
        .limit(10),
      supabase
        .from('matches')
        .select('id, home_team, away_team, kickoff, slug, home_score, away_score, round')
        .eq('competition', 'UCL 2026/27')
        .eq('status', 'completed')
        .not('slug', 'is', null)
        .order('kickoff', { ascending: false })
        .limit(20),
    ])
    return { upcoming: upcoming.data || [], recent: recent.data || [] }
  } catch { return { upcoming: [], recent: [] } }
}

function formatDate(kickoff: string) {
  const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z'
  return new Date(utc).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

const UCL_FACTS = [
  { icon: '🏆', label: 'Competition', value: 'UEFA Champions League' },
  { icon: '📅', label: 'Format', value: 'League Stage + Knockouts' },
  { icon: '⚽', label: 'Fixtures', value: '234 matches' },
  { icon: '🌍', label: 'Nations', value: '15+ countries' },
  { icon: '🏟️', label: 'Final', value: 'May 2027' },
  { icon: '🆓', label: 'Cost', value: 'Free forever' },
]

export default async function UCLPage() {
  const { upcoming, recent } = await getMatches()

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '80px' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #0D1F0F 100%)', padding: '48px 20px 40px', borderBottom: '1px solid #1E1B4B', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid #8B5CF6', borderRadius: '999px', padding: '6px 18px', marginBottom: '24px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>⭐ UCL 2026/27 · LIVE NOW</span>
        </div>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>⭐</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,6vw,48px)', marginBottom: '10px', lineHeight: 1.1 }}>
          Champions League<br /><span style={{ color: '#8B5CF6' }}>2026/27</span>
        </h1>
        <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Europe's greatest club competition. Predict every match — League Stage through the Final. Your record carries over from EPL.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#8B5CF6', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            ⭐ Predict UCL Free →
          </a>
          <a href="/groups" style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #2D1B69', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px' }}>
            🏆 Create a League
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px 0' }}>

        {/* UPCOMING MATCHES */}
        {upcoming.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>UPCOMING UCL FIXTURES</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {upcoming.map((match: any) => (
                <a key={match.id}
                  href={match.slug ? `/matches/${match.slug}` : '/predict'}
                  style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>
                      {match.home_team} vs {match.away_team}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>{formatDate(match.kickoff)} UTC{match.round ? ` · ${match.round}` : ''}</div>
                  </div>
                  <span style={{ backgroundColor: '#8B5CF6', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    Predict →
                  </span>
                </a>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <a href="/predict" style={{ fontSize: '13px', color: '#8B5CF6', fontWeight: 'bold', textDecoration: 'none' }}>View all UCL fixtures →</a>
            </div>
          </div>
        )}

        {/* RECENT RESULTS */}
        {recent.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>RECENT UCL RESULTS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recent.map((match: any) => (
                <a key={match.id}
                  href={`/matches/${match.slug}`}
                  style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>
                      {match.home_team} vs {match.away_team}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>{formatDate(match.kickoff)} UTC</div>
                  </div>
                  {match.home_score !== null && (
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#9CA3AF', minWidth: '40px', textAlign: 'center' }}>
                      {match.home_score}–{match.away_score}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', backgroundColor: '#1A3A1A', color: '#6B7280', padding: '3px 10px', borderRadius: '999px', fontWeight: 600 }}>View →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1A0B2E 0%, #0D2B14 100%)', border: '2px solid #8B5CF6', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', marginBottom: '32px', boxShadow: '0 0 40px rgba(139,92,246,0.15)' }}>
          <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px' }}>ONE PERMANENT RECORD</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,4vw,28px)', marginBottom: '12px' }}>
            EPL → UCL → ISL.<br />
            <span style={{ color: '#8B5CF6' }}>Your reputation never resets.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
            Every correct call in UCL builds on your EPL record. One profile. Every competition. Forever.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: 'white', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 0 24px rgba(139,92,246,0.3)' }}>
            ⭐ Predict UCL Free →
          </a>
          <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '10px' }}>Free forever · No betting · No card required</p>
        </div>

        {/* KEY FACTS */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>COMPETITION FACTS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {UCL_FACTS.map(({ icon, label, value }) => (
              <div key={label} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INTERNAL LINKS */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { href: '/premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
            { href: '/isl', label: '🇮🇳 Indian Super League' },
            { href: '/leaderboard/ghana-pl', label: '🇬🇭 Ghana Premier League' },
            { href: '/nations', label: '🌍 Nation Battle' },
            { href: '/leaderboard', label: '🏆 Leaderboard' },
            { href: '/groups', label: '👥 Private Leagues' },
          ].map(({ href, label }) => (
            <a key={href} href={href} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', color: '#9CA3AF', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}

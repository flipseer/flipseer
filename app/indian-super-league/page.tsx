import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Indian Super League Predictions 2026/27 | ISL Match Predictions | Flipseer',
  description: 'Predict every ISL 2026/27 match before kickoff. Bengaluru, Goa, Mumbai City, Kerala Blasters, ATK Mohun Bagan and more. Build your Indian football reputation. Free forever.',
  keywords: 'ISL predictions, Indian Super League predictions 2026, football prediction India, ISL match predictions',
  alternates: { canonical: 'https://flipseer.com/indian-super-league' },
  openGraph: {
    title: 'Indian Super League Predictions 2026/27 | Flipseer',
    description: 'Predict every ISL match. Build your Indian football reputation. Free forever.',
    url: 'https://flipseer.com/indian-super-league',
  },
}

export const dynamic = 'force-dynamic'

async function getUpcomingMatches() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('matches')
      .select('id, home_team, away_team, kickoff')
      .eq('competition', 'ISL 2026/27')
      .eq('status', 'upcoming')
      .order('kickoff', { ascending: true })
      .limit(10)
    return data || []
  } catch { return [] }
}

function formatDate(kickoff: string) {
  const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z'
  return new Date(utc).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

function slugTeam(name: string) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

export default async function ISLPage() {
  const matches = await getUpcomingMatches()
  const clubs = ['Bengaluru FC','FC Goa','Chennaiyin FC','Kerala Blasters','Mumbai City','ATK Mohun Bagan','NorthEast United','Odisha FC','Churchill Brothers','Inter Kashi','SC Delhi','East Bengal II','Minerva Punjab']

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '48px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🇮🇳</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,5vw,42px)', marginBottom: '10px', fontWeight: 800 }}>
          Indian Super League Predictions 2026/27
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '15px', maxWidth: '520px', margin: '0 auto 8px', lineHeight: 1.7 }}>
          Predict every ISL 2026/27 match before kickoff. Bengaluru, Goa, Mumbai City, Kerala Blasters and more.
          Build your Indian football reputation permanently on Flipseer.
        </p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: '#FF6B35', fontWeight: 'bold' }}>🇮🇳 ISL 2026/27 · Season starts October 10</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#FF6B35', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            🇮🇳 Predict ISL Now →
          </a>
          <a href="/india" style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px' }}>
            🌍 India Nation Page
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px' }}>
        {matches.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>Upcoming ISL Matches</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {matches.map((match: any) => (
                <a key={match.id}
                  href={`/matches/${slugTeam(match.home_team)}-vs-${slugTeam(match.away_team)}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '12px 16px', textDecoration: 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '2px' }}>
                      {match.home_team} vs {match.away_team}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>{formatDate(match.kickoff)} UTC</div>
                  </div>
                  <span style={{ fontSize: '11px', backgroundColor: '#FF6B3520', color: '#FF6B35', padding: '3px 10px', borderRadius: '999px', fontWeight: 700, border: '1px solid #FF6B3540' }}>Predict →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>ISL 2026/27 Clubs</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {clubs.map(club => (
              <span key={club} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', color: '#9CA3AF', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>
                {club}
              </span>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #FF6B3540', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '12px', color: '#FF6B35', fontWeight: 'bold', letterSpacing: '1px', margin: '0 0 8px' }}>🌍 WORLD CUP 2030 — BUILD YOUR RECORD NOW</p>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0, lineHeight: 1.6 }}>
            India is the fastest growing football market. Start predicting ISL now and build 4 years of verified football intelligence before World Cup 2030.
          </p>
        </div>

        <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '14px' }}>More on Flipseer</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
              { href: '/champions-league', label: '⭐ Champions League' },
              { href: '/ghana-premier-league', label: '🇬🇭 Ghana Premier League' },
              { href: '/india', label: '🇮🇳 India Football' },
              { href: '/football-reputation', label: '📊 Football Reputation' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
              { href: '/groups', label: '👥 Private Leagues' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', color: '#9CA3AF', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

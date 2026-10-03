import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Premier League Predictions 2026/27 | EPL Match Predictions | Flipseer',
  description: 'Predict every Premier League 2026/27 match before kickoff. Lock your EPL predictions, build your football reputation and compete in private leagues. Free forever.',
  keywords: 'premier league predictions, EPL predictions 2026, football prediction, premier league match predictions',
  alternates: { canonical: 'https://flipseer.com/premier-league' },
  openGraph: {
    title: 'Premier League Predictions 2026/27 | Flipseer',
    description: 'Predict every EPL match before kickoff. Build your permanent football reputation.',
    url: 'https://flipseer.com/premier-league',
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
      .select('id, home_team, away_team, kickoff, competition')
      .eq('competition', 'EPL 2026/27')
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

export default async function PremierLeaguePage() {
  const matches = await getUpcomingMatches()

  const clubs = [
    'Arsenal','Aston Villa','Bournemouth','Brentford','Brighton','Chelsea',
    'Crystal Palace','Everton','Fulham','Leeds','Leicester','Liverpool',
    'Manchester City','Manchester United','Newcastle','Nottingham Forest',
    'Tottenham','West Ham','Wolves','Sunderland'
  ]

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '48px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,5vw,42px)', marginBottom: '10px', fontWeight: 800 }}>
          Premier League Predictions 2026/27
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '15px', maxWidth: '520px', margin: '0 auto 20px', lineHeight: 1.7 }}>
          Predict every EPL match before kickoff. Your call locks permanently — no edits, no excuses.
          Build your Premier League reputation and compete in private leagues with friends.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#8B5CF6', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            ⚽ Predict EPL Now →
          </a>
          <a href="/groups" style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px' }}>
            🏆 Create a League
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px' }}>

        {/* UPCOMING MATCHES */}
        {matches.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>Upcoming EPL Matches</h2>
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
                  <span style={{ fontSize: '11px', backgroundColor: '#8B5CF620', color: '#8B5CF6', padding: '3px 10px', borderRadius: '999px', fontWeight: 700, border: '1px solid #8B5CF640' }}>Predict →</span>
                </a>
              ))}
            </div>
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <a href="/predict" style={{ fontSize: '13px', color: '#8B5CF6', textDecoration: 'none', fontWeight: 'bold' }}>
                View all EPL matches →
              </a>
            </div>
          </div>
        )}

        {/* HOW IT WORKS */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>How EPL Predictions Work on Flipseer</h2>
          {[
            { n: '1', title: 'Predict the score', desc: 'Pick the match outcome and exact score before kickoff. Choose your confidence level from 50% to 100%.' },
            { n: '2', title: 'Prediction locks at kickoff', desc: 'Once the match starts your prediction is locked permanently. No edits, no deletions. Your honest call, forever.' },
            { n: '3', title: 'Earn REP points', desc: 'Correct predictions earn REP points that build your Football Reputation score across the whole season.' },
            { n: '4', title: 'Compete privately', desc: 'Create a private league for your WhatsApp group. Everyone predicts the same matches — leaderboard updates after every result.' },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: '#4C1D95', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#C4B5FD', flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '3px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* EPL CLUBS */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>2026/27 Premier League Clubs</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {clubs.map(club => (
              <span key={club} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', color: '#9CA3AF', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>
                {club}
              </span>
            ))}
          </div>
        </div>

        {/* INTERNAL LINKS */}
        <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '14px' }}>More on Flipseer</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/champions-league', label: '⭐ Champions League' },
              { href: '/indian-super-league', label: '🇮🇳 Indian Super League' },
              { href: '/ghana-premier-league', label: '🇬🇭 Ghana Premier League' },
              { href: '/football-reputation', label: '📊 Football Reputation' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
              { href: '/groups', label: '👥 Private Leagues' },
              { href: '/how-to-predict-football', label: 'How to Predict Football' },
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

import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Champions League Predictions 2026/27 | UCL Match Predictions | Flipseer',
  description: 'Predict every Champions League 2026/27 match before kickoff. UCL predictions for Arsenal, Barcelona, Bayern, Real Madrid and more. Free forever. No betting.',
  keywords: 'champions league predictions, UCL predictions 2026, football prediction, champions league match predictions',
  alternates: { canonical: 'https://flipseer.com/champions-league' },
  openGraph: {
    title: 'Champions League Predictions 2026/27 | Flipseer',
    description: 'Predict every UCL match before kickoff. Build your Champions League reputation.',
    url: 'https://flipseer.com/champions-league',
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
      .eq('competition', 'UCL 2026/27')
      .eq('status', 'upcoming')
      .gte('kickoff', '2026-10-13')
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

export default async function ChampionsLeaguePage() {
  const matches = await getUpcomingMatches()

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '48px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,5vw,42px)', marginBottom: '10px', fontWeight: 800 }}>
          Champions League Predictions 2026/27
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '15px', maxWidth: '520px', margin: '0 auto 8px', lineHeight: 1.7 }}>
          Predict every UCL match before kickoff. Arsenal, Barcelona, Bayern Munich, Real Madrid, Liverpool, Man City and more.
          Build your Champions League reputation permanently.
        </p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: '#A78BFA', fontWeight: 'bold' }}>⭐ League Stage 2 starts October 13, 2026</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/ucl" style={{ backgroundColor: '#A78BFA', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            ⭐ Predict UCL Now →
          </a>
          <a href="/groups" style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px' }}>
            🏆 Create UCL League
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px' }}>

        {matches.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>Upcoming UCL Matches</h2>
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
                  <span style={{ fontSize: '11px', backgroundColor: '#A78BFA20', color: '#A78BFA', padding: '3px 10px', borderRadius: '999px', fontWeight: 700, border: '1px solid #A78BFA40' }}>Predict →</span>
                </a>
              ))}
            </div>
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <a href="/ucl" style={{ fontSize: '13px', color: '#A78BFA', textDecoration: 'none', fontWeight: 'bold' }}>View all UCL matches →</a>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>Why Predict UCL on Flipseer?</h2>
          {[
            { title: 'Permanent record', desc: 'Every UCL prediction locked before kickoff. Your correct calls are verified forever — no editing after results.' },
            { title: 'Full season tracking', desc: 'Track your accuracy across the entire Champions League — League Stage, Knockouts, Quarter Finals, Semi Finals and the Final.' },
            { title: 'Private leagues', desc: 'Create a UCL-specific private league for your group. Compete on Champions League matches only.' },
            { title: 'Nation representation', desc: 'Every correct UCL prediction earns REP points for your country in the global Nation Battle.' },
          ].map(({ title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <span style={{ color: '#A78BFA', fontSize: '16px', flexShrink: 0 }}>⭐</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '14px' }}>More on Flipseer</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
              { href: '/indian-super-league', label: '🇮🇳 Indian Super League' },
              { href: '/ghana-premier-league', label: '🇬🇭 Ghana Premier League' },
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

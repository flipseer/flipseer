import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Ghana Premier League Predictions 2026/27 | GPL Match Predictions | Flipseer',
  description: 'Predict every Ghana Premier League 2026/27 match before kickoff. Asante Kotoko, Hearts of Oak, Medeama, Aduana Stars and more. Build your Ghana football reputation. Free forever.',
  keywords: 'Ghana Premier League predictions, GPL predictions 2026, Ghana football prediction, Asante Kotoko predictions, Hearts of Oak predictions',
  alternates: { canonical: 'https://flipseer.com/ghana-premier-league' },
  openGraph: {
    title: 'Ghana Premier League Predictions 2026/27 | Flipseer',
    description: 'Predict every GPL match before kickoff. Build your Ghana football reputation. Free forever.',
    url: 'https://flipseer.com/ghana-premier-league',
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
      .eq('competition', 'Ghana PL 2026/27')
      .eq('status', 'upcoming')
      .order('kickoff', { ascending: true })
      .limit(10)
    return data || []
  } catch { return [] }
}

async function getRecentResults() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('matches')
      .select('id, home_team, away_team, home_score, away_score, kickoff')
      .eq('competition', 'Ghana PL 2026/27')
      .eq('status', 'completed')
      .not('home_score', 'is', null)
      .order('kickoff', { ascending: false })
      .limit(5)
    return data || []
  } catch { return [] }
}

function formatDate(kickoff: string) {
  const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z'
  return new Date(utc).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
  })
}

function slugTeam(name: string) {
  return name.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export default async function GhanaPremierLeaguePage() {
  const [upcoming, results] = await Promise.all([getUpcomingMatches(), getRecentResults()])

  const clubs = [
    'Asante Kotoko', 'Hearts of Oak', 'Medeama', 'Aduana Stars',
    'Bechem United', 'Karela', 'Ashanti Gold', 'Dreams FC',
    'Bibiani Gold Stars', 'Berekum Chelsea', 'Swedru All Blacks',
    'Samartex', 'Young Apostles', 'Heart of Lions', 'Basake Holy Stars',
    'Debibi United', 'Port City', 'Vision FC'
  ]

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '48px 20px 32px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🇬🇭</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,5vw,40px)', marginBottom: '10px', fontWeight: 800 }}>
          Ghana Premier League Predictions 2026/27
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '15px', maxWidth: '540px', margin: '0 auto 16px', lineHeight: 1.7 }}>
          Predict every Ghana Premier League match before kickoff. Asante Kotoko vs Hearts of Oak,
          Medeama, Aduana Stars and all GPL clubs. Build your permanent Ghana football reputation on Flipseer.
        </p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '999px', padding: '5px 16px', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold' }}>🇬🇭 Ghana PL 2026/27 · Season live now</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#F59E0B', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            🇬🇭 Predict Ghana PL Now →
          </a>
          <a href="/groups" style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px' }}>
            🏆 Create Ghana League
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px' }}>

        {/* UPCOMING MATCHES */}
        {upcoming.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>Upcoming Ghana PL Matches</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcoming.map((match: any) => (
                <a key={match.id}
                  href={`/matches/${slugTeam(match.home_team)}-vs-${slugTeam(match.away_team)}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '12px 16px', textDecoration: 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '2px' }}>
                      {match.home_team} vs {match.away_team}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>{formatDate(match.kickoff)} UTC</div>
                  </div>
                  <span style={{ fontSize: '11px', backgroundColor: '#F59E0B20', color: '#F59E0B', padding: '3px 10px', borderRadius: '999px', fontWeight: 700, border: '1px solid #F59E0B40', flexShrink: 0 }}>
                    Predict →
                  </span>
                </a>
              ))}
            </div>
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <a href="/predict" style={{ fontSize: '13px', color: '#F59E0B', textDecoration: 'none', fontWeight: 'bold' }}>
                View all Ghana PL matches →
              </a>
            </div>
          </div>
        )}

        {/* RECENT RESULTS */}
        {results.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>Recent Results</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {results.map((match: any) => {
                const homeWon = match.home_score > match.away_score
                const awayWon = match.away_score > match.home_score
                return (
                  <div key={match.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '12px 16px' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: homeWon ? 700 : 400, color: homeWon ? 'white' : '#6B7280', flex: 1, textAlign: 'right' }}>{match.home_team}</span>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#F59E0B', minWidth: '50px', textAlign: 'center' }}>{match.home_score}–{match.away_score}</span>
                      <span style={{ fontSize: '13px', fontWeight: awayWon ? 700 : 400, color: awayWon ? 'white' : '#6B7280', flex: 1 }}>{match.away_team}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#4B5563', flexShrink: 0 }}>{formatDate(match.kickoff)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ABOUT GPL */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>About the Ghana Premier League</h2>
          <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '12px' }}>
            The Ghana Premier League (GPL) is the top division of football in Ghana, run by the Ghana Football Association (GFA).
            It features 18 clubs competing across a full season from August to May.
          </p>
          <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '12px' }}>
            The biggest rivalry in Ghanaian football is between Asante Kotoko SC and Hearts of Oak SC —
            known as the Super Clash. Kotoko are the most decorated club with multiple GPL titles,
            while Hearts of Oak are their fiercest rivals and CAF Champions League winners.
          </p>
          <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.8 }}>
            On Flipseer, you can predict every GPL match before kickoff, build your permanent Ghana football reputation
            and compete in private leagues with friends and fellow Ghanaian football fans.
          </p>
        </div>

        {/* CLUBS */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>2026/27 Ghana Premier League Clubs</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {clubs.map(club => (
              <span key={club} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', color: '#9CA3AF', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>
                {club}
              </span>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '16px' }}>How Ghana PL Predictions Work</h2>
          {[
            { n: '1', title: 'Predict before kickoff', desc: 'Pick the match outcome and score before every Ghana PL match starts. Your prediction locks permanently at kickoff.' },
            { n: '2', title: 'Build your reputation', desc: 'Every correct Ghana PL prediction earns REP points that build your permanent Football Reputation score.' },
            { n: '3', title: 'Represent Ghana', desc: 'Your correct calls earn REP points for Ghana in the global Nation Battle. Help Ghana beat Nigeria, India and Indonesia.' },
            { n: '4', title: 'Private leagues', desc: 'Create a Ghana PL-specific private league for your WhatsApp group. Compete on Ghana football with friends.' },
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

        {/* WORLD CUP 2030 */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '1px', margin: '0 0 8px' }}>🌍 BUILDING TOWARD WORLD CUP 2030</p>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0, lineHeight: 1.6 }}>
            Ghana has one of the most passionate football fanbases in Africa. Start predicting Ghana PL now
            and build 4 years of verified football intelligence before World Cup 2030. Your record starts today.
          </p>
        </div>

        {/* INTERNAL LINKS */}
        <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '14px' }}>More on Flipseer</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
              { href: '/champions-league', label: '⭐ Champions League' },
              { href: '/indian-super-league', label: '🇮🇳 Indian Super League' },
              { href: '/ghana', label: '🇬🇭 Ghana Nation Page' },
              { href: '/football-reputation', label: '📊 Football Reputation' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
              { href: '/groups', label: '👥 Private Leagues' },
              { href: '/nations', label: '🌍 Nation Battle' },
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

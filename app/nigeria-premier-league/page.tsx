import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Nigeria Premier League Predictions 2026/27 | NPFL | Flipseer',
  description: 'Predict every Nigeria Premier League 2026/27 match before kickoff. NPFL 2026/27 starts January 2027. Build your permanent Football Reputation. Free forever.',
  keywords: 'Nigeria Premier League predictions, NPFL predictions, NPFL 2026/27, Nigeria football predictions, Nigerian football',
  alternates: { canonical: 'https://flipseer.com/nigeria-premier-league' },
  openGraph: {
    title: 'Nigeria Premier League Predictions | NPFL 2026/27 | Flipseer',
    description: 'Predict every NPFL 2026/27 match. Build your permanent Football Reputation.',
    url: 'https://flipseer.com/nigeria-premier-league',
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
        .eq('competition', 'NPFL 2026/27')
        .in('status', ['upcoming', 'live'])
        .order('kickoff', { ascending: true })
        .limit(8),
      supabase
        .from('matches')
        .select('id, home_team, away_team, home_score, away_score, kickoff, slug')
        .eq('competition', 'NPFL 2026/27')
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
  return new Date(utc).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
  })
}

const NPFL_CLUBS = [
  'Enyimba FC', 'Rangers International', 'Kano Pillars', 'Rivers United',
  'Plateau United', 'Remo Stars', 'Shooting Stars', 'Lobi Stars',
  'Heartland FC', 'Nasarawa United', 'Kwara United', 'Bendel Insurance',
  'Doma United', 'Sunshine Stars', 'Wikki Tourists', 'Akwa United',
  'El-Kanemi Warriors', 'Go Round FC', 'Bayelsa United', 'Sporting Lagos',
]

export default async function NigeriaPage() {
  const { upcoming, recent } = await getMatches()
  const hasFixtures = upcoming.length > 0 || recent.length > 0

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif", color: 'white', paddingBottom: 80 }}>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(48px,10vw,88px) 20px clamp(40px,8vw,72px)', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg,#001A00 0%,#0D1F0F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100%', background: 'radial-gradient(ellipse,rgba(0,160,0,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,160,0,0.1)', border: '1px solid rgba(0,160,0,0.4)', borderRadius: 999, padding: '6px 20px', marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#00A000', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#00C800', fontWeight: 700, letterSpacing: '2px' }}>🇳🇬 NPFL 2026/27 · SEASON STARTS JANUARY 2027</span>
        </div>
        <div style={{ fontSize: 'clamp(48px,12vw,80px)', marginBottom: 16 }}>🇳🇬</div>
        <h1 style={{ fontSize: 'clamp(32px,8vw,56px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 16 }}>
          Nigeria Premier League<br /><span style={{ color: '#00C800' }}>2026/27</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9CA3AF', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 32px' }}>
          Enyimba. Rangers. Kano Pillars. Rivers United. Predict every NPFL match before kickoff. Build your permanent Football Reputation.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#00A000', color: 'white', borderRadius: 12, padding: 'clamp(12px,3vw,16px) clamp(24px,6vw,40px)', fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 32px rgba(0,160,0,0.35)' }}>
            🇳🇬 Predict NPFL →
          </a>
          <a href="/nations" style={{ backgroundColor: 'transparent', color: '#9CA3AF', padding: 'clamp(12px,3vw,16px) clamp(16px,4vw,24px)', borderRadius: 12, textDecoration: 'none', fontSize: 'clamp(13px,2vw,15px)', border: '1px solid #1A3A1A' }}>
            🌍 Nation Battle →
          </a>
        </div>
        <p style={{ fontSize: 11, color: '#4B5563', marginTop: 12 }}>Free forever · No betting · No card required</p>
      </section>

      {/* COMING SOON — shown only if no fixtures yet */}
      {!hasFixtures && (
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', background: 'linear-gradient(135deg, #001A00 0%, #0D2B14 100%)', border: '2px solid #00A000', borderRadius: 16, padding: '32px 24px', textAlign: 'center', boxShadow: '0 0 40px rgba(0,160,0,0.08)' }}>
            <div style={{ fontSize: 11, color: '#00C800', fontWeight: 700, letterSpacing: '3px', marginBottom: 12 }}>SEASON NOT STARTED YET</div>
            <h2 style={{ fontSize: 'clamp(20px,4vw,28px)', marginBottom: 12, fontWeight: 800 }}>
              NPFL 2026/27 kicks off<br />
              <span style={{ color: '#00C800' }}>January 2027.</span>
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Fixtures drop in December 2026. Meanwhile, build your Football Reputation on EPL, UCL, Ghana Premier League and ISL — your record carries into the NPFL season.
            </p>
            <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#00A000', color: 'white', padding: '14px 36px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700 }}>
              🇳🇬 Start Predicting Now →
            </a>
            <p style={{ fontSize: 11, color: '#6B7280', marginTop: 10 }}>Free forever · No betting · No card required</p>
          </div>
        </section>
      )}

      {/* UPCOMING MATCHES */}
      {upcoming.length > 0 && (
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#00C800', fontWeight: 700, letterSpacing: '3px' }}>UPCOMING MATCHES · NPFL</p>
              <a href="/predict" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>Predict all →</a>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(0,160,0,0.3)', borderRadius: 14, overflow: 'hidden' }}>
              {upcoming.map((match: any, i: number) => (
                <a key={match.id}
                  href={match.slug ? `/matches/${match.slug}` : '/predict'}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderTop: i === 0 ? 'none' : '1px solid #1A3A1A', textDecoration: 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                      {match.home_team} <span style={{ color: '#4B5563', fontWeight: 400 }}>vs</span> {match.away_team}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>
                      {match.round?.replace('Regular Season - ', 'MD')} · {formatDate(match.kickoff)} UTC
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: '#00C800', fontWeight: 700, backgroundColor: 'rgba(0,160,0,0.1)', padding: '4px 10px', borderRadius: 999, flexShrink: 0 }}>
                    Predict →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RECENT RESULTS */}
      {recent.length > 0 && (
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: 11, color: '#00C800', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>RECENT RESULTS · NPFL</p>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 14, overflow: 'hidden' }}>
              {recent.map((match: any, i: number) => (
                <a key={match.id}
                  href={`/matches/${match.slug}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderTop: i === 0 ? 'none' : '1px solid #1A3A1A', textDecoration: 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 2 }}>
                      {match.home_team} <span style={{ color: '#4B5563', fontWeight: 400 }}>vs</span> {match.away_team}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{formatDate(match.kickoff)} UTC</div>
                  </div>
                  {match.home_score !== null && (
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#9CA3AF', minWidth: 40, textAlign: 'center' as const }}>
                      {match.home_score}–{match.away_score}
                    </span>
                  )}
                  <span style={{ fontSize: 11, backgroundColor: '#1A3A1A', color: '#6B7280', padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>View →</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NATION BATTLE */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 11, color: '#00C800', fontWeight: 700, letterSpacing: '3px', marginBottom: 12 }}>NATION BATTLE</p>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Nigeria vs the world.</h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.7 }}>
            Every NPFL prediction you make counts toward Nigeria's collective accuracy on Flipseer. Nigerian fans vs Ghanaian fans vs Indian fans — whose forecasts are sharper? Build your record now. The Super Eagles faithful need your predictions.
          </p>
        </div>
      </section>

      {/* CLUBS */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#00C800', fontWeight: 700, letterSpacing: '3px', marginBottom: 20, textAlign: 'center' }}>NPFL CLUBS · 2026/27</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8 }}>
            {NPFL_CLUBS.map(club => (
              <div key={club} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#9CA3AF', textAlign: 'center' as const }}>
                {club}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🇳🇬</div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
            Represent Nigeria.<br /><span style={{ color: '#00C800' }}>Build Your Football Reputation.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Every NPFL prediction adds to your global reputation. EPL + NPFL + AFCON 2027 — one permanent record. Forever.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#00A000', color: 'white', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 0 24px rgba(0,160,0,0.3)', marginBottom: 16 }}>
            🇳🇬 Start Predicting NPFL →
          </a>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { href: '/premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL' },
              { href: '/ucl', label: '⭐ UCL' },
              { href: '/ghana-premier-league', label: '🇬🇭 Ghana PL' },
              { href: '/afcon', label: '🌍 AFCON 2027' },
              { href: '/nations', label: '🌍 Nations' },
              { href: '/leaderboard', label: '🏆 Leaderboard' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 8, padding: '6px 14px', textDecoration: 'none', fontSize: 12, color: '#8895A3' }}>{label}</a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

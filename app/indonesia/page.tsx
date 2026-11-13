import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Indonesian Super League 2026/27 Predictions | Flipseer',
  description: 'Prediksi Indonesian Super League 2026/27. Arema, Bali United, Persebaya, Persib dan 14 klub lainnya. Bangun reputasi sepakbolamu selamanya. Gratis.',
  keywords: 'Indonesian Super League predictions, Liga 1 predictions, Indonesia Super League 2026, Indonesia football, Arema, Bali United, Persebaya, prediksi bola',
  alternates: { canonical: 'https://flipseer.com/indonesia' },
  openGraph: {
    title: 'Indonesian Super League 2026/27 | Flipseer',
    description: 'Prediksi setiap pertandingan Indonesian Super League. Bangun reputasi sepakbolamu yang permanen. Gratis selamanya.',
    url: 'https://flipseer.com/indonesia',
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
        .eq('competition', 'Liga 1 2026/27')
        .in('status', ['upcoming', 'live'])
        .order('kickoff', { ascending: true })
        .limit(8),
      supabase
        .from('matches')
        .select('id, home_team, away_team, home_score, away_score, kickoff, slug')
        .eq('competition', 'Liga 1 2026/27')
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

const LIGA1_CLUBS = [
  'Arema FC', 'Bali United', 'Persebaya Surabaya', 'Persija Jakarta',
  'PSM Makassar', 'Persib Bandung', 'Bhayangkara FC', 'PSIM Yogyakarta',
  'Persik Kediri', 'Dewa United', 'PSS Sleman', 'Persita Tangerang',
  'Adhyaksa', 'PSBS Biak', 'Madura United', 'Barito Putera',
  'Semen Padang', 'PSIS Semarang',
]

export default async function IndonesiaPage() {
  const { upcoming, recent } = await getMatches()

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif", color: 'white', paddingBottom: 80 }}>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(48px,10vw,88px) 20px clamp(40px,8vw,72px)', borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(180deg,#1A0005 0%,#0D1F0F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100%', background: 'radial-gradient(ellipse,rgba(206,17,38,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(206,17,38,0.1)', border: '1px solid rgba(206,17,38,0.4)', borderRadius: 999, padding: '6px 20px', marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#CE1126', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#CE1126', fontWeight: 700, letterSpacing: '2px' }}>INDONESIAN SUPER LEAGUE 2026/27</span>
        </div>
        <div style={{ fontSize: 'clamp(48px,12vw,80px)', marginBottom: 16 }}>🇮🇩</div>
        <h1 style={{ fontSize: 'clamp(32px,8vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 16 }}>
          Indonesian Super League<br /><span style={{ color: '#CE1126' }}>2026/27</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: '#9CA3AF', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 32px' }}>
          Arema. Bali United. Persebaya. Persib. Prediksi setiap pertandingan Indonesian Super League. Bangun reputasi sepakbolamu yang permanen.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/predict" style={{ backgroundColor: '#CE1126', color: 'white', borderRadius: 12, padding: 'clamp(12px,3vw,16px) clamp(24px,6vw,40px)', fontSize: 'clamp(14px,2.5vw,16px)', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 32px rgba(206,17,38,0.35)' }}>
            🇮🇩 Prediksi Super League →
          </a>
          <a href="/nations" style={{ backgroundColor: 'transparent', color: '#9CA3AF', padding: 'clamp(12px,3vw,16px) clamp(16px,4vw,24px)', borderRadius: 12, textDecoration: 'none', fontSize: 'clamp(13px,2vw,15px)', border: '1px solid #1A3A1A' }}>
            🌍 Nation Battle →
          </a>
        </div>
        <p style={{ fontSize: 11, color: '#4B5563', marginTop: 12 }}>Gratis selamanya · Bukan judi · Tidak perlu kartu</p>
      </section>

      {/* UPCOMING MATCHES */}
      {upcoming.length > 0 && (
        <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A', backgroundColor: '#050E05' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#CE1126', fontWeight: 700, letterSpacing: '3px' }}>PERTANDINGAN MENDATANG · SUPER LEAGUE</p>
              <a href="/predict" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>Prediksi semua →</a>
            </div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid rgba(206,17,38,0.3)', borderRadius: 14, overflow: 'hidden' }}>
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
                  <span style={{ fontSize: 11, color: '#CE1126', fontWeight: 700, backgroundColor: 'rgba(206,17,38,0.1)', padding: '4px 10px', borderRadius: 999, flexShrink: 0 }}>
                    Prediksi →
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
            <p style={{ fontSize: 11, color: '#CE1126', fontWeight: 700, letterSpacing: '3px', marginBottom: 16 }}>HASIL TERBARU · SUPER LEAGUE</p>
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
                  <span style={{ fontSize: 11, backgroundColor: '#1A3A1A', color: '#6B7280', padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>Lihat →</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLUBS */}
      <section style={{ padding: '48px 20px', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#CE1126', fontWeight: 700, letterSpacing: '3px', marginBottom: 20, textAlign: 'center' }}>18 KLUB · SUPER LEAGUE 2026/27</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 8 }}>
            {LIGA1_CLUBS.map(club => (
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>🇮🇩</div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
            Wakili Indonesia.<br /><span style={{ color: '#CE1126' }}>Bangun Reputasi Sepakbolamu.</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Setiap prediksi Super League menambah reputasi globalmu. EPL + Super League + UCL — satu catatan permanen. Selamanya.
          </p>
          <a href="/predict" style={{ display: 'inline-block', backgroundColor: '#CE1126', color: 'white', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 0 24px rgba(206,17,38,0.3)', marginBottom: 16 }}>
            🇮🇩 Mulai Prediksi Super League →
          </a>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { href: '/premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL' },
              { href: '/ucl', label: '⭐ UCL' },
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

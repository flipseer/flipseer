import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })

  const { data: pred } = await supabase
    .from('predictions')
    .select(`
      id, predicted_home_score, predicted_away_score,
      predicted_outcome, confidence, created_at,
      profiles:user_id (username, total_points, accuracy_pct, country),
      matches:match_id (home_team, away_team, kickoff, competition, actual_home_score, actual_away_score, status)
    `)
    .eq('id', id)
    .single()

  if (!pred) return new Response('Not found', { status: 404 })

  const profile = pred.profiles as any
  const match = pred.matches as any
  const result = getResult(pred)

  const cfg = {
    exact:   { label: 'EXACT SCORE 🎯', color: '#F59E0B', bg: '#1A1200' },
    correct: { label: 'CORRECT ✓',      color: '#2E9E5E', bg: '#001A0A' },
    wrong:   { label: 'WRONG ✗',        color: '#EF4444', bg: '#1A0000' },
    pending: { label: 'LOCKED 🔒',      color: '#8B5CF6', bg: '#0A0014' },
  }[result] || { label: 'LOCKED 🔒', color: '#8B5CF6', bg: '#0A0014' }

  return new ImageResponse(
    (
      <div style={{ width: '1200px', height: '630px', background: '#0D1F0F', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', position: 'relative', overflow: 'hidden' }}>
        {/* Background accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: cfg.color, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: cfg.color, display: 'flex' }} />

        {/* Left panel */}
        <div style={{ display: 'flex', flex: 1, padding: '60px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '20px' }}>

            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', fontFamily: 'Georgia, serif' }}>Flipseer</div>
              <div style={{ fontSize: '13px', color: '#6B7280', letterSpacing: '2px' }}>FOOTBALL REPUTATION</div>
            </div>

            {/* Result badge */}
            <div style={{ display: 'flex' }}>
              <div style={{ background: cfg.bg, border: '2px solid ' + cfg.color, color: cfg.color, padding: '10px 24px', borderRadius: '999px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', display: 'flex' }}>
                {cfg.label}
              </div>
            </div>

            {/* Match */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', color: '#6B7280', letterSpacing: '2px' }}>
                {match?.competition?.replace(' 2026/27', '')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', display: 'flex' }}>{match?.home_team}</div>
                <div style={{ background: '#050E05', border: '2px solid ' + cfg.color, borderRadius: '12px', padding: '12px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '42px', fontWeight: 'bold', color: cfg.color, fontFamily: 'Georgia, serif', display: 'flex' }}>
                    {pred.predicted_home_score}–{pred.predicted_away_score}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '2px', display: 'flex' }}>PREDICTED</div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', display: 'flex' }}>{match?.away_team}</div>
              </div>
              {result !== 'pending' && match?.actual_home_score !== null && (
                <div style={{ fontSize: '16px', color: '#6B7280', display: 'flex' }}>
                  Actual: <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '8px' }}>{match?.actual_home_score}–{match?.actual_away_score}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '8px' }}>
              {[
                { label: 'CONFIDENCE', value: pred.confidence + '%', color: '#8B5CF6' },
                { label: 'REP SCORE', value: String(profile?.total_points || 0), color: '#F59E0B' },
                { label: 'ACCURACY', value: (profile?.accuracy_pct || 0) + '%', color: '#2E9E5E' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '2px', display: 'flex' }}>{label}</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color, fontFamily: 'Georgia, serif', display: 'flex' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Predictor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
              <div style={{ width: '48px', height: '48px', background: '#4C1D95', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: '#C4B5FD' }}>
                {profile?.username?.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', display: 'flex' }}>@{profile?.username}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', display: 'flex' }}>Locked before kickoff · No edits ever</div>
              </div>
            </div>

            {/* URL */}
            <div style={{ fontSize: '16px', color: '#8B5CF6', fontWeight: 'bold', display: 'flex' }}>
              flipseer.com/proof/{pred.id.slice(0, 8)}...
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

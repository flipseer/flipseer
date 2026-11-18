import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const alt = 'Flipseer Forecast Journal'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { username: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, rank, rank_icon, total_points, accuracy_pct, prediction_count, streak, country')
    .eq('username', params.username)
    .single()

  const username = profile?.username || params.username
  const rank = profile?.rank || 'Rookie'
  const rankIcon = profile?.rank_icon || '🥉'
  const points = profile?.total_points?.toLocaleString() || '0'
  const accuracy = profile?.accuracy_pct != null ? Number(profile.accuracy_pct).toFixed(1) : '0.0'
  const predictions = profile?.prediction_count || 0
  const streak = profile?.streak || 0

  // Accuracy color: green if >=50, amber if >=35, red otherwise
  const accNum = parseFloat(accuracy)
  const accColor = accNum >= 50 ? '#2E9E5E' : accNum >= 35 ? '#F59E0B' : '#EF4444'

  return new ImageResponse(
    (
      <div style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #071408 0%, #0D2B14 60%, #0D1F0F 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '56px 64px',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
      }}>

        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(90deg, #2E9E5E, #8B5CF6)', display: 'flex' }} />

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '44px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', color: '#6B7280', letterSpacing: '4px', marginBottom: '10px', display: 'flex' }}>
              FLIPSEER · FOOTBALL REPUTATION
            </div>
            <div style={{ fontSize: '58px', color: '#ffffff', fontWeight: 'bold', marginBottom: '10px', display: 'flex' }}>
              @{username}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                fontSize: '14px',
                color: '#2E9E5E',
                fontWeight: 'bold',
                backgroundColor: 'rgba(46,158,94,0.15)',
                border: '1px solid #2E9E5E',
                borderRadius: '999px',
                padding: '4px 16px',
                display: 'flex',
              }}>
                {rankIcon} {rank}
              </div>
              {streak > 0 && (
                <div style={{
                  fontSize: '14px',
                  color: '#F59E0B',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(245,158,11,0.15)',
                  border: '1px solid #F59E0B',
                  borderRadius: '999px',
                  padding: '4px 16px',
                  display: 'flex',
                }}>
                  🔥 {streak} streak
                </div>
              )}
            </div>
          </div>
          <div style={{ fontSize: '88px', display: 'flex', opacity: 0.9 }}>⚽</div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '44px' }}>
          {[
            { value: `${accuracy}%`, label: 'Accuracy', color: accColor },
            { value: String(predictions), label: 'Predictions', color: '#8B5CF6' },
            { value: points, label: 'Rep Points', color: '#2E9E5E' },
            { value: `${streak}🔥`, label: 'Hot Streak', color: '#F59E0B' },
          ].map(({ value, label, color }) => (
            <div key={label} style={{
              flex: 1,
              backgroundColor: 'rgba(13,43,20,0.6)',
              border: '1px solid rgba(46,158,94,0.3)',
              borderRadius: '14px',
              padding: '22px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: '38px', fontWeight: 'bold', color, marginBottom: '6px', display: 'flex' }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', letterSpacing: '1px', display: 'flex' }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(46,158,94,0.25)', paddingTop: '22px' }}>
          <div style={{ fontSize: '18px', color: '#9CA3AF', display: 'flex' }}>
            Can you beat this record? Predict free →
          </div>
          <div style={{ fontSize: '22px', color: '#2E9E5E', fontWeight: 'bold', display: 'flex' }}>
            flipseer.com/u/{username}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(90deg, #2E9E5E, #8B5CF6)', display: 'flex' }} />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

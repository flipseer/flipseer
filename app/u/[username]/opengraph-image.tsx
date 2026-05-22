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

  // ── Fetch profile ──
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, rank, rank_icon, total_points, accuracy_pct, prediction_count, streak, country')
    .eq('username', params.username)
    .single()

  const username = profile?.username || params.username
  const rank = profile?.rank || 'Rookie'
  const rankIcon = profile?.rank_icon || '🥉'
  const points = profile?.total_points?.toLocaleString() || '0'
  const accuracy = profile?.accuracy_pct || 0
  const predictions = profile?.prediction_count || 0
  const streak = profile?.streak || 0

  return new ImageResponse(
    (
      <div style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #0D1F0F 0%, #0D2B14 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
      }}>

        {/* Top green bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: '#2E9E5E', display: 'flex' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '16px', color: '#6B7280', letterSpacing: '4px', marginBottom: '8px', display: 'flex' }}>
              FORECAST JOURNAL
            </div>
            <div style={{ fontSize: '56px', color: '#2E9E5E', fontWeight: 'bold', marginBottom: '8px', display: 'flex' }}>
              @{username}
            </div>
            <div style={{ fontSize: '28px', color: '#9CA3AF', display: 'flex' }}>
              {rankIcon} {rank} · World Cup 2026
            </div>
          </div>
          <div style={{ fontSize: '100px', display: 'flex' }}>⚽</div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '48px' }}>
          {[
            { value: points, label: 'Points', color: '#2E9E5E' },
            { value: `${accuracy}%`, label: 'Accuracy', color: '#F59E0B' },
            { value: String(predictions), label: 'Predictions', color: '#2E9E5E' },
            { value: `${streak} 🔥`, label: 'Streak', color: '#F59E0B' },
          ].map(({ value, label, color }) => (
            <div key={label} style={{
              flex: 1,
              backgroundColor: 'rgba(13,43,20,0.8)',
              border: '1px solid #1A7A4A',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color, marginBottom: '8px', display: 'flex' }}>{value}</div>
              <div style={{ fontSize: '16px', color: '#6B7280', display: 'flex' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1A7A4A', paddingTop: '24px' }}>
          <div style={{ fontSize: '20px', color: '#6B7280', fontStyle: 'italic', display: 'flex' }}>
            "The permanent public record of your football intelligence."
          </div>
          <div style={{ fontSize: '24px', color: '#2E9E5E', fontWeight: 'bold', display: 'flex' }}>
            flipseer.com
          </div>
        </div>

        {/* Bottom green bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', background: '#2E9E5E', display: 'flex' }} />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

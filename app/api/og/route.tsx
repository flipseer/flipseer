import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username') || 'Forecaster'
  const points   = searchParams.get('points')   || '0'
  const correct  = searchParams.get('correct')  || '0'
  const accuracy = searchParams.get('accuracy') || '0'
  const country  = searchParams.get('country')  || 'WC 2026'
  const rank     = searchParams.get('rank')      || ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0D1F0F',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(46,158,94,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
        }} />
        {/* Top badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#0D2B14',
          border: '1px solid #2E9E5E',
          borderRadius: '20px',
          padding: '8px 20px',
          marginBottom: '28px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E9E5E', display: 'flex' }} />
          <span style={{ fontSize: '16px', color: '#2E9E5E', fontWeight: 'bold', letterSpacing: '2px' }}>
            FLIPSEER &middot; WORLD CUP 2026
          </span>
        </div>
        {/* Username */}
        <div style={{ fontSize: '52px', fontWeight: 'bold', color: 'white', marginBottom: '8px', display: 'flex' }}>
          @{username}
        </div>
        {/* Country */}
        <div style={{ fontSize: '20px', color: '#6B7280', marginBottom: '40px', display: 'flex' }}>
          {country}{rank ? ` · Rank #${rank}` : ''}
        </div>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
          {[
            { value: points, label: 'POINTS' },
            { value: correct, label: 'CORRECT' },
            { value: accuracy + '%', label: 'ACCURACY' },
          ].map(({ value, label }) => (
            <div key={label} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#0D2B14',
              border: '1px solid #1A7A4A',
              borderRadius: '16px',
              padding: '24px 40px',
            }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#2E9E5E' }}>{value}</span>
              <span style={{ fontSize: '14px', color: '#6B7280', letterSpacing: '2px', marginTop: '4px' }}>{label}</span>
            </div>
          ))}
        </div>
        {/* Bottom tagline */}
        <div style={{ fontSize: '18px', color: '#4B5563', display: 'flex' }}>
          flipseer.com &middot; Free &middot; No Betting &middot; Pure Football
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

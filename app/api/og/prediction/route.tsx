import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const FLAGS: Record<string, string> = {
  IN: '🇮🇳', BR: '🇧🇷', AR: '🇦🇷', FR: '🇫🇷', DE: '🇩🇪', GB: '🏴',
  ES: '🇪🇸', PT: '🇵🇹', NL: '🇳🇱', IT: '🇮🇹', MX: '🇲🇽', US: '🇺🇸',
  NG: '🇳🇬', SN: '🇸🇳', MA: '🇲🇦', JP: '🇯🇵', ID: '🇮🇩', ZA: '🇿🇦',
  TR: '🇹🇷', SA: '🇸🇦', KR: '🇰🇷', CO: '🇨🇴', CA: '🇨🇦', AU: '🇦🇺',
  PK: '🇵🇰', BD: '🇧🇩', GH: '🇬🇭', EG: '🇪🇬',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const home = searchParams.get('home') || 'Home'
  const away = searchParams.get('away') || 'Away'
  const outcome = (searchParams.get('outcome') || 'draw').toLowerCase() // home | away | draw
  const homeScore = searchParams.get('hs')
  const awayScore = searchParams.get('as')
  const confidence = searchParams.get('conf') || '50'
  const username = searchParams.get('user') || 'Forecaster'
  const country = (searchParams.get('country') || '').toUpperCase()
  const flag = FLAGS[country] || '🌍'
  const league = searchParams.get('league') || 'World Cup 2026'

  const hasExact = homeScore !== null && awayScore !== null && homeScore !== '' && awayScore !== ''
  const pickLabel = outcome === 'home' ? home : outcome === 'away' ? away : 'Draw'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0D1F0F',
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(46,158,94,0.20) 0%, rgba(13,31,15,0) 60%)',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          padding: '56px 64px',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', fontSize: '44px' }}>⚽</div>
            <div style={{ display: 'flex', fontSize: '38px', fontWeight: 700, color: '#2E9E5E', letterSpacing: '2px' }}>
              FLIPSEER
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '20px',
              color: '#6B7280',
              letterSpacing: '4px',
              fontWeight: 700,
              border: '1px solid #1A7A4A',
              borderRadius: '999px',
              padding: '8px 20px',
            }}
          >
            {league.toUpperCase()}
          </div>
        </div>

        {/* User line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '44px' }}>
          <div style={{ display: 'flex', fontSize: '40px' }}>{flag}</div>
          <div style={{ display: 'flex', fontSize: '30px', color: '#D1FAE5' }}>
            <span style={{ color: '#2E9E5E', fontWeight: 700 }}>@{username}</span>&nbsp;predicts
          </div>
        </div>

        {/* Match card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0D2B14',
            border: '2px solid #1A7A4A',
            borderRadius: '24px',
            padding: '48px',
            marginTop: '24px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                fontSize: '50px',
                fontWeight: 700,
                flex: 1,
                color: outcome === 'home' ? '#2E9E5E' : 'white',
              }}
            >
              {home}
            </div>
            <div style={{ display: 'flex', fontSize: '28px', color: '#4B5563', fontWeight: 700, padding: '0 28px' }}>
              VS
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '50px',
                fontWeight: 700,
                flex: 1,
                justifyContent: 'flex-end',
                color: outcome === 'away' ? '#2E9E5E' : 'white',
              }}
            >
              {away}
            </div>
          </div>

          {/* Prediction pill */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '44px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(46,158,94,0.12)',
                border: '2px solid #2E9E5E',
                borderRadius: '20px',
                padding: '24px 60px',
              }}
            >
              {hasExact ? (
                <div style={{ display: 'flex', fontSize: '60px', fontWeight: 700, color: '#2E9E5E' }}>
                  {homeScore}&nbsp;–&nbsp;{awayScore}
                </div>
              ) : (
                <div style={{ display: 'flex', fontSize: '44px', fontWeight: 700, color: '#2E9E5E' }}>
                  {outcome === 'draw' ? 'DRAW' : pickLabel.toUpperCase() + ' TO WIN'}
                </div>
              )}
              <div style={{ display: 'flex', fontSize: '24px', color: '#9CA3AF', marginTop: '10px' }}>
                {confidence}% confidence
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '28px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '22px', color: '#6EE7B7' }}>
            🔒 Locked forever · No betting · Pure football intelligence
          </div>
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 700, color: 'white' }}>flipseer.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

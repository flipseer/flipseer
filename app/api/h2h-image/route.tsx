// app/api/h2h-image/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const teamA = searchParams.get('a') || 'Team A'
  const teamB = searchParams.get('b') || 'Team B'
  const winsA = parseInt(searchParams.get('aw') || '0')
  const winsB = parseInt(searchParams.get('bw') || '0')
  const draws = parseInt(searchParams.get('d') || '0')
  const logoA = searchParams.get('al') || ''
  const logoB = searchParams.get('bl') || ''

  const meetings = winsA + winsB + draws

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1350px',
          background: 'linear-gradient(145deg, #071408 0%, #0D2B14 60%, #071A0A 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #2E9E5E, #8B5CF6)', display: 'flex' }} />

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '64px', width: '100%' }}>
          <div style={{ fontSize: '14px', color: '#2E9E5E', letterSpacing: '4px', fontWeight: 700, display: 'flex' }}>
            ⚽ FLIPSEER · HEAD TO HEAD
          </div>
        </div>

        {/* Teams + score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', width: '100%', padding: '0 60px', flex: 1 }}>
          {/* Team A */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            {logoA ? (
              <img src={logoA} width={160} height={160} style={{ objectFit: 'contain', marginBottom: '20px' }} />
            ) : (
              <div style={{ width: '160px', height: '160px', backgroundColor: 'rgba(46,158,94,0.15)', borderRadius: '50%', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '60px', display: 'flex' }}>⚽</div>
              </div>
            )}
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#F0FFF4', textAlign: 'center', display: 'flex' }}>{teamA}</div>
            <div style={{ fontSize: '72px', fontWeight: 900, color: '#2E9E5E', marginTop: '16px', display: 'flex' }}>{winsA}</div>
            <div style={{ fontSize: '14px', color: '#6B7280', letterSpacing: '2px', display: 'flex' }}>WINS</div>
          </div>

          {/* Centre */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '20px', color: '#6B7280', letterSpacing: '2px', display: 'flex' }}>LAST {meetings}</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#9CA3AF', display: 'flex' }}>VS</div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '20px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ fontSize: '20px', color: '#F59E0B', fontWeight: 700, display: 'flex' }}>{draws}</div>
              <div style={{ fontSize: '12px', color: '#6B7280', letterSpacing: '2px', display: 'flex' }}>DRAWS</div>
            </div>
          </div>

          {/* Team B */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            {logoB ? (
              <img src={logoB} width={160} height={160} style={{ objectFit: 'contain', marginBottom: '20px' }} />
            ) : (
              <div style={{ width: '160px', height: '160px', backgroundColor: 'rgba(139,92,246,0.15)', borderRadius: '50%', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '60px', display: 'flex' }}>⚽</div>
              </div>
            )}
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#F0FFF4', textAlign: 'center', display: 'flex' }}>{teamB}</div>
            <div style={{ fontSize: '72px', fontWeight: 900, color: '#8B5CF6', marginTop: '16px', display: 'flex' }}>{winsB}</div>
            <div style={{ fontSize: '14px', color: '#6B7280', letterSpacing: '2px', display: 'flex' }}>WINS</div>
          </div>
        </div>

        {/* Win bar */}
        <div style={{ width: '100%', padding: '0 60px', marginBottom: '48px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280' }}>
            <span style={{ display: 'flex' }}>{meetings > 0 ? Math.round((winsA / meetings) * 100) : 0}% win rate</span>
            <span style={{ display: 'flex' }}>{meetings > 0 ? Math.round((winsB / meetings) * 100) : 0}% win rate</span>
          </div>
          <div style={{ height: '12px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${meetings > 0 ? (winsA / meetings) * 100 : 50}%`, background: 'linear-gradient(90deg, #1A6040, #2E9E5E)', borderRadius: '999px 0 0 999px', display: 'flex' }} />
            <div style={{ flex: 1, backgroundColor: 'rgba(139,92,246,0.4)', display: 'flex' }} />
          </div>
        </div>

        {/* CTA */}
        <div style={{
          width: '100%',
          borderTop: '1px solid rgba(46,158,94,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '32px 60px 48px',
        }}>
          <div style={{ fontSize: '22px', color: '#9CA3AF', display: 'flex' }}>
            Predict {teamA} vs {teamB} free →
          </div>
          <div style={{ fontSize: '28px', color: '#2E9E5E', fontWeight: 900, display: 'flex' }}>
            flipseer.com
          </div>
        </div>

        {/* Bottom accent bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #2E9E5E, #8B5CF6)', display: 'flex' }} />
      </div>
    ),
    { width: 1080, height: 1350 }
  )
}

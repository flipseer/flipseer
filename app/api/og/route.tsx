import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'forecaster';
  const home = searchParams.get('home') || 'Team A';
  const away = searchParams.get('away') || 'Team B';
  const pick = searchParams.get('pick') || 'Home Win';
  const confidence = searchParams.get('confidence') || '50';
  const pts = searchParams.get('pts') || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0D1F0F, #0D2B14)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial',
        }}
      >
        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, width: '1200px', height: '6px', background: '#2E9E5E' }} />

        {/* Logo */}
        <div style={{ fontSize: '48px', color: '#2E9E5E', fontWeight: 'bold', marginBottom: '24px' }}>
          ⚽ FLIPSEER
        </div>

        {/* Match */}
        <div style={{ fontSize: '56px', color: 'white', fontWeight: 'bold', marginBottom: '24px' }}>
          {home} vs {away}
        </div>

        {/* Pick pill */}
        <div style={{
          background: '#1A7A4A',
          borderRadius: '40px',
          padding: '16px 48px',
          fontSize: '36px',
          color: 'white',
          fontWeight: 'bold',
          marginBottom: '24px',
        }}>
          🎯 {pick}
        </div>

        {/* Confidence */}
        <div style={{ fontSize: '32px', color: '#2E9E5E', marginBottom: '16px' }}>
          {confidence}% Confidence{pts ? ` · +${pts} pts` : ''}
        </div>

        {/* Username */}
        <div style={{ fontSize: '24px', color: '#9CA3AF', marginBottom: '8px' }}>
          @{username} · World Cup 2026
        </div>

        {/* Footer */}
        <div style={{ fontSize: '18px', color: '#4B5563', position: 'absolute', bottom: '24px' }}>
          flipseer.com · Build your forecasting reputation
        </div>

        {/* Bottom bar */}
        <div style={{ position: 'absolute', bottom: 0, width: '1200px', height: '6px', background: '#2E9E5E' }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

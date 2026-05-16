import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D1F0F, #0D2B14)',
        color: 'white',
        fontFamily: 'Arial',
      }}>
        <div style={{ fontSize: '100px', marginBottom: '20px' }}>⚽</div>
        <div style={{ fontSize: '80px', fontWeight: 'bold', color: '#2E9E5E' }}>FLIPSEER</div>
        <div style={{ fontSize: '36px', marginTop: '20px' }}>Predict · Earn Reputation · Build Legacy</div>
        <div style={{ fontSize: '28px', marginTop: '16px', color: '#9CA3AF' }}>World Cup 2026 · flipseer.com</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

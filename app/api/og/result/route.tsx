import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const FLAGS: Record<string, string> = {
  IN: '🇮🇳', ID: '🇮🇩', NG: '🇳🇬', BR: '🇧🇷', AR: '🇦🇷',
  GB: '🏴', FR: '🇫🇷', DE: '🇩🇪', ES: '🇪🇸', PT: '🇵🇹',
  MX: '🇲🇽', US: '🇺🇸', GH: '🇬🇭', MA: '🇲🇦', JP: '🇯🇵',
  KR: '🇰🇷', AU: '🇦🇺', PK: '🇵🇰', BD: '🇧🇩', SA: '🇸🇦',
  TR: '🇹🇷', EG: '🇪🇬', ZA: '🇿🇦', NO: '🇳🇴', SN: '🇸🇳',
};

// GET /api/og/result?user=praveen&home=Goa&away=Bengaluru&hs=1&as=2&pred_h=0&pred_a=2&outcome=away&correct=true&country=IN&comp=ISL
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;

  const username  = p.get('user') || 'Forecaster';
  const home      = p.get('home') || 'Home';
  const away      = p.get('away') || 'Away';
  const hs        = p.get('hs') ?? '0';    // actual home score
  const as_       = p.get('as') ?? '0';    // actual away score
  const predH     = p.get('pred_h');       // predicted home score (optional)
  const predA     = p.get('pred_a');       // predicted away score (optional)
  const outcome   = p.get('outcome') || 'draw'; // predicted outcome: home|away|draw
  const correct   = p.get('correct') === 'true';
  const exact     = p.get('exact') === 'true';
  const country   = (p.get('country') || '').toUpperCase();
  const comp      = p.get('comp') || 'Football';
  const pts       = p.get('pts') || '0';
  const flag      = FLAGS[country] || '🌍';

  const resultLabel = correct
    ? (exact ? '⚽ Exact Score!' : '✅ Correct Call')
    : '❌ Wrong Call';
  const resultColor = correct ? '#2E9E5E' : '#EF4444';

  const pickLabel =
    outcome === 'home' ? `${home} Win` :
    outcome === 'away' ? `${away} Win` : 'Draw';

  const hasPredScore = predH !== null && predA !== null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0D1F0F',
          backgroundImage: `radial-gradient(circle at 50% 0%, ${correct ? 'rgba(46,158,94,0.25)' : 'rgba(239,68,68,0.15)'} 0%, rgba(13,31,15,0) 60%)`,
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          padding: '48px 64px',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', fontSize: '40px' }}>⚽</div>
            <div style={{ display: 'flex', fontSize: '34px', fontWeight: 700, color: '#2E9E5E', letterSpacing: '2px' }}>
              FLIPSEER
            </div>
          </div>
          <div style={{
            display: 'flex',
            backgroundColor: correct ? 'rgba(46,158,94,0.2)' : 'rgba(239,68,68,0.2)',
            border: `2px solid ${resultColor}`,
            borderRadius: '999px',
            padding: '10px 28px',
            fontSize: '24px',
            fontWeight: 700,
            color: resultColor,
          }}>
            {resultLabel}
          </div>
        </div>

        {/* User line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '36px' }}>
          <div style={{ display: 'flex', fontSize: '36px' }}>{flag}</div>
          <div style={{ display: 'flex', fontSize: '26px', color: '#D1FAE5' }}>
            <span style={{ color: '#2E9E5E', fontWeight: 700 }}>@{username}</span>
            <span style={{ color: '#9CA3AF' }}>&nbsp;·&nbsp;{comp}</span>
          </div>
        </div>

        {/* Match result card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0D2B14',
            border: `2px solid ${correct ? '#1A7A4A' : '#3A1A1A'}`,
            borderRadius: '24px',
            padding: '36px 48px',
            marginTop: '20px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Teams + actual score */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', fontSize: '48px', fontWeight: 700, flex: 1 }}>{home}</div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#0A1A0C',
              border: '1px solid #1A4A2A',
              borderRadius: '16px',
              padding: '12px 32px',
              margin: '0 24px',
            }}>
              <div style={{ display: 'flex', fontSize: '54px', fontWeight: 700, color: '#2E9E5E', letterSpacing: '4px' }}>
                {hs} – {as_}
              </div>
              <div style={{ display: 'flex', fontSize: '16px', color: '#6B7280', marginTop: '4px', letterSpacing: '2px' }}>
                FULL TIME
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: '48px', fontWeight: 700, flex: 1, justifyContent: 'flex-end' }}>{away}</div>
          </div>

          {/* Prediction pill */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px', gap: '20px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: `rgba(${correct ? '46,158,94' : '239,68,68'},0.1)`,
              border: `1.5px solid ${resultColor}`,
              borderRadius: '16px',
              padding: '16px 40px',
            }}>
              <div style={{ display: 'flex', fontSize: '18px', color: '#9CA3AF', marginBottom: '6px' }}>My Prediction</div>
              <div style={{ display: 'flex', fontSize: '36px', fontWeight: 700, color: resultColor }}>
                {hasPredScore ? `${predH} – ${predA}` : pickLabel}
              </div>
              {hasPredScore && !exact && (
                <div style={{ display: 'flex', fontSize: '18px', color: '#9CA3AF', marginTop: '4px' }}>{pickLabel}</div>
              )}
            </div>
            {correct && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(46,158,94,0.1)',
                border: '1.5px solid #1A7A4A',
                borderRadius: '16px',
                padding: '16px 40px',
              }}>
                <div style={{ display: 'flex', fontSize: '18px', color: '#9CA3AF', marginBottom: '6px' }}>Points Earned</div>
                <div style={{ display: 'flex', fontSize: '36px', fontWeight: 700, color: '#2E9E5E' }}>+{pts} REP</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ display: 'flex', fontSize: '20px', color: '#6B7280' }}>
            🔒 Locked before kickoff · flipseer.com/u/{username}
          </div>
          <div style={{ display: 'flex', fontSize: '20px', color: '#4B5563' }}>
            Free · No betting · Pure football
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

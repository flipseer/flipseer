import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'forecaster';

  // Fetch profile data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, rank, rank_icon, total_points, accuracy_pct, prediction_count, correct_count, streak, country')
    .eq('username', username)
    .single();

  const name = profile?.username || username;
  const rank = profile?.rank || 'Rookie';
  const rankIcon = profile?.rank_icon || '🥉';
  const points = profile?.total_points?.toLocaleString() || '0';
  const accuracy = profile?.accuracy_pct || 0;
  const predictions = profile?.prediction_count || 0;
  const streak = profile?.streak || 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#0D1F0F',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        }}>

        {/* Background gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at top left, rgba(46,158,94,0.15) 0%, transparent 60%)',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '16px', color: '#6B7280', letterSpacing: '3px', marginBottom: '8px' }}>
              FORECAST JOURNAL
            </div>
            <div style={{ fontSize: '52px', color: '#2E9E5E', fontWeight: 'bold', marginBottom: '4px' }}>
              @{name}
            </div>
            <div style={{ fontSize: '24px', color: '#9CA3AF' }}>
              {rankIcon} {rank} · World Cup 2026
            </div>
          </div>
          <div style={{ fontSize: '80px' }}>⚽</div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          {[
            { value: points, label: 'Points', color: '#2E9E5E' },
            { value: `${accuracy}%`, label: 'Accuracy', color: '#F59E0B' },
            { value: String(predictions), label: 'Predictions', color: '#2E9E5E' },
            { value: `${streak}🔥`, label: 'Streak', color: '#F59E0B' },
          ].map(({ value, label, color }) => (
            <div key={label} style={{
              flex: 1, backgroundColor: '#0D2B14', border: '1px solid #1A7A4A',
              borderRadius: '16px', padding: '20px', textAlign: 'center' as const,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color, marginBottom: '8px' }}>{value}</div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1A7A4A', paddingTop: '24px' }}>
          <div style={{ fontSize: '18px', color: '#6B7280', fontStyle: 'italic' }}>
            "The permanent public record of your football intelligence."
          </div>
          <div style={{ fontSize: '22px', color: '#2E9E5E', fontWeight: 'bold' }}>
            flipseer.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

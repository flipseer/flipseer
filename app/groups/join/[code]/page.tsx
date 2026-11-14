import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Props = { params: { code: string } };

const COMP_FLAG: Record<string, string> = {
  'EPL 2026/27':      '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'UCL 2026/27':      '⭐',
  'Liga 1 2026/27':   '🇮🇩',
  'Ghana PL 2026/27': '🇬🇭',
  'ISL 2026/27':      '🇮🇳',
  'NPFL 2026/27':     '🇳🇬',
};

const COMP_COLOR: Record<string, string> = {
  'EPL 2026/27':      '#8B5CF6',
  'UCL 2026/27':      '#A78BFA',
  'Liga 1 2026/27':   '#CE1126',
  'Ghana PL 2026/27': '#F59E0B',
  'ISL 2026/27':      '#FF6B35',
  'NPFL 2026/27':     '#008751',
};

export default async function JoinPage({ params }: Props) {
  const code = params.code?.toUpperCase() || '';
  const supabase = createClient();

  // Fetch group info — public read, no auth required
  const { data: group } = await supabase
    .from('groups')
    .select('id, name, competition, description, invite_code')
    .eq('invite_code', code)
    .single();

  // Invalid code — redirect to groups
  if (!group) redirect('/groups');

  // Member count
  const { count: memberCount } = await supabase
    .from('group_members')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', group.id);

  // Check if user is already logged in
  const { data: { session } } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const flag = COMP_FLAG[group.competition] || '⚽';
  const color = COMP_COLOR[group.competition] || '#2E9E5E';
  const members = memberCount || 0;

  return (
    <main style={{
      backgroundColor: '#080F09',
      minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* League badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `${color}20`,
            border: `2px solid ${color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 16px',
          }}>
            {flag}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            color: color, marginBottom: 8,
          }}>
            YOU'VE BEEN INVITED TO JOIN
          </div>
          <h1 style={{
            fontSize: 'clamp(20px,5vw,26px)', fontWeight: 800,
            margin: '0 0 8px', letterSpacing: '-0.5px',
          }}>
            {group.name}
          </h1>
          {group.description && (
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>
              {group.description}
            </p>
          )}

          {/* Stats row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 24,
            backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
            borderRadius: 12, padding: '14px 24px', marginBottom: 24,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{members}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>Members</div>
            </div>
            <div style={{ width: 1, backgroundColor: '#1A3A1A' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#9CA3AF' }}>{flag}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{group.competition.replace(' 2026/27', '')}</div>
            </div>
            <div style={{ width: 1, backgroundColor: '#1A3A1A' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#2E9E5E' }}>🔒</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>Locked picks</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        {isLoggedIn ? (
          // Already logged in — go straight to join
          <Link href={`/groups?join=${code}`} style={{
            display: 'block', width: '100%', textAlign: 'center',
            backgroundColor: color, color: 'white',
            padding: '15px', borderRadius: 12,
            fontSize: 15, fontWeight: 800,
            textDecoration: 'none',
            boxShadow: `0 0 24px ${color}40`,
          }}>
            Join {group.name} →
          </Link>
        ) : (
          <>
            <Link href={`/auth?redirect=/join/${code}`} style={{
              display: 'block', width: '100%', textAlign: 'center',
              backgroundColor: color, color: 'white',
              padding: '15px', borderRadius: 12,
              fontSize: 15, fontWeight: 800,
              textDecoration: 'none',
              boxShadow: `0 0 24px ${color}40`,
              marginBottom: 10,
            }}>
              Join League — Sign Up Free →
            </Link>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#4B5563', margin: 0 }}>
              Already have an account?{' '}
              <Link href={`/auth?redirect=/join/${code}`} style={{ color, fontWeight: 700, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </>
        )}

        {/* Trust signals */}
        <div style={{
          marginTop: 24, padding: '14px',
          backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
          borderRadius: 10, textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
            🔒 Predictions locked at kickoff · Permanent record<br />
            Free forever · No betting · No card required
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none' }}>
            ← Back to Flipseer
          </Link>
        </div>

      </div>
    </main>
  );
}

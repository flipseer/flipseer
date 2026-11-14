'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

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

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string)?.toUpperCase() || '';

  const [group, setGroup] = useState<any>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [{ data: groupData }, { data: { session } }] = await Promise.all([
        supabase.from('groups').select('id, name, competition, description, invite_code').eq('invite_code', code).single(),
        supabase.auth.getSession(),
      ]);

      if (!groupData) { router.replace('/groups'); return; }

      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupData.id);

      setGroup(groupData);
      setMemberCount(count || 0);
      setIsLoggedIn(!!session);
      setLoading(false);
    };
    load();
  }, [code]);

  const handleJoin = async () => {
    if (!isLoggedIn) {
      router.push(`/auth?redirect=/groups/join/${code}`);
      return;
    }
    setJoining(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push(`/auth?redirect=/groups/join/${code}`); return; }

    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', session.user.id)
      .single();

    if (!existing) {
      await supabase.from('group_members').insert({
        group_id: group.id,
        user_id: session.user.id,
        joined_via_invite: true,
      });
    }
    setJoined(true);
    setJoining(false);
    setTimeout(() => router.push('/groups'), 1500);
  };

  if (loading) return (
    <main style={{ backgroundColor: '#080F09', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚽</div>
        <p>Loading league...</p>
      </div>
    </main>
  );

  if (!group) return null;

  const flag = COMP_FLAG[group.competition] || '⚽';
  const color = COMP_COLOR[group.competition] || '#2E9E5E';

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
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color, marginBottom: 8 }}>
            YOU'VE BEEN INVITED TO JOIN
          </div>
          <h1 style={{ fontSize: 'clamp(20px,5vw,26px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            {group.name}
          </h1>
          {group.description && (
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>{group.description}</p>
          )}

          {/* Stats row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 24,
            backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
            borderRadius: 12, padding: '14px 24px', marginBottom: 24,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{memberCount}</div>
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
        {joined ? (
          <div style={{
            textAlign: 'center', backgroundColor: `${color}20`,
            border: `1px solid ${color}`, borderRadius: 12, padding: '20px',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 15, fontWeight: 800, color }}>Joined! Redirecting...</div>
          </div>
        ) : (
          <>
            <button
              onClick={handleJoin}
              disabled={joining}
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                backgroundColor: joining ? `${color}80` : color,
                color: 'white', padding: '15px', borderRadius: 12,
                fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer',
                boxShadow: `0 0 24px ${color}40`, marginBottom: 10,
              }}
            >
              {joining ? 'Joining...' : isLoggedIn ? `Join ${group.name} →` : 'Join League — Sign Up Free →'}
            </button>
            {!isLoggedIn && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#4B5563', margin: 0 }}>
                Already have an account?{' '}
                <Link href={`/auth?redirect=/groups/join/${code}`} style={{ color, fontWeight: 700, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            )}
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

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 12, color: '#4B5563', textDecoration: 'none' }}>← Back to Flipseer</Link>
        </div>
      </div>
    </main>
  );
}

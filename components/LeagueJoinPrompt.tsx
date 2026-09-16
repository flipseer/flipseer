'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();

const OFFICIAL_LEAGUES = [
  { code: 'FLIP-GLB1', name: 'Global Flipseer League', flag: '🌍', comp: 'All competitions', color: '#2E9E5E', desc: 'EPL · UCL · Liga 1 · Ghana PL' },
  { code: 'FLIP-EPL1', name: 'Flipseer EPL League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', comp: 'EPL 2026/27', color: '#8B5CF6', desc: 'Premier League predictions' },
  { code: 'FLIP-UCL1', name: 'Flipseer UCL League', flag: '⭐', comp: 'UCL 2026/27', color: '#A78BFA', desc: 'Champions League predictions' },
  { code: 'FLIP-AFR1', name: 'Ghana Premier League Community', flag: '🇬🇭', comp: 'Ghana PL 2026/27', color: '#F59E0B', desc: 'Predict Ghana Premier League matches' },
  { code: 'FLIP-ASI1', name: 'Indonesia Liga 1 Community', flag: '🇮🇩', comp: 'Liga 1 2026/27', color: '#CE1126', desc: 'Predict Liga 1 Indonesia matches' },
];

export default function LeagueJoinPrompt({ userId, username, onDone }: { userId: string; username: string; onDone?: () => void }) {
  const [show, setShow] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);
  const [joined, setJoined] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const dismissed = localStorage.getItem('flipseer_league_prompt_dismissed');
    if (dismissed) return;
    // Check if user is already in any league
    supabase.from('group_members').select('group_id').eq('user_id', userId).then(({ data }) => {
      if (!data || data.length === 0) {
        // Show prompt after 1.5s
        setTimeout(() => setShow(true), 1500);
      }
    });
  }, [userId]);

  const handleJoin = async (league: typeof OFFICIAL_LEAGUES[0]) => {
    setJoining(league.code);
    const { data: group } = await supabase.from('groups').select('*').eq('invite_code', league.code).single();
    if (!group) { setJoining(null); return; }
    const { data: existing } = await supabase.from('group_members').select('id').eq('group_id', group.id).eq('user_id', userId).single();
    if (!existing) {
      await supabase.from('group_members').insert({ group_id: group.id, user_id: userId, joined_via_invite: false });
    }
    setJoined(prev => [...prev, league.code]);
    setJoining(null);
  };

  const handleDone = () => {
    localStorage.setItem('flipseer_league_prompt_dismissed', '1');
    setShow(false);
    setDone(true);
    if (onDone) onDone();
  };

  if (!show || done) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 500, padding: '0' }}
      onClick={e => { if (e.target === e.currentTarget) handleDone(); }}>
      <div style={{ width: '100%', maxWidth: '480px', background: '#0D1F0F', border: '1px solid #2D1B69', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', animation: 'slideUp .3s ease' }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

        {/* Handle bar */}
        <div style={{ width: '40px', height: '4px', background: '#2D1B69', borderRadius: '999px', margin: '0 auto 20px' }} />

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 6px' }}>Join a League, @{username}</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            Compete with the Flipseer community. Pick one or more leagues.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {OFFICIAL_LEAGUES.map(league => {
            const isJoined = joined.includes(league.code);
            const isJoining = joining === league.code;
            return (
              <div key={league.code} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: isJoined ? league.color + '15' : '#0D2B14', border: '1px solid ' + (isJoined ? league.color : '#1A3A1A'), borderRadius: '12px', padding: '12px 14px', transition: 'all .2s' }}>
                <div style={{ width: '38px', height: '38px', background: league.color + '20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {league.flag}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: isJoined ? league.color : 'white', marginBottom: '1px' }}>{league.name}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>{league.desc}</div>
                </div>
                <button onClick={() => !isJoined && handleJoin(league)} disabled={isJoining || isJoined}
                  style={{ padding: '6px 14px', background: isJoined ? 'transparent' : league.color, color: isJoined ? league.color : 'white', border: isJoined ? '1px solid ' + league.color : 'none', borderRadius: '7px', cursor: isJoined ? 'default' : 'pointer', fontSize: '12px', fontWeight: 'bold', flexShrink: 0, minWidth: '60px', textAlign: 'center' }}>
                  {isJoining ? '...' : isJoined ? '✓ Joined' : 'Join'}
                </button>
              </div>
            );
          })}
        </div>

        <button onClick={handleDone}
          style={{ width: '100%', padding: '12px', background: joined.length > 0 ? '#8B5CF6' : 'transparent', color: joined.length > 0 ? 'white' : '#6B7280', border: joined.length > 0 ? 'none' : '1px solid #1A3A1A', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
          {joined.length > 0 ? `Done — joined ${joined.length} league${joined.length > 1 ? 's' : ''} ✓` : 'Maybe later'}
        </button>

        {joined.length > 0 && (
          <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', marginTop: '10px' }}>
            View your leagues → <a href="/groups" style={{ color: '#8B5CF6', textDecoration: 'none', fontWeight: 'bold' }}>flipseer.com/groups</a>
          </p>
        )}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

const COMPETITIONS = [
  'EPL 2026/27',
  'UCL 2026/27',
  'Liga 1 2026/27',
  'Ghana PL 2026/27',
  'ISL 2026/27',
  'NPFL 2026/27',
];

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

type Group = {
  id: string;
  name: string;
  competition: string;
  description: string | null;
  invite_code: string;
  created_by: string;
  member_count?: number;
  is_owner?: boolean;
};

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'FLIP-' + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function GroupsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  // Create form state
  const [groupName, setGroupName] = useState('');
  const [groupComp, setGroupComp] = useState('Ghana PL 2026/27');
  const [groupDesc, setGroupDesc] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth?redirect=/groups'); return; }
      setUser(session.user);
      await loadGroups(session.user.id);

      // Handle ?join=CODE from invite link redirect
      const joinCode = searchParams.get('join');
      if (joinCode) {
        await handleJoinByCode(joinCode.toUpperCase(), session.user.id);
      }
    };
    init();
  }, []);

  const loadGroups = async (userId: string) => {
    // Get groups user is a member of
    const { data: memberships } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId);

    if (!memberships?.length) { setGroups([]); setLoading(false); return; }

    const groupIds = memberships.map((m: any) => m.group_id);

    const { data: groupData } = await supabase
      .from('groups')
      .select('id, name, competition, description, invite_code, created_by')
      .in('id', groupIds);

    if (!groupData?.length) { setGroups([]); setLoading(false); return; }

    // Get member counts
    const enriched = await Promise.all(groupData.map(async (g: any) => {
      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', g.id);
      return { ...g, member_count: count || 0, is_owner: g.created_by === userId };
    }));

    setGroups(enriched);
    setLoading(false);
  };

  const handleJoinByCode = async (code: string, userId: string) => {
    const { data: group } = await supabase
      .from('groups')
      .select('id, name, competition')
      .eq('invite_code', code)
      .single();

    if (!group) { setJoinError('Invalid invite code.'); return; }

    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      await supabase.from('group_members').insert({
        group_id: group.id,
        user_id: userId,
        joined_via_invite: true,
      });
    }

    const flag = COMP_FLAG[group.competition] || '⚽';
    setJoinSuccess(`${flag} Joined "${group.name}"!`);
    await loadGroups(userId);
    setTimeout(() => setJoinSuccess(''), 4000);
  };

  const handleCreate = async () => {
    if (!groupName.trim() || !user) return;
    setCreating(true);

    const code = generateCode();
    const { data: newGroup, error } = await supabase
      .from('groups')
      .insert({
        name: groupName.trim(),
        competition: groupComp,
        description: groupDesc.trim() || null,
        invite_code: code,
        created_by: user.id,
      })
      .select('id')
      .single();

    if (!error && newGroup) {
      await supabase.from('group_members').insert({
        group_id: newGroup.id,
        user_id: user.id,
      });
      await loadGroups(user.id);
    }

    setGroupName('');
    setGroupDesc('');
    setGroupComp('Ghana PL 2026/27');
    setShowCreate(false);
    setCreating(false);
  };

  const copyInviteLink = async (code: string) => {
    const link = `https://flipseer.com/groups/join/${code}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // fallback: select text
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const shareWhatsApp = (group: Group) => {
    const flag = COMP_FLAG[group.competition] || '⚽';
    const comp = group.competition.replace(' 2026/27', '');
    const link = `https://flipseer.com/groups/join/${group.invite_code}`;
    const text = `${flag} Join my private ${comp} prediction league on Flipseer!\n\n*${group.name}* — ${group.member_count} member${group.member_count === 1 ? '' : 's'}\n\nPredict matches, build your football reputation, compete with friends.\nFree forever. No betting.\n\n👉 ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTelegram = (group: Group) => {
    const flag = COMP_FLAG[group.competition] || '⚽';
    const comp = group.competition.replace(' 2026/27', '');
    const link = `https://flipseer.com/groups/join/${group.invite_code}`;
    const text = `${flag} Join my private ${comp} prediction league — ${group.name}. Free, no betting. Prove your football intelligence!\n👉 ${link}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return (
    <main style={{ backgroundColor: '#02081F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚽</div>
        <p>Loading leagues...</p>
      </div>
    </main>
  );

  return (
    <main style={{
      backgroundColor: '#02081F',
      minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white',
      paddingBottom: 60,
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #0D2B14 0%, #02081F 100%)',
        borderBottom: '1px solid #1A3A1A',
        padding: '20px 16px 24px',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#2E9E5E', marginBottom: 4 }}>
                FLIPSEER
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                Private Leagues
              </h1>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                backgroundColor: '#2E9E5E',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              + New League
            </button>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '8px 0 0' }}>
            Compete with friends. Prove your football intelligence.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px' }}>

        {/* Join success / error banners */}
        {joinSuccess && (
          <div style={{
            margin: '16px 0 0',
            backgroundColor: '#0D2B14', border: '1px solid #2E9E5E',
            borderRadius: 10, padding: '12px 16px',
            fontSize: 14, fontWeight: 700, color: '#2E9E5E',
          }}>
            ✅ {joinSuccess}
          </div>
        )}
        {joinError && (
          <div style={{
            margin: '16px 0 0',
            backgroundColor: '#2B0D0D', border: '1px solid #9E2E2E',
            borderRadius: 10, padding: '12px 16px',
            fontSize: 14, color: '#F87171',
          }}>
            ❌ {joinError}
          </div>
        )}

        {/* Empty state */}
        {groups.length === 0 && (
          <div style={{
            marginTop: 48, textAlign: 'center',
            backgroundColor: '#0D1A0F', border: '1px dashed #1A3A1A',
            borderRadius: 16, padding: '40px 24px',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No leagues yet</div>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 20px' }}>
              Create a private league and invite your friends via WhatsApp.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                backgroundColor: '#2E9E5E', color: 'white',
                border: 'none', borderRadius: 10,
                padding: '12px 28px', fontSize: 14,
                fontWeight: 800, cursor: 'pointer',
              }}
            >
              Create Your First League →
            </button>
          </div>
        )}

        {/* Groups list */}
        {groups.map(group => {
          const flag = COMP_FLAG[group.competition] || '⚽';
          const color = COMP_COLOR[group.competition] || '#2E9E5E';
          const isCopied = copiedCode === group.invite_code;
          return (
            <div key={group.id} style={{
              marginTop: 16,
              backgroundColor: '#0D1A0F',
              border: `1px solid ${color}30`,
              borderRadius: 14,
              overflow: 'hidden',
            }}>
              {/* Group header */}
              <div style={{
                padding: '16px 16px 12px',
                borderBottom: `1px solid ${color}20`,
                background: `linear-gradient(135deg, ${color}10 0%, transparent 100%)`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    backgroundColor: `${color}20`,
                    border: `2px solid ${color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {flag}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>
                        {group.name}
                      </div>
                      {group.is_owner && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: 1,
                          color: color, backgroundColor: `${color}20`,
                          padding: '2px 7px', borderRadius: 999,
                        }}>
                          OWNER
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                      {group.competition.replace(' 2026/27', '')} · {group.member_count} member{group.member_count === 1 ? '' : 's'}
                    </div>
                    {group.description && (
                      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                        {group.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Invite code row */}
              <div style={{
                padding: '10px 16px',
                borderBottom: `1px solid #1A2A1A`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 11, color: '#4B5563', flexShrink: 0 }}>Invite code:</span>
                <code style={{
                  fontSize: 13, fontWeight: 800, color: color,
                  backgroundColor: `${color}15`, padding: '3px 8px',
                  borderRadius: 6, letterSpacing: 1, flex: 1,
                }}>
                  {group.invite_code}
                </code>
                <button
                  onClick={() => copyInviteLink(group.invite_code)}
                  style={{
                    backgroundColor: isCopied ? '#0D2B14' : '#1A2A1A',
                    border: `1px solid ${isCopied ? '#2E9E5E' : '#2A3A2A'}`,
                    color: isCopied ? '#2E9E5E' : '#9CA3AF',
                    borderRadius: 7, padding: '5px 10px',
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    whiteSpace: 'nowrap', transition: 'all 0.2s',
                  }}
                >
                  {isCopied ? '✓ Copied!' : '📋 Copy Link'}
                </button>
              </div>

              {/* Share buttons */}
              <div style={{ padding: '10px 16px', display: 'flex', gap: 8 }}>
                <button
                  onClick={() => shareWhatsApp(group)}
                  style={{
                    flex: 1,
                    backgroundColor: '#128C7E',
                    color: 'white', border: 'none',
                    borderRadius: 8, padding: '9px 0',
                    fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  <span style={{ fontSize: 14 }}>📱</span> WhatsApp
                </button>
                <button
                  onClick={() => shareTelegram(group)}
                  style={{
                    flex: 1,
                    backgroundColor: '#2AABEE',
                    color: 'white', border: 'none',
                    borderRadius: 8, padding: '9px 0',
                    fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  <span style={{ fontSize: 14 }}>✈️</span> Telegram
                </button>
                <Link
                  href={`/groups/${group.id}`}
                  style={{
                    flex: 1,
                    backgroundColor: '#1A2A1A',
                    color: '#9CA3AF', border: '1px solid #2A3A2A',
                    borderRadius: 8, padding: '9px 0',
                    fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 5,
                    textDecoration: 'none',
                  }}
                >
                  🏆 Leaderboard
                </Link>
              </div>
            </div>
          );
        })}

        {/* How it works — shown when groups exist */}
        {groups.length > 0 && (
          <div style={{
            marginTop: 24,
            backgroundColor: '#0D1A0F',
            border: '1px solid #1A3A1A',
            borderRadius: 12, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#4B5563', marginBottom: 8 }}>
              HOW SEEDING WORKS
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.7 }}>
              📱 Share the WhatsApp link in your football group chats<br />
              🔗 Friends tap the link → see your league → join in seconds<br />
              🏆 Everyone predicts → leaderboard updates live<br />
              🔥 Top predictor gets bragging rights
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 500, padding: '0 0 0',
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div style={{
            backgroundColor: '#0D1A0F',
            border: '1px solid #2E9E5E',
            borderRadius: '20px 20px 0 0',
            padding: '24px 20px 36px',
            width: '100%', maxWidth: 500,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Create Private League</div>
              <button onClick={() => setShowCreate(false)} style={{
                backgroundColor: 'transparent', border: 'none',
                color: '#6B7280', fontSize: 20, cursor: 'pointer', padding: '0 4px',
              }}>✕</button>
            </div>

            {/* League name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#6B7280', display: 'block', marginBottom: 6 }}>
                LEAGUE NAME *
              </label>
              <input
                type="text"
                placeholder="e.g. Friday Night Foxes, Office Rivals..."
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                maxLength={40}
                style={{
                  width: '100%', backgroundColor: '#0D2B14',
                  border: '1px solid #1A4A1A', borderRadius: 8,
                  padding: '11px 14px', color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Competition */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#6B7280', display: 'block', marginBottom: 6 }}>
                COMPETITION
              </label>
              <select
                value={groupComp}
                onChange={e => setGroupComp(e.target.value)}
                style={{
                  width: '100%', backgroundColor: '#0D2B14',
                  border: '1px solid #1A4A1A', borderRadius: 8,
                  padding: '11px 14px', color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  appearance: 'none',
                }}
              >
                {COMPETITIONS.map(c => (
                  <option key={c} value={c}>{COMP_FLAG[c]} {c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#6B7280', display: 'block', marginBottom: 6 }}>
                DESCRIPTION <span style={{ color: '#4B5563', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Work friends only, Best predictions win bragging rights"
                value={groupDesc}
                onChange={e => setGroupDesc(e.target.value)}
                maxLength={80}
                style={{
                  width: '100%', backgroundColor: '#0D2B14',
                  border: '1px solid #1A4A1A', borderRadius: 8,
                  padding: '11px 14px', color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={!groupName.trim() || creating}
              style={{
                width: '100%',
                backgroundColor: groupName.trim() ? '#2E9E5E' : '#1A3A1A',
                color: 'white', border: 'none',
                borderRadius: 10, padding: '14px',
                fontSize: 15, fontWeight: 800,
                cursor: groupName.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              {creating ? 'Creating...' : '🏆 Create League & Get Invite Link →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: '#4B5563', margin: '12px 0 0' }}>
              An invite link is generated instantly. Share via WhatsApp or Telegram.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

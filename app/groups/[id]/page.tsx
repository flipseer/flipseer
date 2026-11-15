'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

const MEDALS = ['🥇', '🥈', '🥉'];

type Group = {
  id: string;
  name: string;
  competition: string;
  description: string | null;
  invite_code: string;
  created_by: string;
};

type Member = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  total_predictions: number;
  correct_predictions: number;
  points: number;
  accuracy: number;
  rank: number;
  is_me: boolean;
};

export default function GroupLeaderboardPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [notMember, setNotMember] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push(`/auth?redirect=/groups/${groupId}`); return; }
      setUser(session.user);
      await loadLeaderboard(session.user.id);
    };
    init();
  }, [groupId]);

  const loadLeaderboard = async (userId: string) => {
    // Load group info
    const { data: groupData } = await supabase
      .from('groups')
      .select('id, name, competition, description, invite_code, created_by')
      .eq('id', groupId)
      .single();

    if (!groupData) { setLoading(false); return; }
    setGroup(groupData);

    // Check membership
    const { data: myMembership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (!myMembership) { setNotMember(true); setLoading(false); return; }

    // Get all members
    const { data: memberRows } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', groupId);

    if (!memberRows?.length) { setLoading(false); return; }

    const memberIds = memberRows.map((m: any) => m.user_id);

    // Get profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .in('id', memberIds);

    // Get prediction stats per member
    const enriched: Member[] = await Promise.all(memberIds.map(async (uid: string) => {
      const profile = profiles?.find((p: any) => p.id === uid);

      // Count total predictions
      const { count: total } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid);

      // Count correct predictions (where result matches prediction)
      const { count: correct } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid)
        .eq('is_correct', true);

      const totalPred = total || 0;
      const correctPred = correct || 0;
      const accuracy = totalPred > 0 ? Math.round((correctPred / totalPred) * 100) : 0;
      // Points: 3 per correct + bonus for activity
      const points = correctPred * 3 + Math.floor(totalPred * 0.5);

      return {
        user_id: uid,
        display_name: profile?.display_name || 'Anonymous',
        avatar_url: profile?.avatar_url || null,
        total_predictions: totalPred,
        correct_predictions: correctPred,
        points,
        accuracy,
        rank: 0,
        is_me: uid === userId,
      };
    }));

    // Sort by points desc, then accuracy
    enriched.sort((a, b) => b.points - a.points || b.accuracy - a.accuracy);
    enriched.forEach((m, i) => { m.rank = i + 1; });

    setMembers(enriched);
    setLoading(false);
  };

  const shareWhatsApp = () => {
    if (!group) return;
    const flag = COMP_FLAG[group.competition] || '⚽';
    const comp = group.competition.replace(' 2026/27', '');
    const link = `https://flipseer.com/groups/join/${group.invite_code}`;
    const text = `${flag} Join my private ${comp} prediction league on Flipseer!\n\n*${group.name}* — ${members.length} member${members.length === 1 ? '' : 's'}\n\nPredict matches, build your football reputation, compete with friends.\nFree forever. No betting.\n\n👉 ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyInviteLink = async () => {
    if (!group) return;
    const link = `https://flipseer.com/groups/join/${group.invite_code}`;
    try { await navigator.clipboard.writeText(link); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return (
    <main style={{ backgroundColor: '#02081F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <p>Loading leaderboard...</p>
      </div>
    </main>
  );

  if (!group) return (
    <main style={{ backgroundColor: '#02081F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
        <p>League not found.</p>
        <Link href="/groups" style={{ color: '#2E9E5E' }}>← Back to leagues</Link>
      </div>
    </main>
  );

  if (notMember) return (
    <main style={{ backgroundColor: '#02081F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'Arial, sans-serif', padding: '0 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <p style={{ color: 'white', fontWeight: 700 }}>You're not in this league.</p>
        <Link
          href={`/groups/join/${group.invite_code}`}
          style={{
            display: 'inline-block', marginTop: 12,
            backgroundColor: '#2E9E5E', color: 'white',
            padding: '10px 24px', borderRadius: 10,
            textDecoration: 'none', fontWeight: 800, fontSize: 14,
          }}
        >
          Join This League →
        </Link>
      </div>
    </main>
  );

  const flag = COMP_FLAG[group.competition] || '⚽';
  const color = COMP_COLOR[group.competition] || '#2E9E5E';
  const myEntry = members.find(m => m.is_me);

  return (
    <main style={{
      backgroundColor: '#02081F',
      minHeight: '100vh',
      fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif",
      color: 'white',
      paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, ${color}22 0%, #02081F 100%)`,
        borderBottom: `1px solid ${color}30`,
        padding: '20px 16px 20px',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Link href="/groups" style={{
            fontSize: 12, color: '#6B7280', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12,
          }}>
            ← Private Leagues
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              backgroundColor: `${color}20`, border: `2px solid ${color}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>
              {flag}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
                {group.name}
              </h1>
              <div style={{ fontSize: 12, color: '#6B7280' }}>
                {group.competition.replace(' 2026/27', '')} · {members.length} member{members.length === 1 ? '' : 's'}
              </div>
              {group.description && (
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{group.description}</div>
              )}
            </div>
          </div>

          {/* Share row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button
              onClick={shareWhatsApp}
              style={{
                flex: 1, backgroundColor: '#128C7E', color: 'white',
                border: 'none', borderRadius: 8, padding: '9px 0',
                fontSize: 12, fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              📱 Invite via WhatsApp
            </button>
            <button
              onClick={copyInviteLink}
              style={{
                backgroundColor: copied ? '#0D2B14' : '#1A2A1A',
                border: `1px solid ${copied ? '#2E9E5E' : '#2A3A2A'}`,
                color: copied ? '#2E9E5E' : '#9CA3AF',
                borderRadius: 8, padding: '9px 14px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Copied!' : '📋 Copy Link'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px' }}>

        {/* My rank card */}
        {myEntry && (
          <div style={{
            margin: '20px 0 0',
            backgroundColor: `${color}15`,
            border: `1px solid ${color}40`,
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              fontSize: 28, width: 44, textAlign: 'center', flexShrink: 0,
            }}>
              {myEntry.rank <= 3 ? MEDALS[myEntry.rank - 1] : `#${myEntry.rank}`}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: color, marginBottom: 2 }}>
                YOUR STANDING
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{myEntry.points}</div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>pts</div>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{myEntry.accuracy}%</div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{myEntry.correct_predictions}/{myEntry.total_predictions}</div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>correct</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#4B5563', marginBottom: 10 }}>
            LEADERBOARD
          </div>

          {members.length === 0 && (
            <div style={{
              textAlign: 'center', backgroundColor: '#0D1A0F',
              border: '1px dashed #1A3A1A', borderRadius: 12, padding: '32px 16px',
              color: '#6B7280', fontSize: 13,
            }}>
              No predictions yet. Be the first to predict!
            </div>
          )}

          {members.map((member, i) => {
            const isMe = member.is_me;
            const medal = i < 3 ? MEDALS[i] : null;
            return (
              <div key={member.user_id} style={{
                marginBottom: 8,
                backgroundColor: isMe ? `${color}12` : '#0D1A0F',
                border: `1px solid ${isMe ? color + '40' : '#1A2A1A'}`,
                borderRadius: 10, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s',
              }}>
                {/* Rank */}
                <div style={{
                  width: 32, textAlign: 'center', flexShrink: 0,
                  fontSize: medal ? 20 : 13,
                  fontWeight: 800,
                  color: medal ? 'inherit' : '#4B5563',
                }}>
                  {medal || `#${member.rank}`}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  backgroundColor: `${color}20`,
                  border: `1.5px solid ${isMe ? color : '#2A3A2A'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0, overflow: 'hidden',
                }}>
                  {member.avatar_url
                    ? <img src={member.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '👤'
                  }
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: isMe ? 'white' : '#E5E7EB',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {member.display_name}{isMe ? ' (you)' : ''}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>
                    {member.correct_predictions}/{member.total_predictions} correct · {member.accuracy}% accuracy
                  </div>
                </div>

                {/* Points */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize: 18, fontWeight: 800,
                    color: i === 0 ? '#F59E0B' : isMe ? color : 'white',
                  }}>
                    {member.points}
                  </div>
                  <div style={{ fontSize: 10, color: '#4B5563' }}>pts</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Points system explanation */}
        <div style={{
          marginTop: 24,
          backgroundColor: '#0D1A0F',
          border: '1px solid #1A3A1A',
          borderRadius: 12, padding: '14px 16px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#4B5563', marginBottom: 8 }}>
            HOW POINTS WORK
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.7 }}>
            ✅ +3 pts for every correct prediction<br />
            ⚽ +0.5 pts per prediction (activity bonus)<br />
            🏆 Leaderboard updates after each match result
          </div>
        </div>

        {/* Predict CTA */}
        <Link href="/predict" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 16, gap: 8,
          backgroundColor: '#2E9E5E', color: 'white',
          borderRadius: 12, padding: '14px',
          fontSize: 15, fontWeight: 800, textDecoration: 'none',
        }}>
          ⚽ Make Predictions Now →
        </Link>
      </div>
    </main>
  );
}

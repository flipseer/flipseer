'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export default function GroupsPage() {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [activeGroup, setActiveGroup] = useState<any>(null);
  const [groupLeaders, setGroupLeaders] = useState<any[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'FLIP-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/auth'; return; }
      setUserId(session.user.id);

      const { data: profile } = await supabase
        .from('profiles').select('username').eq('id', session.user.id).single();
      if (profile?.username) setUsername(profile.username);

      await loadMyGroups(session.user.id);
      setLoading(false);
    };
    init();
  }, []);

  const loadMyGroups = async (uid: string) => {
    const { data: memberships } = await supabase
      .from('group_members')
      .select('group_id, joined_at')
      .eq('user_id', uid);

    if (!memberships || memberships.length === 0) {
      setMyGroups([]);
      return;
    }

    const groupIds = memberships.map(m => m.group_id);
    const { data: groups } = await supabase
      .from('groups')
      .select('*')
      .in('id', groupIds);

    if (!groups) return;

    const groupsWithCount = await Promise.all(groups.map(async (g) => {
      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', g.id);
      return { ...g, member_count: count || 0 };
    }));

    setMyGroups(groupsWithCount);
  };

  const handleCreate = async () => {
    if (!newGroupName.trim()) { showMessage('Please enter a group name', 'error'); return; }
    setCreating(true);
    const code = generateInviteCode();

    const { data: group, error } = await supabase
      .from('groups')
      .insert({
        name: newGroupName.trim(),
        description: newGroupDesc.trim() || null,
        creator_id: userId,
        invite_code: code,
      })
      .select()
      .single();

    if (error || !group) {
      showMessage('Failed to create group. Try again.', 'error');
      setCreating(false);
      return;
    }

    await supabase.from('group_members').insert({
      group_id: group.id,
      user_id: userId,
    });

    setNewGroupName('');
    setNewGroupDesc('');
    await loadMyGroups(userId);
    showMessage('Group created! Share the code: ' + code);
    setCreating(false);
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) { showMessage('Please enter an invite code', 'error'); return; }
    setJoining(true);

    const { data: group } = await supabase
      .from('groups')
      .select('*')
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .single();

    if (!group) {
      showMessage('Invalid invite code. Check and try again.', 'error');
      setJoining(false);
      return;
    }

    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      showMessage('You are already in this group!', 'error');
      setJoining(false);
      return;
    }

    await supabase.from('group_members').insert({
      group_id: group.id,
      user_id: userId,
    });

    setInviteCode('');
    await loadMyGroups(userId);
    showMessage('Joined ' + group.name + '! Good luck!');
    setJoining(false);
  };

  const handleViewLeaderboard = async (group: any) => {
    setActiveGroup(group);
    setLoadingLeaders(true);

    const { data: members } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', group.id);

    if (!members || members.length === 0) {
      setGroupLeaders([]);
      setLoadingLeaders(false);
      return;
    }

    const memberIds = members.map(m => m.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, total_points, accuracy_pct, streak, rank, rank_icon, country, prediction_count')
      .in('id', memberIds)
      .order('total_points', { ascending: false });

    setGroupLeaders(profiles || []);
    setLoadingLeaders(false);
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!confirm('Leave this group?')) return;
    await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    setActiveGroup(null);
    await loadMyGroups(userId);
    showMessage('Left the group.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => showMessage('Invite code copied!'));
  };

  const shareGroup = (group: any) => {
    const text = 'Join my Flipseer group "' + group.name + '" and compete on World Cup 2026 predictions!\nUse invite code: ' + group.invite_code + '\nJoin at: flipseer.com/groups';
    if (navigator.share) {
      navigator.share({ title: 'Join ' + group.name + ' on Flipseer', text, url: 'https://flipseer.com/groups' });
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }
  };

  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <p style={{ color: '#2E9E5E', fontSize: '18px' }}>Loading groups...</p>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', padding: '0 0 60px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 20px 0' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', color: '#2E9E5E', marginBottom: '8px' }}>&#x1F465; Private Groups</h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Compete with friends, family, or your WhatsApp gang</p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div style={{ backgroundColor: messageType === 'success' ? 'rgba(46,158,94,0.15)' : 'rgba(239,68,68,0.15)', border: '1px solid ' + (messageType === 'success' ? '#2E9E5E' : '#EF4444'), borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', color: messageType === 'success' ? '#6EE7B7' : '#FCA5A5', fontWeight: 'bold' }}>
            {messageType === 'success' ? '&#x2705; ' : '&#x26A0; '}{message}
          </div>
        )}

        {/* GROUP LEADERBOARD MODAL */}
        {activeGroup && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: 0, marginBottom: '4px' }}>{activeGroup.name}</h2>
                <span style={{ fontSize: '11px', color: '#6B7280', backgroundColor: '#0D1F0F', padding: '2px 10px', borderRadius: '999px', border: '1px solid #1A3A1A' }}>
                  Code: {activeGroup.invite_code}
                </span>
              </div>
              <button onClick={() => setActiveGroup(null)} style={{ backgroundColor: 'transparent', border: '1px solid #374151', color: '#6B7280', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                Close
              </button>
            </div>

            {loadingLeaders ? (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>Loading leaderboard...</p>
            ) : groupLeaders.length === 0 ? (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>No predictions yet. Kick things off!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {groupLeaders.map((leader, i) => {
                  const isMe = leader.id === userId;
                  const medal = i === 0 ? '&#x1F947;' : i === 1 ? '&#x1F948;' : i === 2 ? '&#x1F949;' : '#' + (i + 1);
                  return (
                    <div key={leader.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '10px', border: '1px solid ' + (isMe ? '#2E9E5E' : i < 3 ? '#F59E0B40' : '#1A7A4A'), backgroundColor: isMe ? 'rgba(46,158,94,0.1)' : i === 0 ? 'rgba(245,158,11,0.06)' : '#0D1F0F' }}>
                      <div style={{ fontSize: '18px', width: '28px', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: medal }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                          {leader.username} {isMe && <span style={{ fontSize: '10px', color: '#2E9E5E', backgroundColor: 'rgba(46,158,94,0.2)', padding: '1px 8px', borderRadius: '999px', marginLeft: '4px' }}>YOU</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                          {leader.rank_icon} {leader.rank} &middot; {leader.prediction_count} predictions
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#2E9E5E' }}>{leader.total_points} pts</div>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>{leader.accuracy_pct}% acc</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* GROUP ACTIONS */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => shareGroup(activeGroup)} style={{ flex: 1, padding: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                &#x1F4F1; Invite via WhatsApp
              </button>
              <button onClick={() => copyToClipboard(activeGroup.invite_code)} style={{ flex: 1, padding: '10px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                &#x1F4CB; Copy Code
              </button>
              <button onClick={() => handleLeaveGroup(activeGroup.id)} style={{ padding: '10px 16px', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                Leave
              </button>
            </div>
          </div>
        )}

        {/* MY GROUPS */}
        {myGroups.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', marginBottom: '12px', color: '#9CA3AF', letterSpacing: '1px', fontSize: '12px', fontWeight: 'bold' }}>YOUR GROUPS</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myGroups.map((group) => (
                <div key={group.id} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ fontSize: '28px' }}>&#x1F3C6;</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '3px' }}>{group.name}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
                      {group.member_count} member{group.member_count !== 1 ? 's' : ''} &middot; Code: <span style={{ color: '#2E9E5E', fontWeight: 'bold' }}>{group.invite_code}</span>
                    </div>
                    {group.description && <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '3px' }}>{group.description}</div>}
                  </div>
                  <button onClick={() => handleViewLeaderboard(group)} style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    View &#x2192;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREATE GROUP */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', marginBottom: '16px' }}>&#x2795; Create a Group</h2>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Group Name *</label>
            <input
              type="text"
              placeholder="e.g. India WhatsApp Gang"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              maxLength={40}
              style={{ width: '100%', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Description (optional)</label>
            <input
              type="text"
              placeholder="e.g. Office fantasy league"
              value={newGroupDesc}
              onChange={e => setNewGroupDesc(e.target.value)}
              maxLength={80}
              style={{ width: '100%', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button onClick={handleCreate} disabled={creating || !newGroupName.trim()} style={{ width: '100%', padding: '12px', backgroundColor: creating || !newGroupName.trim() ? '#1A3A20' : '#1A7A4A', color: creating || !newGroupName.trim() ? '#4B5563' : 'white', border: 'none', borderRadius: '8px', cursor: creating || !newGroupName.trim() ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
            {creating ? 'Creating...' : 'Create Group &#x2192;'}
          </button>
          <p style={{ fontSize: '11px', color: '#4B5563', marginTop: '10px', textAlign: 'center' }}>
            You will get a unique invite code to share with friends
          </p>
        </div>

        {/* JOIN GROUP */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', marginBottom: '16px' }}>&#x1F517; Join a Group</h2>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Invite Code</label>
            <input
              type="text"
              placeholder="e.g. FLIP-7X9K"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value.toUpperCase())}
              maxLength={9}
              style={{ width: '100%', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase' }}
            />
          </div>
          <button onClick={handleJoin} disabled={joining || !inviteCode.trim()} style={{ width: '100%', padding: '12px', backgroundColor: joining || !inviteCode.trim() ? '#1A3A20' : '#2E9E5E', color: joining || !inviteCode.trim() ? '#4B5563' : 'white', border: 'none', borderRadius: '8px', cursor: joining || !inviteCode.trim() ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
            {joining ? 'Joining...' : 'Join Group &#x2192;'}
          </button>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '6px' }}>&#x2139; How Groups Work</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>Private groups let you compete with friends, family, or your WhatsApp gang - separately from the global leaderboard.</p>

          {/* STEPS */}
          {[
            {
              step: '1',
              icon: '&#x2795;',
              title: 'Create a group',
              desc: 'Click "Create a Group", give it a name (e.g. "India WhatsApp Gang"), and optionally add a description. You instantly get a unique invite code like FLIP-7X9K.',
            },
            {
              step: '2',
              icon: '&#x1F4F1;',
              title: 'Share the invite code',
              desc: 'Send your invite code to friends via WhatsApp, Instagram, or text. Anyone with the code can join - no approval needed. You can also tap "Invite via WhatsApp" for a pre-written message.',
            },
            {
              step: '3',
              icon: '&#x26BD;',
              title: 'Everyone predicts normally',
              desc: 'Each member predicts matches on the Predict page as usual. Your predictions automatically count for both the global leaderboard AND your group leaderboard - no extra steps.',
            },
            {
              step: '4',
              icon: '&#x1F3C6;',
              title: 'Group leaderboard updates live',
              desc: 'After each match result is processed, your group leaderboard updates. Open your group and see exactly who called it best among your friends.',
            },
            {
              step: '5',
              icon: '&#x1F517;',
              title: 'Join multiple groups',
              desc: 'You can join as many groups as you like using different invite codes. Your same predictions and points count in all groups you are a member of.',
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{ display: 'flex', gap: '14px', marginBottom: '20px', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '36px', height: '36px', backgroundColor: '#1A7A4A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>{step}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '18px' }} dangerouslySetInnerHTML={{ __html: icon }} />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>{title}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.6' }}>{desc}</div>
              </div>
            </div>
          ))}

          {/* FAQ */}
          <div style={{ borderTop: '1px solid #1A3A1A', paddingTop: '20px', marginTop: '4px' }}>
            <p style={{ fontSize: '12px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '14px' }}>COMMON QUESTIONS</p>
            {[
              { q: 'Can I join a group after matches have started?', a: 'Yes. You can join anytime. Your existing predictions and points immediately appear on the group leaderboard.' },
              { q: 'Can the group creator remove members?', a: 'Not currently. Any member can leave a group voluntarily using the Leave button on the group leaderboard.' },
              { q: 'How many members can a group have?', a: 'No limit! Invite as many friends as you like. The more the better.' },
              { q: 'Do group predictions affect my global score?', a: 'Groups use your same global predictions and points. Nothing extra required - compete in both automatically.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold', marginBottom: '4px' }}>&#x2753; {q}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.6', paddingLeft: '20px' }}>{a}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

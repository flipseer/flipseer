'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import InviteBanner from '@/components/InviteBanner';
const supabase = createClient();
const FLAG: { [key: string]: string } = {
  'IN': '&#x1F1EE;&#x1F1F3;', 'ID': '&#x1F1EE;&#x1F1E9;',
  'NG': '&#x1F1F3;&#x1F1EC;', 'BR': '&#x1F1E7;&#x1F1F7;',
  'AR': '&#x1F1E6;&#x1F1F7;', 'GB': '&#x1F3F4;',
  'FR': '&#x1F1EB;&#x1F1F7;', 'DE': '&#x1F1E9;&#x1F1EA;',
  'ES': '&#x1F1EA;&#x1F1F8;', 'PT': '&#x1F1F5;&#x1F1F9;',
  'MX': '&#x1F1F2;&#x1F1FD;', 'US': '&#x1F1FA;&#x1F1F8;',
  'GH': '&#x1F1EC;&#x1F1ED;', 'MA': '&#x1F1F2;&#x1F1E6;',
  'JP': '&#x1F1EF;&#x1F1F5;', 'KR': '&#x1F1F0;&#x1F1F7;',
  'PK': '&#x1F1F5;&#x1F1F0;', 'BD': '&#x1F1E7;&#x1F1E9;',
  'TR': '&#x1F1F9;&#x1F1F7;', 'ZA': '&#x1F1FF;&#x1F1E6;',
};
const MEDALS = ['&#x1F947;', '&#x1F948;', '&#x1F949;'];
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FLIP-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
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
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(''), 3500);
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) { setInviteCode(joinCode.toUpperCase()); setShowJoin(true); }
    const isWelcome = params.get('welcome') === '1';
    if (isWelcome) { setShowCreate(true); showToast('Welcome! Create your first league →'); }
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/auth'; return; }
      setUserId(session.user.id);
      const { data: profile } = await supabase.from('profiles').select('username').eq('id', session.user.id).single();
      if (profile?.username) setUsername(profile.username);
      await loadMyGroups(session.user.id);
      setLoading(false);
    };
    init();
  }, []);
  const loadMyGroups = async (uid: string) => {
    const { data: memberships } = await supabase.from('group_members').select('group_id').eq('user_id', uid);
    if (!memberships?.length) { setMyGroups([]); return; }
    const groupIds = memberships.map(m => m.group_id);
    const { data: groups } = await supabase.from('groups').select('*').in('id', groupIds);
    if (!groups) return;
    const withCount = await Promise.all(groups.map(async (g) => {
      const { count } = await supabase.from('group_members').select('*', { count: 'exact', head: true }).eq('group_id', g.id);
      return { ...g, member_count: count || 0 };
    }));
    setMyGroups(withCount);
  };
  const handleCreate = async () => {
    if (!newGroupName.trim()) { showToast('Enter a group name', 'error'); return; }
    setCreating(true);
    const code = generateInviteCode();
    const { data: group, error } = await supabase.from('groups').insert({
      name: newGroupName.trim(), description: newGroupDesc.trim() || null,
      creator_id: userId, invite_code: code,
    }).select().single();
    if (error || !group) { showToast('Failed to create group', 'error'); setCreating(false); return; }
    await supabase.from('group_members').insert({ group_id: group.id, user_id: userId });
    setNewGroupName(''); setNewGroupDesc(''); setShowCreate(false);
    await loadMyGroups(userId);
    showToast('Group created! Code: ' + code);
    setCreating(false);
    handleViewLeaderboard({ ...group, member_count: 1 });
  };
  const handleJoin = async () => {
    if (!inviteCode.trim()) { showToast('Enter an invite code', 'error'); return; }
    setJoining(true);
    const { data: group } = await supabase.from('groups').select('*').eq('invite_code', inviteCode.trim().toUpperCase()).single();
    if (!group) { showToast('Invalid invite code', 'error'); setJoining(false); return; }
    const { data: existing } = await supabase.from('group_members').select('id').eq('group_id', group.id).eq('user_id', userId).single();
    if (existing) { showToast('Already in this group!', 'error'); setJoining(false); return; }
    await supabase.from('group_members').insert({ group_id: group.id, user_id: userId });
    setInviteCode(''); setShowJoin(false);
    await loadMyGroups(userId);
    showToast('Joined ' + group.name + '!');
    setJoining(false);
    handleViewLeaderboard(group);
  };
  const handleViewLeaderboard = async (group: any) => {
    setActiveGroup(group); setLoadingLeaders(true);
    const { data: members } = await supabase.from('group_members').select('user_id').eq('group_id', group.id);
    if (!members?.length) { setGroupLeaders([]); setLoadingLeaders(false); return; }
    const memberIds = members.map(m => m.user_id);
    const { data: profiles } = await supabase.from('profiles')
      .select('id, username, total_points, accuracy_pct, rank, rank_icon, country, prediction_count, correct_count')
      .in('id', memberIds).order('total_points', { ascending: false });
    setGroupLeaders(profiles || []);
    setLoadingLeaders(false);
  };
  const handleLeave = async (groupId: string) => {
    if (!confirm('Leave this group?')) return;
    await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId);
    setActiveGroup(null);
    await loadMyGroups(userId);
    showToast('Left the group');
  };
  const getShareMessage = (group: any) => {
    const joinUrl = `https://flipseer.com/groups?join=${group.invite_code}`;
    const name = group.name.toLowerCase();
    if (name.includes('office') || name.includes('work')) {
      return `🏢 Office EPL League — who actually knows football?\n\nI've set up a Flipseer league for us. Predict every Premier League match before kickoff.\n\nJoin → ${joinUrl}\nCode: ${group.invite_code}\n\nFree. No betting. #EPL2027`;
    } else if (name.includes('family')) {
      return `👨‍👩‍👧‍👦 Family EPL League — who knows football best?\n\nSet up a Flipseer league for us. Predict every match before kickoff. Full season.\n\nJoin → ${joinUrl}\nCode: ${group.invite_code}\n\nFree. No betting. #EPL2027`;
    } else if (name.includes('uni') || name.includes('college') || name.includes('campus')) {
      return `🎓 University EPL League — campus bragging rights!\n\nPredict every Premier League match before kickoff. See who tops the league.\n\nJoin → ${joinUrl}\nCode: ${group.invite_code}\n\nFree. No betting. #EPL2027`;
    } else if (name.includes('nigeria') || name.includes('india') || name.includes('indonesia') || name.includes('ghana') || name.includes('country')) {
      return `🌍 Country EPL League — represent your nation!\n\nEvery correct prediction earns points for our nation in Flipseer's Nation Battle.\n\nJoin → ${joinUrl}\nCode: ${group.invite_code}\n\nFree. No betting. #EPL2027`;
    } else if (name.includes('arsenal') || name.includes('liverpool') || name.includes('city') || name.includes('united') || name.includes('fan') || name.includes('club')) {
      return `⚽ Fan League — who calls it best?\n\nPredict every EPL match before kickoff. Prove you know football.\n\nJoin → ${joinUrl}\nCode: ${group.invite_code}\n\nFree. No betting. #EPL2027`;
    }
    return `🏴󠁧󠁢󠁥󠁮󠁧󠁿 Join my EPL league "${group.name}" on Flipseer!\n\nPredict every Premier League match. Compete privately AND earn points globally.\n\nJoin → ${joinUrl}\nCode: ${group.invite_code}\n\n#PremierLeague #EPL2027 #Flipseer`;
  };
  const shareGroup = (group: any) => {
    const joinUrl = `https://flipseer.com/groups?join=${group.invite_code}`;
    const text = getShareMessage(group);
    if (navigator.share) {
      navigator.share({ title: 'Join ' + group.name + ' on Flipseer', text, url: joinUrl });
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }
  };
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => showToast('Code copied: ' + code));
  };
  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
        <p style={{ color: '#8B5CF6', fontSize: '16px' }}>Loading your groups...</p>
      </div>
    </main>
  );
  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '80px' }}>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
        .group-card:hover { border-color: #8B5CF6 !important; }
        .group-card { transition: border-color 0.15s ease; }
      `}</style>
      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', top: '72px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, backgroundColor: toastType === 'success' ? '#4C1D95' : '#7F1D1D', color: 'white', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', animation: 'toastIn 0.3s ease', whiteSpace: 'nowrap' }}>
          {toastType === 'success' ? '✓ ' : '✕ '}{toast}
        </div>
      )}
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(180deg, #1A0B2E 0%, #0D1F0F 100%)', padding: '48px 20px 32px', borderBottom: '1px solid #2D1B69', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid #8B5CF6', borderRadius: '999px', padding: '5px 16px', marginBottom: '20px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>PRIVATE GROUPS · EPL 2026/27</span>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 6vw, 48px)', letterSpacing: '-1px', marginBottom: '10px', lineHeight: '1.1' }}>
          YOUR OWN<br /><span style={{ color: '#8B5CF6' }}>FOOTBALL LEAGUE.</span>
        </h1>
        <p style={{ color: '#4B5563', fontSize: '14px', maxWidth: '460px', margin: '0 auto 8px', lineHeight: '1.6' }}>
          Create a private league with friends. Every prediction still counts globally, in your nation, and in your permanent record.
        </p>
        <p style={{ color: '#8B5CF6', fontSize: '13px', fontWeight: 'bold', marginBottom: '28px' }}>
          One prediction. Four systems. No extra steps.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setShowCreate(true); setShowJoin(false); }}
            style={{ backgroundColor: '#8B5CF6', color: 'white', border: 'none', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 24px rgba(139,92,246,0.3)' }}>
            + Create Group
          </button>
          <button onClick={() => { setShowJoin(true); setShowCreate(false); }}
            style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #2D1B69', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', cursor: 'pointer' }}>
            Join with Code
          </button>
        </div>
      </div>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '28px 16px 0' }}>
        {/* CREATE FORM */}
        {showCreate && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #8B5CF6', borderRadius: '16px', padding: '24px', marginBottom: '24px', animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: 0 }}>Create a Group</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>GROUP NAME *</label>
              <input type="text" placeholder="e.g. EPL WhatsApp Gang" value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)} maxLength={40}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                style={{ width: '100%', backgroundColor: '#0D1F0F', border: '1px solid #8B5CF6', borderRadius: '8px', padding: '12px 14px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>DESCRIPTION (OPTIONAL)</label>
              <input type="text" placeholder="e.g. Office EPL league" value={newGroupDesc}
                onChange={e => setNewGroupDesc(e.target.value)} maxLength={80}
                style={{ width: '100%', backgroundColor: '#0D1F0F', border: '1px solid #2D1B69', borderRadius: '8px', padding: '12px 14px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button onClick={handleCreate} disabled={creating || !newGroupName.trim()}
              style={{ width: '100%', padding: '13px', backgroundColor: !newGroupName.trim() ? '#1A3A20' : '#8B5CF6', color: !newGroupName.trim() ? '#4B5563' : 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: !newGroupName.trim() ? 'not-allowed' : 'pointer' }}>
              {creating ? 'Creating...' : 'Create & Get Invite Code →'}
            </button>
            <p style={{ fontSize: '11px', color: '#4B5563', textAlign: 'center', marginTop: '10px' }}>You get a unique code like FLIP-7X9K to share</p>
          </div>
        )}
        {/* JOIN FORM */}
        {showJoin && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '16px', padding: '24px', marginBottom: '24px', animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: 0 }}>Join a Group</h2>
              <button onClick={() => setShowJoin(false)} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>INVITE CODE</label>
              <input type="text" placeholder="FLIP-7X9K" value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())} maxLength={9}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                style={{ width: '100%', backgroundColor: '#0D1F0F', border: '1px solid #8B5CF6', borderRadius: '8px', padding: '12px 14px', color: '#8B5CF6', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase', textAlign: 'center' }} />
            </div>
            <button onClick={handleJoin} disabled={joining || inviteCode.length < 9}
              style={{ width: '100%', padding: '13px', backgroundColor: inviteCode.length < 9 ? '#1A3A20' : '#8B5CF6', color: inviteCode.length < 9 ? '#4B5563' : 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: inviteCode.length < 9 ? 'not-allowed' : 'pointer' }}>
              {joining ? 'Joining...' : 'Join Group →'}
            </button>
          </div>
        )}
        {/* ACTIVE GROUP LEADERBOARD */}
        {activeGroup && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #8B5CF6', borderRadius: '16px', marginBottom: '24px', overflow: 'hidden', animation: 'slideUp 0.3s ease', boxShadow: '0 0 24px rgba(139,92,246,0.15)' }}>
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #2D1B69' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '4px' }}>PRIVATE GROUP · EPL 2026/27</div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', margin: '0 0 8px' }}>{activeGroup.name}</h2>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', backgroundColor: '#050E05', border: '1px solid #2D1B69', padding: '3px 12px', borderRadius: '999px', color: '#9CA3AF' }}>
                      {activeGroup.member_count || groupLeaders.length} members
                    </span>
                    <button onClick={() => copyCode(activeGroup.invite_code)}
                      style={{ fontSize: '12px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid #8B5CF6', padding: '3px 12px', borderRadius: '999px', color: '#8B5CF6', cursor: 'pointer', fontWeight: 'bold' }}>
                      {activeGroup.invite_code} · Copy
                    </button>
                  </div>
                </div>
                <button onClick={() => setActiveGroup(null)}
                  style={{ background: 'none', border: '1px solid #2D1B69', color: '#6B7280', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0, fontSize: '16px' }}>
                  ✕
                </button>
              </div>
            </div>
            <div style={{ padding: '8px 0' }}>
              {loadingLeaders ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Loading...</div>
              ) : groupLeaders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
                  <p>No predictions yet. EPL starts August 21!</p>
                  <a href="/predict" style={{ display: 'inline-block', marginTop: '12px', backgroundColor: '#8B5CF6', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                    Predict Now →
                  </a>
                </div>
              ) : (
                groupLeaders.map((leader, i) => {
                  const isMe = leader.id === userId;
                  const flag = FLAG[leader.country] || '';
                  const barWidth = Math.max(3, Math.round((leader.total_points / (groupLeaders[0]?.total_points || 1)) * 100));
                  return (
                    <div key={leader.id} style={{ padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid #1A3A1A', backgroundColor: isMe ? 'rgba(139,92,246,0.06)' : 'transparent' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ minWidth: '36px', textAlign: 'center' }}>
                          {i < 3
                            ? <span style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: MEDALS[i] }} />
                            : <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: 'bold' }}>#{i + 1}</span>
                          }
                        </div>
                        {flag && <span style={{ fontSize: '18px' }} dangerouslySetInnerHTML={{ __html: flag }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            <a href={`/u/${leader.username}`} style={{ fontSize: '14px', fontWeight: 'bold', color: isMe ? '#8B5CF6' : 'white', textDecoration: 'none' }}>
                              @{leader.username}
                            </a>
                            {isMe && <span style={{ fontSize: '9px', color: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.15)', padding: '2px 7px', borderRadius: '999px', fontWeight: 'bold', letterSpacing: '1px' }}>YOU</span>}
                            {i === 0 && <span style={{ fontSize: '9px', color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.15)', padding: '2px 7px', borderRadius: '999px', fontWeight: 'bold' }}>LEADER</span>}
                          </div>
                          <div style={{ fontSize: '11px', color: '#4B5563' }}>
                            {leader.prediction_count} predictions · {leader.accuracy_pct}% accuracy
                          </div>
                          <div style={{ marginTop: '6px', backgroundColor: '#0D1F0F', borderRadius: '999px', height: '3px', overflow: 'hidden' }}>
                            <div style={{ width: barWidth + '%', height: '100%', backgroundColor: i === 0 ? '#F59E0B' : isMe ? '#8B5CF6' : '#4C1D95', borderRadius: '999px', transition: 'width 0.8s ease' }} />
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: i === 0 ? '#F59E0B' : '#8B5CF6', fontFamily: 'Georgia, serif' }}>{leader.total_points}</div>
                          <div style={{ fontSize: '10px', color: '#4B5563', letterSpacing: '1px' }}>PTS</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #2D1B69', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => shareGroup(activeGroup)}
                style={{ flex: 1, padding: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', minWidth: '120px' }}>
                📱 Invite via WhatsApp
              </button>
              <button onClick={() => copyCode(activeGroup.invite_code)}
                style={{ flex: 1, padding: '10px', backgroundColor: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', minWidth: '100px' }}>
                Copy Code
              </button>
              <button onClick={() => handleLeave(activeGroup.id)}
                style={{ padding: '10px 16px', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF444440', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                Leave
              </button>
            </div>
          </div>
        )}
        {/* MY GROUPS */}
        {myGroups.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>YOUR GROUPS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {myGroups.map((group) => {
                const isActive = activeGroup?.id === group.id;
                return (
                  <div key={group.id} className="group-card"
                    style={{ backgroundColor: '#0D2B14', border: '1px solid ' + (isActive ? '#8B5CF6' : '#2D1B69'), borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
                    onClick={() => handleViewLeaderboard(group)}>
                    <div style={{ width: '44px', height: '44px', backgroundColor: '#4C1D95', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                      🏴󠁧󠁢󠁥󠁮󠁧󠁿
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '3px', color: isActive ? '#8B5CF6' : 'white' }}>{group.name}</div>
                      <div style={{ fontSize: '12px', color: '#4B5563' }}>
                        {group.member_count} member{group.member_count !== 1 ? 's' : ''} ·
                        <span style={{ color: '#8B5CF6', fontWeight: 'bold', marginLeft: '4px' }}>{group.invite_code}</span>
                      </div>
                    </div>
                    <div style={{ color: isActive ? '#8B5CF6' : '#4B5563', fontSize: '18px', flexShrink: 0 }}>
                      {isActive ? '▾' : '›'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* EMPTY STATE */}
        {myGroups.length === 0 && !showCreate && !showJoin && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>WHY CREATE A LEAGUE?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {[
                  { icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', text: 'Compete privately with friends on every EPL matchweek' },
                  { icon: '📊', text: 'Compare accuracy — see who actually knows football' },
                  { icon: '🌍', text: 'Every prediction still counts in the global leaderboard' },
                  { icon: '🏆', text: 'Your nation earns points from every call you make' },
                  { icon: '🔒', text: 'Your permanent record grows across all competitions' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.5' }}>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{ backgroundColor: '#050E05', border: '1px solid #8B5CF6', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold' }}>
                  One prediction powers four systems — group, nation, global leaderboard, and permanent reputation.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => setShowCreate(true)}
                  style={{ flex: 1, backgroundColor: '#8B5CF6', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', minWidth: '140px' }}>
                  + Create Your League
                </button>
                <button onClick={() => setShowJoin(true)}
                  style={{ flex: 1, backgroundColor: 'transparent', color: '#8B5CF6', border: '1px solid #8B5CF6', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', minWidth: '140px' }}>
                  Join with Code
                </button>
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>POPULAR LEAGUE IDEAS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
              {[
                { icon: '🏢', name: 'Office League', desc: 'Beat your colleagues every matchweek' },
                { icon: '👨‍👩‍👧‍👦', name: 'Family League', desc: 'Who knows football best at home?' },
                { icon: '🎓', name: 'University League', desc: 'Campus bragging rights all season' },
                { icon: '🏆', name: 'Friends League', desc: 'Settle it once and for all' },
                { icon: '🌍', name: 'Country League', desc: 'Represent your nation together' },
                { icon: '⚽', name: 'Football Club Fan League', desc: 'Best predictor in your fan group' },
              ].map(({ icon, name, desc }) => (
                <button key={name} onClick={() => { setNewGroupName(name); setShowCreate(true); }}
                  style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '10px', padding: '14px 12px', cursor: 'pointer', textAlign: 'left' }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = '#8B5CF6')}
                  onMouseOut={e => (e.currentTarget.style.borderColor = '#2D1B69')}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>{name}</div>
                  <div style={{ fontSize: '11px', color: '#4B5563' }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* INVITE BANNER */}
        <InviteBanner />
        {/* HOW IT WORKS */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '20px' }}>HOW GROUPS WORK</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { n: '1', icon: '➕', title: 'Create a group', desc: 'Name it. Get a unique FLIP-XXXX code instantly.' },
              { n: '2', icon: '📱', title: 'Share the code', desc: 'Send to friends via WhatsApp. Anyone with the code can join.' },
              { n: '3', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', title: 'Predict EPL as normal', desc: 'Predictions count in your group AND the global leaderboard. No extra steps.' },
              { n: '4', icon: '🏆', title: 'Watch the battle', desc: 'Group leaderboard updates after every match result. See who called it best.' },
            ].map(({ n, icon, title, desc }) => (
              <div key={n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#4C1D95', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0, color: '#C4B5FD' }}>{n}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '16px' }}>{icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{title}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

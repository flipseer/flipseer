'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();

const FLAG: { [key: string]: string } = {
  'IN': '&#x1F1EE;&#x1F1F3;', 'ID': '&#x1F1EE;&#x1F1E9;',
  'NG': '&#x1F1F3;&#x1F1EC;', 'BR': '&#x1F1E7;&#x1F1F7;',
  'AR': '&#x1F1E6;&#x1F1F7;', 'GB': '&#x1F3F4;',
  'FR': '&#x1F1EB;&#x1F1F7;', 'DE': '&#x1F1E9;&#x1F1EA;',
  'GH': '&#x1F1EC;&#x1F1ED;', 'MA': '&#x1F1F2;&#x1F1E6;',
  'JP': '&#x1F1EF;&#x1F1F5;', 'KR': '&#x1F1F0;&#x1F1F7;',
  'ZA': '&#x1F1FF;&#x1F1E6;', 'US': '&#x1F1FA;&#x1F1F8;',
};

const COMPETITIONS = [
  { key: 'EPL 2026/27',      label: 'EPL',      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#8B5CF6' },
  { key: 'UCL 2026/27',      label: 'UCL',      flag: '⭐',         color: '#A78BFA' },
  { key: 'Ghana PL 2026/27', label: 'Ghana PL', flag: '🇬🇭',        color: '#F59E0B' },
  { key: 'Liga 1 2026/27',   label: 'Liga 1',   flag: '🇮🇩',        color: '#CE1126' },
  { key: 'All',              label: 'All',      flag: '🌍',         color: '#2E9E5E' },
];

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FLIP-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function getWhatsAppMessage(group: any, leaders: any[], userRank: number) {
  const url = `https://flipseer.com/groups?join=${group.invite_code}`;
  const leader = leaders[0];
  const comp = group.competition || 'All competitions';
  const memberCount = group.member_count || 1;

  let msg = `🏆 *${group.name}*\n`;
  msg += `${comp} · ${memberCount} member${memberCount !== 1 ? 's' : ''}\n\n`;
  if (leader) msg += `Current leader: @${leader.username} · ${leader.total_points} REP\n\n`;
  msg += `Join before kickoff and prove your football knowledge:\n`;
  msg += `${url}\n`;
  msg += `Code: ${group.invite_code}\n\n`;
  msg += `Free. No betting. Predictions lock at kickoff. ⚽`;
  return msg;
}

type Tab = 'leaderboard' | 'matches' | 'manage';

export default function GroupsPage() {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<{ [id: string]: Tab }>({});
  const [leagueData, setLeagueData] = useState<{ [id: string]: { leaders: any[]; userRank: number; loading: boolean; upcomingMatches: any[] } }>({});
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  // Create flow
  const [showCreate, setShowCreate] = useState(false);
  const [step, setStep] = useState<'name' | 'comp' | 'done'>('name');
  const [newName, setNewName] = useState('');
  const [newComp, setNewComp] = useState('EPL 2026/27');
  const [creating, setCreating] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<any>(null);
  // Join flow
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  const toast$ = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(''), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast$('Copied: ' + label));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jc = params.get('join');
    if (jc) { setJoinCode(jc.toUpperCase()); setShowJoin(true); }
    const stored = sessionStorage.getItem('flipseer_join_code');
    if (stored) { setJoinCode(stored); setShowJoin(true); sessionStorage.removeItem('flipseer_join_code'); }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (jc) sessionStorage.setItem('flipseer_join_code', jc.toUpperCase());
        window.location.href = '/auth' + (jc ? '?join=' + jc : '');
        return;
      }
      setUserId(session.user.id);
      const { data: p } = await supabase.from('profiles').select('username').eq('id', session.user.id).single();
      if (p?.username) setUsername(p.username);
      await loadGroups(session.user.id);
      setLoading(false);
    };
    init();
  }, []);

  const loadGroups = async (uid: string) => {
    const { data: memberships } = await supabase.from('group_members').select('group_id').eq('user_id', uid);
    if (!memberships?.length) { setMyGroups([]); return; }
    const ids = memberships.map((m: any) => m.group_id);
    const { data: groups } = await supabase.from('groups').select('*').in('id', ids).order('created_at', { ascending: false });
    if (!groups) return;
    const withCounts = await Promise.all(groups.map(async (g: any) => {
      const { count } = await supabase.from('group_members').select('*', { count: 'exact', head: true }).eq('group_id', g.id);
      return { ...g, member_count: count || 0 };
    }));
    setMyGroups(withCounts);
  };

  const loadLeagueData = useCallback(async (group: any, uid: string) => {
    const gid = group.id;
    setLeagueData(prev => ({ ...prev, [gid]: { leaders: [], userRank: 0, loading: true, upcomingMatches: [] } }));

    // Load members + their profiles
    const { data: members } = await supabase.from('group_members').select('user_id').eq('group_id', gid);
    const memberIds = (members || []).map((m: any) => m.user_id);

    const [profilesRes, matchesRes] = await Promise.all([
      memberIds.length ? supabase.from('profiles')
        .select('id, username, total_points, accuracy_pct, prediction_count, country, rank_icon')
        .in('id', memberIds).order('total_points', { ascending: false }) : { data: [] },
      supabase.from('matches')
        .select('id, home_team, away_team, kickoff, competition, status')
        .in('status', ['upcoming'])
        .in('competition', group.competition === 'All'
          ? ['EPL 2026/27', 'UCL 2026/27', 'Ghana PL 2026/27', 'Liga 1 2026/27']
          : [group.competition])
        .order('kickoff', { ascending: true })
        .limit(3),
    ]);

    const leaders = profilesRes.data || [];

    // Pad with global top predictors if < 8 members
    let padded = [...leaders];
    if (padded.length < 8) {
      const existingIds = new Set(padded.map((l: any) => l.id));
      existingIds.add(uid);
      const { data: globals } = await supabase.from('profiles')
        .select('id, username, total_points, accuracy_pct, prediction_count, country, rank_icon')
        .gt('total_points', 0)
        .order('total_points', { ascending: false })
        .limit(20);
      const extras = (globals || []).filter((g: any) => !existingIds.has(g.id)).slice(0, 8 - padded.length).map((g: any) => ({ ...g, isCommunity: true }));
      padded = [...padded, ...extras].sort((a: any, b: any) => b.total_points - a.total_points);
    }

    const userRank = padded.findIndex((l: any) => l.id === uid) + 1;
    setLeagueData(prev => ({ ...prev, [gid]: { leaders: padded, userRank, loading: false, upcomingMatches: matchesRes.data || [] } }));
  }, []);

  const toggleExpand = (group: any) => {
    if (expandedId === group.id) { setExpandedId(null); return; }
    setExpandedId(group.id);
    setActiveTab(prev => ({ ...prev, [group.id]: 'leaderboard' }));
    if (!leagueData[group.id]) loadLeagueData(group, userId);
  };

  const handleCreate = async () => {
    if (!newName.trim()) { toast$('Enter a league name', 'error'); return; }
    setCreating(true);
    const code = generateCode();
    const comp = newComp;
    const { data: group, error } = await supabase.from('groups').insert({
      name: newName.trim(), creator_id: userId, invite_code: code, competition: comp,
    }).select().single();
    if (error || !group) { toast$('Failed to create league', 'error'); setCreating(false); return; }
    await supabase.from('group_members').insert({ group_id: group.id, user_id: userId, joined_via_invite: false });
    await loadGroups(userId);
    setCreatedGroup({ ...group, member_count: 1 });
    setStep('done');
    setCreating(false);
    setExpandedId(group.id);
    loadLeagueData({ ...group, member_count: 1 }, userId);
  };

  const handleJoin = async () => {
    if (joinCode.length < 9) { toast$('Enter a valid FLIP code', 'error'); return; }
    setJoining(true);
    const { data: group } = await supabase.from('groups').select('*').eq('invite_code', joinCode.toUpperCase()).single();
    if (!group) { toast$('Invalid code', 'error'); setJoining(false); return; }
    const { data: existing } = await supabase.from('group_members').select('id').eq('group_id', group.id).eq('user_id', userId).single();
    if (existing) { toast$('Already a member', 'error'); setJoining(false); return; }
    await supabase.from('group_members').insert({ group_id: group.id, user_id: userId, joined_via_invite: true });
    await loadGroups(userId);
    toast$('Joined ' + group.name + '!');
    setJoining(false);
    setShowJoin(false);
    setJoinCode('');
    setExpandedId(group.id);
    loadLeagueData(group, userId);
  };

  const handleLeave = async (groupId: string, groupName: string) => {
    if (!confirm('Leave ' + groupName + '?')) return;
    await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId);
    setLeagueData(prev => { const n = { ...prev }; delete n[groupId]; return n; });
    setExpandedId(null);
    await loadGroups(userId);
    toast$('Left ' + groupName);
  };

  const handleDeleteLeague = async (groupId: string, groupName: string) => {
    if (!confirm('Delete ' + groupName + '? This cannot be undone.')) return;
    await supabase.from('group_members').delete().eq('group_id', groupId);
    await supabase.from('groups').delete().eq('id', groupId);
    setLeagueData(prev => { const n = { ...prev }; delete n[groupId]; return n; });
    setExpandedId(null);
    await loadGroups(userId);
    toast$('League deleted');
  };

  const formatKickoff = (kickoff: string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Date(utc).toLocaleString('en-GB', { timeZone: tz, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getCountdown = (kickoff: string) => {
    const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
    const diff = new Date(utc).getTime() - Date.now();
    if (diff <= 0) return 'Locked';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 48) return Math.floor(h / 24) + 'd';
    if (h > 0) return h + 'h ' + m + 'm';
    return m + 'm';
  };

  const compColor = (key: string) => COMPETITIONS.find(c => c.key === key)?.color || '#8B5CF6';
  const compFlag = (key: string) => COMPETITIONS.find(c => c.key === key)?.flag || '⚽';

  if (loading) return (
    <main style={{ background: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚽</div>
        <p style={{ color: '#8B5CF6', fontSize: '15px' }}>Loading your leagues...</p>
      </div>
    </main>
  );

  return (
    <main style={{ background: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '100px' }}>
      <style>{`
        @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .tab-btn:hover{opacity:.8}
        .card-hover:hover{border-color:#8B5CF6 !important}
        .card-hover{transition:border-color .15s}
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: toastType === 'success' ? '#4C1D95' : '#7F1D1D', color: 'white', padding: '9px 20px', borderRadius: '999px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', animation: 'fadeIn .2s ease' }}>
          {toastType === 'success' ? '✓ ' : '✕ '}{toast}
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(180deg,#0A0014 0%,#0D1F0F 100%)', padding: '36px 20px 24px', borderBottom: '1px solid #1A2A1A' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#8B5CF6', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>PRIVATE LEAGUES</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,5vw,32px)', margin: '0 0 6px', lineHeight: 1.1 }}>
            Your own football <span style={{ color: '#8B5CF6' }}>league.</span>
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.6 }}>
            Predict with friends. Compete for your nation. Build your record.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setShowCreate(true); setShowJoin(false); setStep('name'); setNewName(''); }}
              style={{ flex: 1, background: '#8B5CF6', color: 'white', border: 'none', padding: '11px', borderRadius: '9px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Create League
            </button>
            <button onClick={() => { setShowJoin(true); setShowCreate(false); }}
              style={{ flex: 1, background: 'transparent', color: '#9CA3AF', border: '1px solid #2A3A2A', padding: '11px', borderRadius: '9px', fontSize: '14px', cursor: 'pointer' }}>
              Join with Code
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px' }}>

        {/* ── CREATE FLOW ── */}
        {showCreate && (
          <div style={{ background: '#0D2B14', border: '1px solid #8B5CF6', borderRadius: '14px', padding: '20px', marginBottom: '16px', animation: 'slideDown .2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', margin: 0 }}>
                {step === 'name' ? 'Name your league' : step === 'comp' ? 'Choose competition' : '🎉 League created!'}
              </h2>
              <button onClick={() => { setShowCreate(false); setStep('name'); setCreatedGroup(null); }}
                style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            {step === 'name' && (
              <>
                <input type="text" placeholder="e.g. WhatsApp Gunners FC" value={newName}
                  onChange={e => setNewName(e.target.value)} maxLength={40}
                  onKeyDown={e => e.key === 'Enter' && newName.trim() && setStep('comp')}
                  autoFocus
                  style={{ width: '100%', background: '#0A1A0A', border: '1px solid #8B5CF6', borderRadius: '8px', padding: '11px 14px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
                <button onClick={() => newName.trim() && setStep('comp')} disabled={!newName.trim()}
                  style={{ width: '100%', padding: '11px', background: newName.trim() ? '#8B5CF6' : '#1A3A20', color: newName.trim() ? 'white' : '#4B5563', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: newName.trim() ? 'pointer' : 'not-allowed' }}>
                  Next: Choose Competition →
                </button>
              </>
            )}

            {step === 'comp' && (
              <>
                <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>Which competition does your league cover?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {COMPETITIONS.map(c => (
                    <button key={c.key} onClick={() => setNewComp(c.key)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: newComp === c.key ? c.color + '20' : '#0A1A0A', border: '1px solid ' + (newComp === c.key ? c.color : '#1A3A1A'), borderRadius: '9px', cursor: 'pointer', textAlign: 'left', color: 'white' }}>
                      <span style={{ fontSize: '20px' }}>{c.flag}</span>
                      <span style={{ fontSize: '14px', fontWeight: newComp === c.key ? 'bold' : 'normal', color: newComp === c.key ? c.color : 'white' }}>{c.label}</span>
                      {newComp === c.key && <span style={{ marginLeft: 'auto', fontSize: '14px', color: c.color }}>✓</span>}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setStep('name')}
                    style={{ padding: '11px 16px', background: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    ← Back
                  </button>
                  <button onClick={handleCreate} disabled={creating}
                    style={{ flex: 1, padding: '11px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {creating ? 'Creating...' : 'Create League →'}
                  </button>
                </div>
              </>
            )}

            {step === 'done' && createdGroup && (
              <div style={{ animation: 'fadeIn .3s ease' }}>
                <div style={{ background: '#050E05', border: '1px solid #2D1B69', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '6px' }}>YOUR FLIP CODE</p>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8B5CF6', letterSpacing: '4px', marginBottom: '10px' }}>{createdGroup.invite_code}</div>
                  <button onClick={() => copyToClipboard(createdGroup.invite_code, 'code')}
                    style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid #8B5CF6', color: '#8B5CF6', padding: '6px 16px', borderRadius: '999px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                    Copy Code
                  </button>
                </div>
                <button onClick={() => {
                  const msg = getWhatsAppMessage(createdGroup, [], 1);
                  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
                }}
                  style={{ width: '100%', padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px' }}>
                  📲 Share on WhatsApp
                </button>
                <button onClick={() => copyToClipboard('https://flipseer.com/groups?join=' + createdGroup.invite_code, 'invite link')}
                  style={{ width: '100%', padding: '11px', background: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', borderRadius: '9px', fontSize: '13px', cursor: 'pointer', marginBottom: '8px' }}>
                  Copy Invite Link
                </button>
                <button onClick={() => { setShowCreate(false); setStep('name'); setCreatedGroup(null); }}
                  style={{ width: '100%', padding: '10px', background: 'transparent', color: '#6B7280', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── JOIN FLOW ── */}
        {showJoin && (
          <div style={{ background: '#0D2B14', border: '1px solid #2A3A2A', borderRadius: '14px', padding: '20px', marginBottom: '16px', animation: 'slideDown .2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', margin: 0 }}>Join a League</h2>
              <button onClick={() => { setShowJoin(false); setJoinCode(''); }} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <input type="text" placeholder="FLIP-XXXX" value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={9}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              autoFocus
              style={{ width: '100%', background: '#0A1A0A', border: '1px solid #8B5CF6', borderRadius: '8px', padding: '11px 14px', color: '#8B5CF6', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }} />
            <button onClick={handleJoin} disabled={joining || joinCode.length < 9}
              style={{ width: '100%', padding: '11px', background: joinCode.length >= 9 ? '#8B5CF6' : '#1A3A20', color: joinCode.length >= 9 ? 'white' : '#4B5563', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: joinCode.length >= 9 ? 'pointer' : 'not-allowed' }}>
              {joining ? 'Joining...' : 'Join League →'}
            </button>
          </div>
        )}

        {/* ── MY LEAGUES ── */}
        {myGroups.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>Your Leagues</span>
              <span style={{ fontSize: '11px', color: '#8B5CF6' }}>{myGroups.length} active</span>
            </div>
            {myGroups.map(group => {
              const isOpen = expandedId === group.id;
              const ld = leagueData[group.id];
              const userRank = ld?.userRank || 0;
              const isLeader = userRank === 1;
              const isCreator = group.creator_id === userId;
              const tab = activeTab[group.id] || 'leaderboard';
              const color = compColor(group.competition || 'EPL 2026/27');
              const flag = compFlag(group.competition || 'EPL 2026/27');

              return (
                <div key={group.id} style={{ marginBottom: '8px' }}>
                  {/* CARD */}
                  <div className="card-hover" onClick={() => toggleExpand(group)}
                    style={{ background: isOpen ? '#0F2B14' : '#0D2214', border: '1px solid ' + (isOpen ? color : '#1A3A1A'), borderRadius: isOpen ? '14px 14px 0 0' : '14px', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Avatar */}
                    <div style={{ width: '42px', height: '42px', background: '#4C1D95', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: '#C4B5FD', flexShrink: 0, letterSpacing: '.5px' }}>
                      {group.name.slice(0, 2).toUpperCase()}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }}>
                        {group.name}
                        {isCreator && <span style={{ fontSize: '9px', color: '#F59E0B', background: 'rgba(245,158,11,.15)', padding: '1px 6px', borderRadius: '999px', marginLeft: '6px', fontWeight: 'bold' }}>CREATOR</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px' }}>{flag}</span>
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>{group.member_count} members</span>
                        <button onClick={e => { e.stopPropagation(); copyToClipboard(group.invite_code, 'code'); }}
                          style={{ fontSize: '10px', color: color, background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.3)', padding: '1px 7px', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold' }}>
                          {group.invite_code}
                        </button>
                      </div>
                    </div>
                    {/* Rank */}
                    {userRank > 0 && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {isLeader
                          ? <><div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold' }}>🏆 #1</div><div style={{ fontSize: '10px', color: '#F59E0B' }}>Leading</div></>
                          : <><div style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold' }}>#{userRank}</div><div style={{ fontSize: '10px', color: '#6B7280' }}>of {group.member_count}</div></>
                        }
                      </div>
                    )}
                    <div style={{ color: isOpen ? color : '#4B5563', fontSize: '16px', transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none', flexShrink: 0 }}>›</div>
                  </div>

                  {/* EXPANDED */}
                  {isOpen && (
                    <div style={{ background: '#0A1A0A', border: '1px solid ' + color, borderTop: 'none', borderRadius: '0 0 14px 14px', animation: 'slideDown .2s ease' }}>

                      {/* TABS */}
                      <div style={{ display: 'flex', borderBottom: '1px solid #1A2A1A' }}>
                        {(['leaderboard', 'matches', 'manage'] as Tab[]).map(t => (
                          <button key={t} className="tab-btn"
                            onClick={() => setActiveTab(prev => ({ ...prev, [group.id]: t }))}
                            style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: tab === t ? 'bold' : 'normal', color: tab === t ? color : '#6B7280', background: 'none', border: 'none', borderBottom: '2px solid ' + (tab === t ? color : 'transparent'), cursor: 'pointer', transition: 'all .15s', textTransform: 'capitalize' }}>
                            {t === 'leaderboard' ? '🏆 Leaderboard' : t === 'matches' ? '⚽ Matches' : '⚙️ Manage'}
                          </button>
                        ))}
                      </div>

                      {/* TAB: LEADERBOARD */}
                      {tab === 'leaderboard' && (
                        <div>
                          {ld?.loading ? (
                            <div style={{ padding: '32px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>Loading...</div>
                          ) : !ld || ld.leaders.length === 0 ? (
                            <div style={{ padding: '32px', textAlign: 'center' }}>
                              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚽</div>
                              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '12px' }}>No predictions yet — be first!</p>
                              <a href="/predict" style={{ background: '#8B5CF6', color: 'white', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>Predict Now →</a>
                            </div>
                          ) : (
                            <>
                              {/* Community note if padded */}
                              {ld.leaders.some((l: any) => l.isCommunity) && (
                                <div style={{ padding: '8px 16px', background: 'rgba(139,92,246,.05)', borderBottom: '1px solid #1A2A1A' }}>
                                  <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
                                    👥 Competing against Flipseer community until your league fills up. <a href="#" onClick={e => { e.preventDefault(); const msg = getWhatsAppMessage(group, ld.leaders, userRank); window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); }} style={{ color: '#8B5CF6', textDecoration: 'none', fontWeight: 'bold' }}>Invite friends →</a>
                                  </p>
                                </div>
                              )}
                              {ld.leaders.map((leader: any, i: number) => {
                                const isMe = leader.id === userId;
                                const flag = FLAG[leader.country] || '';
                                const topPts = ld.leaders[0]?.total_points || 1;
                                const bar = Math.max(4, Math.round((leader.total_points / topPts) * 100));
                                return (
                                  <div key={leader.id + i} style={{ padding: '10px 16px', borderTop: i > 0 ? '1px solid #1A2A1A' : 'none', background: isMe ? 'rgba(139,92,246,.06)' : 'transparent', opacity: leader.isCommunity ? 0.7 : 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ minWidth: '24px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold', color: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : '#4B5563' }}>
                                        {i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1)}
                                      </div>
                                      {flag && <span style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: flag }} />}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                                          <a href={`/u/${leader.username}`} style={{ fontSize: '13px', fontWeight: 'bold', color: isMe ? '#8B5CF6' : leader.isCommunity ? '#6B7280' : 'white', textDecoration: 'none' }}>@{leader.username}</a>
                                          {isMe && <span style={{ fontSize: '9px', color: '#8B5CF6', background: 'rgba(139,92,246,.2)', padding: '1px 5px', borderRadius: '999px', fontWeight: 'bold' }}>YOU</span>}
                                          {leader.isCommunity && <span style={{ fontSize: '9px', color: '#4B5563', background: '#1A2A1A', padding: '1px 5px', borderRadius: '999px' }}>COMMUNITY</span>}
                                          {i === 0 && !isMe && !leader.isCommunity && <span style={{ fontSize: '9px', color: '#F59E0B', background: 'rgba(245,158,11,.15)', padding: '1px 5px', borderRadius: '999px', fontWeight: 'bold' }}>LEADER</span>}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#4B5563', marginBottom: '3px' }}>{leader.prediction_count} preds · {leader.accuracy_pct}% acc</div>
                                        <div style={{ height: '2px', background: '#1A2A1A', borderRadius: '999px', overflow: 'hidden' }}>
                                          <div style={{ width: bar + '%', height: '100%', background: i === 0 ? '#F59E0B' : isMe ? '#8B5CF6' : '#4C1D95' }} />
                                        </div>
                                      </div>
                                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: i === 0 ? '#F59E0B' : isMe ? '#8B5CF6' : 'white' }}>{leader.total_points}</div>
                                        <div style={{ fontSize: '9px', color: '#4B5563', letterSpacing: '1px' }}>REP</div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              {/* Share leaderboard */}
                              <div style={{ padding: '12px 16px', borderTop: '1px solid #1A2A1A', display: 'flex', gap: '8px' }}>
                                <button onClick={() => { const msg = getWhatsAppMessage(group, ld.leaders, userRank); window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); }}
                                  style={{ flex: 1, padding: '9px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                  📲 Share Leaderboard
                                </button>
                                <a href="/predict" style={{ padding: '9px 14px', background: color + '20', color: color, border: '1px solid ' + color + '60', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
                                  ⚽ Predict
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* TAB: MATCHES */}
                      {tab === 'matches' && (
                        <div>
                          {!ld || ld.upcomingMatches.length === 0 ? (
                            <div style={{ padding: '28px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                              No upcoming matches right now.
                              <br /><a href="/predict" style={{ color: '#8B5CF6', fontWeight: 'bold', textDecoration: 'none' }}>View all matches →</a>
                            </div>
                          ) : (
                            <>
                              <div style={{ padding: '10px 16px 6px', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>UPCOMING — PREDICT BEFORE KICKOFF</div>
                              {ld.upcomingMatches.map((match: any) => {
                                const countdown = getCountdown(match.kickoff);
                                const isLocked = countdown === 'Locked';
                                return (
                                  <div key={match.id} style={{ padding: '10px 16px', borderTop: '1px solid #1A2A1A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '2px' }}>{match.home_team} vs {match.away_team}</div>
                                      <div style={{ fontSize: '11px', color: '#6B7280' }}>{formatKickoff(match.kickoff)}</div>
                                    </div>
                                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                                      {!isLocked && <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', marginBottom: '4px' }}>⏱ {countdown}</div>}
                                      <a href="/predict" style={{ fontSize: '12px', background: isLocked ? 'transparent' : '#8B5CF6', color: isLocked ? '#4B5563' : 'white', border: isLocked ? '1px solid #1A3A1A' : 'none', padding: '5px 10px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                                        {isLocked ? 'Locked' : 'Predict →'}
                                      </a>
                                    </div>
                                  </div>
                                );
                              })}
                              <div style={{ padding: '10px 16px', borderTop: '1px solid #1A2A1A', textAlign: 'center' }}>
                                <a href="/predict" style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', textDecoration: 'none' }}>View all matches →</a>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* TAB: MANAGE */}
                      {tab === 'manage' && (
                        <div style={{ padding: '16px' }}>
                          {/* Invite section */}
                          <div style={{ background: '#050E05', border: '1px solid #2D1B69', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                            <p style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '1px', margin: '0 0 8px' }}>INVITE MEMBERS</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#8B5CF6', letterSpacing: '3px' }}>{group.invite_code}</span>
                              <button onClick={() => copyToClipboard(group.invite_code, 'code')}
                                style={{ fontSize: '11px', color: '#8B5CF6', background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.4)', padding: '4px 10px', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Copy Code
                              </button>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => { const msg = getWhatsAppMessage(group, ld?.leaders || [], userRank); window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); }}
                                style={{ flex: 1, padding: '9px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                📲 WhatsApp
                              </button>
                              <button onClick={() => copyToClipboard('https://flipseer.com/groups?join=' + group.invite_code, 'invite link')}
                                style={{ flex: 1, padding: '9px', background: 'transparent', color: '#9CA3AF', border: '1px solid #1A3A1A', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                                Copy Link
                              </button>
                            </div>
                          </div>

                          {/* League info */}
                          <div style={{ background: '#050E05', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                            <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px', margin: '0 0 10px' }}>LEAGUE INFO</p>
                            {[
                              { label: 'Competition', value: group.competition || 'All' },
                              { label: 'Members', value: group.member_count + ' / 500' },
                              { label: 'Created', value: new Date(group.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                              { label: 'Creator', value: isCreator ? 'You' : 'Other' },
                            ].map(({ label, value }) => (
                              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1A2A1A', fontSize: '13px' }}>
                                <span style={{ color: '#6B7280' }}>{label}</span>
                                <span style={{ color: 'white', fontWeight: '500' }}>{value}</span>
                              </div>
                            ))}
                          </div>

                          {/* Weekly recap */}
                          <div style={{ background: 'rgba(139,92,246,.05)', border: '1px solid rgba(139,92,246,.2)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                            <p style={{ fontSize: '12px', color: '#8B5CF6', margin: '0 0 6px', fontWeight: 'bold' }}>📊 Weekly Reputation Recap</p>
                            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 8px', lineHeight: 1.5 }}>
                              Share your league leaderboard every matchweek. Show who proved their football knowledge.
                            </p>
                            <button onClick={() => {
                              const leaders = ld?.leaders.filter((l: any) => !l.isCommunity).slice(0, 3) || [];
                              let recap = `🏆 *${group.name} — Weekly Recap*\n\n`;
                              leaders.forEach((l: any, i: number) => {
                                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
                                recap += `${medal} @${l.username} · ${l.total_points} REP\n`;
                              });
                              recap += `\nWho proved their football knowledge this week?\n`;
                              recap += `Join: flipseer.com/groups?join=${group.invite_code}`;
                              window.open('https://wa.me/?text=' + encodeURIComponent(recap), '_blank');
                            }}
                              style={{ width: '100%', padding: '9px', background: 'rgba(139,92,246,.15)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,.4)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                              Share This Week&apos;s Recap →
                            </button>
                          </div>

                          {/* Danger zone */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {isCreator && (
                              <button onClick={() => handleDeleteLeague(group.id, group.name)}
                                style={{ flex: 1, padding: '9px', background: 'transparent', color: '#EF4444', border: '1px solid rgba(239,68,68,.25)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                                Delete League
                              </button>
                            )}
                            <button onClick={() => handleLeave(group.id, group.name)}
                              style={{ flex: 1, padding: '9px', background: 'transparent', color: '#EF4444', border: '1px solid rgba(239,68,68,.25)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                              Leave League
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}


        {/* ── OFFICIAL FLIPSEER LEAGUES ── */}
        {myGroups.filter(g => ['FLIP-EPL1','FLIP-UCL1','FLIP-AFR1','FLIP-ASI1','FLIP-GLB1'].includes(g.invite_code)).length === 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>Official Flipseer Leagues</span>
              <span style={{ fontSize: '11px', color: '#2E9E5E' }}>Open to all</span>
            </div>
            {[
              { code: 'FLIP-EPL1', name: 'Flipseer EPL League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', comp: 'EPL 2026/27', color: '#8B5CF6', desc: 'The main EPL community' },
              { code: 'FLIP-UCL1', name: 'Flipseer UCL League', flag: '⭐', comp: 'UCL 2026/27', color: '#A78BFA', desc: 'Champions League predictions' },
              { code: 'FLIP-AFR1', name: 'Ghana Premier League Community', flag: '🇬🇭', comp: 'Ghana PL 2026/27', color: '#F59E0B', desc: 'Predict Ghana Premier League matches' },
              { code: 'FLIP-ASI1', name: 'Indonesia Liga 1 Community', flag: '🇮🇩', comp: 'Liga 1 2026/27', color: '#CE1126', desc: 'Predict Liga 1 Indonesia matches' },
              { code: 'FLIP-GLB1', name: 'Global Flipseer League', flag: '🌍', comp: 'All competitions', color: '#2E9E5E', desc: 'Every competition, one league' },
            ].map(league => (
              <div key={league.code} style={{ background: '#0D2214', border: '1px solid #1A3A1A', borderRadius: '12px', padding: '12px 16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: league.color + '20', border: '1px solid ' + league.color + '40', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {league.flag}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>{league.name}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>{league.comp} · {league.desc}</div>
                </div>
                <button onClick={async () => {
                  if (!userId) return;
                  setJoinCode(league.code);
                  setJoining(true);
                  const { data: group } = await supabase.from('groups').select('*').eq('invite_code', league.code).single();
                  if (!group) { toast$('League not found', 'error'); setJoining(false); return; }
                  const { data: existing } = await supabase.from('group_members').select('id').eq('group_id', group.id).eq('user_id', userId).single();
                  if (existing) { toast$('Already a member', 'error'); setJoining(false); return; }
                  await supabase.from('group_members').insert({ group_id: group.id, user_id: userId, joined_via_invite: false });
                  await loadGroups(userId);
                  toast$('Joined ' + group.name + '!');
                  setJoining(false);
                  setExpandedId(group.id);
                  loadLeagueData(group, userId);
                }}
                  style={{ padding: '7px 14px', background: league.color, color: 'white', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>
                  Join →
                </button>
              </div>
            ))}
          </div>
        )}
        {/* ── EMPTY STATE ── */}
        {myGroups.length === 0 && !showCreate && !showJoin && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg,#1A0B2E,#0D2B14)', border: '1px solid #8B5CF6', borderRadius: '14px', padding: '24px', marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 8px' }}>Create your first private league</h2>
              <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 20px', lineHeight: 1.6 }}>
                Turn your WhatsApp football group into a real competition. Every prediction counts in your league, your nation, and the global leaderboard.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                {['🏢 Office', '👨‍👩‍👧‍👦 Family', '📱 WhatsApp', '🌍 Country'].map(tag => (
                  <span key={tag} style={{ fontSize: '12px', color: '#8B5CF6', background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.3)', padding: '4px 10px', borderRadius: '999px' }}>{tag}</span>
                ))}
              </div>
              <button onClick={() => { setShowCreate(true); setStep('name'); }}
                style={{ width: '100%', background: '#8B5CF6', color: 'white', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px', boxShadow: '0 0 24px rgba(139,92,246,.3)' }}>
                + Create My First League
              </button>
              <button onClick={() => setShowJoin(true)}
                style={{ width: '100%', background: 'transparent', color: '#9CA3AF', border: '1px solid #2A3A2A', padding: '11px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}>
                Or join with a FLIP code
              </button>
            </div>
            <div style={{ background: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '16px', marginBottom: '14px' }}>
              <p style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '2px', margin: '0 0 12px' }}>WHY CREATE A LEAGUE?</p>
              {[
                { icon: '⚽', text: 'Compete privately across EPL, UCL, Liga 1 and Ghana PL' },
                { icon: '📊', text: 'See who actually knows football — weekly accuracy leaderboard' },
                { icon: '🌍', text: 'Every prediction counts globally and for your nation simultaneously' },
                { icon: '🔒', text: 'Predictions lock at kickoff — permanent record, no edits' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
              <div style={{ background: '#050E05', border: '1px solid #8B5CF6', borderRadius: '8px', padding: '10px 14px', margin: '14px 0', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold' }}>One prediction · four systems — league, nation, global leaderboard, permanent reputation.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setShowCreate(true); setStep('name'); }}
                  style={{ flex: 1, background: '#8B5CF6', color: 'white', border: 'none', padding: '11px', borderRadius: '9px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                  + Create League
                </button>
                <button onClick={() => setShowJoin(true)}
                  style={{ flex: 1, background: 'transparent', color: '#8B5CF6', border: '1px solid #8B5CF6', padding: '11px', borderRadius: '9px', fontSize: '14px', cursor: 'pointer' }}>
                  Join with Code
                </button>
              </div>
            </div>
            </div>
            <p style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>QUICK START</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '8px', marginBottom: '20px' }}>
              {[
                { icon: '🏢', name: 'Office League' },
                { icon: '👨‍👩‍👧‍👦', name: 'Family League' },
                { icon: '📱', name: 'WhatsApp League' },
                { icon: '🌍', name: 'Country League' },
                { icon: '🏆', name: 'Friends League' },
                { icon: '⚽', name: 'Fan Club League' },
              ].map(({ icon, name }) => (
                <button key={name} onClick={() => { setNewName(name); setShowCreate(true); setStep('name'); }}
                  style={{ background: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '14px 12px', cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s' }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = '#8B5CF6')}
                  onMouseOut={e => (e.currentTarget.style.borderColor = '#1A3A1A')}>
                  <div style={{ fontSize: '22px', marginBottom: '6px' }}>{icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>{name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HOW IT WORKS — always at bottom */}
        <div style={{ background: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '18px' }}>
          <p style={{ fontSize: '10px', color: '#4B5563', fontWeight: 'bold', letterSpacing: '2px', margin: '0 0 14px' }}>HOW IT WORKS</p>
          {[
            { n: '1', icon: '➕', t: 'Create', d: 'Name your league. Choose EPL, UCL, Liga 1, Ghana PL or all. Get FLIP code.' },
            { n: '2', icon: '📲', t: 'Invite', d: 'Share FLIP code on WhatsApp. Friends join in one tap.' },
            { n: '3', icon: '⚽', t: 'Predict', d: 'Everyone predicts as normal. Counts in league AND globally.' },
            { n: '4', icon: '🏆', t: 'Compete', d: 'Leaderboard updates after every result. Weekly recap to share.' },
          ].map(({ n, icon, t, d }) => (
            <div key={n} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', background: '#4C1D95', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: '#C4B5FD', flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '2px' }}>{icon} {t}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

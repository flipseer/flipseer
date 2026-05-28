'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

// ✅ Fix 1: use shared browser client that preserves session
const supabase = createClient();

type Group = {
  id: string;
  name: string;
  description: string;
  invite_code: string;
  created_at: string;
};

type Member = {
  user_id: string;
  profiles: {
    username: string;
    total_points: number;
    streak: number;
    correct_count: number;
    prediction_count: number;
    rank: string;
    rank_icon: string;
    country: string;
  };
};

export default function Groups() {
  const [user, setUser] = useState<any>(null);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [leaderboard, setLeaderboard] = useState<Member[]>([]);
  const [tab, setTab] = useState<'my' | 'create' | 'search'>('my');
  const [loading, setLoading] = useState(true);
  const [lbLoading, setLbLoading] = useState(false);

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<Group[]>([]);
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);

  const [inviteCode, setInviteCode] = useState('');
  const [joiningCode, setJoiningCode] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      // ✅ Fix 2: use getSession() instead of getUser()
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/auth'; return; }
      setUser(session.user);
      await fetchMyGroups(session.user.id);
      setLoading(false);
    };
    init();
  }, []);

  const fetchMyGroups = async (uid: string) => {
    const { data } = await supabase
      .from('group_members')
      .select('group_id, groups(id, name, description, invite_code, created_at)')
      .eq('user_id', uid);
    if (data) {
      const groups = data.map((d: any) => d.groups).filter(Boolean);
      setMyGroups(groups);
    }
  };

  const fetchLeaderboard = async (group: Group) => {
    setActiveGroup(group);
    setLbLoading(true);
    const res = await fetch(`/api/groups/leaderboard?group_id=${group.id}`);
    const data = await res.json();
    setLeaderboard(data.members ?? []);
    setLbLoading(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    setCreateMsg('');
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), description: newDesc.trim(), creator_id: user.id }),
    });
    const data = await res.json();
    setCreating(false);
    if (data.error) {
      setCreateMsg(`❌ ${data.error}`);
    } else {
      setCreateMsg('✅ Group created!');
      setNewName('');
      setNewDesc('');
      await fetchMyGroups(user.id);
      setTab('my');
    }
  };

  const handleSearch = async () => {
    if (!searchQ.trim()) return;
    setSearching(true);
    const res = await fetch(`/api/groups?q=${encodeURIComponent(searchQ)}`);
    const data = await res.json();
    setSearchResults(data.groups ?? []);
    setSearching(false);
  };

  const handleJoin = async (invite_code: string) => {
    setJoining(invite_code);
    const res = await fetch('/api/groups/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invite_code, user_id: user.id }),
    });
    const data = await res.json();
    setJoining(null);
    if (!data.error) {
      await fetchMyGroups(user.id);
      setTab('my');
    } else {
      alert(data.error);
    }
  };

  const handleJoinByCode = async () => {
    if (!inviteCode.trim()) return;
    setJoiningCode(true);
    setJoinMsg('');
    const res = await fetch('/api/groups/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invite_code: inviteCode.trim(), user_id: user.id }),
    });
    const data = await res.json();
    setJoiningCode(false);
    if (data.error) {
      setJoinMsg(`❌ ${data.error}`);
    } else {
      setJoinMsg(`✅ Joined ${data.group.name}!`);
      setInviteCode('');
      await fetchMyGroups(user.id);
      setTimeout(() => setTab('my'), 1000);
    }
  };

  const copyInviteLink = (code: string) => {
    const link = `${window.location.origin}/groups?join=${code}`;
    navigator.clipboard.writeText(link);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      handleJoin(joinCode);
      window.history.replaceState({}, '', '/groups');
    }
  }, [user]);

  if (loading) return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#2E9E5E', fontFamily: 'Georgia, serif', fontSize: '20px' }}>Loading groups...</p>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      <section style={{ textAlign: 'center', padding: '40px 20px 24px', background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '8px' }}>Private Groups</h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Compete with friends, colleagues, and rivals</p>
      </section>

      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { key: 'my', label: `My Groups (${myGroups.length})` },
            { key: 'create', label: '+ Create' },
            { key: 'search', label: '🔍 Find' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => { setTab(key as any); setActiveGroup(null); }}
              style={{ flex: 1, padding: '10px 4px', borderRadius: '8px', border: '1px solid #1A7A4A', backgroundColor: tab === key ? '#1A7A4A' : 'transparent', color: tab === key ? 'white' : '#9CA3AF', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
              {label}
            </button>
          ))}
        </div>

        {/* MY GROUPS */}
        {tab === 'my' && (
          <div>
            {myGroups.length === 0 ? (
              <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '8px' }}>You're not in any groups yet</p>
                <p style={{ color: '#4B5563', fontSize: '13px', marginBottom: '20px' }}>Create one or ask a friend for their invite link</p>
                <button onClick={() => setTab('create')}
                  style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                  Create a Group →
                </button>
              </div>
            ) : (
              <>
                {activeGroup ? (
                  <div>
                    <button onClick={() => setActiveGroup(null)}
                      style={{ backgroundColor: 'transparent', border: '1px solid #1A7A4A', color: '#9CA3AF', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', marginBottom: '16px' }}>
                      ← Back to groups
                    </button>
                    <div style={{ backgroundColor: '#0D2B14', border: '2px solid #2E9E5E', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
                      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '4px' }}>{activeGroup.name}</h2>
                      {activeGroup.description && <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '12px' }}>{activeGroup.description}</p>}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: '#6B7280' }}>Invite code:</span>
                        <code style={{ fontSize: '12px', color: '#2E9E5E', backgroundColor: '#0D1F0F', padding: '3px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                          {activeGroup.invite_code}
                        </code>
                        <button onClick={() => copyInviteLink(activeGroup.invite_code)}
                          style={{ backgroundColor: copied === activeGroup.invite_code ? '#2E9E5E' : '#1A7A4A', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                          {copied === activeGroup.invite_code ? '✅ Copied!' : '🔗 Copy Link'}
                        </button>
                      </div>
                    </div>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', marginBottom: '12px' }}>🏆 Group Leaderboard</h3>
                    {lbLoading ? (
                      <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>Loading...</p>
                    ) : leaderboard.length === 0 ? (
                      <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                        <p style={{ color: '#6B7280' }}>No members yet. Share the invite link!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {leaderboard.map((m, i) => (
                          <div key={m.user_id} style={{ backgroundColor: '#0D2B14', border: `1px solid ${i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7C2F' : '#1A7A4A'}`, borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '20px', minWidth: '32px', textAlign: 'center' }}>
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>@{m.profiles?.username}</div>
                              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                                {m.profiles?.correct_count ?? 0} correct · {m.profiles?.prediction_count ?? 0} predictions
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2E9E5E', fontFamily: 'Georgia, serif' }}>
                                {m.profiles?.total_points ?? 0}
                              </div>
                              <div style={{ fontSize: '10px', color: '#6B7280' }}>pts</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {myGroups.map((g) => (
                      <div key={g.id} style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{g.name}</h3>
                            {g.description && <p style={{ fontSize: '12px', color: '#6B7280' }}>{g.description}</p>}
                          </div>
                          <button onClick={() => fetchLeaderboard(g)}
                            style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            🏆 View
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <code style={{ fontSize: '11px', color: '#2E9E5E', backgroundColor: '#0D1F0F', padding: '3px 10px', borderRadius: '6px' }}>
                            {g.invite_code}
                          </code>
                          <button onClick={() => copyInviteLink(g.invite_code)}
                            style={{ backgroundColor: copied === g.invite_code ? '#2E9E5E' : 'transparent', color: copied === g.invite_code ? 'white' : '#9CA3AF', border: '1px solid #1A7A4A', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                            {copied === g.invite_code ? '✅ Copied!' : '🔗 Copy Invite Link'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* CREATE GROUP */}
        {tab === 'create' && (
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '20px' }}>Create a Group</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>GROUP NAME *</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Office World Cup Pool" maxLength={40}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>DESCRIPTION (optional)</label>
              <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="e.g. Bragging rights for the whole office" maxLength={100}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            {createMsg && <p style={{ fontSize: '13px', color: createMsg.startsWith('✅') ? '#2E9E5E' : '#FCA5A5', marginBottom: '12px' }}>{createMsg}</p>}
            <button onClick={handleCreate} disabled={creating || !newName.trim()}
              style={{ width: '100%', padding: '12px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: !newName.trim() ? 0.5 : 1 }}>
              {creating ? 'Creating...' : 'Create Group →'}
            </button>
          </div>
        )}

        {/* SEARCH + JOIN */}
        {tab === 'search' && (
          <div>
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2E9E5E', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#2E9E5E' }}>🔗 Join by Invite Code</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Enter invite code..."
                  onKeyDown={e => e.key === 'Enter' && handleJoinByCode()}
                  style={{ flex: 1, padding: '10px 14px', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '8px', color: 'white', fontSize: '14px' }} />
                <button onClick={handleJoinByCode} disabled={joiningCode || !inviteCode.trim()}
                  style={{ padding: '10px 16px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  {joiningCode ? '...' : 'Join'}
                </button>
              </div>
              {joinMsg && <p style={{ fontSize: '13px', color: joinMsg.startsWith('✅') ? '#2E9E5E' : '#FCA5A5', marginTop: '8px' }}>{joinMsg}</p>}
            </div>

            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>🔍 Search Groups by Name</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search group name..."
                  style={{ flex: 1, padding: '10px 14px', backgroundColor: '#0D1F0F', border: '1px solid #1A7A4A', borderRadius: '8px', color: 'white', fontSize: '14px' }} />
                <button onClick={handleSearch} disabled={searching}
                  style={{ padding: '10px 16px', backgroundColor: '#1A7A4A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  {searching ? '...' : 'Search'}
                </button>
              </div>
              {searchResults.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {searchResults.map((g) => {
                    const isMember = myGroups.some(mg => mg.id === g.id);
                    return (
                      <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#0D1F0F', borderRadius: '10px', border: '1px solid #1A3A1A' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{g.name}</div>
                          {g.description && <div style={{ fontSize: '12px', color: '#6B7280' }}>{g.description}</div>}
                        </div>
                        {isMember ? (
                          <span style={{ fontSize: '11px', color: '#2E9E5E', backgroundColor: '#1A3A1A', padding: '4px 10px', borderRadius: '999px' }}>Joined ✅</span>
                        ) : (
                          <button onClick={() => handleJoin(g.invite_code)} disabled={joining === g.invite_code}
                            style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                            {joining === g.invite_code ? '...' : 'Join'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {searchResults.length === 0 && searchQ && !searching && (
                <p style={{ color: '#6B7280', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No groups found for "{searchQ}"</p>
              )}
            </div>
          </div>
        )}
      </section>
      </main>
  );
}

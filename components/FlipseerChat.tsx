'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

type Message = {
  role: 'user' | 'bot';
  text: string;
};

const QUICK_QUESTIONS = [
  'Who is leading?',
  'Next match?',
  'How to score points?',
  'What are badges?',
  'Is it free?',
];

async function getLiveData() {
  const [leaderboard, nextMatch, liveMatch, stats] = await Promise.all([
    supabase.from('profiles').select('username, total_points, country').order('total_points', { ascending: false }).limit(3),
    supabase.from('matches').select('home_team, away_team, kickoff, league').eq('status', 'upcoming').order('kickoff', { ascending: true }).limit(1),
    supabase.from('matches').select('home_team, away_team, home_score, away_score').eq('status', 'live').limit(1),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);
  return {
    leaderboard: leaderboard.data || [],
    nextMatch: nextMatch.data?.[0] || null,
    liveMatch: liveMatch.data?.[0] || null,
    totalUsers: stats.count || 0,
  };
}

function formatKickoff(kickoff: string) {
  const utc = kickoff.endsWith('Z') ? kickoff : kickoff.replace(' ', 'T') + 'Z';
  return new Date(utc).toLocaleString('en-GB', {
    day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}

async function getResponse(input: string): Promise<string> {
  const q = input.toLowerCase().trim();
  const data = await getLiveData();

  if (q.includes('lead') || q.includes('top') || q.includes('rank') || q.includes('#1') || q.includes('best')) {
    if (data.leaderboard.length === 0) return 'No predictions yet! Be the first to predict at flipseer.com/predict';
    const medals = ['1.', '2.', '3.'];
    const top3 = data.leaderboard.map((u: any, i: number) => medals[i] + ' ' + u.username + ' - ' + u.total_points + ' pts').join('\n');
    return 'Current Top 3 Forecasters:\n' + top3 + '\n\nPredict now to climb the table!';
  }

  if (q.includes('next') || q.includes('when') || q.includes('upcoming') || q.includes('match')) {
    if (data.liveMatch) {
      return '🔴 LIVE RIGHT NOW: ' + data.liveMatch.home_team + ' vs ' + data.liveMatch.away_team + '\nScore: ' + data.liveMatch.home_score + '-' + data.liveMatch.away_score + '\n\nPredictions are locked for this match.';
    }
    if (!data.nextMatch) return 'No upcoming matches found. Check back soon!';
    return 'Next match: ' + data.nextMatch.home_team + ' vs ' + data.nextMatch.away_team + '\nKickoff: ' + formatKickoff(data.nextMatch.kickoff) + ' (your local time)\n\nPredict now before it locks!';
  }

  if (q.includes('point') || q.includes('scoring') || q.includes('earn') || (q.includes('how') && q.includes('work'))) {
    return 'Flipseer Scoring:\n\n✅ Correct outcome: +10 pts\n📊 Goal difference: +18 pts\n🎯 Exact score: +55 pts\n⚡ Upset bonus: +12 pts\n\nConfidence multiplier:\n80%+ = x1.4 | 60-79% = x1.2 | Below 40% = x0.8\n\nMax 108 pts per match!';
  }

  if (q.includes('badge') || q.includes('award') || q.includes('medal')) {
    return 'Flipseer Badges:\n\n🥇 Founding Forecaster - joined before launch\n🎯 Score Master - exact score correct\n👑 Upset King - called the underdog\n⚡ Match Hero - highest points in a match\n🦁 Bold Caller - upset at 80%+ confidence\n🔥 Hot Streak x5/x7/x10 - consecutive wins\n\nPredict correctly to unlock them!';
  }

  if (q.includes('free') || q.includes('cost') || q.includes('pay') || q.includes('money') || q.includes('price')) {
    return 'Flipseer is 100% FREE!\n\n🚫 No subscription\n🚫 No betting\n🚫 No gambling\n✅ Pure football intelligence\n\nAlways free. Forever.';
  }

  if (q.includes('bet') || q.includes('gambl') || q.includes('odds')) {
    return 'Flipseer is NOT a betting platform!\n\n🚫 No money involved\n🚫 No odds\n🚫 No risk\n\nPure football intelligence. That is it.';
  }

  if (q.includes('user') || q.includes('member') || q.includes('people') || q.includes('community')) {
    return '⚽ Flipseer has ' + data.totalUsers + ' Founding Forecasters!\n\nJoin us at flipseer.com - free forever.';
  }

  if (q.includes('founding') || q.includes('founder') || q.includes('early')) {
    return '🏅 Founding Forecaster Badge\n\nExclusive badge for users who joined before World Cup 2026 kicked off on June 11.\n\nOnly 100 spots were available.\nThis badge will NEVER be awarded again.';
  }

  if (q.includes('data') || q.includes('privacy') || q.includes('safe') || q.includes('secure')) {
    return 'Your data is safe!\n\n🔒 Your data stays yours\n🛡 Encrypted & Secure\n🚫 Never Sold\n⚙ Under Your Control\n\nFull policy: flipseer.com/privacy';
  }

  if (q.includes('predict') || q.includes('how to') || q.includes('start') || q.includes('begin')) {
    return 'How to predict on Flipseer:\n\n1️⃣ Sign up free at flipseer.com\n2️⃣ Go to Predict page\n3️⃣ Pick winner + exact score\n4️⃣ Set confidence (1-100%)\n5️⃣ Click Lock In\n\nPredictions close at kick-off.\nYour record is permanent!';
  }

  if (q.includes('group') || q.includes('friend') || q.includes('invite')) {
    return 'Private Groups on Flipseer:\n\n👥 Create a group & get invite code\n📱 Share via WhatsApp with friends\n🏆 Group leaderboard updates live\n\nGo to flipseer.com/groups to start!';
  }

  if (q.includes('nation') || q.includes('country')) {
    return '🌍 Nation Battle on Flipseer!\n\nEvery prediction earns points for your country. Countries compete on the global Nation leaderboard.\n\nSet your country: flipseer.com/profile\nView the battle: flipseer.com/nations';
  }

  if (q.includes('streak') || q.includes('consecutive') || q.includes('row')) {
    return '🔥 Streaks on Flipseer:\n\n5 correct = Hot Streak x5\n7 correct = Hot Streak x7\n10 correct = Hot Streak x10\n\nStreaks reset on a wrong prediction.';
  }

  if (q.length < 4 || q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return 'Hi! Welcome to Flipseer! ⚽\n\nI can help you with:\n• Leaderboard & rankings\n• Next match & fixtures\n• Scoring system\n• Badges & streaks\n• Groups & nations\n• Privacy & data\n\nWhat would you like to know?';
  }

  return 'I can help with leaderboard, next match, scoring, badges, groups and privacy!\n\nTry asking:\n• "Who is leading?"\n• "When is the next match?"\n• "How do I earn points?"\n• "What badges can I earn?"';
}

export default function FlipseerChat() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I\'m the Flipseer Assistant ⚽\n\nAsk me about leaderboard, next match, scoring, badges or anything about Flipseer!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show tooltip after 4 seconds to grab attention
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open) setShowTooltip(true);
    }, 4000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 10000);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, []);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    const response = await getResponse(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
  };

  const handleOpen = () => {
    setOpen(!open);
    setShowTooltip(false);
  };

  return (
    <>
      <style>{`
        @keyframes chatPulse {
          0% { box-shadow: 0 0 0 0 rgba(46,158,94,0.7), 0 4px 20px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(46,158,94,0), 0 4px 20px rgba(0,0,0,0.4); }
          100% { box-shadow: 0 0 0 0 rgba(46,158,94,0), 0 4px 20px rgba(0,0,0,0.4); }
        }
        @keyframes tooltipSlide {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

      {/* TOOLTIP */}
      {showTooltip && !open && (
        <div style={{
          position: 'fixed',
          bottom: '92px',
          right: '20px',
          backgroundColor: '#0D2B14',
          border: '1px solid #2E9E5E',
          borderRadius: '12px',
          padding: '10px 14px',
          zIndex: 301,
          animation: 'tooltipSlide 0.3s ease forwards',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          maxWidth: '220px',
          cursor: 'pointer',
        }} onClick={handleOpen}>
          <div style={{ fontSize: '13px', color: 'white', fontWeight: 'bold', marginBottom: '3px', fontFamily: 'Arial, sans-serif' }}>
            ⚽ Ask Flipseer AI
          </div>
          <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Arial, sans-serif' }}>
            Who should I predict next?
          </div>
          {/* Arrow */}
          <div style={{
            position: 'absolute', bottom: '-7px', right: '28px',
            width: 0, height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '7px solid #2E9E5E',
          }} />
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={handleOpen}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '20px',
          height: '52px',
          borderRadius: '999px',
          backgroundColor: '#1A7A4A',
          border: '2px solid #2E9E5E',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '0 18px 0 14px',
          zIndex: 300,
          animation: open ? 'none' : 'chatPulse 2s ease-in-out infinite, chatBounce 3s ease-in-out infinite',
          transition: 'all 0.2s ease',
          fontFamily: 'Arial, sans-serif',
        }}>
        {/* Live dot */}
        {!open && (
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: '#4ADE80',
            display: 'inline-block',
            animation: 'dotPulse 1.2s ease-in-out infinite',
            flexShrink: 0,
          }} />
        )}
        <span style={{ fontSize: '20px', lineHeight: 1 }}>{open ? '✕' : '⚽'}</span>
        {!open && (
          <span style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: 'white',
            whiteSpace: 'nowrap',
            letterSpacing: '0.3px',
          }}>
            Ask AI
          </span>
        )}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '88px',
          right: '20px',
          width: '320px',
          maxHeight: '500px',
          backgroundColor: '#0D1F0F',
          border: '1px solid #2E9E5E',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(46,158,94,0.25), 0 8px 32px rgba(0,0,0,0.6)',
          zIndex: 300,
          fontFamily: 'Arial, sans-serif',
          animation: 'tooltipSlide 0.25s ease forwards',
        }}>

          {/* HEADER */}
          <div style={{ backgroundColor: '#0D2B14', padding: '14px 16px', borderBottom: '1px solid #1A3A1A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: '22px' }}>⚽</span>
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: '#4ADE80',
                border: '1px solid #0D2B14',
                animation: 'dotPulse 1.2s ease-in-out infinite',
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>Flipseer AI Assistant</div>
              <div style={{ fontSize: '11px', color: '#4ADE80' }}>● Online · World Cup 2026</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '18px', padding: '2px 6px', borderRadius: '6px', lineHeight: 1 }}>✕</button>
          </div>

          {/* MESSAGES */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 12px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  backgroundColor: msg.role === 'user' ? '#1A7A4A' : '#0D2B14',
                  border: msg.role === 'bot' ? '1px solid #1A3A1A' : 'none',
                  fontSize: '13px',
                  color: 'white',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '4px', padding: '8px 0 0 4px' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    backgroundColor: '#2E9E5E', display: 'inline-block',
                    animation: `dotPulse 1s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* QUICK QUESTIONS */}
          <div style={{ padding: '8px 10px', borderTop: '1px solid #1A3A1A', display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => send(q)}
                style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', color: '#9CA3AF', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s ease' }}>
                {q}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #1A3A1A', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ask anything about Flipseer..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              style={{ flex: 1, backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '13px', outline: 'none' }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()}
              style={{ backgroundColor: input.trim() ? '#1A7A4A' : '#1A3A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: input.trim() ? 'pointer' : 'default', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.15s ease' }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

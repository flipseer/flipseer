'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

type Message = {
  role: 'user' | 'bot';
  text: string;
};

const QUICK_QUESTIONS = [
  'Who is leading',
  'Next match',
  'How to score points',
  'What are badges',
  'Is it free',
];

async function getLiveData() {
  const [leaderboard, nextMatch, liveMatch, stats] = await Promise.all([
    supabase.from('profiles').select('username, total_points, rank_icon, country').order('total_points', { ascending: false }).limit(3),
    supabase.from('matches').select('home_team, away_team, kickoff, league').eq('status', 'upcoming').order('kickoff', { ascending: true }).limit(1),
    supabase.from('matches').select('home_team, away_team, home_score, away_score').eq('status', 'locked').limit(1),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);
  return {
    leaderboard: leaderboard.data || [],
    nextMatch: nextMatch.data.[0] || null,
    liveMatch: liveMatch.data.[0] || null,
    totalUsers: stats.count || 0,
  };
}

function formatKickoff(kickoff: string) {
  const utc = kickoff.endsWith('Z')  kickoff : kickoff.replace(' ', 'T') + 'Z';
  return new Date(utc).toLocaleString('en-GB', {
    day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}

async function getResponse(input: string): Promise<string> {
  const q = input.toLowerCase().trim();
  const data = await getLiveData();

  // LEADERBOARD
  if (q.includes('lead') || q.includes('top') || q.includes('rank') || q.includes('#1') || q.includes('best')) {
    if (data.leaderboard.length === 0) return 'No predictions yet! Be the first to predict at flipseer.com/predict';
    const top3 = data.leaderboard.map((u, i) => {
      const medals = ['\u{1F947}', '\uD83E\uDD48', '\uD83E\uDD49'];
      return medals[i] + ' ' + u.username + '  ' + u.total_points + ' pts';
    }).join('\n');
    return 'Current Top 3 Forecasters:\n' + top3 + '\n\nPredict now to climb the table! ';
  }

  // NEXT MATCH
  if (q.includes('next') || q.includes('when') || q.includes('upcoming') || q.includes('match')) {
    if (data.liveMatch) {
      return 'LIVE RIGHT NOW: ' + data.liveMatch.home_team + ' vs ' + data.liveMatch.away_team + '  ' + data.liveMatch.home_score + '-' + data.liveMatch.away_score + ' \n\nPredictions are locked for this match.';
    }
    if (!data.nextMatch) return 'No upcoming matches found. Check back soon!';
    return 'Next match: ' + data.nextMatch.home_team + ' vs ' + data.nextMatch.away_team + '\nKickoff: ' + formatKickoff(data.nextMatch.kickoff) + ' (your local time)\n\nPredict now before it locks! ';
  }

  // SCORING
  if (q.includes('point') || q.includes('score') || q.includes('earn') || q.includes('how') && q.includes('work')) {
    return 'Flipseer Scoring System:\n\n Correct outcome  +10 pts\n Goal difference  +18 pts\n Exact score  +55 pts\n Upset bonus  +12 pts\n\nConfidence multiplier:\n80%+  x1.4\n60-79%  x1.2\nBelow 40%  x0.8\n\nMax: 108 pts per match! ';
  }

  // BADGES
  if (q.includes('badge') || q.includes('award') || q.includes('medal')) {
    return 'Flipseer Badges:\n\n Founding Forecaster  joined before launch\n Score Master  exact score correct\n Upset King  called the underdog\n Match Hero  highest points in a match\n Bold Caller  upset with 80%+ confidence\n Hot Streak x5/x7/x10  consecutive correct picks\n\nPredict correctly to unlock them! ';
  }

  // FREE / COST
  if (q.includes('free') || q.includes('cost') || q.includes('pay') || q.includes('money') || q.includes('price')) {
    return 'Flipseer is 100% free! \n\nNo subscription. No betting. No gambling.\nJust pure football intelligence.\n\nAlways free. Forever. ';
  }

  // BETTING
  if (q.includes('bet') || q.includes('gambl') || q.includes('odds')) {
    return 'Flipseer is NOT a betting platform! \n\nWe are a prediction reputation platform.\nNo money involved. No odds. No risk.\n\nPure football intelligence. That is it. ';
  }

  // USERS / COMMUNITY
  if (q.includes('user') || q.includes('member') || q.includes('people') || q.includes('community') || q.includes('forecaster')) {
    return 'Flipseer has ' + data.totalUsers + ' Founding Forecasters so far! \n\nJoin us at flipseer.com  free forever.';
  }

  // FOUNDING FORECASTER
  if (q.includes('founding') || q.includes('founder') || q.includes('early')) {
    return 'Founding Forecaster is an exclusive badge for users who joined before World Cup 2026 kicked off on June 11. \n\nOnly 100 spots were available.\nThis badge will NEVER be awarded again.\n\nIf you joined early  you are legendary! ';
  }

  // PRIVACY / DATA
  if (q.includes('data') || q.includes('privacy') || q.includes('safe') || q.includes('secure') || q.includes('personal')) {
    return 'Your data is safe with us! \n\n Your personal data stays yours\n Encrypted & Secure\n Never Sold\n Under Your Control\n\nWe only store your predictions, points and badges.\n\nFull policy: flipseer.com/privacy';
  }

  // PREDICT HOW TO
  if (q.includes('predict') || q.includes('how to') || q.includes('start') || q.includes('begin')) {
    return 'How to predict on Flipseer:\n\n1 Sign up free at flipseer.com\n2 Go to Predict page\n3 Pick winner + exact score\n4 Set your confidence (1-100%)\n5 Click Lock In\n6 Predictions close at kick-off\n\nYour record is permanent. No edits after kick-off! ';
  }

  // GROUPS
  if (q.includes('group') || q.includes('friend') || q.includes('invite') || q.includes('private')) {
    return 'Private Groups on Flipseer:\n\n Create a group  get invite code\n Share code with friends via WhatsApp\n Everyone predicts normally\n Group leaderboard updates after each match\n\nGo to flipseer.com/groups to start! ';
  }

  // NATIONS
  if (q.includes('nation') || q.includes('country') || q.includes('india') || q.includes('nigeria') || q.includes('brazil')) {
    return 'Nation Battle on Flipseer! \n\nEvery prediction you make earns points for your country.\nCountries compete on the global Nation leaderboard.\n\nSet your country at flipseer.com/profile\nView the battle at flipseer.com/nations ';
  }

  // STREAK
  if (q.includes('streak') || q.includes('consecutive') || q.includes('row')) {
    return 'Streaks on Flipseer:\n\n Get 5 correct in a row  Hot Streak x5\n Get 7 correct in a row  Hot Streak x7\n Get 10 correct in a row  Hot Streak x10\n\nStreaks reset on a wrong prediction.\nKeep predicting to build yours! ';
  }

  // HELLO / HI
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q === 'hii' || q.length < 4) {
    return 'Hi! Welcome to Flipseer! \n\nI can help you with:\n Leaderboard & rankings\n Next match & fixtures\n Scoring system\n Badges & streaks\n Groups & nations\n Privacy & data\n\nWhat would you like to know';
  }

  // DEFAULT
  return 'I can help with leaderboard, next match, scoring, badges, groups and privacy questions!\n\nTry asking:\n "Who is leading"\n "When is the next match"\n "How do I earn points"\n "What badges can I earn"';
}

export default function FlipseerChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I am Flipseer Assistant \n\nAsk me about leaderboard, next match, scoring, badges or anything Flipseer!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return (
    <>
      {/* CHAT BUBBLE */}
      <button
        onClick={() => setOpen(!open)}
        style={{ position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1A7A4A', border: '2px solid #2E9E5E', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 0 20px rgba(46,158,94,0.5)', zIndex: 300, transition: 'transform 0.2s' }}>
        {open  '' : ''}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div style={{ position: 'fixed', bottom: '90px', right: '24px', width: '320px', maxHeight: '480px', backgroundColor: '#0D1F0F', border: '1px solid #2E9E5E', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 0 40px rgba(46,158,94,0.3)', zIndex: 300, fontFamily: 'Arial, sans-serif' }}>

          {/* Header */}
          <div style={{ backgroundColor: '#0D2B14', padding: '14px 16px', borderBottom: '1px solid #1A3A1A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}></span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>Flipseer Assistant</div>
              <div style={{ fontSize: '11px', color: '#2E9E5E' }}>World Cup 2026</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user'  'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 12px',
                  borderRadius: msg.role === 'user'  '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  backgroundColor: msg.role === 'user'  '#1A7A4A' : '#0D2B14',
                  border: msg.role === 'bot'  '1px solid #1A3A1A' : 'none',
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
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '12px 12px 12px 4px', padding: '10px 14px', fontSize: '18px' }}>
                  
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #1A3A1A', display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => send(q)}
                style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', color: '#9CA3AF', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #1A3A1A', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              style={{ flex: 1, backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '13px', outline: 'none' }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()}
              style={{ backgroundColor: input.trim()  '#1A7A4A' : '#1A3A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
              &#x2192;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

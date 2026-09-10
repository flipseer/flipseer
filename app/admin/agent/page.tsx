'use client';
import { useState } from 'react';

const MARKETS = [
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria', league: 'EPL + UCL' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana', league: 'Ghana PL + EPL' },
  { code: 'IN', flag: '🇮🇳', name: 'India', league: 'ISL + EPL' },
  { code: 'ID', flag: '🇮🇩', name: 'Indonesia', league: 'Liga 1 + EPL' },
  { code: 'MA', flag: '🇲🇦', name: 'Morocco', league: 'EPL + UCL' },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt', league: 'EPL + UCL' },
  { code: 'GB', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England', league: 'EPL + UCL' },
  { code: 'KE', flag: '🇰🇪', name: 'Kenya', league: 'EPL + UCL' },
];

const PLATFORMS = ['Instagram', 'X (Twitter)', 'WhatsApp Group', 'Facebook Group', 'YouTube', 'TikTok', 'Telegram'];
const TYPES = ['Fan Page', 'Football Analyst', 'Fantasy Football', 'Sports Journalist', 'Football Community', 'Club Supporters'];

const BG = '#0D1F0F';
const CARD = '#0D2B14';
const BORDER = '#1A3A1A';
const PURPLE = '#8B5CF6';
const GREEN = '#2E9E5E';
const GOLD = '#F59E0B';
const RED = '#EF4444';
const GREY = '#9CA3AF';
const DIM = '#4B5563';

async function callClaude(prompt: string, system: string): Promise<string> {
  const res = await fetch('/api/admin/claude-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': 'flipseer2026',
    },
    body: JSON.stringify({
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.content?.[0]?.text || '';
}

function scoreColor(s: number) { return s >= 70 ? GREEN : s >= 45 ? GOLD : RED; }
function verdictBorder(v: string) { return v === 'Strong' ? GREEN : v === 'Moderate' ? GOLD : BORDER; }

function Label({ children, color }: { children: React.ReactNode; color?: string }) {
  return <div style={{ fontSize: 10, color: color || DIM, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{children}</div>;
}

function Input({ id, placeholder, type, value, onChange }: any) {
  return (
    <input id={id} type={type || 'text'} placeholder={placeholder} value={value} onChange={onChange}
      style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 12px', color: 'white', fontSize: 13, fontFamily: 'inherit' }} />
  );
}

function Select({ value, onChange, children }: any) {
  return (
    <select value={value} onChange={onChange}
      style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 12px', color: 'white', fontSize: 13, fontFamily: 'inherit' }}>
      {children}
    </select>
  );
}

function RunBtn({ onClick, loading, color, children }: any) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{ width: '100%', padding: '12px', backgroundColor: color || PURPLE, color: color === GOLD ? 'black' : 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'inherit' }}>
      {children}
    </button>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ fontSize: 11, color: copied ? GREEN : GREY, background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ height: 4, backgroundColor: BORDER, borderRadius: 2, marginTop: 4 }}>
      <div style={{ width: `${score}%`, height: '100%', backgroundColor: color, borderRadius: 2 }} />
    </div>
  );
}

export default function AgentPage() {
  const [tab, setTab] = useState('research');

  // Research
  const [rHandle, setRHandle] = useState('');
  const [rFollowers, setRFollowers] = useState('');
  const [rPlatform, setRPlatform] = useState('Instagram');
  const [rType, setRType] = useState('Fan Page');
  const [rMarket, setRMarket] = useState('NG');
  const [rDesc, setRDesc] = useState('');
  const [rLoading, setRLoading] = useState(false);
  const [rResult, setRResult] = useState<any>(null);
  const [rError, setRError] = useState('');

  // Outreach
  const [oHandle, setOHandle] = useState('');
  const [oFollowers, setOFollowers] = useState('');
  const [oPlatform, setOPlatform] = useState('Instagram');
  const [oType, setOType] = useState('Fan Page');
  const [oMarket, setOMarket] = useState('NG');
  const [oDesc, setODesc] = useState('');
  const [oLoading, setOLoading] = useState(false);
  const [oResult, setOResult] = useState<any>(null);

  // Batch
  const [bText, setBText] = useState('');
  const [bMarket, setBMarket] = useState('NG');
  const [bLoading, setBLoading] = useState(false);
  const [bResult, setBResult] = useState<any[]|null>(null);

  async function runResearch() {
    if (!rHandle || !rFollowers) { setRError('Enter handle and follower count'); return; }
    setRError(''); setRLoading(true); setRResult(null);
    const mkt = MARKETS.find(m => m.code === rMarket)!;
    try {
      const text = await callClaude(
        `Evaluate this creator for Flipseer acquisition:\nHandle: ${rHandle}\nPlatform: ${rPlatform}\nType: ${rType}\nFollowers: ${rFollowers}\nMarket: ${mkt.name} (${mkt.league})\nDescription: ${rDesc || 'Football content creator'}\n\nReturn JSON only:\n{"fit_score":0-100,"audience_score":0-100,"engagement_score":0-100,"activation_score":0-100,"overall_score":0-100,"verdict":"Strong|Moderate|Weak","reason":"2 sentences","estimated_signups":number,"estimated_activated":number,"best_angle":"one sentence","risk":"one sentence"}`,
        'You evaluate football creators for Flipseer acquisition (free prediction platform, no betting). Respond ONLY in valid JSON, no markdown.'
      );
      setRResult(JSON.parse(text.replace(/```json|```/g, '').trim()));
    } catch(e: any) { setRError('Error: ' + (e.message || 'Analysis failed — try again')); }
    setRLoading(false);
  }

  async function runOutreach() {
    if (!oHandle) return;
    setOLoading(true); setOResult(null);
    const mkt = MARKETS.find(m => m.code === oMarket)!;
    const slug = oHandle.replace('@', '').toLowerCase().replace(/\s+/g, '_');
    try {
      const text = await callClaude(
        `Write personalised outreach for Flipseer:\nHandle: ${oHandle}\nPlatform: ${oPlatform}\nType: ${oType}\nMarket: ${mkt.name} (${mkt.league})\nFollowers: ${oFollowers || 'unknown'}\nDescription: ${oDesc || 'Football content creator'}\n\nReturn JSON only:\n{"dm_message":"max 280 chars","whatsapp_message":"3-4 lines with flipseer.com link","email_subject":"subject","email_body":"4-5 short paragraphs","suggested_league_name":"league name","referral_link":"flipseer.com/${oMarket.toLowerCase()}?ref=${slug}","best_channel":"DM|WhatsApp|Email","hook":"one thing that will make them care"}`,
        'You write outreach for Flipseer (free football prediction reputation platform, no betting). Direct, human tone. Respond ONLY in valid JSON.'
      );
      setOResult(JSON.parse(text.replace(/```json|```/g, '').trim()));
    } catch { setOResult({ error: 'Generation failed — try again' }); }
    setOLoading(false);
  }

  async function runBatch() {
    if (!bText.trim()) return;
    setBLoading(true); setBResult(null);
    const mkt = MARKETS.find(m => m.code === bMarket)!;
    try {
      const text = await callClaude(
        `Market: ${mkt.name} (${mkt.league})\nEvaluate these creators for Flipseer:\n\n${bText}\n\nReturn JSON array only:\n[{"name":"creator","score":0-100,"verdict":"Strong|Moderate|Weak|Skip","pitch_angle":"one sentence","estimated_activated":number}]`,
        'You are a creator acquisition analyst for Flipseer. Respond ONLY in valid JSON array, no markdown.'
      );
      const results = JSON.parse(text.replace(/```json|```/g, '').trim());
      setBResult(results.sort((a: any, b: any) => b.score - a.score));
    } catch { setBResult([]); }
    setBLoading(false);
  }

  const tabs = [
    { id: 'research', label: '🔎 Score Creator' },
    { id: 'outreach', label: '✍️ Generate Pitch' },
    { id: 'batch', label: '⚡ Batch Scan' },
  ];

  return (
    <main style={{ backgroundColor: BG, minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',Arial,sans-serif", color: 'white', padding: '24px 20px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>FLIPSEER · ACQUISITION AGENT</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,5vw,32px)', fontWeight: 900, letterSpacing: -1, marginBottom: 6 }}>Find. Score. Pitch. Convert.</h1>
          <p style={{ fontSize: 13, color: GREY }}>AI-powered creator discovery and outreach for football communities.</p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '7px 16px', borderRadius: 8, border: `1px solid ${tab === t.id ? PURPLE : BORDER}`,
              backgroundColor: tab === t.id ? PURPLE + '25' : 'transparent',
              color: tab === t.id ? PURPLE : GREY, fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── SCORE CREATOR ── */}
        {tab === 'research' && (
          <div>
            <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><Label>HANDLE / NAME</Label><Input placeholder="@osimhen9fans" value={rHandle} onChange={(e: any) => setRHandle(e.target.value)} /></div>
                <div><Label>FOLLOWERS</Label><Input placeholder="25000" type="number" value={rFollowers} onChange={(e: any) => setRFollowers(e.target.value)} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><Label>PLATFORM</Label><Select value={rPlatform} onChange={(e: any) => setRPlatform(e.target.value)}>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</Select></div>
                <div><Label>TYPE</Label><Select value={rType} onChange={(e: any) => setRType(e.target.value)}>{TYPES.map(t => <option key={t}>{t}</option>)}</Select></div>
                <div><Label>MARKET</Label><Select value={rMarket} onChange={(e: any) => setRMarket(e.target.value)}>{MARKETS.map(m => <option key={m.code} value={m.code}>{m.flag} {m.name}</option>)}</Select></div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Label>DESCRIPTION (optional)</Label>
                <textarea value={rDesc} onChange={(e: any) => setRDesc(e.target.value)} placeholder="Nigerian EPL fan page, posts match highlights and predictions..." rows={2}
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 12px', color: 'white', fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              {rError && <p style={{ fontSize: 12, color: RED, marginBottom: 8 }}>{rError}</p>}
              <RunBtn onClick={runResearch} loading={rLoading}>{rLoading ? 'Analysing...' : '🔎 Score This Creator'}</RunBtn>
            </div>

            {rResult && (
              <div style={{ backgroundColor: CARD, border: `1px solid ${verdictBorder(rResult.verdict)}`, borderRadius: 14, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <Label>ACQUISITION SCORE</Label>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 900, color: scoreColor(rResult.overall_score), lineHeight: 1 }}>{rResult.overall_score}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(rResult.overall_score), border: `1px solid ${scoreColor(rResult.overall_score)}50`, backgroundColor: scoreColor(rResult.overall_score) + '15', borderRadius: 4, padding: '3px 10px' }}>{rResult.verdict.toUpperCase()}</span>
                </div>
                <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
                  {[['Audience fit', rResult.fit_score, PURPLE], ['Audience size', rResult.audience_score, GOLD], ['Engagement', rResult.engagement_score, GREEN], ['Activation potential', rResult.activation_score, RED]].map(([l, v, c]: any) => (
                    <div key={l}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: GREY }}>{l}</span><span style={{ fontSize: 12, fontWeight: 700, color: c }}>{v}</span></div><ScoreBar score={v} color={c} /></div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  <div style={{ background: BG, borderRadius: 8, padding: '12px 14px' }}><Label>EST. SIGNUPS</Label><div style={{ fontSize: 26, fontWeight: 900, color: PURPLE, fontFamily: 'Georgia, serif' }}>{rResult.estimated_signups}</div></div>
                  <div style={{ background: BG, borderRadius: 8, padding: '12px 14px' }}><Label>EST. ACTIVATED</Label><div style={{ fontSize: 26, fontWeight: 900, color: GREEN, fontFamily: 'Georgia, serif' }}>{rResult.estimated_activated}</div></div>
                </div>
                <div style={{ background: BG, borderRadius: 8, padding: 14, marginBottom: 10 }}>
                  <Label color={GOLD}>BEST ANGLE</Label>
                  <p style={{ fontSize: 13, color: GREY, lineHeight: 1.7, margin: 0 }}>{rResult.best_angle}</p>
                </div>
                <div style={{ background: BG, borderRadius: 8, padding: 14, marginBottom: rResult.risk ? 10 : 0 }}>
                  <Label>ANALYSIS</Label>
                  <p style={{ fontSize: 13, color: GREY, lineHeight: 1.7, margin: 0 }}>{rResult.reason}</p>
                </div>
                {rResult.risk && (
                  <div style={{ background: RED + '10', border: `1px solid ${RED}30`, borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                    <span style={{ fontSize: 11, color: RED, fontWeight: 700 }}>Risk: </span>
                    <span style={{ fontSize: 12, color: GREY }}>{rResult.risk}</span>
                  </div>
                )}
                <button onClick={() => { setOHandle(rHandle); setOPlatform(rPlatform); setOType(rType); setOMarket(rMarket); setOFollowers(rFollowers); setODesc(rDesc); setTab('outreach'); }}
                  style={{ width: '100%', backgroundColor: GREEN, color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✍️ Generate Pitch for This Creator →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── GENERATE PITCH ── */}
        {tab === 'outreach' && (
          <div>
            <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><Label>HANDLE / NAME</Label><Input placeholder="@nigerianfootball" value={oHandle} onChange={(e: any) => setOHandle(e.target.value)} /></div>
                <div><Label>FOLLOWERS</Label><Input placeholder="50000" type="number" value={oFollowers} onChange={(e: any) => setOFollowers(e.target.value)} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><Label>PLATFORM</Label><Select value={oPlatform} onChange={(e: any) => setOPlatform(e.target.value)}>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</Select></div>
                <div><Label>TYPE</Label><Select value={oType} onChange={(e: any) => setOType(e.target.value)}>{TYPES.map(t => <option key={t}>{t}</option>)}</Select></div>
                <div><Label>MARKET</Label><Select value={oMarket} onChange={(e: any) => setOMarket(e.target.value)}>{MARKETS.map(m => <option key={m.code} value={m.code}>{m.flag} {m.name}</option>)}</Select></div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Label>DESCRIPTION</Label>
                <textarea value={oDesc} onChange={(e: any) => setODesc(e.target.value)} placeholder="What content do they post? What is their audience like?" rows={2}
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 12px', color: 'white', fontSize: 13, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <RunBtn onClick={runOutreach} loading={oLoading} color={GREEN}>{oLoading ? 'Generating...' : '✍️ Generate Personalised Pitch'}</RunBtn>
            </div>

            {oResult && !oResult.error && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: GREEN, border: `1px solid ${GREEN}50`, backgroundColor: GREEN + '15', borderRadius: 4, padding: '3px 10px' }}>Best: {oResult.best_channel}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: PURPLE, border: `1px solid ${PURPLE}50`, backgroundColor: PURPLE + '15', borderRadius: 4, padding: '3px 10px' }}>Hook: {oResult.hook}</span>
                </div>
                {[
                  { label: 'DIRECT MESSAGE', color: PURPLE, content: oResult.dm_message, copy: oResult.dm_message },
                  { label: 'WHATSAPP MESSAGE', color: GREEN, content: oResult.whatsapp_message, copy: oResult.whatsapp_message },
                  { label: 'EMAIL', color: GOLD, content: `Subject: ${oResult.email_subject}\n\n${oResult.email_body}`, copy: `Subject: ${oResult.email_subject}\n\n${oResult.email_body}` },
                ].map(({ label, color, content, copy }) => (
                  <div key={label} style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <Label color={color}>{label}</Label>
                      <CopyBtn text={copy} />
                    </div>
                    <p style={{ fontSize: 13, color: GREY, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>{content}</p>
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
                    <Label>LEAGUE NAME</Label>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: 0 }}>{oResult.suggested_league_name}</p>
                  </div>
                  <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <Label>REFERRAL LINK</Label>
                      <CopyBtn text={oResult.referral_link} />
                    </div>
                    <p style={{ fontSize: 11, color: GREEN, wordBreak: 'break-all', margin: 0 }}>{oResult.referral_link}</p>
                  </div>
                </div>
              </div>
            )}
            {oResult?.error && <p style={{ fontSize: 13, color: RED }}>{oResult.error}</p>}
          </div>
        )}

        {/* ── BATCH SCAN ── */}
        {tab === 'batch' && (
          <div>
            <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <Label>MARKET</Label>
                <Select value={bMarket} onChange={(e: any) => setBMarket(e.target.value)} style={{ width: 'auto' }}>{MARKETS.map(m => <option key={m.code} value={m.code}>{m.flag} {m.name}</option>)}</Select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Label>CREATORS LIST — one per line</Label>
                <textarea value={bText} onChange={(e: any) => setBText(e.target.value)} rows={8} placeholder={'@nigerianfootball — Instagram fan page, 45K followers\n@eplnigeria — Twitter, 12K, EPL commentary\nNaija Football WhatsApp Group — 250 members\n@kudus_ghana_fans — Instagram, 8K'}
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '9px 12px', color: 'white', fontSize: 13, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
              </div>
              <RunBtn onClick={runBatch} loading={bLoading} color={GOLD}>{bLoading ? 'Scanning...' : '⚡ Scan All Creators'}</RunBtn>
            </div>

            {bResult && (
              <div>
                <div style={{ fontSize: 11, color: DIM, fontWeight: 700, marginBottom: 10 }}>{bResult.length} creators ranked by activation potential</div>
                {bResult.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, backgroundColor: CARD, border: `1px solid ${verdictBorder(c.verdict)}`, borderRadius: 12, padding: '14px 18px', marginBottom: 8 }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 900, color: scoreColor(c.score), minWidth: 40, textAlign: 'center' }}>{c.score}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: scoreColor(c.score), border: `1px solid ${scoreColor(c.score)}50`, backgroundColor: scoreColor(c.score) + '15', borderRadius: 4, padding: '2px 8px' }}>{c.verdict}</span>
                      </div>
                      <p style={{ fontSize: 12, color: GREY, margin: 0 }}>{c.pitch_angle}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>{c.estimated_activated}</div>
                      <div style={{ fontSize: 10, color: DIM }}>activated</div>
                    </div>
                    <button onClick={() => { setOHandle(c.name); setOMarket(bMarket); setTab('outreach'); }}
                      style={{ backgroundColor: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 12px', color: GREY, fontSize: 11, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>
                      Pitch →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

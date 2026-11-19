'use client'
// app/tools/h2h/H2HClient.tsx

import { useState, useEffect, useRef } from 'react'

interface Team {
  name: string
  logo: string
  competition: string
}

interface H2HResult {
  teamA: { name: string; logo: string; wins: number }
  teamB: { name: string; logo: string; wins: number }
  draws: number
  meetings: number
  recentMatches: {
    date: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    competition: string
  }[]
  imageUrl: string
}

// Liga 1 / ISL teams shown at top of dropdown
const PRIORITY_TEAMS = [
  'Persib Bandung', 'Persija Jakarta', 'Persebaya Surabaya', 'Arema FC',
  'PSS Sleman', 'Bali United', 'Borneo FC', 'PSIS Semarang',
  'Dewa United', 'Madura United', 'PSM Makassar', 'Persik Kediri',
]

function SearchableSelect({
  teams, value, onChange, placeholder,
}: {
  teams: Team[]
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // When value is set externally (URL params), show name in input
  const displayValue = value || ''

  const priorityTeams = teams.filter(t => PRIORITY_TEAMS.includes(t.name))
  const otherTeams = teams.filter(t => !PRIORITY_TEAMS.includes(t.name))

  const filtered = (list: Team[]) =>
    query
      ? list.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
      : list

  const filteredPriority = filtered(priorityTeams)
  const filteredOther = filtered(otherTeams)
  const hasResults = filteredPriority.length > 0 || filteredOther.length > 0

  function select(name: string) {
    onChange(name)
    setQuery('')
    setOpen(false)
  }

  const optionStyle = (selected: boolean): React.CSSProperties => ({
    padding: '10px 14px',
    cursor: 'pointer',
    backgroundColor: selected ? 'rgba(46,158,94,0.15)' : 'transparent',
    color: selected ? '#2E9E5E' : '#F0FFF4',
    fontSize: '14px',
    borderRadius: '6px',
  })

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '14px 16px',
          backgroundColor: '#0D2B14',
          border: `1px solid ${open ? '#2E9E5E' : '#1A4A1A'}`,
          borderRadius: '12px',
          color: displayValue ? '#F0FFF4' : '#6B7280',
          fontSize: '15px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue || placeholder}
        </span>
        <span style={{ color: '#6B7280', marginLeft: '8px', flexShrink: 0 }}>▾</span>
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0, right: 0,
          backgroundColor: '#0D2B14',
          border: '1px solid #1A4A1A',
          borderRadius: '12px',
          zIndex: 50,
          maxHeight: '320px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          <div style={{ padding: '8px 8px 4px' }}>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search teams…"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#071408',
                border: '1px solid #1A4A1A',
                borderRadius: '8px',
                color: '#F0FFF4',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', padding: '4px 8px 8px' }}>
            {!hasResults && (
              <div style={{ padding: '12px', color: '#6B7280', fontSize: '13px', textAlign: 'center' }}>No teams found</div>
            )}
            {filteredPriority.length > 0 && (
              <>
                {!query && <div style={{ fontSize: '10px', color: '#2E9E5E', letterSpacing: '2px', padding: '6px 6px 4px', fontWeight: 700 }}>LIGA 1 · ISL</div>}
                {filteredPriority.map(t => (
                  <div
                    key={t.name}
                    onMouseDown={() => select(t.name)}
                    style={optionStyle(value === t.name)}
                  >
                    {t.name}
                  </div>
                ))}
              </>
            )}
            {filteredOther.length > 0 && (
              <>
                {filteredPriority.length > 0 && !query && (
                  <div style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '2px', padding: '10px 6px 4px', fontWeight: 700 }}>ALL TEAMS</div>
                )}
                {filteredOther.map(t => (
                  <div
                    key={t.name}
                    onMouseDown={() => select(t.name)}
                    style={optionStyle(value === t.name)}
                  >
                    {t.name}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function H2HClient({ teams }: { teams: Team[] }) {
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<H2HResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [autoGenerated, setAutoGenerated] = useState(false)

  // Read URL params on mount — pre-select teams and auto-generate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const a = params.get('a')
    const b = params.get('b')
    if (a) setTeamA(decodeURIComponent(a))
    if (b) setTeamB(decodeURIComponent(b))
    if (a && b && a !== b) setAutoGenerated(true)
  }, [])

  // Auto-generate when both teams are set from URL
  useEffect(() => {
    if (autoGenerated && teamA && teamB) {
      generate()
      setAutoGenerated(false)
    }
  }, [autoGenerated, teamA, teamB])

  async function generate() {
    if (!teamA || !teamB) { setError('Select both teams'); return }
    if (teamA === teamB) { setError('Select two different teams'); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/h2h?teamA=${encodeURIComponent(teamA)}&teamB=${encodeURIComponent(teamB)}`)
      if (!res.ok) throw new Error('Failed to fetch H2H data')
      const data = await res.json()
      setResult(data)
      // Update URL without page reload
      const url = new URL(window.location.href)
      url.searchParams.set('a', teamA)
      url.searchParams.set('b', teamB)
      window.history.replaceState({}, '', url.toString())
    } catch (e) {
      setError('Could not load H2H data. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/tools/h2h?a=${encodeURIComponent(teamA)}&b=${encodeURIComponent(teamB)}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareBase = typeof window !== 'undefined'
    ? `${window.location.origin}/tools/h2h?a=${encodeURIComponent(teamA)}&b=${encodeURIComponent(teamB)}`
    : ''

  const whatsappUrl = result
    ? `https://wa.me/?text=${encodeURIComponent(`${teamA} vs ${teamB} H2H:\n${result.teamA.wins}W · ${result.draws}D · ${result.teamB.wins}W\n\nSee the full card & predict free: ${shareBase}`)}`
    : ''

  const twitterUrl = result
    ? `https://x.com/intent/tweet?text=${encodeURIComponent(`${teamA} vs ${teamB} H2H:\n${result.teamA.wins}W · ${result.draws}D · ${result.teamB.wins}L\n\nFull card + predict free 👇`)}&url=${encodeURIComponent(shareBase)}`
    : ''

  return (
    <div>
      {/* Team selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <SearchableSelect teams={teams} value={teamA} onChange={setTeamA} placeholder="Select Team A" />
        <div style={{ color: '#2E9E5E', fontWeight: 900, fontSize: '20px', textAlign: 'center' }}>VS</div>
        <SearchableSelect teams={teams} value={teamB} onChange={setTeamB} placeholder="Select Team B" />
      </div>

      {error && (
        <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{error}</div>
      )}

      <button
        onClick={generate}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading ? '#1A6040' : '#2E9E5E',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.5px',
          transition: 'background 0.15s',
        }}
      >
        {loading ? 'Loading H2H data…' : 'Generate Card →'}
      </button>

      {/* Result */}
      {result && (
        <div style={{ marginTop: '40px' }}>
          {/* Stats card */}
          <div style={{
            backgroundColor: '#0D2B14',
            border: '1px solid #1A4A1A',
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #2E9E5E, #8B5CF6)' }} />

            <div style={{ padding: '28px 24px' }}>
              {/* Teams header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  {result.teamA.logo && (
                    <img src={result.teamA.logo} alt={result.teamA.name} style={{ width: '56px', height: '56px', objectFit: 'contain', marginBottom: '8px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                  )}
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0FFF4' }}>{result.teamA.name}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0 16px' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '2px', marginBottom: '4px' }}>LAST {result.meetings} MEETINGS</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#2E9E5E' }}>
                    {result.teamA.wins} – {result.draws} – {result.teamB.wins}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>W · D · L</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  {result.teamB.logo && (
                    <img src={result.teamB.logo} alt={result.teamB.name} style={{ width: '56px', height: '56px', objectFit: 'contain', marginBottom: '8px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                  )}
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0FFF4' }}>{result.teamB.name}</div>
                </div>
              </div>

              {/* Recent matches */}
              <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '2px', marginBottom: '12px' }}>RECENT MATCHES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.recentMatches.map((m, i) => {
                  const homeWin = m.homeScore > m.awayScore
                  const awayWin = m.awayScore > m.homeScore
                  const draw = m.homeScore === m.awayScore
                  return (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '13px',
                    }}>
                      <span style={{ color: '#9CA3AF', minWidth: '80px' }}>{m.date}</span>
                      <span style={{ flex: 1, textAlign: 'right', fontWeight: homeWin ? 700 : 400, color: homeWin ? '#F0FFF4' : '#6B7280' }}>{m.homeTeam}</span>
                      <span style={{ margin: '0 12px', fontWeight: 700, color: draw ? '#F59E0B' : '#F0FFF4', minWidth: '40px', textAlign: 'center' }}>
                        {m.homeScore}–{m.awayScore}
                      </span>
                      <span style={{ flex: 1, fontWeight: awayWin ? 700 : 400, color: awayWin ? '#F0FFF4' : '#6B7280' }}>{m.awayTeam}</span>
                    </div>
                  )
                })}
              </div>

              {/* CTA */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #1A4A1A', textAlign: 'center' }}>
                <a
                  href='/matches'
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#2E9E5E',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  Predict the next match free →
                </a>
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href={whatsappUrl}
              target='_blank'
              rel='noopener noreferrer'
              style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#25D366', color: '#fff', padding: '12px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}
            >
              📱 WhatsApp
            </a>
            <a
              href={twitterUrl}
              target='_blank'
              rel='noopener noreferrer'
              style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', padding: '12px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}
            >
              𝕏 Post
            </a>
            <button
              onClick={copyLink}
              style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: copied ? '#1A4A1A' : '#0D2B14', border: '1px solid #1A4A1A', color: copied ? '#2E9E5E' : '#9CA3AF', padding: '12px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
            >
              {copied ? '✓ Copied' : '🔗 Copy link'}
            </button>
          </div>

          {/* OG image download */}
          <div style={{ marginTop: '12px' }}>
            <a
              href={result.imageUrl}
              target='_blank'
              rel='noopener noreferrer'
              style={{ display: 'block', textAlign: 'center', color: '#6B7280', fontSize: '12px', textDecoration: 'underline', padding: '8px' }}
            >
              Download card image (1080×1350) →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

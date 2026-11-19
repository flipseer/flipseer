'use client'
// app/tools/h2h/H2HClient.tsx

import { useState } from 'react'

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

export default function H2HClient({ teams }: { teams: Team[] }) {
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<H2HResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const selectStyle = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: '#0D2B14',
    border: '1px solid #1A4A1A',
    borderRadius: '12px',
    color: '#F0FFF4',
    fontSize: '15px',
    appearance: 'none' as const,
    outline: 'none',
    cursor: 'pointer',
  }

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

  const whatsappUrl = result
    ? `https://wa.me/?text=${encodeURIComponent(`${teamA} vs ${teamB} H2H stats — ${result.teamA.wins}W ${result.draws}D ${result.teamB.wins}W\n\nSee the full card & make your prediction: ${window.location.origin}/tools/h2h?a=${encodeURIComponent(teamA)}&b=${encodeURIComponent(teamB)}`)}`
    : ''

  const twitterUrl = result
    ? `https://x.com/intent/tweet?text=${encodeURIComponent(`${teamA} vs ${teamB} H2H:\n${teamA}: ${result.teamA.wins}W | Draws: ${result.draws} | ${teamB}: ${result.teamB.wins}W\n\nMake your prediction free 👇`)}&url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/tools/h2h?a=${encodeURIComponent(teamA)}&b=${encodeURIComponent(teamB)}`)}`
    : ''

  return (
    <div>
      {/* Team selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <select value={teamA} onChange={e => setTeamA(e.target.value)} style={selectStyle}>
            <option value=''>Select Team A</option>
            {teams.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
        <div style={{ color: '#2E9E5E', fontWeight: 900, fontSize: '20px', textAlign: 'center' }}>VS</div>
        <div style={{ position: 'relative' }}>
          <select value={teamB} onChange={e => setTeamB(e.target.value)} style={selectStyle}>
            <option value=''>Select Team B</option>
            {teams.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
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
            {/* Top bar */}
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
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>W · D · W</div>
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
              style={{
                flex: 1,
                minWidth: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#25D366',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              📱 WhatsApp
            </a>
            <a
              href={twitterUrl}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                flex: 1,
                minWidth: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#000',
                border: '1px solid #333',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              𝕏 Post
            </a>
            <button
              onClick={copyLink}
              style={{
                flex: 1,
                minWidth: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: copied ? '#1A4A1A' : '#0D2B14',
                border: '1px solid #1A4A1A',
                color: copied ? '#2E9E5E' : '#9CA3AF',
                padding: '12px 16px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
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
              style={{
                display: 'block',
                textAlign: 'center',
                color: '#6B7280',
                fontSize: '12px',
                textDecoration: 'underline',
                padding: '8px',
              }}
            >
              Download card image (1080×1350) →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

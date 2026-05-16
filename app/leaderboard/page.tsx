'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Leader = {
  id: string
  username: string
  total_points: number
  prediction_count: number
  correct_count: number
  accuracy_pct: number
  rank: string
  rank_icon: string
  country: string
  position: number
}

const COUNTRIES = [
  { code: '', label: '🌍 Global' },
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'BR', label: '🇧🇷 Brazil' },
  { code: 'GB', label: '🇬🇧 UK' },
  { code: 'US', label: '🇺🇸 USA' },
  { code: 'NG', label: '🇳🇬 Nigeria' },
  { code: 'AR', label: '🇦🇷 Argentina' },
  { code: 'DE', label: '🇩🇪 Germany' },
  { code: 'FR', label: '🇫🇷 France' },
  { code: 'ES', label: '🇪🇸 Spain' },
]

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCountry, setActiveCountry] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      let query = supabase
        .from('leaderboard')
        .select('*')
        .limit(50)

      if (activeCountry) {
        query = query.eq('country', activeCountry)
      }

      const { data, error } = await query
      if (!error && data) setLeaders(data)
      setLoading(false)
    }
    fetchLeaderboard()
  }, [activeCountry])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1F0F', color: 'white', fontFamily: 'Arial, sans-serif', padding: '0 0 60px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px 0' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#2E9E5E', marginBottom: '8px' }}>⚽ Leaderboard</h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Top predictors for World Cup 2026</p>
        </div>

        {/* Country Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', justifyContent: 'center' }}>
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              onClick={() => setActiveCountry(c.code)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: activeCountry === c.code ? '#2E9E5E' : '#1A7A4A',
                backgroundColor: activeCountry === c.code ? '#1A7A4A' : 'transparent',
                color: activeCountry === c.code ? 'white' : '#9CA3AF',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: activeCountry === c.code ? 'bold' : 'normal',
              }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>Loading...</div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>
            No predictors yet for this region. Be the first! 🎯
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaders.map((leader, i) => (
              <div key={leader.id} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                borderRadius: '12px', border: '1px solid',
                borderColor: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#F97316' : '#1A7A4A',
                backgroundColor: i === 0 ? 'rgba(245,158,11,0.08)' : i === 1 ? 'rgba(156,163,175,0.08)' : i === 2 ? 'rgba(249,115,22,0.08)' : '#0D2B14',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', width: '32px', textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{leader.username || 'Anonymous'}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                    {leader.rank_icon} {leader.rank} · {leader.prediction_count} predictions
                    {leader.country && ` · ${leader.country}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#2E9E5E', fontWeight: 'bold', fontSize: '18px' }}>{leader.total_points} pts</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{leader.accuracy_pct}% acc</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

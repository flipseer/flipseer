'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Leader = {
  id: string
  username: string
  total_points: number
  prediction_count: number
  correct_count: number
  accuracy_pct: number
  rank: string
  rank_icon: string
  position: number
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(50)

      if (!error && data) setLeaders(data)
      setLoading(false)
    }
    fetchLeaderboard()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">⚽ Leaderboard</h1>
          <p className="text-gray-400 mt-1">Top predictors for World Cup 2026</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : leaders.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No predictions yet. Be the first! 🎯
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader) => (
              <div
                key={leader.id}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  leader.position === 1
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : leader.position === 2
                    ? 'border-gray-300 bg-gray-300/10'
                    : leader.position === 3
                    ? 'border-orange-400 bg-orange-400/10'
                    : 'border-gray-700 bg-gray-900'
                }`}
              >
                {/* Position */}
                <div className="text-xl font-bold w-8 text-center">
                  {leader.position === 1 ? '🥇' : leader.position === 2 ? '🥈' : leader.position === 3 ? '🥉' : `#${leader.position}`}
                </div>

                {/* Name + Rank */}
                <div className="flex-1">
                  <div className="font-semibold">
                    {leader.username || 'Anonymous'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {leader.rank_icon} {leader.rank} · {leader.prediction_count} predictions
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <div className="text-green-400 font-bold text-lg">
                    {leader.total_points} pts
                  </div>
                  <div className="text-sm text-gray-400">
                    {leader.accuracy_pct}% acc
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

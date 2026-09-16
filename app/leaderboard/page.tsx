import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Football Prediction Leaderboard | EPL · UCL · Liga 1 · Ghana PL | Flipseer',
  description: 'Top football predictors on Flipseer. Global and country leaderboards ranked by prediction accuracy and REP points. EPL, UCL, Liga 1 and Ghana PL. Free forever.',
  keywords: 'football prediction leaderboard, EPL predictions ranking, UCL predictions leaderboard, best football predictors, football forecaster rankings',
  alternates: { canonical: 'https://flipseer.com/leaderboard' },
  openGraph: {
    title: 'Football Prediction Leaderboard | Flipseer',
    description: 'Who are the top football predictors in the world? Global and country leaderboards across EPL, UCL, Liga 1 and Ghana PL.',
    url: 'https://flipseer.com/leaderboard',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
}

export default function LeaderboardPage() {
  return (
    <>
      <div style={{ display: 'none' }}>
        <h1>Football Prediction Leaderboard — EPL, UCL, Liga 1, Ghana PL | Flipseer</h1>
        <p>Top football predictors competing across EPL 2026/27, UCL 2026/27, Liga 1 Indonesia and Ghana Premier League on Flipseer. Free prediction platform. No betting. Build your permanent Football Reputation.</p>
      </div>
      <LeaderboardClientWrapper />
    </>
  )
}

// Dynamically import the client component to avoid SSR issues
import dynamic_import from 'next/dynamic'
const LeaderboardClientWrapper = dynamic_import(() => import('./LeaderboardClient'), { ssr: false })

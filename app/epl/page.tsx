import type { Metadata } from 'next'
import EPLClient from './EPLClient'

export const metadata: Metadata = {
  title: 'Premier League 2026/27 Predictions | Flipseer',
  description: 'Predict every Premier League 2026/27 match. 380 fixtures, 20 clubs. Arsenal, Man City, Liverpool and more. Build your permanent football reputation. Free forever.',
  keywords: 'Premier League predictions 2026, EPL predictions, football prediction app, Arsenal predictions, Man City predictions',
  alternates: { canonical: 'https://flipseer.com/epl' },
  openGraph: {
    title: 'Premier League 2026/27 Predictions | Flipseer',
    description: '380 EPL matches. Predict before kickoff. Build your permanent Football Reputation. Free.',
    url: 'https://flipseer.com/epl',
  },
}

export default function EPLPage() {
  return <EPLClient />
}

import type { Metadata } from 'next'
import NigeriaClient from './NigeriaClient'

export const metadata: Metadata = {
  title: 'Nigeria Football Predictions | NPFL 2027 | Flipseer',
  description: 'Nigerian football fans predict EPL, UCL and NPFL matches on Flipseer. Remo Stars, Rivers United, Enyimba, Kano Pillars. Represent Nigeria in the global Nation Battle. Free forever.',
  keywords: 'Nigeria football predictions, NPFL predictions, Nigerian Premier League, Enyimba predictions, Remo Stars',
  alternates: { canonical: 'https://flipseer.com/nigeria' },
  openGraph: {
    title: 'Nigeria Football Predictions | NPFL 2027 | Flipseer',
    description: 'Predict EPL and NPFL matches. Represent Nigeria in the global Nation Battle. Free forever. No betting.',
    url: 'https://flipseer.com/nigeria',
    images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function NigeriaPage() {
  const clubs = [
    'Remo Stars', 'Rivers United', 'Enyimba', 'Kano Pillars',
    'Enugu Rangers', 'Akwa United', 'Bendel Insurance', 'Kwara United',
    'Abia Warriors', 'El Kanemi Warriors', 'Katsina United', 'Warri Wolves',
    'Heartland', 'Wikki Tourists', 'Lobi Stars', 'Plateau United',
    'Nasarawa United', 'Gombe United', 'Insurance FC', 'Sunshine Stars',
  ]

  return (
    <>
      <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        <h1>Nigeria Football Predictions — NPFL 2027 | Flipseer</h1>
        <p>Nigerian football fans predict EPL, UCL and NPFL matches on Flipseer. Remo Stars, Rivers United, Enyimba, Kano Pillars and all 20 NPFL clubs. NPFL 2026/27 season starts January 2027. Represent Nigeria in the global Nation Battle. Free forever. No betting.</p>
        <ul>{clubs.map(c => <li key={c}>{c}</li>)}</ul>
      </div>
      <NigeriaClient />
    </>
  )
}

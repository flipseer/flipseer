import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EPL 2026/27 Predictions | Premier League Reputation | Flipseer',
  description: 'Predict Premier League 2026/27 matches on Flipseer. Your World Cup reputation carries forward. 380 matches. Earn the EPL Founding Forecaster badge. Free forever. No betting.',
  keywords: 'EPL predictions 2026, Premier League prediction game free, football reputation EPL, Premier League forecaster, EPL 2026 predict matches, football prediction platform',
  alternates: { canonical: 'https://flipseer.com/epl' },
  openGraph: {
    title: '🏆 Premier League 2026/27 is Coming | Flipseer',
    description: 'Your World Cup reputation carries forward into EPL. 380 matches. Permanent record. Free forever. Earn the Founding Forecaster badge from August 16.',
    url: 'https://flipseer.com/epl',
    images: [{ url: 'https://flipseer.com/api/og/home', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EPL 2026/27 Predictions | Flipseer',
    description: 'Premier League predictions start August 16. Your World Cup reputation carries forward. Free forever. No betting.',
  },
}

export default function EPLLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

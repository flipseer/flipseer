import type { Metadata } from 'next'
import UCLClient from './UCLClient'

export const metadata: Metadata = {
  title: 'UCL 2026/27 Predictions | Champions League | Flipseer',
  description: 'Predict every UEFA Champions League 2026/27 match. Build your permanent Football Reputation. Free forever. No betting.',
  keywords: 'UCL predictions, Champions League 2026 predictions, football prediction UEFA',
  alternates: { canonical: 'https://flipseer.com/ucl' },
  openGraph: {
    title: 'UCL 2026/27 Predictions | Flipseer',
    description: 'Predict every UCL match. Build your permanent Football Reputation.',
    url: 'https://flipseer.com/ucl',
  },
}

export default function UCLPage() {
  return <UCLClient />
}

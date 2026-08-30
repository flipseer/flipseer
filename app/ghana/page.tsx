import type { Metadata } from 'next'
import GhanaClient from './GhanaClient'

export const metadata: Metadata = {
  title: 'Ghana Premier League 2026/27 Predictions | Flipseer',
  description: 'Predict Ghana Premier League 2026/27 matches. Asante Kotoko, Hearts of Oak, Medeama and more. Build your permanent football reputation. Free forever.',
  keywords: 'Ghana Premier League predictions, GPL 2026, Ghana football, Kotoko, Hearts of Oak',
  alternates: { canonical: 'https://flipseer.com/ghana' },
  openGraph: {
    title: 'Ghana Premier League 2026/27 | Flipseer',
    description: 'Predict every GPL match. Build your permanent football reputation. Free forever.',
    url: 'https://flipseer.com/ghana',
  },
}

export default function GhanaPage() {
  return <GhanaClient />
}

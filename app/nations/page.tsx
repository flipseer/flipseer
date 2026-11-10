import type { Metadata } from 'next'
import NationsClient from './NationsClient'

export const metadata: Metadata = {
  title: 'Nation Battle — Global Football Prediction Rankings | Flipseer',
  description: 'Which country has the best football predictors? Live EPL 2026/27 Nation Battle on Flipseer. Predict matches, earn points for your nation, compete globally.',
  keywords: 'football nation battle, EPL nation rankings, country football predictions, Flipseer nations',
  alternates: {
    canonical: 'https://flipseer.com/nations',
  },
  openGraph: {
    title: 'Nation Battle — Global Football Prediction Rankings | Flipseer',
    description: 'Which country has the best football predictors? Live EPL 2026/27 Nation Battle on Flipseer.',
    url: 'https://flipseer.com/nations',
    images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function NationsPage() {
  return <NationsClient />
}

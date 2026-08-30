import type { Metadata } from 'next'
import IndonesiaClient from './IndonesiaClient'

export const metadata: Metadata = {
  title: 'Liga 1 Indonesia 2026/27 Predictions | Flipseer',
  description: 'Prediksi Liga 1 Indonesia 2026/27. Arema, Bali United, Persebaya, Persib dan 14 klub lainnya. Bangun reputasi sepakbolamu selamanya. Gratis.',
  keywords: 'Liga 1 predictions, Liga 1 2026, Indonesia football, Arema, Bali United, Persebaya, prediksi bola',
  alternates: { canonical: 'https://flipseer.com/indonesia' },
  openGraph: {
    title: 'Liga 1 Indonesia 2026/27 | Flipseer',
    description: 'Prediksi setiap pertandingan Liga 1. Bangun reputasi sepakbolamu yang permanen. Gratis selamanya.',
    url: 'https://flipseer.com/indonesia',
  },
}

export default function IndonesiaPage() {
  return <IndonesiaClient />
}

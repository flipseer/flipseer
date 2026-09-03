import type { Metadata } from 'next'
import EgyptClient from './EgyptClient'

export const metadata: Metadata = {
  title: 'Egypt Football Predictions 2026/27 | Flipseer',
  description: 'Predict EPL and UCL matches. Represent Egypt in the global Nation Battle. Build your permanent football reputation. Free forever.',
  keywords: 'Egypt football predictions, Egyptian football fans, EPL predictions Egypt, Mohamed Salah, Nation Battle Egypt',
  alternates: { canonical: 'https://flipseer.com/egypt' },
  openGraph: {
    title: 'Egypt Football Predictions | Flipseer',
    description: 'Represent Egypt. Predict every match. Build your permanent football reputation.',
    url: 'https://flipseer.com/egypt',
  },
}

export default function EgyptPage() {
  return <EgyptClient />
}

import type { Metadata } from 'next'
import MoroccoClient from './MoroccoClient'

export const metadata: Metadata = {
  title: 'Morocco Football Predictions 2026/27 | Flipseer',
  description: 'Predict EPL and UCL matches. Represent Morocco in the global Nation Battle. Build your permanent football reputation. Free forever.',
  keywords: 'Morocco football predictions, Moroccan football fans, EPL predictions Morocco, Nation Battle Morocco',
  alternates: { canonical: 'https://flipseer.com/morocco' },
  openGraph: {
    title: 'Morocco Football Predictions | Flipseer',
    description: 'Represent Morocco. Predict every match. Build your permanent football reputation.',
    url: 'https://flipseer.com/morocco',
  },
}

export default function MoroccoPage() {
  return <MoroccoClient />
}

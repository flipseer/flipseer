import type { Metadata } from 'next'
import NigeriaClient from './NigeriaClient'

export const metadata: Metadata = {
  title: 'Nigeria Premier Football League 2026/27 | Flipseer',
  description: 'Predict NPFL 2026/27 matches. Remo Stars, Rivers United, Enyimba, Kano Pillars and more. Represent Nigeria. Build your permanent football reputation. Free forever.',
  keywords: 'NPFL predictions, Nigeria Premier League 2026, Nigeria football, Remo Stars, Rivers United, Enyimba',
  alternates: { canonical: 'https://flipseer.com/nigeria' },
  openGraph: {
    title: 'Nigeria Premier Football League 2026/27 | Flipseer',
    description: 'Represent Nigeria. Predict every NPFL match. Free forever.',
    url: 'https://flipseer.com/nigeria',
  },
}

export default function NigeriaPage() {
  return <NigeriaClient />
}

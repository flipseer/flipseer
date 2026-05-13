import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flipseer — Build Your Forecasting Reputation in Football',
  description: 'Where correct calls earn you status among real fans. No betting. No AI tips. Pure football reputation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}

import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata(
  { params }: { params: { username: string } }
): Promise<Metadata> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, rank, rank_icon, total_points, accuracy_pct, prediction_count, country')
    .eq('username', params.username)
    .single()

  if (!profile) {
    return {
      title: 'Forecaster Not Found | Flipseer',
      description: 'This forecaster hasn\'t joined Flipseer yet.',
    }
  }

  const title = `@${profile.username}'s Forecast Journal | Flipseer`
  const description = `${profile.rank_icon} ${profile.rank} · ${profile.total_points} pts · ${profile.accuracy_pct}% accuracy · ${profile.prediction_count} predictions. World Cup 2026 permanent record.`
  const ogImage = `https://flipseer.com/api/og/journal?username=${profile.username}`
  const url = `https://flipseer.com/u/${profile.username}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Flipseer',
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${profile.username}'s Flipseer Forecast Journal`,
      }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      site: '@flipseer',
    },
    // ── WhatsApp uses OpenGraph tags ──
    // og:image is automatically picked up
    alternates: {
      canonical: url,
    },
  }
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

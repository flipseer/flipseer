import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://flipseer.com'

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,                   priority: 1.0,  changeFrequency: 'daily'   },
    { url: `${base}/leaderboard`,        priority: 0.9,  changeFrequency: 'daily'   },
    { url: `${base}/predict`,            priority: 0.9,  changeFrequency: 'daily'   },
    { url: `${base}/premier-league`,     priority: 0.85, changeFrequency: 'daily'   },
    { url: `${base}/ucl`,                priority: 0.85, changeFrequency: 'daily'   },
    { url: `${base}/isl`,                priority: 0.8,  changeFrequency: 'daily'   },
    { url: `${base}/nations`,            priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${base}/leaderboard/ghana-pl`, priority: 0.75, changeFrequency: 'daily' },
    { url: `${base}/leaderboard/liga-1`,   priority: 0.75, changeFrequency: 'daily' },
    { url: `${base}/football-prediction-tips`,             priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/epl-predictions`,                      priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/champions-league-predictions`,         priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/world-cup-2026-predictions`,           priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/football-prediction-accuracy-tracker`, priority: 0.65, changeFrequency: 'monthly' },
    { url: `${base}/auth`,               priority: 0.6,  changeFrequency: 'monthly' },
  ]

  // ── Match pages ───────────────────────────────────────────────────────────
  // Only include matches with a valid slug — exact slug used, no transformation
  const { data: matches } = await supabase
    .from('matches')
    .select('slug, kickoff, status')
    .in('status', ['completed', 'upcoming', 'live', 'locked'])
    .not('slug', 'is', null)
    .order('kickoff', { ascending: false })
    .limit(300)

  const matchPages: MetadataRoute.Sitemap = (matches ?? [])
    .filter((m) => m.slug && m.slug.trim() !== '')
    .map((m) => ({
      url: `${base}/matches/${m.slug}`,
      lastModified: new Date(m.kickoff),
      changeFrequency: (m.status === 'completed' ? 'monthly' : 'daily') as 'monthly' | 'daily',
      priority: m.status === 'completed' ? 0.65 : 0.8,
    }))

  // ── Profile pages ─────────────────────────────────────────────────────────
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .gt('prediction_count', 2)
    .not('username', 'is', null)
    .order('total_points', { ascending: false })
    .limit(500)

  const profilePages: MetadataRoute.Sitemap = (profiles ?? [])
    .filter((p) => p.username)
    .map((p) => ({
      url: `${base}/u/${p.username}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...staticPages, ...matchPages, ...profilePages]
}

import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fetchMatchPages(competition: string, priority: number): Promise<MetadataRoute.Sitemap> {
  try {
    const { data: matches } = await supabase
      .from('matches')
      .select('slug, kickoff')
      .eq('competition', competition)
      .in('status', ['completed', 'upcoming', 'live', 'locked'])
      .not('slug', 'is', null)
      .order('kickoff', { ascending: false })

    return (matches ?? [])
      .filter((m) => m.slug)
      .map((m) => ({
        url: `https://flipseer.com/matches/${m.slug}`,
        lastModified: new Date(m.kickoff),
        changeFrequency: 'weekly' as const,
        priority,
      }))
  } catch (e) {
    console.error(`Sitemap fetch error for ${competition}:`, e)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://flipseer.com'
  const now = new Date()

  // Only include pages that actually exist and don't redirect
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                                          lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/predict`,                             lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/leaderboard`,                         lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${baseUrl}/premier-league`,                      lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/champions-league`,                    lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/indian-super-league`,                 lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/ghana-premier-league`,                lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/indonesia`,                           lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/india`,                               lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${baseUrl}/ghana`,                               lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${baseUrl}/nations`,                             lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${baseUrl}/how-to-predict-football`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/football-reputation`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/how-to-play`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`,                                 lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const [eplMatchPages, uclMatchPages, islMatchPages, ghanaMatchPages, ligaMatchPages] =
    await Promise.all([
      fetchMatchPages('EPL 2026/27',      0.7),
      fetchMatchPages('UCL 2026/27',      0.7),
      fetchMatchPages('ISL 2026/27',      0.7),
      fetchMatchPages('Ghana PL 2026/27', 0.6),
      fetchMatchPages('Liga 1 2026/27',   0.6),
    ])

  let profilePages: MetadataRoute.Sitemap = []
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('username, prediction_count')
      .not('username', 'is', null)
      .gt('prediction_count', 2)
      .order('prediction_count', { ascending: false })
      .limit(500)

    profilePages = (profiles ?? [])
      .filter(p => p.username && p.username.length > 0)
      .map((p) => ({
        url: `${baseUrl}/u/${p.username}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }))
  } catch (e) {
    console.error('Sitemap profile fetch error:', e)
  }

  return [
    ...staticPages,
    ...eplMatchPages,
    ...uclMatchPages,
    ...islMatchPages,
    ...ghanaMatchPages,
    ...ligaMatchPages,
    ...profilePages,
  ]
}

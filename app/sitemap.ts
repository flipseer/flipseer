import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://flipseer.com'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                                          lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/predict`,                             lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/nations`,                             lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/leaderboard`,                         lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${baseUrl}/result`,                              lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${baseUrl}/epl`,                                 lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/ucl`,                                 lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/ghana`,                               lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/indonesia`,                           lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/nigeria`,                             lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/india`,                               lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/morocco`,                             lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/egypt`,                               lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/groups`,                              lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/about`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/how-to-play`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/how-to-predict-football`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/football-reputation`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`,                                 lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // EPL match SEO pages
  let eplMatchPages: MetadataRoute.Sitemap = []
  try {
    const { data: matches } = await supabase
      .from('matches')
      .select('home_team, away_team, kickoff, status')
      .eq('competition', 'EPL 2026/27')
      .not('home_team', 'is', null)
      .not('away_team', 'is', null)
      .order('kickoff', { ascending: true })

    const cleanTeam = (name: string) => name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    eplMatchPages = (matches ?? []).map((m) => ({
      url: `${baseUrl}/matches/${cleanTeam(m.home_team)}-vs-${cleanTeam(m.away_team)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error('Sitemap EPL fetch error:', e)
  }

  // UCL match SEO pages
  let uclMatchPages: MetadataRoute.Sitemap = []
  try {
    const { data: matches } = await supabase
      .from('matches')
      .select('home_team, away_team, kickoff')
      .eq('competition', 'UCL 2026/27')
      .gte('kickoff', '2026-10-13')
      .not('home_team', 'is', null)
      .order('kickoff', { ascending: true })

    const cleanTeam = (name: string) => name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    uclMatchPages = (matches ?? []).map((m) => ({
      url: `${baseUrl}/matches/${cleanTeam(m.home_team)}-vs-${cleanTeam(m.away_team)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error('Sitemap UCL fetch error:', e)
  }

  // Public profile pages
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
        priority: 0.6,
      }))
  } catch (e) {
    console.error('Sitemap profile fetch error:', e)
  }

  return [
    ...staticPages,
    ...eplMatchPages,
    ...uclMatchPages,
    ...profilePages,
  ]
}

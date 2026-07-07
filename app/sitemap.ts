import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// Use service role key — sitemap runs server-side at build time
// anon key may have RLS restrictions that return empty data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const NATION_SLUGS = [
  'india', 'indonesia', 'nigeria', 'brazil', 'argentina',
  'england', 'france', 'germany', 'spain', 'portugal',
  'mexico', 'usa', 'ghana', 'morocco', 'japan',
  'south-korea', 'australia', 'pakistan', 'bangladesh',
  'egypt', 'senegal', 'south-africa', 'saudi-arabia',
  'turkey', 'norway',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://flipseer.com'
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/nations`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/leaderboard`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/epl`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/world-cup-2026`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/how-to-play`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/how-to-predict-football`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/football-reputation`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Nation SEO pages
  const nationPages: MetadataRoute.Sitemap = NATION_SLUGS.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Match SEO pages
  let matchSeoPages: MetadataRoute.Sitemap = []
  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select('home_team, away_team, kickoff, status')
      .eq('competition', 'World Cup 2026')
      .not('home_team', 'is', null)
      .not('away_team', 'is', null)
      .order('kickoff', { ascending: true })

    if (error) {
      console.error('Sitemap match fetch error:', error.message)
    } else {
      matchSeoPages = (matches ?? [])
        .filter(m => 
          m.home_team && 
          m.away_team && 
          m.home_team !== 'World Cup Team' &&
          m.away_team !== 'World Cup Team'
        )
        .map((m) => {
          // Strip ALL special chars — & ' . etc — only keep a-z 0-9 and hyphens
          const cleanTeam = (name: string) => name
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
          const slug = `${cleanTeam(m.home_team)}-vs-${cleanTeam(m.away_team)}`
          return {
            url: `${baseUrl}/matches/${slug}`,
            lastModified: new Date(m.kickoff),
            changeFrequency: m.status === 'completed' ? 'monthly' as const : 'daily' as const,
            priority: m.status === 'upcoming' ? 0.9 : 0.7,
          }
        })
    }
  } catch (e) {
    console.error('Sitemap match fetch exception:', e)
  }

  // Public profile pages — only active users with predictions
  let profilePages: MetadataRoute.Sitemap = []
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('username, prediction_count')
      .not('username', 'is', null)
      .gt('prediction_count', 0)
      .order('prediction_count', { ascending: false })
      .limit(500) // cap at 500 to keep sitemap manageable

    if (error) {
      console.error('Sitemap profile fetch error:', error.message)
    } else {
      profilePages = (profiles ?? [])
        .filter(p => p.username && p.username.length > 0)
        .map((p) => ({
          url: `${baseUrl}/u/${p.username}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
    }
  } catch (e) {
    console.error('Sitemap profile fetch exception:', e)
  }

  return [
    ...staticPages,
    ...nationPages,
    ...matchSeoPages,
    ...profilePages,
  ]
}

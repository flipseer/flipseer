import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://flipseer.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/predict`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/groups`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/how-to-play`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Dynamic match pages
  const { data: matches } = await supabase
    .from('matches')
    .select('id, kickoff')
    .order('kickoff', { ascending: true })

  const matchPages: MetadataRoute.Sitemap = (matches ?? []).map((m) => ({
    url: `${baseUrl}/predict#match-${m.id}`,
    lastModified: new Date(m.kickoff),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Dynamic profile pages
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username')
    .not('username', 'is', null)

  const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
    url: `${baseUrl}/u/${p.username}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...matchPages, ...profilePages]
}

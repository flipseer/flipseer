import { Redis } from '@upstash/redis'

// Requires in Vercel env vars:
// UPSTASH_REDIS_REST_URL
// UPSTASH_REDIS_REST_TOKEN

export const redis = Redis.fromEnv()

// TTL constants (seconds)
export const TTL = {
  MATCHES:      60,   // 1 min — live match list
  LEADERBOARD:  30,   // 30s  — global leaderboard
  GROUP_LB:     30,   // 30s  — group leaderboard
  MATCH_RESULT: 300,  // 5 min — finished match scores
  USER_STATS:   120,  // 2 min — user profile stats
  OG_IMAGE:     3600, // 1 hour — OG images
}

// ── Generic cache helper ──
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    const cached = await redis.get<T>(key)
    if (cached !== null) return cached
  } catch (e) {
    // Redis unavailable — fall through to fetcher
    console.warn('Redis unavailable:', e)
  }

  const data = await fetcher()
  
  try {
    await redis.set(key, data, { ex: ttl })
  } catch (e) {
    console.warn('Redis set failed:', e)
  }

  return data
}

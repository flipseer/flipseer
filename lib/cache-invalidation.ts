import { redis } from './redis'

// ── Call after match results confirmed ──
export async function invalidateMatchCache() {
  try {
    await redis.del('matches:live')
    await redis.del('matches:upcoming')
    console.log('✅ Match cache cleared')
  } catch (e) {
    console.warn('Cache invalidation failed:', e)
  }
}

// ── Call after points recalculated ──
export async function invalidateLeaderboardCache(groupId?: string) {
  try {
    if (groupId) {
      await redis.del(`leaderboard:group:${groupId}`)
    } else {
      const keys = await redis.keys('leaderboard:*')
      if (keys.length > 0) {
        await Promise.all(keys.map(k => redis.del(k)))
      }
    }
    console.log('✅ Leaderboard cache cleared')
  } catch (e) {
    console.warn('Cache invalidation failed:', e)
  }
}

// ── Call after match result confirmed ──
export async function onMatchResultConfirmed(
  matchId: string,
  groupIds: string[] = []
) {
  await invalidateMatchCache()
  await invalidateLeaderboardCache()
  await Promise.all(groupIds.map(id => invalidateLeaderboardCache(id)))
  console.log(`✅ All caches cleared for match ${matchId}`)
}

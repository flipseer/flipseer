// ── Simple in-memory rate limiter ──
// For production at scale, use Upstash Redis rate limiting

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  maxRequests: number  // max requests per window
  windowMs: number     // window in milliseconds
}

export function rateLimit(identifier: string, options: RateLimitOptions): {
  success: boolean
  remaining: number
  resetIn: number
} {
  const now = Date.now()
  const key = identifier
  const existing = rateLimitMap.get(key)

  // Reset if window expired
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + options.windowMs,
    })
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetIn: options.windowMs,
    }
  }

  // Increment count
  existing.count++

  if (existing.count > options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: existing.resetTime - now,
    }
  }

  rateLimitMap.set(key, existing)
  return {
    success: true,
    remaining: options.maxRequests - existing.count,
    resetIn: existing.resetTime - now,
  }
}

// ── Rate limit configs ──
export const LIMITS = {
  PREDICTIONS: { maxRequests: 10, windowMs: 60 * 1000 },     // 10 per minute
  AUTH:        { maxRequests: 5,  windowMs: 60 * 1000 },     // 5 per minute
  API_GENERAL: { maxRequests: 30, windowMs: 60 * 1000 },     // 30 per minute
  WELCOME:     { maxRequests: 3,  windowMs: 60 * 60 * 1000 },// 3 per hour
}

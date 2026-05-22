// ── Timezone utilities for Flipseer ──
// Handles kickoff times correctly for global users

export const TIMEZONES: { [key: string]: string } = {
  'IN': 'Asia/Kolkata',        // India (IST UTC+5:30)
  'BR': 'America/Sao_Paulo',   // Brazil
  'NG': 'Africa/Lagos',        // Nigeria
  'GB': 'Europe/London',       // UK
  'US': 'America/New_York',    // USA East
  'AR': 'America/Buenos_Aires',// Argentina
  'DE': 'Europe/Berlin',       // Germany
  'FR': 'Europe/Paris',        // France
  'ES': 'Europe/Madrid',       // Spain
  'MX': 'America/Mexico_City', // Mexico
  'ZA': 'Africa/Johannesburg', // South Africa
  'JP': 'Asia/Tokyo',          // Japan
  'AU': 'Australia/Sydney',    // Australia
  'CA': 'America/Toronto',     // Canada
}

// Format kickoff time for user's timezone
export function formatKickoff(
  kickoffUtc: string,
  userCountry?: string,
  format: 'full' | 'time' | 'date' | 'relative' = 'full'
): string {
  const timezone = userCountry
    ? TIMEZONES[userCountry] || 'UTC'
    : Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

  const date = new Date(kickoffUtc)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (format === 'relative') {
    if (diffMs < 0) return 'Kicked off'
    if (diffHours < 1) return `${Math.floor(diffMs / 60000)}m left`
    if (diffHours < 24) return `${Math.floor(diffHours)}h ${Math.floor(diffHours % 1 * 60)}m`
    if (diffDays < 7) return `${Math.floor(diffDays)}d ${Math.floor(diffHours % 24)}h`
    return formatKickoff(kickoffUtc, userCountry, 'date')
  }

  if (format === 'time') {
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (format === 'date') {
    return date.toLocaleDateString('en-GB', {
      timeZone: timezone,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Full format
  return date.toLocaleString('en-GB', {
    timeZone: timezone,
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  })
}

// Get timezone abbreviation for country
export function getTimezoneLabel(userCountry?: string): string {
  const labels: { [key: string]: string } = {
    'IN': 'IST', 'BR': 'BRT', 'NG': 'WAT', 'GB': 'BST/GMT',
    'US': 'ET', 'AR': 'ART', 'DE': 'CET', 'FR': 'CET',
    'ES': 'CET', 'MX': 'CST', 'ZA': 'SAST', 'JP': 'JST',
  }
  return userCountry ? labels[userCountry] || 'UTC' : 'Local'
}

// Check if match is locked (within 2 min of kickoff)
export function isMatchLocked(kickoffUtc: string): boolean {
  const kickoff = new Date(kickoffUtc)
  const lockTime = new Date(kickoff.getTime() - 2 * 60 * 1000)
  return new Date() >= lockTime
}

// Time remaining until lock
export function timeUntilLock(kickoffUtc: string): string {
  const kickoff = new Date(kickoffUtc)
  const lockTime = new Date(kickoff.getTime() - 2 * 60 * 1000)
  const now = new Date()
  const diff = lockTime.getTime() - now.getTime()

  if (diff <= 0) return 'Locked'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

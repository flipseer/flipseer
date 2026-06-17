/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  async redirects() {
    return [
      // Fix 404s for country pages linked from homepage TOP_NATIONS grid
      // These pages don't exist yet — redirect to /nations until built
      {
        source: '/world-cup-2026/:country',
        destination: '/nations',
        permanent: false,
      },
    ]
  },
}

module.exports = withSentryConfig(nextConfig, {
  org: 'flipseer',
  project: 'flipseer',
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})

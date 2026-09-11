/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // www → non-www canonical redirect
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.flipseer.com' }],
        destination: 'https://flipseer.com/:path*',
        permanent: true,
      },
      // Old world cup pages
      {
        source: '/world-cup-2026/:country',
        destination: '/nations',
        permanent: true,
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

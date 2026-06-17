import type { Metadata } from 'next'

type SearchParams = { [key: string]: string | string[] | undefined }

function buildImageQuery(searchParams: SearchParams) {
  const params = new URLSearchParams()
  const keys = ['home', 'away', 'outcome', 'hs', 'as', 'conf', 'user', 'country', 'league']
  for (const key of keys) {
    const val = searchParams[key]
    if (typeof val === 'string' && val.length > 0) {
      params.set(key, val)
    }
  }
  return params.toString()
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const query = buildImageQuery(searchParams)
  const imageUrl = `https://flipseer.com/api/og/prediction?${query}`

  const home = (searchParams.home as string) || 'Home'
  const away = (searchParams.away as string) || 'Away'
  const user = (searchParams.user as string) || 'A forecaster'

  const title = `@${user} predicted ${home} vs ${away} — Flipseer`
  const description =
    'World Cup 2026 prediction battle. Build your permanent football reputation. Free. No betting.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function SharePredictionPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = buildImageQuery(searchParams)
  const imageUrl = `/api/og/prediction?${query}`

  const home = (searchParams.home as string) || 'Home'
  const away = (searchParams.away as string) || 'Away'
  const user = (searchParams.user as string) || 'A forecaster'

  return (
    <main
      style={{
        backgroundColor: '#0D1F0F',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '12px',
          color: '#2E9E5E',
          fontWeight: 'bold',
          letterSpacing: '3px',
          marginBottom: '16px',
        }}
      >
        WORLD CUP 2026
      </p>

      <img
        src={imageUrl}
        alt={`@${user}'s prediction for ${home} vs ${away}`}
        style={{
          width: '100%',
          maxWidth: '640px',
          borderRadius: '16px',
          border: '1px solid #1A7A4A',
          marginBottom: '32px',
        }}
      />

      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', marginBottom: '12px' }}>
        Think you can call it better?
      </h1>
      <p style={{ color: '#9CA3AF', marginBottom: '28px', maxWidth: '420px' }}>
        Predict every World Cup 2026 match before kick-off. Build your permanent
        football reputation. Free. No betting.
      </p>
      <a
        href="/auth"
        style={{
          backgroundColor: '#1A7A4A',
          color: 'white',
          padding: '16px 44px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '18px',
          boxShadow: '0 0 40px rgba(46,158,94,0.35)',
        }}
      >
        Join Free →
      </a>
    </main>
  )
}

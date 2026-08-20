// app/leagues/[type]/page.tsx
// League type landing pages — SEO + conversion for each league archetype
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const LEAGUE_DATA: { [key: string]: {
  slug: string; name: string; icon: string; color: string;
  title: string; description: string; keywords: string;
  headline: string; subheadline: string;
  audience: string; hook: string;
  benefits: { icon: string; title: string; desc: string }[];
  whatsapp: string; steps: string[];
  cta: string;
}} = {
  office: {
    slug: 'office', name: 'Office League', icon: '🏢', color: '#8B5CF6',
    title: 'Office Football Prediction League | EPL 2026/27 | Flipseer',
    description: 'Create a private EPL prediction league for your office. Predict every Premier League match, compete with colleagues, see who actually knows football. Free forever.',
    keywords: 'office football league, workplace prediction league, EPL office competition, football prediction office, Premier League office league',
    headline: 'Office League.',
    subheadline: 'Who actually knows football in your office?',
    audience: 'Your colleagues talk football every Monday. Now prove it.',
    hook: 'Every Matchweek — predict, compare, compete. The office leaderboard never lies.',
    benefits: [
      { icon: '📊', title: 'Monday morning leaderboard', desc: 'Results processed after every matchweek. See who called it right before the meeting starts.' },
      { icon: '🔒', title: 'No excuses', desc: "Predictions lock at kickoff. Once it's in, it's permanent. No editing after you saw the team news." },
      { icon: '🌍', title: 'Still earns global points', desc: 'Your office predictions also count toward your personal record and Nation Battle — every match matters.' },
      { icon: '🆓', title: 'Free forever', desc: 'No subscription. No betting. No card. Just football intelligence, ranked.' },
    ],
    whatsapp: "⚽ I've created an Office League on Flipseer for EPL 2026/27.\n\nPredict every match before kickoff. Permanent record. No excuses.\n\nJoin here → flipseer.com/groups\nCode: [YOUR CODE]\n\nFree. No betting.",
    steps: ['Create your Office League on Flipseer', 'Share the FLIP-XXXX code on your office WhatsApp', 'Everyone predicts before each kickoff', 'Check the leaderboard every Monday morning'],
    cta: 'Create Your Office League',
  },
  family: {
    slug: 'family', name: 'Family League', icon: '👨‍👩‍👧‍👦', color: '#F59E0B',
    title: 'Family Football Prediction League | EPL 2026/27 | Flipseer',
    description: 'Create a private EPL prediction league for your family. Predict Premier League matches together, compete across generations, build a permanent family football record. Free.',
    keywords: 'family football league, family prediction league, EPL family competition, football prediction family, Premier League family league',
    headline: 'Family League.',
    subheadline: "Who's the best football mind in your family?",
    audience: 'Dad thinks he knows. You disagree. The Family League settles it — permanently.',
    hook: '380 EPL matches. One family leaderboard. A full season of bragging rights.',
    benefits: [
      { icon: '🏆', title: 'Season-long competition', desc: 'The Family League runs the full EPL season — 38 matchweeks of family rivalry.' },
      { icon: '🌏', title: 'Across any distance', desc: 'Family in India, Nigeria, UK — everyone joins the same league with one code.' },
      { icon: '📖', title: 'Permanent family record', desc: 'Every correct prediction goes on your permanent record. The bragging lasts forever.' },
      { icon: '🆓', title: 'Free forever', desc: 'No subscription. No betting. No card required.' },
    ],
    whatsapp: "⚽ Family EPL League — who actually knows football?\n\nI've set up a Flipseer league for us. Predict every Premier League match before kickoff.\n\nJoin → flipseer.com/groups\nCode: [YOUR CODE]\n\nFree. No betting. Permanent record.",
    steps: ['Create your Family League on Flipseer', 'Share the code on the family WhatsApp group', 'Everyone predicts before kickoff each matchweek', 'Crown the family champion at the end of the season'],
    cta: 'Create Your Family League',
  },
  university: {
    slug: 'university', name: 'University League', icon: '🎓', color: '#2E9E5E',
    title: 'University Football Prediction League | EPL 2026/27 | Flipseer',
    description: 'Create a private EPL prediction league for your university or college. Predict Premier League matches, compete with coursemates, earn campus bragging rights. Free forever.',
    keywords: 'university football league, college prediction league, campus EPL competition, student football prediction, university Premier League league',
    headline: 'University League.',
    subheadline: 'Campus bragging rights. All season.',
    audience: 'Your coursemates talk tactics. Now rank them.',
    hook: 'Create a University League — invite your course, your hall, your football group. One code. Full season.',
    benefits: [
      { icon: '🎓', title: 'Course vs course', desc: 'Create separate leagues per department, hall of residence or year group. Multiple leagues, one account.' },
      { icon: '📱', title: 'Built for WhatsApp', desc: 'Share your league code directly into any WhatsApp group. Join in under 2 minutes.' },
      { icon: '🌍', title: 'International students', desc: 'International students still represent their home nation — earning global Nation Battle points.' },
      { icon: '🆓', title: 'Free forever', desc: 'No subscription. No betting. No card. Perfect for students.' },
    ],
    whatsapp: "⚽ University EPL League — who actually knows football?\n\nSet up a Flipseer league for our group. Predict every Premier League match before kickoff.\n\nJoin → flipseer.com/groups\nCode: [YOUR CODE]\n\nFree. No betting. Full season.",
    steps: ['Create your University League', 'Share the code on your course/hall WhatsApp', 'Predict every EPL matchweek before kickoff', 'See who tops the league by May'],
    cta: 'Create Your University League',
  },
  friends: {
    slug: 'friends', name: 'Friends League', icon: '🏆', color: '#8B5CF6',
    title: 'Friends Football Prediction League | EPL 2026/27 | Flipseer',
    description: 'Create a private EPL prediction league with your friends. Predict Premier League matches before kickoff, compete all season, build your permanent football reputation. Free.',
    keywords: 'friends football league, prediction league friends, EPL friends competition, football prediction friends, Premier League friends league',
    headline: 'Friends League.',
    subheadline: "Settle who actually knows football. All season.",
    audience: "Your WhatsApp group argues about football every week. Now rank everyone properly.",
    hook: '380 matches. One friends league. A season of settled arguments.',
    benefits: [
      { icon: '🔒', title: 'Locked at kickoff', desc: "No changing your mind after you see the lineup. Your prediction is in — permanently." },
      { icon: '📊', title: 'Full season ranking', desc: 'Not just one match — the Friends League runs all 38 EPL matchweeks. Real skill, not luck.' },
      { icon: '📱', title: 'One tap to share', desc: 'Share your FLIP-XXXX code on WhatsApp. Friends join in under 2 minutes.' },
      { icon: '🆓', title: 'Free forever', desc: 'No subscription. No betting. No card required. Ever.' },
    ],
    whatsapp: "⚽ Friends EPL League — who actually knows football?\n\nI've set up a Flipseer league for us. Predict every Premier League match before kickoff. Full season.\n\nJoin → flipseer.com/groups\nCode: [YOUR CODE]\n\nFree. No betting.",
    steps: ['Create your Friends League', 'Send the code to your WhatsApp group', 'Everyone predicts before each kickoff', 'See who wins the season in May'],
    cta: 'Create Your Friends League',
  },
  country: {
    slug: 'country', name: 'Country League', icon: '🌍', color: '#EF4444',
    title: 'Country Football Prediction League | EPL 2026/27 | Flipseer',
    description: 'Create a private EPL prediction league for your country community. Indians, Nigerians, Indonesians — compete with your countrymen, represent your nation. Free forever.',
    keywords: 'country football league, India EPL league, Nigeria prediction league, Indonesia football league, nation prediction competition',
    headline: 'Country League.',
    subheadline: 'Represent your nation. Compete with your community.',
    audience: 'Indian EPL fans. Nigerian football lovers. Indonesian supporters. All competing together.',
    hook: 'Every correct prediction earns points for your nation in the global Nation Battle. Compete locally — rank globally.',
    benefits: [
      { icon: '🌍', title: 'Nation Battle points', desc: 'Every prediction in your Country League also earns points for your nation in the global Nation Battle rankings.' },
      { icon: '🇮🇳', title: 'Built for diaspora', desc: 'Indians in the UK, Nigerians in the US, Indonesians in Australia — one league, worldwide.' },
      { icon: '📊', title: 'Country leaderboard', desc: "See who's the top predictor from your nation. Carry your country's flag on the global stage." },
      { icon: '🆓', title: 'Free forever', desc: 'No subscription. No betting. No card required.' },
    ],
    whatsapp: "🌍 [Country] EPL Prediction League — join and represent!\n\nEvery correct prediction earns points for [Country] in Flipseer's Nation Battle.\n\nJoin → flipseer.com/groups\nCode: [YOUR CODE]\n\nFree. No betting. Permanent record.",
    steps: ['Create your Country League', 'Share with your national community WhatsApp groups', 'Predict every EPL matchweek', 'Climb the Nation Battle global rankings together'],
    cta: 'Create Your Country League',
  },
  'football-club-fan': {
    slug: 'football-club-fan', name: 'Football Club Fan League', icon: '⚽', color: '#F59E0B',
    title: 'Football Club Fan Prediction League | EPL 2026/27 | Flipseer',
    description: 'Create a private EPL prediction league for your football club fan group. Arsenal fans, Liverpool fans, Man City fans — see who calls it best. Free forever.',
    keywords: 'Arsenal fan prediction league, Liverpool fan league, football fan prediction, EPL fan competition, Premier League fan league',
    headline: 'Fan League.',
    subheadline: "Best predictor in your fan group. Prove it.",
    audience: 'Arsenal fans. Liverpool fans. Man City fans. Every fanbase has a know-it-all. Now rank them.',
    hook: "You know your club better than anyone. Now prove it across all 380 EPL matches.",
    benefits: [
      { icon: '⚽', title: 'Full EPL — not just your club', desc: "Predict all 380 EPL matches — your club's games AND the rest. Full football intelligence." },
      { icon: '🔒', title: 'No bias allowed', desc: 'Predict before kickoff. Your club loyalty is tested — correct calls earn points, bias costs you.' },
      { icon: '📊', title: 'Fan group leaderboard', desc: "Season-long ranking in your fan group. Who called it best across the whole season?" },
      { icon: '🆓', title: 'Free forever', desc: 'No subscription. No betting. No card required.' },
    ],
    whatsapp: "⚽ [Club] Fan Prediction League — who calls it best?\n\nSet up a Flipseer league for our fan group. Predict every EPL match before kickoff.\n\nJoin → flipseer.com/groups\nCode: [YOUR CODE]\n\nFree. No betting. Full season.",
    steps: ['Create your Fan League', 'Share the code in your fan group WhatsApp', 'Predict all 380 EPL matches', 'Crown the top predictor at the end of the season'],
    cta: 'Create Your Fan League',
  },
}

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  const league = LEAGUE_DATA[params.type]
  if (!league) return { title: 'League Not Found' }
  return {
    title: league.title,
    description: league.description,
    keywords: league.keywords,
    alternates: { canonical: `https://flipseer.com/leagues/${league.slug}` },
    openGraph: {
      title: league.title,
      description: league.description,
      url: `https://flipseer.com/leagues/${league.slug}`,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(LEAGUE_DATA).map(type => ({ type }))
}

export default function LeagueLandingPage({ params }: { params: { type: string } }) {
  const league = LEAGUE_DATA[params.type]
  if (!league) notFound()

  const encodedWA = encodeURIComponent(league.whatsapp)

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '80px' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg, #1A0B2E 0%, #0D1F0F 100%)', padding: '64px 20px 48px', textAlign: 'center', borderBottom: '1px solid #2D1B69' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid #8B5CF6', borderRadius: '999px', padding: '6px 18px', marginBottom: '24px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '2px' }}>EPL 2026/27 · PRIVATE LEAGUES</span>
        </div>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{league.icon}</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,7vw,56px)', marginBottom: '12px', lineHeight: 1.1 }}>
          {league.headline}<br /><span style={{ color: league.color }}>{league.subheadline}</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', maxWidth: '520px', margin: '0 auto 12px', lineHeight: 1.7 }}>
          {league.audience}
        </p>
        <p style={{ fontSize: '15px', color: league.color, fontWeight: 'bold', marginBottom: '32px' }}>
          {league.hook}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/groups" style={{ backgroundColor: league.color, color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '17px', fontWeight: 'bold', boxShadow: `0 0 32px ${league.color}60` }}>
            👥 {league.cta} →
          </a>
          <a href={`https://wa.me/?text=${encodedWA}`} target="_blank" rel="noopener noreferrer"
            style={{ backgroundColor: '#25D366', color: 'white', padding: '16px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '17px', fontWeight: 'bold' }}>
            📱 Share on WhatsApp
          </a>
        </div>
        <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '12px' }}>Free forever · No betting · No card required</p>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px 0' }}>

        {/* BENEFITS */}
        <section style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', color: league.color, fontWeight: 'bold', letterSpacing: '3px', marginBottom: '20px' }}>WHY {league.name.toUpperCase()}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {league.benefits.map(({ icon, title, desc }) => (
              <div key={title} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', color: league.color, fontWeight: 'bold', letterSpacing: '3px', marginBottom: '20px' }}>HOW IT WORKS</p>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '14px', padding: '24px' }}>
            {league.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: i < league.steps.length - 1 ? '16px' : '0', marginBottom: i < league.steps.length - 1 ? '16px' : '0', borderBottom: i < league.steps.length - 1 ? '1px solid #1A3A1A' : 'none' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: league.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0, color: 'white' }}>{i + 1}</div>
                <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6, paddingTop: '6px' }}>{step}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WHATSAPP MESSAGE */}
        <section style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', color: league.color, fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px' }}>READY-TO-SEND WHATSAPP MESSAGE</p>
          <div style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
            <pre style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'Arial, sans-serif' }}>{league.whatsapp}</pre>
          </div>
          <a href={`https://wa.me/?text=${encodedWA}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#25D366', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
            📱 Send this message on WhatsApp →
          </a>
        </section>

        {/* FINAL CTA */}
        <section style={{ backgroundColor: '#0D2B14', border: `2px solid ${league.color}`, borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: `0 0 40px ${league.color}20` }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{league.icon}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,4vw,28px)', marginBottom: '10px' }}>
            Start your {league.name} today.
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px' }}>
            EPL 2026/27 — 380 matches. Starts August 21. Free forever.
          </p>
          <a href="/groups" style={{ display: 'inline-block', backgroundColor: league.color, color: 'white', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', boxShadow: `0 0 24px ${league.color}40` }}>
            👥 {league.cta} →
          </a>
          <p style={{ fontSize: '11px', color: '#6B7280', margin: '8px 0 0' }}>Free forever · No betting · No card required</p>
        </section>

        {/* SEE ALL LEAGUES */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>Other league types:</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.values(LEAGUE_DATA).filter(l => l.slug !== params.type).map(l => (
              <a key={l.slug} href={`/leagues/${l.slug}`} style={{ backgroundColor: '#0D2B14', border: '1px solid #2D1B69', color: '#9CA3AF', padding: '6px 14px', borderRadius: '999px', textDecoration: 'none', fontSize: '12px' }}>
                {l.icon} {l.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

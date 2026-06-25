'use client';
import { useState } from 'react';

const MEDALS = ['&#x1F947;', '&#x1F948;', '&#x1F949;'];

type Props = {
  country: { name: string; code: string; flag: string; adjective: string; rivals: string[] };
  slug: string;
  profiles: any[];
  nationRank: number;
  nationPoints: number;
  forecasterCount: number;
};

export default function NationPageClient({ country, slug, profiles, nationRank, nationPoints, forecasterCount }: Props) {
  const [copied, setCopied] = useState(false);

  const shareText = `${country.flag} ${country.name} is ranked #${nationRank} in the World Cup 2026 Nation Battle on Flipseer!\n\n${forecasterCount} ${country.adjective} forecasters competing globally.\n\nJoin & represent ${country.name} → flipseer.com/${slug}\n\n#WorldCup2026 #${country.name.replace(' ', '')} #Flipseer`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`flipseer.com/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: '60px' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg, #0D2B14 0%, #0D1F0F 100%)', padding: '60px 20px 40px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>{country.flag}</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 6vw, 48px)', marginBottom: '8px', lineHeight: '1.2' }}>
          {country.name} Football Predictions
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '28px' }}>
          World Cup 2026 · Nation Battle · Global Rankings
        </p>

        {/* Nation stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {[
            { value: nationRank > 0 ? '#' + nationRank : '—', label: 'Global Rank', color: '#F59E0B' },
            { value: nationPoints, label: 'Nation Points', color: '#2E9E5E' },
            { value: forecasterCount, label: 'Forecasters', color: '#9CA3AF' },
          ].map(({ value, label, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color, fontFamily: 'Georgia, serif' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <a href="/auth" style={{ backgroundColor: '#2E9E5E', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 0 30px rgba(46,158,94,0.3)' }}>
            {country.flag} Represent {country.name} Free →
          </a>
          <a href={'https://wa.me/?text=' + encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer"
            style={{ backgroundColor: '#25D366', color: 'white', padding: '14px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            &#x1F4F1; Share
          </a>
        </div>
        <p style={{ fontSize: '12px', color: '#4B5563' }}>Free forever · No betting · No card required</p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px 0' }}>

        {/* TOP FORECASTERS */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '6px' }}>
            &#x1F3C6; {country.name}&apos;s Top Forecasters
          </h2>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>
            {country.adjective} football minds competing globally
          </p>

          {profiles.length === 0 ? (
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{country.flag}</div>
              <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
                No {country.adjective} forecasters yet.
              </p>
              <p style={{ color: '#4B5563', fontSize: '13px', marginBottom: '20px' }}>
                Be the first to represent {country.name}!
              </p>
              <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                Join & Represent {country.name} →
              </a>
            </div>
          ) : (
            <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#050E05', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px' }}>
                <span>RANK · FORECASTER</span>
                <span>ACCURACY · PREDICTIONS · POINTS</span>
              </div>
              {profiles.map((p, i) => (
                <div key={p.username} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid #1A3A1A' }}>
                  <div style={{ minWidth: '28px', textAlign: 'center' }}>
                    {i < 3
                      ? <span style={{ fontSize: '18px' }} dangerouslySetInnerHTML={{ __html: MEDALS[i] }} />
                      : <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 'bold' }}>#{i + 1}</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <a href={`/u/${p.username}`} style={{ fontSize: '15px', fontWeight: 'bold', color: '#2E9E5E', textDecoration: 'none' }}>
                      @{p.username}
                    </a>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                      {p.prediction_count} predictions · {p.correct_count} correct · {p.accuracy_pct}% accuracy
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: i === 0 ? '#F59E0B' : '#2E9E5E', fontFamily: 'Georgia, serif' }}>{p.total_points}</div>
                    <div style={{ fontSize: '10px', color: '#4B5563' }}>pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIVAL NATIONS */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '6px' }}>&#x1F30D; Rival Nations</h2>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>
            {country.name} competes against these nations in the global battle
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {country.rivals.map((rival) => (
              <a key={rival} href={'/' + rival.toLowerCase().replace(' ', '-')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '10px', padding: '10px 16px', textDecoration: 'none', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                {rival} &#x2192;
              </a>
            ))}
          </div>
        </div>

        {/* SEO CONTENT — helps Google understand the page */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: '14px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '12px', color: '#2E9E5E' }}>
            About {country.name} on Flipseer
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8', marginBottom: '12px' }}>
            {country.adjective} football fans use Flipseer to predict World Cup 2026 matches and build a permanent football reputation. Every correct prediction earns points for {country.name} in the global Nation Battle.
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8', marginBottom: '12px' }}>
            Flipseer is 100% free. No betting. No gambling. Pure football intelligence. Predict exact scores, set your confidence level, and lock your call before kickoff — permanently.
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8' }}>
            After World Cup 2026, predictions continue across EPL 2026/27, Champions League, La Liga and more. One permanent record. Every competition. Forever.
          </p>
        </div>

        {/* COPY LINK */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '10px' }}>
            Share this page with {country.adjective} football fans:
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <code style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', color: '#2E9E5E' }}>
              flipseer.com/{slug}
            </code>
            <button onClick={handleCopy}
              style={{ backgroundColor: '#1A7A4A', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* FINAL CTA */}
        <div style={{ textAlign: 'center', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '14px', padding: '32px 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{country.flag}</div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '8px' }}>
            {country.name} needs more forecasters
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>
            Help {country.name} climb the global rankings. Every prediction counts.
          </p>
          <a href="/auth" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            Join & Represent {country.name} →
          </a>
          <p style={{ color: '#4B5563', fontSize: '11px', marginTop: '10px' }}>Free forever · No card · No betting</p>
        </div>

      </div>
    </main>
  );
}

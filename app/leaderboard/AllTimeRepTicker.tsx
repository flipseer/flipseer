'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
const supabase = createClient();

const COUNTRY_FLAGS: { [key: string]: string } = {
  'IN': '🇮🇳', 'ID': '🇮🇩', 'NG': '🇳🇬', 'BR': '🇧🇷', 'AR': '🇦🇷',
  'GB': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'GH': '🇬🇭', 'FR': '🇫🇷', 'DE': '🇩🇪', 'ES': '🇪🇸',
  'PT': '🇵🇹', 'MX': '🇲🇽', 'US': '🇺🇸', 'MA': '🇲🇦', 'JP': '🇯🇵',
  'KR': '🇰🇷', 'AU': '🇦🇺', 'CA': '🇨🇦', 'ZA': '🇿🇦', 'TR': '🇹🇷',
  'PK': '🇵🇰', 'BD': '🇧🇩', 'SA': '🇸🇦', 'EG': '🇪🇬', 'CO': '🇨🇴',
  'NL': '🇳🇱', 'IT': '🇮🇹', 'NO': '🇳🇴', 'SE': '🇸🇪',
};

export default function AllTimeRepTicker() {
  const [items, setItems] = useState<{ username: string; flag: string; points: number; accuracy: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('username, country, total_points, accuracy_pct')
          .gt('total_points', 0)
          .not('username', 'is', null)
          .order('total_points', { ascending: false })
          .limit(100);
        if (!data || data.length === 0) return;
        setItems(
          data
            .filter((p: any) => p.username)
            .map((p: any) => ({
              username: p.username,
              flag: COUNTRY_FLAGS[p.country || ''] || '🌍',
              points: p.total_points,
              accuracy: p.accuracy_pct || 0,
            }))
        );
      } catch (e) {}
    };
    load();
    const t = setInterval(load, 120000);
    return () => clearInterval(t);
  }, []);

  if (items.length === 0) return null;

  const band = [...items, ...items];
  const speed = Math.max(40, items.length * 3);

  return (
    <div
      aria-hidden="true"
      style={{
        backgroundColor: '#020D04',
        borderBottom: '1px solid rgba(245,158,11,0.18)',
        padding: '8px 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes repTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes repPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.85); } }
        @keyframes repFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>

      {/* Label */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', gap: '6px',
        backgroundColor: '#020D04',
        paddingLeft: '12px', paddingRight: '14px',
        borderRight: '1px solid rgba(245,158,11,0.18)',
      }}>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          backgroundColor: '#F59E0B', display: 'inline-block',
          animation: 'repPulse 1s ease-in-out infinite', flexShrink: 0,
        }} />
        <span style={{ fontSize: '9px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '2px', whiteSpace: 'nowrap' }}>
          🏆 ALL-TIME REP
        </span>
      </div>

      {/* Scrolling band */}
      <div style={{
        display: 'flex',
        animation: `repTicker ${speed}s linear infinite`,
        whiteSpace: 'nowrap',
        width: 'max-content',
        willChange: 'transform',
        transform: 'translateZ(0)',
        paddingLeft: '130px',
      }}>
        {band.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0 22px' }}>
            <span style={{ fontSize: '13px' }}>{item.flag}</span>
            <a
              href={`/u/${item.username}`}
              style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 'bold', textDecoration: 'none' }}
            >
              @{item.username}
            </a>
            <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold', animation: 'repFlash 2s ease-in-out infinite' }}>
              {item.points} rep
            </span>
            {item.accuracy > 0 && (
              <span style={{
                fontSize: '10px', color: '#2E9E5E',
                backgroundColor: 'rgba(46,158,94,0.12)',
                border: '1px solid rgba(46,158,94,0.25)',
                padding: '1px 6px', borderRadius: '999px', fontWeight: 'bold',
              }}>
                {item.accuracy}%
              </span>
            )}
            <span style={{ color: '#1A3A1A', fontSize: '10px', marginLeft: '6px' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

'use client';

type Props = {
  totalPoints: number;
  username?: string;
  compact?: boolean; // compact=true for navbar/header, false for full display
};

const RANKS = [
  { name: 'Rookie',    icon: '🥉', min: 0,    max: 49,   color: '#9CA3AF' },
  { name: 'Predictor', icon: '🎯', min: 50,   max: 199,  color: '#2E9E5E' },
  { name: 'Expert',    icon: '🔥', min: 200,  max: 499,  color: '#F59E0B' },
  { name: 'Elite',     icon: '⭐', min: 500,  max: 999,  color: '#8B5CF6' },
  { name: 'Legend',    icon: '👑', min: 1000, max: Infinity, color: '#EF4444' },
];

function getRankInfo(points: number) {
  const current = RANKS.findLast(r => points >= r.min) || RANKS[0];
  const nextRank = RANKS[RANKS.indexOf(current) + 1] || null;

  const progressMin = current.min;
  const progressMax = nextRank ? nextRank.min : current.min + 500;
  const progressPct = nextRank
    ? Math.min(100, Math.round(((points - progressMin) / (progressMax - progressMin)) * 100))
    : 100;
  const pointsToNext = nextRank ? nextRank.min - points : 0;

  return { current, nextRank, progressPct, pointsToNext, progressMin, progressMax };
}

export default function ReputationProgressBar({ totalPoints, username, compact = false }: Props) {
  const { current, nextRank, progressPct, pointsToNext } = getRankInfo(totalPoints);

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        backgroundColor: '#0D2B14', border: '1px solid #1A3A1A',
        borderRadius: 8, padding: '6px 12px',
      }}>
        <span style={{ fontSize: 14 }}>{current.icon}</span>
        <div style={{ flex: 1, minWidth: 80 }}>
          <div style={{
            height: 4, backgroundColor: '#1A3A1A',
            borderRadius: 999, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progressPct}%`,
              backgroundColor: current.color,
              borderRadius: 999,
              transition: 'width 1s ease',
            }}/>
          </div>
        </div>
        <span style={{ fontSize: 11, color: current.color, fontWeight: 700 }}>
          {totalPoints}pts
        </span>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0D2B14',
      border: `1px solid ${current.color}40`,
      borderRadius: 14, padding: '20px',
      marginTop: 12,
    }}>
      {/* Top row — rank + points */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>{current.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>
              {current.name}
            </div>
            <div style={{ fontSize: 11, color: '#8895A3', letterSpacing: '0.5px' }}>
              FOOTBALL REPUTATION
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: current.color, letterSpacing: '-0.5px' }}>
            {totalPoints.toLocaleString()}
          </div>
          <div style={{ fontSize: 10, color: '#6B7280', letterSpacing: '1px' }}>POINTS</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{
          height: 8, backgroundColor: '#1A3A1A',
          borderRadius: 999, overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: `linear-gradient(90deg, ${current.color}88, ${current.color})`,
            borderRadius: 999,
            transition: 'width 1.2s ease',
            boxShadow: `0 0 8px ${current.color}60`,
          }}/>
        </div>
      </div>

      {/* Progress labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {nextRank ? (
          <>
            <span style={{ fontSize: 11, color: '#6B7280' }}>
              {progressPct}% to {nextRank.name}
            </span>
            <span style={{ fontSize: 11, color: nextRank.color, fontWeight: 700 }}>
              {pointsToNext} pts needed {nextRank.icon}
            </span>
          </>
        ) : (
          <span style={{ fontSize: 12, color: current.color, fontWeight: 700 }}>
            👑 Maximum rank achieved — Football Legend
          </span>
        )}
      </div>

      {/* Rank milestones */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 16, paddingTop: 12,
        borderTop: '1px solid #1A3A1A',
      }}>
        {RANKS.map((rank) => {
          const achieved = totalPoints >= rank.min;
          const isCurrent = rank.name === current.name;
          return (
            <div key={rank.name} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                fontSize: isCurrent ? 20 : 16,
                opacity: achieved ? 1 : 0.3,
                filter: isCurrent ? `drop-shadow(0 0 6px ${rank.color})` : 'none',
                transition: 'all 0.2s',
                marginBottom: 3,
              }}>
                {rank.icon}
              </div>
              <div style={{
                fontSize: 8, letterSpacing: '0.3px',
                color: isCurrent ? rank.color : achieved ? '#6B7280' : '#2E4A2E',
                fontWeight: isCurrent ? 700 : 400,
              }}>
                {rank.name.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

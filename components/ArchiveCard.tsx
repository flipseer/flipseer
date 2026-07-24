// components/ArchiveCard.tsx
// Shows completed World Cup matches with user predictions

type Props = {
  match: {
    id: number;
    home_team: string;
    away_team: string;
    kickoff: string;
    home_score: number | null;
    away_score: number | null;
    winner: string | null;
    league: string;
  };
  pred?: {
    outcome: string;
    confidence: number;
    predicted_home_score?: number;
    predicted_away_score?: number;
    points_earned?: number;
  };
};

export default function ArchiveCard({ match, pred }: Props) {
  const isCorrect = pred && match.winner === pred.outcome;
  const kickoffDate = new Date(
    match.kickoff.endsWith('Z') ? match.kickoff : match.kickoff.replace(' ', 'T') + 'Z'
  ).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{
      backgroundColor: '#0D2B14',
      border: `1px solid ${isCorrect ? '#2E9E5E' : pred ? '#7F1D1D' : '#1A3A1A'}`,
      borderRadius: '12px', padding: '16px 20px', marginBottom: '10px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', color: '#6B7280' }}>
          {match.league} · {kickoffDate}
        </span>
        <span style={{
          fontSize: '10px', fontWeight: 700,
          color: isCorrect ? '#2E9E5E' : pred ? '#EF4444' : '#6B7280',
          backgroundColor: isCorrect ? 'rgba(46,158,94,0.1)' : pred ? 'rgba(239,68,68,0.1)' : '#1A3A1A',
          padding: '2px 8px', borderRadius: '999px',
        }}>
          {isCorrect ? '✓ Correct' : pred ? '✗ Wrong' : 'No prediction'}
        </span>
      </div>

      {/* Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{
          fontSize: '16px', fontWeight: 800,
          color: match.winner === 'home' ? 'white' : '#6B7280', flex: 1,
        }}>
          {match.home_team}
        </span>
        <span style={{
          fontSize: '20px', fontWeight: 900, color: '#F59E0B',
          padding: '0 16px', letterSpacing: '-0.5px',
        }}>
          {match.home_score ?? '-'} – {match.away_score ?? '-'}
        </span>
        <span style={{
          fontSize: '16px', fontWeight: 800,
          color: match.winner === 'away' ? 'white' : '#6B7280',
          flex: 1, textAlign: 'right',
        }}>
          {match.away_team}
        </span>
      </div>

      {/* User prediction */}
      {pred && (
        <div style={{
          backgroundColor: '#050E05', borderRadius: '8px', padding: '8px 12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', color: '#8895A3' }}>
            Your pick: <strong style={{ color: 'white' }}>
              {pred.outcome === 'home' ? match.home_team
                : pred.outcome === 'away' ? match.away_team : 'Draw'}
            </strong>
            {pred.predicted_home_score !== undefined &&
              <span> · {pred.predicted_home_score}-{pred.predicted_away_score}</span>}
            <span> · {pred.confidence}% conf</span>
          </span>
          {pred.points_earned !== undefined && (
            <span style={{
              fontSize: '13px', fontWeight: 800,
              color: pred.points_earned > 0 ? '#2E9E5E' : '#6B7280',
            }}>
              {pred.points_earned > 0 ? '+' + pred.points_earned + ' pts' : '0 pts'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function PredictionHistory({ userId }: { userId: string }) {
  const [preds, setPreds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const MATCHES: { [key: number]: { home: string; away: string } } = {
    1: { home: 'Mexico', away: 'South Africa' },
    2: { home: 'USA', away: 'Canada' },
    3: { home: 'Brazil', away: 'Croatia' },
    4: { home: 'Argentina', away: 'Algeria' },
    5: { home: 'France', away: 'Senegal' },
    6: { home: 'England', away: 'Croatia' },
    7: { home: 'Germany', away: 'Japan' },
    8: { home: 'Spain', away: 'Morocco' },
    9: { home: 'Portugal', away: 'DR Congo' },
    10: { home: 'Netherlands', away: 'Ecuador' },
    11: { home: 'Italy', away: 'Peru' },
    12: { home: 'Colombia', away: 'Cameroon' },
  };

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) setPreds(data);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>Loading journal...</div>
  );

  if (preds.length === 0) return (
    <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>📖</div>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Your prediction history will appear here</p>
      <a href="/predict" style={{ display: 'inline-block', marginTop: '16px', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
        Make Your First Prediction →
      </a>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {preds.map((p) => {
        const match = MATCHES[p.match_id];
        const outcomLabel = p.predicted_outcome === 'home'
          ? match?.home
          : p.predicted_outcome === 'away'
          ? match?.away
          : 'Draw';
        const hasResult = p.points_earned !== null && p.points_earned !== undefined;
        const won = p.points_earned > 0;

        return (
          <div key={p.id} style={{
            backgroundColor: '#0D2B14',
            border: `1px solid ${hasResult ? (won ? '#2E9E5E' : '#7F1D1D') : '#1A7A4A'}`,
            borderRadius: '12px',
            padding: '16px 20px',
          }}>
            {/* Match */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                {match?.home} vs {match?.away}
              </span>
              {hasResult ? (
                <span style={{
                  fontSize: '12px',
                  backgroundColor: won ? '#1A7A4A' : '#7F1D1D',
                  color: won ? '#6EE7B7' : '#FCA5A5',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontWeight: 'bold'
                }}>
                  {won ? `+${p.points_earned} pts ✅` : '0 pts ❌'}
                </span>
              ) : (
                <span style={{ fontSize: '11px', backgroundColor: '#1A3A20', color: '#6B7280', padding: '2px 10px', borderRadius: '999px' }}>
                  Pending
                </span>
              )}
            </div>

            {/* Prediction */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Your pick: </span>
                <span style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold' }}>{outcomLabel}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Confidence: </span>
                <span style={{ fontSize: '13px', color: '#2E9E5E', fontWeight: 'bold' }}>{p.confidence_pct}%</span>
              </div>
            </div>

            {/* Date */}
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#4B5563' }}>
              {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

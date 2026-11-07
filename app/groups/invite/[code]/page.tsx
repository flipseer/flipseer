import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = { params: { code: string } };

const FLAG: Record<string, string> = {
  IN:'🇮🇳',ID:'🇮🇩',NG:'🇳🇬',BR:'🇧🇷',AR:'🇦🇷',
  GB:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',FR:'🇫🇷',DE:'🇩🇪',ES:'🇪🇸',PT:'🇵🇹',
  MX:'🇲🇽',US:'🇺🇸',GH:'🇬🇭',MA:'🇲🇦',JP:'🇯🇵',
  KR:'🇰🇷',AU:'🇦🇺',PK:'🇵🇰',BD:'🇧🇩',SA:'🇸🇦',
  TR:'🇹🇷',EG:'🇪🇬',ZA:'🇿🇦',NO:'🇳🇴',SN:'🇸🇳',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const code = params.code.toUpperCase();
  const { data: group } = await supabase
    .from('groups')
    .select('name, competition')
    .eq('invite_code', code)
    .single();

  const groupName = group?.name || 'Private League';
  const comp = (group?.competition || 'All competitions').replace(' 2026/27', '');
  return {
    title: `Join ${groupName} — ${comp} Prediction League | Flipseer`,
    description: `You've been invited to join ${groupName} on Flipseer. Predict football matches, beat your friends, build your reputation. Free forever.`,
    openGraph: {
      title: `Join ${groupName} on Flipseer`,
      description: `${comp} prediction league. Free · No betting · Predictions lock before kickoff.`,
      images: [{ url: 'https://flipseer.com/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export default async function GroupInvitePage({ params }: Props) {
  const code = params.code.toUpperCase();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch group
  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('invite_code', code)
    .single();

  if (!group) {
    return (
      <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Arial, sans-serif', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>League not found</h1>
          <p style={{ color: '#6B7280', marginBottom: 20 }}>This invite link may have expired or the code is incorrect.</p>
          <a href="/groups" style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
            Browse Leagues →
          </a>
        </div>
      </main>
    );
  }

  // Fetch top members
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', group.id)
    .limit(50);

  const memberIds = (members || []).map((m: any) => m.user_id);
  let topMembers: any[] = [];
  if (memberIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, total_points, rank_icon, rank, country')
      .in('id', memberIds)
      .order('total_points', { ascending: false })
      .limit(5);
    topMembers = profiles || [];
  }

  const memberCount = group.member_count || memberIds.length || 1;
  const comp = (group.competition || 'All competitions').replace(' 2026/27', '');
  const joinUrl = `https://flipseer.com/groups?join=${code}`;

  return (
    <main style={{ backgroundColor: '#0D1F0F', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white', paddingBottom: 60 }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#071408 0%,#0D1F0F 100%)', padding: '56px 20px 40px', textAlign: 'center', borderBottom: '1px solid #1A3A1A' }}>
        <p style={{ fontSize: 11, color: '#2E9E5E', fontWeight: 700, letterSpacing: 3, marginBottom: 16 }}>
          FLIPSEER · PRIVATE LEAGUE
        </p>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,5vw,42px)', margin: '0 0 10px 0' }}>
          {group.name}
        </h1>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <span style={{ backgroundColor: '#0D2B14', border: '1px solid #1A4A2A', borderRadius: 999, padding: '4px 14px', fontSize: 12, color: '#9CA3AF' }}>
            ⚽ {comp}
          </span>
          <span style={{ backgroundColor: '#0D2B14', border: '1px solid #1A4A2A', borderRadius: 999, padding: '4px 14px', fontSize: 12, color: '#9CA3AF' }}>
            👥 {memberCount} member{memberCount !== 1 ? 's' : ''}
          </span>
          <span style={{ backgroundColor: '#0D2B14', border: '1px solid #1A4A2A', borderRadius: 999, padding: '4px 14px', fontSize: 12, color: '#9CA3AF' }}>
            🔒 Predictions lock at kickoff
          </span>
        </div>

        {/* CTA */}
        <a
          href={`/auth?redirect=${encodeURIComponent(`/groups?join=${code}`)}`}
          style={{
            display: 'inline-block',
            backgroundColor: '#2E9E5E',
            color: 'white',
            padding: '16px 36px',
            borderRadius: 12,
            textDecoration: 'none',
            fontSize: 17,
            fontWeight: 700,
            boxShadow: '0 0 32px rgba(46,158,94,0.4)',
            marginBottom: 12,
          }}
        >
          Join This League →
        </a>
        <p style={{ color: '#4B5563', fontSize: 12, margin: 0 }}>
          Free · No betting · No card required
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 20px 0' }}>

        {/* How it works */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 14, padding: '24px', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, margin: '0 0 16px 0' }}>How it works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '🔮', title: 'Predict before kickoff', desc: 'Pick the winner, exact score, and your confidence level before the match starts.' },
              { icon: '🔒', title: 'Locks at kickoff', desc: 'No editing after the whistle. Your call is permanent — that\'s what makes it real.' },
              { icon: '🏆', title: 'Earn REP & climb the league', desc: 'Correct predictions earn REP points. See who\'s best in your private league.' },
              { icon: '📖', title: 'Permanent record', desc: 'Every prediction is archived forever. Your football intelligence, proven over time.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top members */}
        {topMembers.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, margin: '0 0 14px 0' }}>Top Forecasters in this League</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topMembers.map((m, i) => (
                <div key={m.id} style={{
                  backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 10,
                  padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#6B7280', minWidth: 24, textAlign: 'center' }}>
                    {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                  </div>
                  <div style={{ fontSize: 20 }}>{FLAG[m.country] || '🌍'}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#2E9E5E' }}>@{m.username}</span>
                    <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 8 }}>{m.rank_icon} {m.rank}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#F59E0B' }}>{m.total_points} REP</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invite code */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A4A2A', borderRadius: 14, padding: '20px', marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px 0', letterSpacing: 2 }}>INVITE CODE</p>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 6, color: '#2E9E5E', fontFamily: 'monospace' }}>{code}</div>
          <p style={{ fontSize: 11, color: '#4B5563', margin: '8px 0 0 0' }}>Share this code or the link below</p>
        </div>

        {/* Share this invite */}
        <div style={{ backgroundColor: '#0D2B14', border: '1px solid #1A3A1A', borderRadius: 14, padding: '20px', marginBottom: 32 }}>
          <h3 style={{ fontSize: 15, margin: '0 0 14px 0' }}>📤 Invite your friends</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`🏆 Join my Flipseer private league: *${group.name}*\n\n⚽ ${comp} predictions\n👥 ${memberCount} members competing\n\nJoin here: ${joinUrl}\nCode: ${code}\n\nFree · No betting · Predictions lock at kickoff ⚽`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', backgroundColor: '#25D366', color: 'white', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}
            >
              📱 WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(joinUrl)}&text=${encodeURIComponent(`🏆 Join my Flipseer league: ${group.name}\n⚽ ${comp} · Code: ${code}\nFree · No betting`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', backgroundColor: '#229ED9', color: 'white', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}
            >
              ✈️ Telegram
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`⚽ Just joined ${group.name} on @Flipseer — ${comp} prediction league.\n\nJoin me: ${joinUrl}\n\nFree · No betting · Pure football`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', backgroundColor: 'transparent', color: '#9CA3AF', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700, border: '1px solid #1A3A1A' }}
            >
              𝕏 Post
            </a>
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: 'center', backgroundColor: '#0D2B14', border: '1px solid #1A7A4A', borderRadius: 14, padding: '32px 24px' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>⚽</div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, margin: '0 0 8px 0' }}>Ready to prove your football knowledge?</h3>
          <p style={{ color: '#6B7280', fontSize: 13, margin: '0 0 16px 0' }}>Predict. Lock before kickoff. Build your permanent reputation.</p>
          <a
            href={`/auth?redirect=${encodeURIComponent(`/groups?join=${code}`)}`}
            style={{ display: 'inline-block', backgroundColor: '#1A7A4A', color: 'white', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 700 }}
          >
            Join {group.name} Free →
          </a>
          <p style={{ color: '#4B5563', fontSize: 11, marginTop: 10 }}>Free forever · No card · No betting</p>
        </div>

      </div>
    </main>
  );
}

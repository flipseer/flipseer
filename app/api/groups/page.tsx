import { createClient } from '@supabase/supabase-js';
import GroupsClient from './GroupsClient';

export const dynamic = 'force-dynamic';

export default async function GroupsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch official Flipseer leagues
  const { data: officialLeagues } = await supabase
    .from('groups')
    .select('id, name, invite_code, competition, created_by')
    .eq('is_official', true)
    .order('created_at', { ascending: false });

  return (
    <GroupsClient
      initialOfficialLeagues={officialLeagues || []}
    />
  );
}

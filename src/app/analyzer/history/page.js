import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HistoryList from '@/components/Analyzer/HistoryList';

export const metadata = {
  title: 'Analysis History',
  description: 'All your past reel analyses and profile audits',
  robots: { index: false, follow: false },
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile?.is_onboarded) redirect('/onboarding');

  const { data: history } = await supabase
    .from('analyzed_reels')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <HistoryList user={user} profile={profile} history={history || []} />;
}

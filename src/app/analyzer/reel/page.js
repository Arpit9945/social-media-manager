import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ReelAnalyzer from '@/components/Analyzer/ReelAnalyzer';

export const metadata = {
  title: 'Reel Analyzer',
  description: 'AI-powered Instagram reel analysis. Get insights on hooks, captions, hashtags, and viral potential.',
  robots: { index: false, follow: false },
};

export default async function ReelAnalyzerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile?.is_onboarded) redirect('/onboarding');

  return <ReelAnalyzer user={user} profile={profile} />;
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ReelGenerator from '@/components/Generator/ReelGenerator';

export const metadata = {
  title: 'Reel Generator',
  description: 'Create animated 15-second Instagram reels in minutes. Free forever.',
  robots: { index: false, follow: false },
};

export default async function ReelGeneratorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile?.is_onboarded) redirect('/onboarding');

  return <ReelGenerator user={user} profile={profile} />;
}

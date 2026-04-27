import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileAuditor from '@/components/Analyzer/ProfileAuditor';

export const metadata = {
  title: 'Profile Audit',
  description: 'AI-powered Instagram profile audit. Get strategic insights and growth recommendations.',
  robots: { index: false, follow: false },
};

export default async function ProfileAuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile?.is_onboarded) redirect('/onboarding');

  return <ProfileAuditor user={user} profile={profile} />;
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OnboardingClient from '@/components/Onboarding/OnboardingClient';

export const metadata = {
  title: 'Set up your brand',
  description: 'Tell us about your brand to get personalized AI suggestions',
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if already onboarded
  const { data: profile } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profile?.is_onboarded) {
    redirect('/dashboard');
  }

  return <OnboardingClient user={user} existingProfile={profile} />;
}

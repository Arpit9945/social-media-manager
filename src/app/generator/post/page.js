import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PostGenerator from '@/components/Generator/PostGenerator';

export const metadata = {
  title: 'Post Generator',
  description: 'Create static Instagram posts in seconds. Free forever.',
  robots: { index: false, follow: false },
};

export default async function PostGeneratorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile?.is_onboarded) redirect('/onboarding');

  return <PostGenerator user={user} profile={profile} />;
}

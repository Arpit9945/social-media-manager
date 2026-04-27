import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Library from '@/components/Generator/Library';

export const metadata = {
  title: 'My Library',
  description: 'All your generated reels and posts in one place',
  robots: { index: false, follow: false },
};

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile?.is_onboarded) redirect('/onboarding');

  const { data: items } = await supabase
    .from('generated_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <Library user={user} profile={profile} items={items || []} />;
}

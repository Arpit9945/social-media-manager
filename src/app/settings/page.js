import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsClient from '@/components/Settings/SettingsClient';

export const metadata = {
  title: 'Settings',
  description: 'Manage your brand profile and account settings',
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return <SettingsClient user={user} profile={profile} />;
}

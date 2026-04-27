import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/Dashboard/DashboardClient';

export const metadata = {
  title: 'Dashboard',
  description: 'Your AI Social Media Assistant dashboard',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
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

  if (!profile?.is_onboarded) {
    redirect('/onboarding');
  }

  // Fetch stats in parallel
  const [analysesResult, postsResult] = await Promise.all([
    supabase
      .from('analyzed_reels')
      .select('id, metrics, created_at, overall_score', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('generated_posts')
      .select('id, content_format, created_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const stats = {
    totalAnalyses: analysesResult.count || 0,
    totalPosts: postsResult.count || 0,
    reelsCount: postsResult.data?.filter((p) => p.content_format === 'reel').length || 0,
    staticCount: postsResult.data?.filter((p) => p.content_format === 'static').length || 0,
    recentAnalyses: analysesResult.data || [],
    recentPosts: postsResult.data || [],
  };

  return <DashboardClient user={user} profile={profile} stats={stats} />;
}

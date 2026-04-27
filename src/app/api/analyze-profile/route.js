import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGroqJSON } from '@/lib/ai/groq';
import { buildProfileAuditPrompt } from '@/lib/ai/prompts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile?.is_onboarded) {
      return NextResponse.json({ error: 'Complete onboarding first' }, { status: 400 });
    }

    const body = await request.json();
    const { handle, bio, recentCaptions } = body;

    if (!bio?.trim()) {
      return NextResponse.json({ error: 'Bio is required' }, { status: 400 });
    }

    const messages = buildProfileAuditPrompt({
      handle: handle?.replace(/^@/, '').trim() || '',
      bio: bio.trim(),
      recentCaptions: recentCaptions?.filter((c) => c?.trim()) || [],
      brandContext: profile,
    });

    const audit = await callGroqJSON(messages, {
      temperature: 0.7,
      maxTokens: 3500,
    });

    // Save to history (using analyzed_reels table with type marker)
    const { data: saved } = await supabase
      .from('analyzed_reels')
      .insert({
        user_id: user.id,
        reel_url: null,
        caption: `[PROFILE AUDIT] @${handle?.replace(/^@/, '') || 'unknown'}`,
        hashtags: null,
        metrics: { type: 'profile_audit', handle, bio },
        analysis: audit,
        overall_score: audit.overall_score,
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      audit,
      saved_id: saved?.id || null,
    });
  } catch (err) {
    console.error('Audit error:', err);
    return NextResponse.json(
      { error: err.message || 'Audit failed. Please try again.' },
      { status: 500 }
    );
  }
}

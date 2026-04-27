import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGroqJSON } from '@/lib/ai/groq';
import { buildReelAnalysisPrompt } from '@/lib/ai/prompts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get brand profile for context
    const { data: profile } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile?.is_onboarded) {
      return NextResponse.json({ error: 'Complete onboarding first' }, { status: 400 });
    }

    // Parse input
    const body = await request.json();
    const { reel_url, caption, hashtags, metrics } = body;

    if (!caption?.trim()) {
      return NextResponse.json({ error: 'Caption is required' }, { status: 400 });
    }

    // Build prompt and call AI
    const messages = buildReelAnalysisPrompt({
      caption: caption.trim(),
      hashtags: hashtags?.trim() || '',
      brandContext: profile,
      metrics: metrics || {},
    });

    const analysis = await callGroqJSON(messages, {
      temperature: 0.7,
      maxTokens: 3000,
    });

    // Save to history
    const { data: saved, error: saveError } = await supabase
      .from('analyzed_reels')
      .insert({
        user_id: user.id,
        reel_url: reel_url || null,
        caption: caption.trim(),
        hashtags: hashtags?.trim() || null,
        metrics: metrics || {},
        analysis: analysis,
        overall_score: analysis.overall_score,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      // Continue anyway — don't fail the analysis just because save failed
    }

    return NextResponse.json({
      success: true,
      analysis,
      saved_id: saved?.id || null,
    });
  } catch (err) {
    console.error('Analyze reel error:', err);
    return NextResponse.json(
      { error: err.message || 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}

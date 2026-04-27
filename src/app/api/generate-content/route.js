import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGroqJSON } from '@/lib/ai/groq';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildContentPrompt({ topic, templateId, templateName, format, brandContext }) {
  const isReel = format === 'reel';

  const isTutorial = templateId === 'tutorial';
  const isStats = templateId === 'statsBurst';
  const isQuote = templateId === 'quoteCard';
  const isProduct = templateId === 'productShowcase';

  let templateRules = '';
  if (isTutorial) {
    templateRules = '\n- The "subtitle" MUST be 3 short numbered steps separated by newlines (\\n). Each step max 8 words.';
  } else if (isStats) {
    templateRules = '\n- The "title" should be a NUMBER (with optional + or %), e.g., "10000+", "85%", "1Cr+".';
  } else if (isQuote) {
    templateRules = '\n- The "title" should be a quote (under 15 words). The "subtitle" should be the author name.';
  } else if (isProduct) {
    templateRules = '\n- The "title" should be a product name (under 4 words). Subtitle = a tagline.';
  }

  const systemPrompt = `You are ASMA, an expert Instagram content writer for Indian creators.

Your task: Given a topic, generate punchy ${isReel ? '15-second reel' : 'static post'} content for the "${templateName}" template.

You MUST respond ONLY with valid JSON in this structure:
{
  "title": "<main hook/headline, max 80 chars, attention-grabbing>",
  "subtitle": "<supporting text, max 120 chars>",
  "cta": "<call-to-action, max 40 chars>"
}

Rules:
- Tone: Punchy, scroll-stopping, Hinglish okay if it fits the brand voice.
- No emoji spam — at most 1 emoji per field, ideally none.
- Title should hook in first 3 words.
- CTA should be action-oriented (Save, Share, Tap, Comment, Follow).
- NO hashtags in any field.
- Avoid generic phrases like "Are you ready" or "Did you know" unless template demands it.${templateRules}`;

  const userPrompt = `Topic: "${topic}"

${brandContext ? `Brand context:
- Brand: ${brandContext.brand_name || 'N/A'}
- Category: ${brandContext.product_category || 'N/A'}
- Target audience: Age ${brandContext.target_age_min}-${brandContext.target_age_max}, ${brandContext.target_gender || 'all'}
- Brand voice: ${brandContext.brand_tone || 'N/A'}` : ''}

Generate the content as JSON.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

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
    const { topic, templateId, templateName, format } = body;

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (topic.length > 200) {
      return NextResponse.json({ error: 'Topic too long' }, { status: 400 });
    }

    const messages = buildContentPrompt({
      topic: topic.trim(),
      templateId: templateId || 'textReveal',
      templateName: templateName || 'Text',
      format: format || 'reel',
      brandContext: profile,
    });

    const content = await callGroqJSON(messages, {
      temperature: 0.85,
      maxTokens: 500,
    });

    // Validate fields
    if (!content.title) {
      return NextResponse.json({ error: 'AI returned invalid content. Try again.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      content: {
        title: String(content.title || '').substring(0, 100),
        subtitle: String(content.subtitle || '').substring(0, 200),
        cta: String(content.cta || '').substring(0, 60),
      },
    });
  } catch (err) {
    console.error('Generate content error:', err);
    return NextResponse.json(
      { error: err.message || 'Generation failed. Try again.' },
      { status: 500 }
    );
  }
}

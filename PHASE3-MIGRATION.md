# ASMA Phase 3 — Setup Guide

Complete migration guide for upgrading from Phase 2 to Phase 3.

## What's new in Phase 3

✅ **Reel Analyzer** — AI analysis of any Instagram reel (hooks, captions, hashtags, viral potential, improved version)
✅ **Profile Auditor** — Strategic audit of bio + recent captions + growth strategy
✅ **Analysis History** — All your past analyses saved & searchable
✅ **Mini Reel Generator** — 10 animated templates, 1080×1920, 15-sec WebM/GIF/PNG export
✅ **Static Post Generator** — Same templates, instant PNG/JPG/WebP export
✅ **My Library** — Grid view of all generated reels & posts
✅ **Updated Dashboard** — Real working tools, quick stats, recent activity

---

## Setup Steps

### 1. Run the SQL migration

Open your Supabase project → SQL Editor → New query, paste the contents of `phase3-schema-migration.sql`, and run it.

This will:
- Make `analyzed_reels.reel_url` nullable
- Add `metrics` and `analysis` JSONB columns to `analyzed_reels`
- Convert `analyzed_reels.hashtags` from `TEXT[]` to `TEXT`
- Add `content_format`, `template_data`, `file_format`, `duration_seconds`, `thumbnail_url` to `generated_posts`
- Recreate RLS policies on both tables

### 2. Add the Groq API key to your environment

Get a free API key at [console.groq.com](https://console.groq.com).

Add to `.env.local`:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Replace project files

Extract the ZIP and replace your existing files. Key new directories/files:

```
src/
├── app/
│   ├── analyzer/
│   │   ├── reel/page.js          ← Reel analyzer entry
│   │   ├── profile/page.js       ← Profile auditor entry
│   │   └── history/page.js       ← History entry
│   ├── api/
│   │   ├── analyze-reel/route.js ← Groq integration
│   │   └── analyze-profile/route.js
│   ├── generator/
│   │   ├── reel/page.js          ← Reel generator entry
│   │   ├── post/page.js          ← Static post generator entry
│   │   └── library/page.js       ← My library entry
│   └── dashboard/page.js          ← Updated with stats
├── components/
│   ├── Analyzer/                  ← All analyzer UI
│   ├── Generator/                 ← All generator UI + 10 templates
│   ├── Shared/ToolHeader.js       ← Reused header for all tools
│   └── Dashboard/                 ← Updated dashboard
├── lib/
│   ├── ai/
│   │   ├── groq.js                ← Groq client
│   │   └── prompts.js             ← AI prompts
│   └── reel/
│       ├── canvasEngine.js        ← Animation engine
│       ├── webmExporter.js        ← Video export
│       └── gifExporter.js         ← GIF export
package.json                        ← Updated with gif.js dependency
phase3-schema-migration.sql         ← SQL migration
```

### 4. Install new dependencies

```bash
npm install
```

This will:
- Install `gif.js@^0.2.0` for animated GIF export
- Auto-copy `gif.worker.js` to `public/` via the postinstall script

### 5. Verify gif.worker.js exists

Check that `public/gif.worker.js` exists. If not, manually copy:

```bash
cp node_modules/gif.js/dist/gif.worker.js public/gif.worker.js
```

Without this, animated GIF export will fail (WebM still works).

### 6. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000/dashboard` — you should see all 6 tool cards live and working.

---

## Testing the build

### Reel Analyzer
1. Go to Dashboard → Reel Analyzer
2. Paste any Instagram caption (URL is optional)
3. Hit "Analyze with AI"
4. You should get a full report in 5-10 seconds

### Reel Generator
1. Go to Dashboard → Mini Reel Generator
2. Pick a template (e.g., "Bold Statement")
3. Type your title, subtitle, CTA — preview animates live
4. Click "Export reel" → "Download Video (WebM)"
5. WebM should download in ~15-25s

### Library
1. After generating a reel/post, go to "My library" from dashboard
2. Your creation should appear with thumbnail rendered locally from saved data

---

## Troubleshooting

**"Failed to parse AI response as JSON"**  
Groq sometimes returns malformed JSON. Just retry — usually works second time. The prompt is engineered with `response_format: json_object` to minimize this.

**WebM export fails on Safari**  
Safari doesn't support `MediaRecorder` for canvas streams. Use the GIF format on Safari, or recommend Chrome/Firefox/Edge to your users.

**GIF export times out**  
GIF encoding is CPU-heavy. The 15-fps × 225-frame encoding takes 30-60s. If browser tab is backgrounded, it may pause. Keep the tab focused during export.

**Storage upload fails**  
File sizes can be large (especially GIFs at 8-15MB). Supabase free tier has a 50MB per-file limit which should be enough. If saves silently fail, check the Storage logs in your Supabase dashboard.

**RLS policy errors**  
If you see "new row violates row-level security policy" errors, re-run the SQL migration — it drops and recreates all policies.

---

## What's next (Phase 4)

Phase 4 ideas (if you want them):
- AI Caption/Hashtag generator (standalone tool)
- Bulk content generation
- Schedule planner UI
- More reel templates (10 → 20+)
- Custom font upload

Phase 5: Final SEO audit, performance optimization, Vercel deploy.

---

**Phase 3 = ASMA goes from skeleton to actually useful product.** 🚀

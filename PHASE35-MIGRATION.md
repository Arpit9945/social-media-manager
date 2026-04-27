# ASMA Phase 3.5 — Update Guide

Quick fixes + powerful new features. **No new SQL migration needed** — schema is unchanged from Phase 3.

## What's new in Phase 3.5

### 🐛 Fixes
- **Sass deprecation warning fixed** — modern Sass API enabled in `next.config.js`. No more "legacy JS API" warnings during build/dev.
- **Performance issues fixed** — route changes are now snappy with skeleton loaders during navigation.

### ✨ New features
- **🤖 AI Content Generation** — In both reel & post generators, type a topic and AI fills in title/subtitle/CTA based on your brand voice + chosen template.
- **🖼️ Logo Upload on Templates** — Upload any logo (PNG/JPG/SVG) and overlay it on any reel or post. Position picker (6 corners), size slider, background style (rounded/circle/none), on/off toggle.
- **🎨 10 New Templates** — Total now **20 templates** (was 10). Variety covers: hooks, educational, data, branding, product, engagement, quotes.

### ⚡ Performance improvements
- `next.config.js` updated with modern Sass compiler API + aggressive caching headers for static assets and gif worker
- `loading.js` files added for all tool routes — Next.js shows instant skeleton during navigation instead of blank screen
- Custom `ToolLoading` skeleton with 3 variants (grid / editor / list) — shimmer animation
- Vercel-optimized: source maps disabled in production, package imports optimized

---

## Setup steps

### 1. Replace project files

Extract the ZIP and replace your existing files. **Don't delete `phase3-schema-migration.sql` from your Supabase** — it's already applied. No new migration needed.

### 2. Re-install dependencies (just to be safe)

```bash
npm install
```

This will re-run the postinstall script that copies `gif.worker.js` into `public/`.

### 3. Restart dev server

```bash
npm run dev
```

You should see:
- ✅ No more Sass deprecation warnings in the console
- ✅ Faster route transitions with skeleton loaders
- ✅ AI generate input above the form fields
- ✅ "Brand logo" collapsible section with upload UI
- ✅ 20 templates in the picker (was 10)

---

## New templates list (20 total)

| # | Template | Category | Best for |
|---|----------|----------|----------|
| 1 | Bold Statement | Hook | Big impact text |
| 2 | Question Hook | Engagement | Curiosity-driving questions ⭐ NEW |
| 3 | Text Reveal | Hook | Typewriter announcement |
| 4 | Story Style | Hook | 3-phase kinetic narrative |
| 5 | Tutorial Steps | Educational | 3-step how-to |
| 6 | Did You Know | Educational | Tips & insights |
| 7 | Top 5 List | Educational | Listicles ⭐ NEW |
| 8 | This vs That | Educational | Before/After ⭐ NEW |
| 9 | Stats Burst | Data | Animated number reveal |
| 10 | Bold Numbers | Data | Big % statements ⭐ NEW |
| 11 | Customer Review | Social proof | Testimonials with stars ⭐ NEW |
| 12 | Brand Reveal | Branding | Cinematic intro |
| 13 | Magazine Cover | Branding | Editorial layouts ⭐ NEW |
| 14 | Glow Card | Branding | Tech/SaaS premium feel ⭐ NEW |
| 15 | Product Showcase | Product | Product launches |
| 16 | Flash Sale | CTA | Promo announcements ⭐ NEW |
| 17 | Event Announcement | CTA | Date-prominent events ⭐ NEW |
| 18 | CTA Push | CTA | Link-in-bio drives |
| 19 | Quote Card | Quote | Inspirational quotes |
| 20 | Minimal Clean | Sophisticated | Editorial whitespace ⭐ NEW |

---

## How to use the new features

### AI Content Generation
1. Open Reel/Post Generator → pick a template → editor opens
2. At the very top of the form, you'll see a gradient "Generate with AI" block
3. Type a topic (e.g., `"morning skincare routine"`, `"50% off shoes"`, `"gym tips for beginners"`)
4. Hit Enter or click Generate
5. Title/Subtitle/CTA auto-fill — based on:
   - Your topic
   - The chosen template (each template has different rules — Tutorial gets 3 steps, Stats Burst gets numbers, Quote Card gets a quote+author, etc.)
   - Your brand voice (from onboarding)

### Logo Upload
1. In the editor form, scroll to **"Brand logo"** collapsible
2. Click "Upload logo" → pick PNG/JPG/SVG/WebP (max 5MB)
3. Image is auto-resized to 512px max, converted to PNG, uploaded to Supabase storage
4. Once uploaded:
   - **Show on this template** toggle → on/off per template
   - **Position** → 6 corner options (TL, TC, TR, BL, BC, BR)
   - **Size** → slider 60-220px
   - **Background style** → Rounded / Circle / None

If your brand has a `logo_url` from onboarding, it auto-loads as default.

---

## Vercel Deployment Tips

For best performance on Vercel:

1. **Environment variables** — make sure these are set in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GROQ_API_KEY`

2. **Build command** — use default `next build` (Vercel auto-detects Next.js 15)

3. **Region** — set to closest to your Supabase region (Mumbai → use `bom1` for Vercel's Mumbai edge)

4. **The Sass warning was just informational** — it didn't block deploys, but now it's silenced in `next.config.js` so your build logs are clean.

---

## Troubleshooting

**"Generate with AI" button does nothing**  
Check that `GROQ_API_KEY` is set in `.env.local` (or in Vercel env vars). Open dev tools → Network tab → trigger generate → look for the `/api/generate-content` response.

**Logo upload fails with "row-level security" error**  
The `logos` Supabase storage bucket from Phase 1 must allow uploads from authenticated users. Check Storage → logos → Policies. The default policy from the Phase 1 schema works fine.

**Logo doesn't show on canvas after upload**  
The logo is fetched cross-origin. Make sure your Supabase project allows CORS from your domain. By default, Supabase CDN allows all origins so it should just work.

**Still seeing the old templates only**  
Hard refresh (Ctrl+Shift+R / Cmd+Shift+R) — Next.js may cache the previous bundle.

---

**Phase 3.5 = production polish + AI superpowers** ✨

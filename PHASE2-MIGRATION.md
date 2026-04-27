# 🚀 Phase 2 Migration Guide

## What's New in Phase 2

### ✅ All Visual Bugs Fixed
- Dashboard "ARPIT" text overflow → Fixed (Inter font + padding)
- Features section cards not rendering → Fixed (removed broken animation)
- How It Works cards not rendering → Fixed (same animation bug)
- Floating cards overlapping phone mockup → Fixed (better positioning)
- Italic Instrument Serif clipping → Fixed (only 1 strategic spot now)

### 🎨 iPhone-Style Design Overhaul
- **Inter font** integrated (with SF Pro fallback for Apple devices)
- Tighter, mathematical spacing (Apple's 8pt grid)
- Refined letter-spacing (-0.02em to -0.04em like Apple)
- Cleaner button hierarchy (white primary, ghost secondary)
- Better depth & layering (subtle shadows, glass effects)
- Reduced italic gradient usage (was 6 places, now 1-2 strategic)

### 🎯 New Logo
- Distinctive "A" wordmark with crossbar + AI spark dot
- Gradient violet→pink background, rounded square
- Reusable `<Logo />` component (size + text props)
- Used everywhere: header, footer, login, dashboard, onboarding, favicon

### 📋 Mandatory Onboarding (5 Steps)
1. **Welcome** — Greeting + benefits
2. **Brand Identity** — Name, logo upload, description
3. **Brand Colors** — 8 presets + custom picker + live preview
4. **Target Audience** — Category, age range slider, gender, location
5. **Brand Voice** — Tone selector with examples + Instagram handle

- Auto-redirect to `/onboarding` for new users
- Cannot skip (required), but **fully editable later from /settings**
- Saves to `brand_profiles` table

### ⚙️ Settings Page (NEW)
- Tabbed interface: Identity, Colors, Audience, Voice, Account
- Edit everything from onboarding
- Sign out option
- Account info display

### 📊 Enhanced Dashboard
- Brand profile card with logo + meta chips
- Personalized welcome with user's first name
- Tools grid (Phase 3-5 placeholders with proper status)
- User menu dropdown with Settings + Sign Out

---

## How to Migrate (Important!)

### Step 1: Backup Current Project
```bash
# Make a backup of your current project folder first
# Just rename it to "social-media-manager-phase1-backup"
```

### Step 2: Stop Dev Server
If running, stop it: `Ctrl + C` in the terminal.

### Step 3: Replace Files
Extract `asma-app-phase2.zip`. Then in your existing project (`C:\wamp64\www\social-media-manager\`):

**Replace these folders entirely** (delete old, copy new):
- `src/styles/`
- `src/components/`
- `src/app/`
- `src/lib/supabase/middleware.js`

**Keep these files unchanged:**
- `.env.local` (your API keys)
- `node_modules/`
- `package.json`, `package-lock.json`
- Other config files

### Step 4: Database Update (NO new tables needed!)

The `brand_profiles` table from Phase 1 already supports everything. No SQL changes required.

### Step 5: Restart Dev Server
```bash
npm run dev
```

### Step 6: Test the Flow
1. Open `http://localhost:3000`
2. Landing page → check all sections now visible (Features, How It Works, etc.)
3. Click "Get Started Free" → Login page (new logo)
4. Sign in with Google → **Auto-redirect to /onboarding** (mandatory)
5. Complete 5 steps → Lands on dashboard
6. Dashboard shows your brand info
7. Click profile menu → Settings → Edit anything → Save
8. Sign out works

---

## File Structure (Phase 2)

```
src/
├── app/
│   ├── dashboard/page.js          [UPDATED]
│   ├── login/                     [UPDATED]
│   ├── onboarding/page.js         [NEW]
│   ├── settings/page.js           [NEW]
│   ├── layout.js                  [UPDATED - Inter font]
│   ├── icon.svg                   [UPDATED - new logo]
│   └── page.js                    [unchanged]
├── components/
│   ├── Auth/                      [UPDATED]
│   ├── Dashboard/                 [UPDATED]
│   ├── Footer/                    [UPDATED]
│   ├── Header/                    [UPDATED]
│   ├── Landing/                   [UPDATED - all sections]
│   ├── Logo/                      [NEW]
│   ├── Onboarding/                [NEW]
│   │   ├── OnboardingClient.js
│   │   ├── Onboarding.module.scss
│   │   └── steps/
│   │       ├── StepWelcome.js
│   │       ├── StepIdentity.js
│   │       ├── StepColors.js
│   │       ├── StepAudience.js
│   │       ├── StepVoice.js
│   │       └── Step.module.scss
│   └── Settings/                  [NEW]
├── lib/supabase/
│   └── middleware.js              [UPDATED - onboarding check]
└── styles/
    ├── abstracts/_variables.scss  [UPDATED - Inter, iPhone scale]
    └── base/_global.scss          [UPDATED]
```

---

## Troubleshooting

### "Cannot find module 'next/font/google'"
Run: `npm install next@latest` to ensure Next.js 15 is installed.

### Onboarding redirect loop
Clear browser cookies and re-login. Make sure `is_onboarded` column exists in `brand_profiles` table (it does from Phase 1).

### Logo not showing in storage
Make sure the `logos` storage bucket has public access enabled in Supabase Dashboard.

### Inter font not loading
Hard refresh: `Ctrl + Shift + R`. Inter is loaded via `next/font/google` so it bundles automatically.

### Dashboard shows "is_onboarded" error
Run this in Supabase SQL Editor:
```sql
ALTER TABLE brand_profiles 
ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false;
```

---

## What's Next: Phase 3

Reel Analyzer:
- Single reel analyzer (paste link)
- Profile audit (full account analysis)
- Compare reels (yours vs competitor)
- AI-powered suggestions

Ready when you are! 🚀

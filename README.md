# AI Social Media Assistant by Arpit (ASMA)

Free AI-powered Instagram growth tool built with Next.js 15, Supabase, and SCSS.

---

## 🎯 Phase 1 — What's Included

✅ Next.js 15 project setup (JavaScript, App Router, no TypeScript, no Tailwind)  
✅ SCSS architecture with global variables system  
✅ SEO-optimized landing page (Hero, Features, How It Works, Pricing, FAQ, CTA)  
✅ Modern SaaS dark theme (Linear/Vercel inspired)  
✅ Mobile-first responsive design  
✅ Google OAuth authentication via Supabase  
✅ Database schema with Row Level Security  
✅ Dashboard skeleton (placeholder for Phase 2+)  
✅ Sitemap, robots.txt, manifest.json  
✅ Performance: optimized fonts, lazy loading, security headers  
✅ Full meta tags + Open Graph + structured data (JSON-LD)  

---

## 📋 Setup Instructions (Step-by-Step)

### Step 1: Install Node.js
Download Node.js 18+ from https://nodejs.org

Verify installation:
```bash
node --version
npm --version
```

### Step 2: Install Dependencies
```bash
cd asma-app
npm install
```

### Step 3: Setup Supabase (5 minutes)

1. Go to https://supabase.com and create a free account
2. Click "New Project"
3. Fill in:
   - Project name: `asma-app`
   - Database password: (save this somewhere safe)
   - Region: `South Asia (Mumbai)` for India
4. Wait 2 minutes for project to be created
5. Once ready, go to **Settings** → **API**
6. Copy these 3 values:
   - **Project URL**
   - **anon public key**
   - **service_role secret key** (keep this private!)

### Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open the file `supabase-schema.sql` from this project
4. Copy entire content and paste in SQL Editor
5. Click "Run"
6. ✅ Tables created!

### Step 5: Setup Google OAuth in Supabase

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth Client ID**
5. Configure OAuth consent screen first if prompted:
   - User Type: External
   - App name: `AI Social Media Assistant by Arpit`
   - Add your email
6. Create OAuth Client:
   - Application type: **Web application**
   - Name: `ASMA`
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
     - `https://your-project-id.supabase.co`
     - (your production URL when deployed)
   - **Authorized redirect URIs:**
     - `https://your-project-id.supabase.co/auth/v1/callback`
7. Save and copy the **Client ID** and **Client Secret**

8. Back in Supabase:
   - Go to **Authentication** → **Providers**
   - Find **Google**, toggle it ON
   - Paste Client ID and Client Secret
   - Save

### Step 6: Get Free AI API Keys

#### Groq API (for fast text generation)
1. Go to https://console.groq.com
2. Sign up (free)
3. Click **API Keys** → **Create API Key**
4. Copy the key

#### Google Gemini API (for vision + backup text)
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click **Create API Key**
4. Copy the key

### Step 7: Create `.env.local`

In the project root, create a file named `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# AI APIs
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here

# App URL (change for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 8: Run the App

```bash
npm run dev
```

Open http://localhost:3000 — you should see the landing page!

---

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Phase 1"
git branch -M main
git remote add origin https://github.com/yourusername/asma-app.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **New Project** → Import your repo
4. Add environment variables (same as `.env.local`)
5. Click **Deploy**
6. Done! Your app is live.

### Step 3: Update OAuth Redirect URLs
After deployment:
1. Add your Vercel URL to Google Console authorized origins
2. Update `NEXT_PUBLIC_APP_URL` in Vercel env to production URL
3. Update Supabase Auth → URL Configuration:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

---

## 📁 Project Structure

```
asma-app/
├── public/                      # Static assets
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── auth/callback/       # OAuth callback handler
│   │   ├── dashboard/           # Dashboard page
│   │   ├── login/               # Login page
│   │   ├── layout.js            # Root layout (SEO metadata)
│   │   ├── page.js              # Landing page
│   │   ├── sitemap.js           # Dynamic sitemap
│   │   ├── robots.js            # Dynamic robots.txt
│   │   └── icon.svg             # Favicon
│   ├── components/
│   │   ├── Auth/                # Auth components
│   │   ├── Dashboard/           # Dashboard components
│   │   ├── Footer/
│   │   ├── Header/
│   │   └── Landing/             # Landing page sections
│   ├── lib/
│   │   └── supabase/            # Supabase clients (browser + server)
│   ├── styles/
│   │   ├── abstracts/
│   │   │   ├── _variables.scss  # 🎨 ALL design tokens
│   │   │   └── _mixins.scss     # Reusable mixins
│   │   ├── base/
│   │   │   ├── _reset.scss
│   │   │   └── _global.scss
│   │   └── main.scss
│   └── middleware.js            # Auth middleware
├── supabase-schema.sql          # Database schema
├── next.config.js
├── jsconfig.json
├── package.json
└── .env.example
```

---

## 🎨 Customizing Colors / Styles

**All design tokens are in:** `src/styles/abstracts/_variables.scss`

To change the entire app's color scheme, just edit this one file:
- `$color-bg-primary` — main background
- `$color-accent` — primary brand color (currently violet)
- `$color-secondary` — secondary brand color (currently pink)
- `$gradient-primary` — main gradient

Save the file and the entire app updates instantly.

---

## 📊 What's Next (Roadmap)

- **Phase 2:** Brand onboarding flow + Settings page
- **Phase 3:** Reel Analyzer (single + profile audit + compare)
- **Phase 4:** Post Generator with templates + AI generation
- **Phase 5:** Caption/Hashtag generator + History + Performance optimization

---

## 🛡️ Security Features Implemented

- Row Level Security (RLS) on all database tables
- Server-side API key handling (never exposed to client)
- HTTPS enforcement via Vercel
- Security headers (XSS, frame protection, content type)
- HttpOnly cookies for auth sessions
- CSRF protection via Supabase OAuth flow
- Input sanitization
- Protected routes via middleware

---

## 💡 Tips

- The `.env.local` file is git-ignored, never commit it
- Use Chrome DevTools Lighthouse to verify SEO/performance scores
- Test Google sign-in in incognito mode
- Check Supabase logs if auth doesn't work

---

**Built by Arpit • Free Forever • Made with ♥ in India**

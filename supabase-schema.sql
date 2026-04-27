-- ============================================
-- ASMA Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. BRAND PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  brand_name TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#8b5cf6',
  secondary_color TEXT DEFAULT '#ec4899',
  product_category TEXT,
  target_age_min INTEGER,
  target_age_max INTEGER,
  target_gender TEXT,
  target_location TEXT,
  brand_tone TEXT,
  instagram_handle TEXT,
  brand_description TEXT,
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ANALYZED REELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analyzed_reels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reel_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  hashtags TEXT[],
  views_count INTEGER,
  likes_count INTEGER,
  comments_count INTEGER,
  analysis_data JSONB,
  overall_score NUMERIC(3,1),
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyzed_reels_user ON public.analyzed_reels(user_id, created_at DESC);

-- ============================================
-- 3. GENERATED POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.generated_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_type TEXT NOT NULL,
  template_id TEXT,
  title TEXT,
  caption TEXT,
  hashtags TEXT[],
  image_url TEXT,
  metadata JSONB,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_generated_posts_user ON public.generated_posts(user_id, created_at DESC);

-- ============================================
-- 4. SAVED TEMPLATES TABLE (user customizations)
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  template_data JSONB NOT NULL,
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_templates_user ON public.saved_templates(user_id, created_at DESC);

-- ============================================
-- 5. PRODUCT IMAGES LIBRARY
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  name TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_images_user ON public.product_images(user_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Brand Profiles
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own brand profile"
  ON public.brand_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand profile"
  ON public.brand_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand profile"
  ON public.brand_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand profile"
  ON public.brand_profiles FOR DELETE USING (auth.uid() = user_id);

-- Analyzed Reels
ALTER TABLE public.analyzed_reels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyzed reels"
  ON public.analyzed_reels FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyzed reels"
  ON public.analyzed_reels FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyzed reels"
  ON public.analyzed_reels FOR DELETE USING (auth.uid() = user_id);

-- Generated Posts
ALTER TABLE public.generated_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generated posts"
  ON public.generated_posts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated posts"
  ON public.generated_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generated posts"
  ON public.generated_posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated posts"
  ON public.generated_posts FOR DELETE USING (auth.uid() = user_id);

-- Saved Templates
ALTER TABLE public.saved_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates"
  ON public.saved_templates FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates"
  ON public.saved_templates FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON public.saved_templates FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON public.saved_templates FOR DELETE USING (auth.uid() = user_id);

-- Product Images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own product images"
  ON public.product_images FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own product images"
  ON public.product_images FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own product images"
  ON public.product_images FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brand_profiles_updated_at
  BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- STORAGE BUCKETS (Run separately if needed)
-- ============================================
-- Go to Storage section in Supabase dashboard and create:
-- 1. Bucket: "logos" (public)
-- 2. Bucket: "products" (public)
-- 3. Bucket: "generated-posts" (public)
-- 
-- Storage policies allow authenticated users to upload/read their own files

-- ============================================
-- ASMA Phase 3 — Schema Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- Update analyzed_reels table to support new fields
-- Make reel_url nullable, add metrics JSONB, rename analysis fields
ALTER TABLE public.analyzed_reels
  ALTER COLUMN reel_url DROP NOT NULL;

ALTER TABLE public.analyzed_reels
  ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS analysis JSONB;

-- Migrate existing analysis_data to analysis if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analyzed_reels' AND column_name = 'analysis_data'
  ) THEN
    UPDATE public.analyzed_reels SET analysis = analysis_data WHERE analysis IS NULL;
  END IF;
END $$;

-- Convert hashtags from TEXT[] to TEXT (we store as space-separated)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analyzed_reels' 
    AND column_name = 'hashtags' 
    AND data_type = 'ARRAY'
  ) THEN
    -- Add temporary text column
    ALTER TABLE public.analyzed_reels ADD COLUMN IF NOT EXISTS hashtags_text TEXT;
    -- Copy array data as space-separated string
    UPDATE public.analyzed_reels 
    SET hashtags_text = array_to_string(hashtags, ' ') 
    WHERE hashtags IS NOT NULL;
    -- Drop old column
    ALTER TABLE public.analyzed_reels DROP COLUMN hashtags;
    -- Rename new column
    ALTER TABLE public.analyzed_reels RENAME COLUMN hashtags_text TO hashtags;
  END IF;
END $$;


-- ============================================
-- Update generated_posts to support reels
-- ============================================
ALTER TABLE public.generated_posts
  ADD COLUMN IF NOT EXISTS content_format TEXT DEFAULT 'static',
  ADD COLUMN IF NOT EXISTS template_data JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS file_format TEXT,
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- content_format: 'static' | 'reel'
-- file_format: 'png' | 'webp' | 'gif' | 'webm'

-- ============================================
-- RLS Policies (in case missing)
-- ============================================
ALTER TABLE public.analyzed_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_posts ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for analyzed_reels
DROP POLICY IF EXISTS "Users can view own analyses" ON public.analyzed_reels;
DROP POLICY IF EXISTS "Users can insert own analyses" ON public.analyzed_reels;
DROP POLICY IF EXISTS "Users can update own analyses" ON public.analyzed_reels;
DROP POLICY IF EXISTS "Users can delete own analyses" ON public.analyzed_reels;

CREATE POLICY "Users can view own analyses"
  ON public.analyzed_reels FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.analyzed_reels FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON public.analyzed_reels FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON public.analyzed_reels FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop and recreate policies for generated_posts
DROP POLICY IF EXISTS "Users can view own posts" ON public.generated_posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON public.generated_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.generated_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.generated_posts;

CREATE POLICY "Users can view own posts"
  ON public.generated_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts"
  ON public.generated_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.generated_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.generated_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Done!

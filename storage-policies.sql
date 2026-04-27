-- ============================================
-- ASMA — Storage RLS Policies Fix
-- Run this in Supabase SQL Editor
-- This sets up Row Level Security for all 3 storage buckets
-- ============================================

-- ============================================
-- LOGOS BUCKET
-- Users can upload/read/delete files in their own folder: {user_id}/...
-- ============================================

-- Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Users can upload own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own logos" ON storage.objects;
DROP POLICY IF EXISTS "Logos are publicly readable" ON storage.objects;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update files in their own folder
CREATE POLICY "Users can update own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete files in their own folder
CREATE POLICY "Users can delete own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to read logos (since bucket is public)
CREATE POLICY "Logos are publicly readable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');


-- ============================================
-- PRODUCTS BUCKET (for Phase 4 — Post Generator)
-- Same pattern: users can manage files in their own folder
-- ============================================

DROP POLICY IF EXISTS "Users can upload own products" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own products" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own products" ON storage.objects;
DROP POLICY IF EXISTS "Products are publicly readable" ON storage.objects;

CREATE POLICY "Users can upload own products"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own products"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'products'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own products"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'products'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Products are publicly readable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');


-- ============================================
-- GENERATED-POSTS BUCKET (for Phase 4)
-- ============================================

DROP POLICY IF EXISTS "Users can upload own generated posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own generated posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own generated posts" ON storage.objects;
DROP POLICY IF EXISTS "Generated posts are publicly readable" ON storage.objects;

CREATE POLICY "Users can upload own generated posts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'generated-posts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own generated posts"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'generated-posts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own generated posts"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'generated-posts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Generated posts are publicly readable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'generated-posts');


-- ============================================
-- VERIFICATION
-- After running, you can check policies were created:
-- ============================================
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Done! Now logo upload will work.

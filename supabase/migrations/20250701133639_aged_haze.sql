/*
  # Add download materials to blog posts

  1. Changes
    - Add download_materials field to blog_posts table to store downloadable materials
    - This will store an array of objects with material information

  2. Security
    - No changes to RLS policies needed
*/

-- Add download_materials field to blog_posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'download_materials'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN download_materials jsonb DEFAULT '[]';
  END IF;
END $$;

-- Comment on column
COMMENT ON COLUMN blog_posts.download_materials IS 'Array of downloadable materials with metadata';

-- Create storage bucket for downloadable files if it doesn't exist
-- Note: This is handled by Supabase UI, but we include it here for documentation
-- In production, you would create this bucket via the Supabase dashboard
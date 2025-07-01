/*
  # Add download_materials field to blog_posts table

  1. Changes
    - Add download_materials JSONB field to blog_posts table with default empty array
    - This field will store downloadable materials with metadata
  
  2. Purpose
    - Allow blog posts to have downloadable materials like PDFs, checklists, etc.
    - Track download counts and other metadata for each material
*/

-- Add download_materials field if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'download_materials'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN download_materials JSONB DEFAULT '[]'::jsonb;
    
    COMMENT ON COLUMN blog_posts.download_materials IS 'Array of downloadable materials with metadata';
  END IF;
END $$;
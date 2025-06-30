/*
  # Add additional fields to blog_posts table

  1. Changes
    - Add tldr_summary field for TL;DR section
    - Add tldr_takeaways array for key takeaways
    - Add categories array for categorization
    - Add faqs JSONB field for FAQ section
    - Add ctas JSONB field for call-to-action buttons
    - Add seo_score integer field for SEO rating

  2. Security
    - No changes to RLS policies needed
*/

-- Add new fields to blog_posts table
DO $$
BEGIN
  -- Add tldr_summary field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'tldr_summary'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN tldr_summary text;
  END IF;

  -- Add tldr_takeaways array
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'tldr_takeaways'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN tldr_takeaways text[] DEFAULT '{}';
  END IF;

  -- Add categories array
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'categories'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN categories text[] DEFAULT '{}';
  END IF;

  -- Add faqs JSONB field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'faqs'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN faqs jsonb DEFAULT '[]';
  END IF;

  -- Add ctas JSONB field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'ctas'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN ctas jsonb DEFAULT '[]';
  END IF;

  -- Add seo_score integer field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'seo_score'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN seo_score integer DEFAULT 0;
  END IF;

  -- Add meta_description field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN meta_description text;
  END IF;

  -- Create index on seo_score for better performance when sorting
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'blog_posts' AND indexname = 'idx_blog_posts_seo_score'
  ) THEN
    CREATE INDEX idx_blog_posts_seo_score ON blog_posts(seo_score);
  END IF;

  -- Create index on categories for better performance when filtering
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'blog_posts' AND indexname = 'idx_blog_posts_categories'
  ) THEN
    CREATE INDEX idx_blog_posts_categories ON blog_posts USING gin(categories);
  END IF;

  -- Create index on published and created_at for common queries
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'blog_posts' AND indexname = 'idx_blog_posts_published_created'
  ) THEN
    CREATE INDEX idx_blog_posts_published_created ON blog_posts(published, created_at DESC);
  END IF;
END $$;
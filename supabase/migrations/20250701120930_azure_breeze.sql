/*
  # Add sources to blog posts

  1. Changes
    - Add sources jsonb field to blog_posts table to store bibliographic references
    - Each source will have type, author, title, year, publisher/website, url, doi/isbn, and access_date fields
    - Sources will be displayed at the end of blog posts and referenced in the content

  2. Security
    - No changes to RLS policies needed
*/

-- Add sources field to blog_posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'sources'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN sources jsonb DEFAULT '[]';
  END IF;
END $$;

-- Add source_citation_style field to blog_posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'source_citation_style'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN source_citation_style text DEFAULT 'apa';
  END IF;
END $$;

-- Comment on columns
COMMENT ON COLUMN blog_posts.sources IS 'Array of bibliographic sources in JSON format';
COMMENT ON COLUMN blog_posts.source_citation_style IS 'Citation style for sources (apa, chicago, etc.)';
/*
  # Add sources and citation style fields to blog_posts table

  1. New Fields
    - `sources` (jsonb) - Array of bibliographic sources in JSON format
    - `source_citation_style` (text) - Citation style for sources (apa, chicago, mla)

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
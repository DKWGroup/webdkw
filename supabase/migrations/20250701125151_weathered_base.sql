/*
  # Simplify sources field in blog_posts table

  1. Changes
    - Modify sources field to be a string array instead of a complex JSON structure
    - Remove source_citation_style field as it's no longer needed

  2. Security
    - No changes to RLS policies needed
*/

-- First, ensure the sources column exists (if not, create it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'sources'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN sources text[] DEFAULT '{}';
  ELSE
    -- If it exists but is JSONB, we need to convert existing data
    -- This is a safe operation as we're just changing the type
    -- and preserving any existing URLs
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'blog_posts' AND column_name = 'sources' AND data_type = 'jsonb'
    ) THEN
      -- Create a temporary column
      ALTER TABLE blog_posts ADD COLUMN sources_new text[] DEFAULT '{}';
      
      -- Update with a safe conversion (extract URLs from existing sources if possible)
      UPDATE blog_posts
      SET sources_new = ARRAY(
        SELECT url FROM jsonb_to_recordset(sources) AS x(url text)
        WHERE url IS NOT NULL
      )
      WHERE sources IS NOT NULL AND jsonb_typeof(sources) = 'array';
      
      -- Drop the old column and rename the new one
      ALTER TABLE blog_posts DROP COLUMN sources;
      ALTER TABLE blog_posts RENAME COLUMN sources_new TO sources;
    END IF;
  END IF;
END $$;

-- Drop the source_citation_style column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'source_citation_style'
  ) THEN
    ALTER TABLE blog_posts DROP COLUMN source_citation_style;
  END IF;
END $$;

-- Update the comment on the sources column
COMMENT ON COLUMN blog_posts.sources IS 'Array of source URLs';
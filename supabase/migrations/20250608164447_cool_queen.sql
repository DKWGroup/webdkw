/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `slug` (text, unique, not null)
      - `excerpt` (text)
      - `content` (text, not null)
      - `published` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `author` (text)
      - `image_url` (text)
      - `tags` (text array)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for public read access to published posts
    - Add policy for authenticated admin to manage all posts
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author text DEFAULT 'Marcin Kowalski',
  image_url text,
  tags text[] DEFAULT '{}'
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Public can read published posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

-- Allow authenticated users to manage all posts (for admin panel)
CREATE POLICY "Authenticated users can manage posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
/*
  # Create projects table for portfolio

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `slug` (text, unique, not null)
      - `category` (text, not null)
      - `industry` (text, not null)
      - `description` (text, not null)
      - `image_url` (text, not null)
      - `technologies` (text array)
      - `results` (jsonb)
      - `completion_date` (text)
      - `project_url` (text)
      - `featured` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `projects` table
    - Add policy for public read access
    - Add policy for authenticated admin to manage all projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  industry text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  technologies text[] DEFAULT '{}',
  results jsonb DEFAULT '[]',
  completion_date text DEFAULT '',
  project_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects
CREATE POLICY "Public can read projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage all projects (for admin panel)
CREATE POLICY "Authenticated users can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger for projects
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
/*
  # Add case study fields to projects table

  1. Changes
    - Add case_study boolean field to mark projects as case studies
    - Add case study specific content fields:
      - case_study_header (text)
      - case_study_introduction (text)
      - case_study_goals (text)
      - case_study_implementation (text)
      - case_study_results (text)
      - case_study_summary (text)
      - case_study_cta (text)

  2. Security
    - No changes to RLS policies needed
*/

-- Add case study fields to projects table
DO $$
BEGIN
  -- Add case_study boolean field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'case_study'
  ) THEN
    ALTER TABLE projects ADD COLUMN case_study boolean DEFAULT false;
  END IF;

  -- Add case study content fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'case_study_header'
  ) THEN
    ALTER TABLE projects ADD COLUMN case_study_header text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'case_study_introduction'
  ) THEN
    ALTER TABLE projects ADD COLUMN case_study_introduction text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'case_study_goals'
  ) THEN
    ALTER TABLE projects ADD COLUMN case_study_goals text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'case_study_implementation'
  ) THEN
    ALTER TABLE projects ADD COLUMN case_study_implementation text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'case_study_results'
  ) THEN
    ALTER TABLE projects ADD COLUMN case_study_results text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'case_study_summary'
  ) THEN
    ALTER TABLE projects ADD COLUMN case_study_summary text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'case_study_cta'
  ) THEN
    ALTER TABLE projects ADD COLUMN case_study_cta text;
  END IF;
END $$;
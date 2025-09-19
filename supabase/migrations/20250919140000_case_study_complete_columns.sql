/*
  Add/ensure all Case Study columns exist on public.projects
  - Safe to run multiple times (IF NOT EXISTS)
  - Complements earlier base and SEO migrations
*/

-- Base case study fields (in case older env missed them)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='case_study') THEN
    ALTER TABLE public.projects ADD COLUMN case_study boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='case_study_header') THEN
    ALTER TABLE public.projects ADD COLUMN case_study_header text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='case_study_introduction') THEN
    ALTER TABLE public.projects ADD COLUMN case_study_introduction text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='case_study_goals') THEN
    ALTER TABLE public.projects ADD COLUMN case_study_goals text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='case_study_implementation') THEN
    ALTER TABLE public.projects ADD COLUMN case_study_implementation text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='case_study_results') THEN
    ALTER TABLE public.projects ADD COLUMN case_study_results text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='case_study_summary') THEN
    ALTER TABLE public.projects ADD COLUMN case_study_summary text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='case_study_cta') THEN
    ALTER TABLE public.projects ADD COLUMN case_study_cta text;
  END IF;
END $$;

-- SEO & extended sections
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS case_study_seo_title text,
  ADD COLUMN IF NOT EXISTS case_study_meta_description text,
  ADD COLUMN IF NOT EXISTS case_study_slug text,
  ADD COLUMN IF NOT EXISTS case_study_og_image text,
  ADD COLUMN IF NOT EXISTS case_study_schema_jsonld jsonb,
  ADD COLUMN IF NOT EXISTS case_study_client_profile text,
  ADD COLUMN IF NOT EXISTS case_study_objective text,
  ADD COLUMN IF NOT EXISTS case_study_challenges text,
  ADD COLUMN IF NOT EXISTS case_study_strategy text,
  ADD COLUMN IF NOT EXISTS case_study_conclusions text,
  ADD COLUMN IF NOT EXISTS case_study_links jsonb,
  ADD COLUMN IF NOT EXISTS case_study_faqs jsonb;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_projects_case_study_slug ON public.projects (case_study_slug);
-- Optional uniqueness: uncomment if slug must be unique among case studies
-- CREATE UNIQUE INDEX IF NOT EXISTS uq_projects_case_study_slug ON public.projects (case_study_slug) WHERE case_study = true AND case_study_slug IS NOT NULL;

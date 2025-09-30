-- Add SEO and new case study section fields to projects
alter table public.projects
  add column if not exists case_study_seo_title text,
  add column if not exists case_study_meta_description text,
  add column if not exists case_study_slug text,
  add column if not exists case_study_og_image text,
  add column if not exists case_study_schema_jsonld jsonb,
  add column if not exists case_study_client_profile text,
  add column if not exists case_study_objective text,
  add column if not exists case_study_challenges text,
  add column if not exists case_study_strategy text,
  add column if not exists case_study_conclusions text,
  add column if not exists case_study_links jsonb,
  add column if not exists case_study_faqs jsonb;

-- helpful indexes
create index if not exists idx_projects_case_study_slug on public.projects (case_study_slug);

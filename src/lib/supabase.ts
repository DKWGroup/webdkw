import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key-placeholder'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  created_at: string
  updated_at: string
  author: string
  image_url?: string
  tags?: string[]
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  lead_magnet?: boolean
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  category: string
  industry: string
  description: string
  image_url: string
  technologies: string[]
  results: {
    metric: string
    value: string
  }[]
  completion_date: string
  project_url?: string
  featured: boolean
  created_at: string
  updated_at: string
}
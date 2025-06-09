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
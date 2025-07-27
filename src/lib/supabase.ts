
// Posts for creator blog
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  category: 'worldbuilding' | 'characters' | 'plot' | 'writing-process' | 'general'
  status: 'draft' | 'published'
  tags?: string[]
  featured_image?: string
  created_at: string
  updated_at: string
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key (for server-side operations)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Export adminClient as alias for compatibility
export const adminClient = supabaseAdmin

// Types for our database tables
export interface ShopItem {
  id: string
  title: string
  type: 'issue' | 'arc' | 'saga' | 'volume' | 'book'
  parent_id: string | null
  order_index: number
  price: number
  content?: string
  description?: string
  cover_image?: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface TimelineEvent {
  id: string
  title: string
  date: string
  category: 'political' | 'magical' | 'technological' | 'cultural' | 'catastrophic'
  description: string
  details?: string
  book_reference?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
}

// New hierarchical shop types
export interface Book {
  id: number
  title: string
  description?: string
  price?: number
  cover_image?: string
  status: 'draft' | 'published' | 'archived'
  total_word_count?: number
  is_complete: boolean
  physical_edition?: any
  created_at: string
  updated_at: string
  volumes?: Volume[]
}

export interface Volume {
  id: number
  book_id: number
  title: string
  description?: string
  price?: number
  order_index: number
  status: 'draft' | 'published' | 'archived'
  physical_available: boolean
  digital_bundle: boolean
  created_at: string
  updated_at: string
  sagas?: Saga[]
}

export interface Saga {
  id: number
  volume_id: number
  title: string
  description?: string
  price?: number
  order_index: number
  status: 'draft' | 'published' | 'archived'
  estimated_length?: string
  created_at: string
  updated_at: string
  arcs?: Arc[]
}

export interface Arc {
  id: number
  saga_id: number
  title: string
  description?: string
  price?: number
  order_index: number
  status: 'draft' | 'published' | 'archived'
  is_complete: boolean
  bundle_discount: number
  created_at: string
  updated_at: string
  issues?: Issue[]
}

export interface Issue {
  id: number
  arc_id: number
  title: string
  description?: string
  price?: number
  word_count: number
  order_index: number
  status: 'draft' | 'published' | 'pre-order' | 'coming-soon'
  release_date?: string
  content_url?: string
  cover_image?: string
  tags?: string[]
  created_at: string
  updated_at: string
  arcs?: {
    id: number
    title: string
    sagas: {
      id: number
      title: string
      volumes: {
        id: number
        title: string
        books: {
          id: number
          title: string
        }
      }
    }
  }
}

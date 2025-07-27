import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

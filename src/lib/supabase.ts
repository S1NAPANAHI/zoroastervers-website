
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key (for server-side operations)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
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

// =====================================================
// Character-related Types
// =====================================================

export interface Character {
  id: number
  // Basic Information
  name: string
  aliases?: string[]
  description?: string
  
  // Physical Appearance
  appearance?: any // JSONB - flexible structure for appearance details
  height?: string
  weight?: string
  eye_color?: string
  hair_color?: string
  age_range?: string
  
  // Personality  26 Traits
  personality?: any // JSONB - flexible structure for personality traits
  skills?: string[]
  abilities?: string[]
  weaknesses?: string[]
  motivations?: string
  fears?: string
  
  // Media  26 Visual
  avatar_url?: string
  images?: any // JSONB - array of image URLs and metadata
  
  // Status  26 Metadata
  status: 'active' | 'inactive' | 'deceased' | 'unknown'
  importance_level: number // 1-10 scale
  is_main_character: boolean
  is_antagonist: boolean
  is_protagonist: boolean
  
  // Hierarchy Relationships (Foreign Keys)
  universe_id?: number
  series_id?: number
  season_id?: number
  work_id?: number
  
  // Origin Information
  first_appearance?: string
  creator?: string
  voice_actor?: string
  
  // Technical Fields
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
  
  // Search and Organization
  tags?: string[]
  search_vector?: any // TSVECTOR for full-text search
}

export interface CharacterRelationship {
  id: number
  
  // Core Relationship
  character_id: number
  related_character_id: number
  
  // Relationship Details
  relationship_type: string // family, friend, enemy, romantic, ally, rival, etc.
  relationship_subtype?: string // brother, sister, best_friend, arch_enemy, etc.
  description?: string
  
  // Relationship Metadata
  strength: number // 1-10 scale of relationship strength/importance
  is_mutual: boolean // Whether relationship is bidirectional
  status: 'active' | 'past' | 'complicated' | 'unknown'
  
  // Timeline
  started_at?: string // When relationship began (episode/chapter reference)
  ended_at?: string // When relationship ended (if applicable)
  
  // Context
  context?: any // JSONB - additional relationship context and metadata
  
  // Technical Fields
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
}

export interface CharacterAssociation {
  id: number
  
  // Core Association
  character_id: number
  
  // Association Type and Target
  association_type: string // organization, location, item, event, concept, etc.
  association_name: string
  association_description?: string
  
  // Association Details
  role?: string // member, leader, owner, visitor, enemy, etc.
  relationship_nature?: string // affiliated, opposed, neutral, dependent, etc.
  importance: number // 1-10 scale of association importance
  
  // External References (Optional foreign keys to other tables)
  location_id?: number
  organization_id?: number
  item_id?: number
  event_id?: number
  
  // Timeline
  started_at?: string // When association began
  ended_at?: string // When association ended (if applicable)
  status: 'active' | 'past' | 'pending' | 'unknown'
  
  // Additional Context
  notes?: string
  context?: any // JSONB - flexible JSON for additional association details
  
  // Technical Fields
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
}

export interface CharacterTag {
  id: number
  
  // Core Tag Information
  name: string
  description?: string
  category?: string // personality, appearance, role, archetype, etc.
  
  // Tag Metadata
  color?: string // Hex color code for UI display
  icon?: string // Icon identifier for UI display
  is_system_tag: boolean // Whether this is a system-defined tag
  
  // Usage Statistics
  usage_count: number
  
  // Technical Fields
  created_at: string
  updated_at: string
  created_by?: number
}

// Union types for filtering
export type CharacterStatus = Character['status']
export type CharacterRelationshipStatus = CharacterRelationship['status']
export type CharacterAssociationStatus = CharacterAssociation['status']
export type CharacterTagCategory = 'personality' | 'appearance' | 'role' | 'archetype' | string

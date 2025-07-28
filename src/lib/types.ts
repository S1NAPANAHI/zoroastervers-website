// Database Types for Supabase
// Auto-generated and manually maintained types for the novel worldbuilding hub database

export interface Database {
  public: {
    Tables: {
      // =====================================================
      // Core Content Hierarchy Tables
      // =====================================================
      books: {
        Row: {
          id: number
          title: string
          description?: string
          author: string
          price?: number
          cover_image_url?: string
          status: 'draft' | 'published' | 'archived'
          total_word_count?: number
          is_complete: boolean
          physical_available: boolean
          digital_bundle: boolean
          publication_date?: string
          parent_id?: number // For book series
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string
          author?: string
          price?: number
          cover_image_url?: string
          status?: 'draft' | 'published' | 'archived'
          total_word_count?: number
          is_complete?: boolean
          physical_available?: boolean
          digital_bundle?: boolean
          publication_date?: string
          parent_id?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          author?: string
          price?: number
          cover_image_url?: string
          status?: 'draft' | 'published' | 'archived'
          total_word_count?: number
          is_complete?: boolean
          physical_available?: boolean
          digital_bundle?: boolean
          publication_date?: string
          parent_id?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      volumes: {
        Row: {
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
        }
        Insert: {
          id?: number
          book_id: number
          title: string
          description?: string
          price?: number
          order_index?: number
          status?: 'draft' | 'published' | 'archived'
          physical_available?: boolean
          digital_bundle?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          book_id?: number
          title?: string
          description?: string
          price?: number
          order_index?: number
          status?: 'draft' | 'published' | 'archived'
          physical_available?: boolean
          digital_bundle?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sagas: {
        Row: {
          id: number
          volume_id: number
          title: string
          description?: string
          order_index: number
          status: 'draft' | 'published' | 'archived'
          word_count?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          volume_id: number
          title: string
          description?: string
          order_index?: number
          status?: 'draft' | 'published' | 'archived'
          word_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          volume_id?: number
          title?: string
          description?: string
          order_index?: number
          status?: 'draft' | 'published' | 'archived'
          word_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      arcs: {
        Row: {
          id: number
          saga_id: number
          title: string
          description?: string
          order_index: number
          status: 'draft' | 'published' | 'archived'
          word_count?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          saga_id: number
          title: string
          description?: string
          order_index?: number
          status?: 'draft' | 'published' | 'archived'
          word_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          saga_id?: number
          title?: string
          description?: string
          order_index?: number
          status?: 'draft' | 'published' | 'archived'
          word_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      issues: {
        Row: {
          id: number
          arc_id: number
          title: string
          description?: string
          price?: number
          word_count?: number
          order_index: number
          status: 'draft' | 'published' | 'pre-order' | 'coming-soon'
          release_date?: string
          content_url?: string
          cover_image_url?: string
          tags?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          arc_id: number
          title: string
          description?: string
          price?: number
          word_count?: number
          order_index?: number
          status?: 'draft' | 'published' | 'pre-order' | 'coming-soon'
          release_date?: string
          content_url?: string
          cover_image_url?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          arc_id?: number
          title?: string
          description?: string
          price?: number
          word_count?: number
          order_index?: number
          status?: 'draft' | 'published' | 'pre-order' | 'coming-soon'
          release_date?: string
          content_url?: string
          cover_image_url?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      // =====================================================
      // User Management Tables
      // =====================================================
      users: {
        Row: {
          id: number
          email: string
          role: 'user' | 'admin' | 'moderator'
          created_at: string
        }
        Insert: {
          id?: number
          email: string
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
        }
        Update: {
          id?: number
          email?: string
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
        }
      }
      // =====================================================
      // Reviews System
      // =====================================================
      reviews: {
        Row: {
          id: number
          user_id: string // UUID
          item_id: number
          item_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          rating: number // 1-5
          comment?: string
          is_verified_purchase: boolean
          is_spoiler: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          item_id: number
          item_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          rating: number
          comment?: string
          is_verified_purchase?: boolean
          is_spoiler?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          item_id?: number
          item_type?: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          rating?: number
          comment?: string
          is_verified_purchase?: boolean
          is_spoiler?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      // =====================================================
      // User Progress Tracking
      // =====================================================
      user_progress: {
        Row: {
          id: number
          user_id: string // UUID
          item_id: number
          item_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          percent_complete: number // 0-100
          last_position?: string
          started_at?: string
          completed_at?: string
          last_accessed: string
          total_reading_time: number // minutes
          session_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          item_id: number
          item_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          percent_complete?: number
          last_position?: string
          started_at?: string
          completed_at?: string
          last_accessed?: string
          total_reading_time?: number
          session_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          item_id?: number
          item_type?: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          percent_complete?: number
          last_position?: string
          started_at?: string
          completed_at?: string
          last_accessed?: string
          total_reading_time?: number
          session_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      // =====================================================
      // Story Routes System
      // =====================================================
      story_routes: {
        Row: {
          id: number
          item_id: number
          item_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          route_key: string
          title: string
          description?: string
          unlock_hint?: string
          is_default_route: boolean
          requires_previous_completion: boolean
          unlock_conditions?: any // JSONB
          order_index: number
          difficulty_level: number // 1-5
          estimated_duration?: number // minutes
          completion_rewards?: any // JSONB
          narrative_impact?: any // JSONB
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          item_id: number
          item_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          route_key: string
          title: string
          description?: string
          unlock_hint?: string
          is_default_route?: boolean
          requires_previous_completion?: boolean
          unlock_conditions?: any
          order_index?: number
          difficulty_level?: number
          estimated_duration?: number
          completion_rewards?: any
          narrative_impact?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          item_id?: number
          item_type?: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          route_key?: string
          title?: string
          description?: string
          unlock_hint?: string
          is_default_route?: boolean
          requires_previous_completion?: boolean
          unlock_conditions?: any
          order_index?: number
          difficulty_level?: number
          estimated_duration?: number
          completion_rewards?: any
          narrative_impact?: any
          created_at?: string
          updated_at?: string
        }
      }
      // =====================================================
      // Easter Eggs System
      // =====================================================
      easter_eggs: {
        Row: {
          id: number
          item_id: number
          item_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          title: string
          clue: string
          reward: string
          trigger_type: string
          trigger_conditions?: any // JSONB
          difficulty_level: number // 1-5
          discovery_rate: number // percentage
          hint_level: number // 1-3
          reward_type: string
          reward_data?: any // JSONB
          is_active: boolean
          available_from?: string
          available_until?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          item_id: number
          item_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          title: string
          clue: string
          reward: string
          trigger_type?: string
          trigger_conditions?: any
          difficulty_level?: number
          discovery_rate?: number
          hint_level?: number
          reward_type?: string
          reward_data?: any
          is_active?: boolean
          available_from?: string
          available_until?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          item_id?: number
          item_type?: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
          title?: string
          clue?: string
          reward?: string
          trigger_type?: string
          trigger_conditions?: any
          difficulty_level?: number
          discovery_rate?: number
          hint_level?: number
          reward_type?: string
          reward_data?: any
          is_active?: boolean
          available_from?: string
          available_until?: string
          created_at?: string
          updated_at?: string
        }
      }
      // =====================================================
      // User Easter Egg Discoveries
      // =====================================================
      user_easter_egg_discoveries: {
        Row: {
          id: number
          user_id: string // UUID
          easter_egg_id: number
          discovered_at: string
          discovery_method?: string
          hints_used: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          easter_egg_id: number
          discovered_at?: string
          discovery_method?: string
          hints_used?: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          easter_egg_id?: number
          discovered_at?: string
          discovery_method?: string
          hints_used?: number
          created_at?: string
        }
      }
      // =====================================================
      // Character Management Tables
      // =====================================================
      characters: {
        Row: {
          id: number
          name: string
          aliases?: string[]
          description?: string
          appearance?: any // JSONB
          height?: string
          weight?: string
          eye_color?: string
          hair_color?: string
          age_range?: string
          personality?: any // JSONB
          skills?: string[]
          abilities?: string[]
          weaknesses?: string[]
          motivations?: string
          fears?: string
          avatar_url?: string
          images?: any // JSONB
          status: 'active' | 'inactive' | 'deceased' | 'unknown'
          importance_level: number
          is_main_character: boolean
          is_antagonist: boolean
          is_protagonist: boolean
          book_id?: number
          volume_id?: number
          saga_id?: number
          arc_id?: number
          issue_id?: number
          first_appearance?: string
          creator?: string
          voice_actor?: string
          created_at: string
          updated_at: string
          created_by?: number
          updated_by?: number
          tags?: string[]
          search_vector?: any
        }
        Insert: {
          id?: number
          name: string
          aliases?: string[]
          description?: string
          appearance?: any
          height?: string
          weight?: string
          eye_color?: string
          hair_color?: string
          age_range?: string
          personality?: any
          skills?: string[]
          abilities?: string[]
          weaknesses?: string[]
          motivations?: string
          fears?: string
          avatar_url?: string
          images?: any
          status?: 'active' | 'inactive' | 'deceased' | 'unknown'
          importance_level?: number
          is_main_character?: boolean
          is_antagonist?: boolean
          is_protagonist?: boolean
          book_id?: number
          volume_id?: number
          saga_id?: number
          arc_id?: number
          issue_id?: number
          first_appearance?: string
          creator?: string
          voice_actor?: string
          created_at?: string
          updated_at?: string
          created_by?: number
          updated_by?: number
          tags?: string[]
          search_vector?: any
        }
        Update: {
          id?: number
          name?: string
          aliases?: string[]
          description?: string
          appearance?: any
          height?: string
          weight?: string
          eye_color?: string
          hair_color?: string
          age_range?: string
          personality?: any
          skills?: string[]
          abilities?: string[]
          weaknesses?: string[]
          motivations?: string
          fears?: string
          avatar_url?: string
          images?: any
          status?: 'active' | 'inactive' | 'deceased' | 'unknown'
          importance_level?: number
          is_main_character?: boolean
          is_antagonist?: boolean
          is_protagonist?: boolean
          book_id?: number
          volume_id?: number
          saga_id?: number
          arc_id?: number
          issue_id?: number
          first_appearance?: string
          creator?: string
          voice_actor?: string
          created_at?: string
          updated_at?: string
          created_by?: number
          updated_by?: number
          tags?: string[]
          search_vector?: any
        }
      }
      character_relationships: {
        Row: {
          id: number
          character_id: number
          related_character_id: number
          relationship_type: string
          relationship_subtype?: string
          description?: string
          strength: number
          is_mutual: boolean
          status: 'active' | 'past' | 'complicated' | 'unknown'
          started_at?: string
          ended_at?: string
          context?: any // JSONB
          created_at: string
          updated_at: string
          created_by?: number
          updated_by?: number
        }
        Insert: {
          id?: number
          character_id: number
          related_character_id: number
          relationship_type: string
          relationship_subtype?: string
          description?: string
          strength?: number
          is_mutual?: boolean
          status?: 'active' | 'past' | 'complicated' | 'unknown'
          started_at?: string
          ended_at?: string
          context?: any
          created_at?: string
          updated_at?: string
          created_by?: number
          updated_by?: number
        }
        Update: {
          id?: number
          character_id?: number
          related_character_id?: number
          relationship_type?: string
          relationship_subtype?: string
          description?: string
          strength?: number
          is_mutual?: boolean
          status?: 'active' | 'past' | 'complicated' | 'unknown'
          started_at?: string
          ended_at?: string
          context?: any
          created_at?: string
          updated_at?: string
          created_by?: number
          updated_by?: number
        }
      }
      character_associations: {
        Row: {
          id: number
          character_id: number
          association_type: string
          association_name: string
          association_description?: string
          role?: string
          relationship_nature?: string
          importance: number
          started_at?: string
          ended_at?: string
          status: 'active' | 'past' | 'pending' | 'unknown'
          context?: any // JSONB
          notes?: string
          created_at: string
          updated_at: string
          created_by?: number
          updated_by?: number
        }
        Insert: {
          id?: number
          character_id: number
          association_type: string
          association_name: string
          association_description?: string
          role?: string
          relationship_nature?: string
          importance?: number
          started_at?: string
          ended_at?: string
          status?: 'active' | 'past' | 'pending' | 'unknown'
          context?: any
          notes?: string
          created_at?: string
          updated_at?: string
          created_by?: number
          updated_by?: number
        }
        Update: {
          id?: number
          character_id?: number
          association_type?: string
          association_name?: string
          association_description?: string
          role?: string
          relationship_nature?: string
          importance?: number
          started_at?: string
          ended_at?: string
          status?: 'active' | 'past' | 'pending' | 'unknown'
          context?: any
          notes?: string
          created_at?: string
          updated_at?: string
          created_by?: number
          updated_by?: number
        }
      }
      character_tags: {
        Row: {
          id: number
          name: string
          description?: string
          category?: string
          color?: string
          icon?: string
          is_system_tag: boolean
          usage_count: number
          created_at: string
          updated_at: string
          created_by?: number
        }
        Insert: {
          id?: number
          name: string
          description?: string
          category?: string
          color?: string
          icon?: string
          is_system_tag?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
          created_by?: number
        }
        Update: {
          id?: number
          name?: string
          description?: string
          category?: string
          color?: string
          icon?: string
          is_system_tag?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
          created_by?: number
        }
      }
      character_tag_assignments: {
        Row: {
          id: number
          character_id: number
          tag_id: number
          confidence: number
          assigned_by: string
          notes?: string
          created_at: string
          created_by?: number
        }
        Insert: {
          id?: number
          character_id: number
          tag_id: number
          confidence?: number
          assigned_by?: string
          notes?: string
          created_at?: string
          created_by?: number
        }
        Update: {
          id?: number
          character_id?: number
          tag_id?: number
          confidence?: number
          assigned_by?: string
          notes?: string
          created_at?: string
          created_by?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      validate_item_reference: {
        Args: {
          item_id: number
          item_type: string
        }
        Returns: boolean
      }
    }
    Enums: {
      content_status: 'draft' | 'published' | 'archived'
      character_status: 'active' | 'inactive' | 'deceased' | 'unknown'
      item_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
      user_role: 'user' | 'admin' | 'moderator'
    }
  }
}

// =====================================================
// Convenience Types
// =====================================================

export type ItemType = 'book' | 'volume' | 'saga' | 'arc' | 'issue'
export type ContentStatus = 'draft' | 'published' | 'archived'
export type CharacterStatus = 'active' | 'inactive' | 'deceased' | 'unknown'
export type UserRole = 'user' | 'admin' | 'moderator'

// Table row types for easier imports
export type Book = Database['public']['Tables']['books']['Row']
export type Volume = Database['public']['Tables']['volumes']['Row']
export type Saga = Database['public']['Tables']['sagas']['Row']
export type Arc = Database['public']['Tables']['arcs']['Row']
export type Issue = Database['public']['Tables']['issues']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type StoryRoute = Database['public']['Tables']['story_routes']['Row']
export type EasterEgg = Database['public']['Tables']['easter_eggs']['Row']
export type UserEasterEggDiscovery = Database['public']['Tables']['user_easter_egg_discoveries']['Row']
export type Character = Database['public']['Tables']['characters']['Row']
export type CharacterRelationship = Database['public']['Tables']['character_relationships']['Row']
export type CharacterAssociation = Database['public']['Tables']['character_associations']['Row']
export type CharacterTag = Database['public']['Tables']['character_tags']['Row']
export type CharacterTagAssignment = Database['public']['Tables']['character_tag_assignments']['Row']

// Insert types for easier imports
export type BookInsert = Database['public']['Tables']['books']['Insert']
export type VolumeInsert = Database['public']['Tables']['volumes']['Insert']
export type SagaInsert = Database['public']['Tables']['sagas']['Insert']
export type ArcInsert = Database['public']['Tables']['arcs']['Insert']
export type IssueInsert = Database['public']['Tables']['issues']['Insert']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert']
export type StoryRouteInsert = Database['public']['Tables']['story_routes']['Insert']
export type EasterEggInsert = Database['public']['Tables']['easter_eggs']['Insert']
export type UserEasterEggDiscoveryInsert = Database['public']['Tables']['user_easter_egg_discoveries']['Insert']
export type CharacterInsert = Database['public']['Tables']['characters']['Insert']
export type CharacterRelationshipInsert = Database['public']['Tables']['character_relationships']['Insert']
export type CharacterAssociationInsert = Database['public']['Tables']['character_associations']['Insert']
export type CharacterTagInsert = Database['public']['Tables']['character_tags']['Insert']
export type CharacterTagAssignmentInsert = Database['public']['Tables']['character_tag_assignments']['Insert']

// Update types for easier imports
export type BookUpdate = Database['public']['Tables']['books']['Update']
export type VolumeUpdate = Database['public']['Tables']['volumes']['Update']
export type SagaUpdate = Database['public']['Tables']['sagas']['Update']
export type ArcUpdate = Database['public']['Tables']['arcs']['Update']
export type IssueUpdate = Database['public']['Tables']['issues']['Update']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']
export type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update']
export type StoryRouteUpdate = Database['public']['Tables']['story_routes']['Update']
export type EasterEggUpdate = Database['public']['Tables']['easter_eggs']['Update']
export type UserEasterEggDiscoveryUpdate = Database['public']['Tables']['user_easter_egg_discoveries']['Update']
export type CharacterUpdate = Database['public']['Tables']['characters']['Update']
export type CharacterRelationshipUpdate = Database['public']['Tables']['character_relationships']['Update']
export type CharacterAssociationUpdate = Database['public']['Tables']['character_associations']['Update']
export type CharacterTagUpdate = Database['public']['Tables']['character_tags']['Update']
export type CharacterTagAssignmentUpdate = Database['public']['Tables']['character_tag_assignments']['Update']

// =====================================================
// Extended Types for Complex Operations
// =====================================================

// Hierarchical content item that can represent any level
export interface ContentItem {
  id: number
  title: string
  description?: string
  type: ItemType
  parent_id?: number
  order_index: number
  status: ContentStatus
  created_at: string
  updated_at: string
  // Type-specific fields
  price?: number
  word_count?: number
  cover_image_url?: string
  release_date?: string
  content_url?: string
  tags?: string[]
}

// Review with user information
export interface ReviewWithUser extends Review {
  user?: {
    id: string
    email: string
    role: UserRole
  }
}

// Progress with content information
export interface ProgressWithContent extends UserProgress {
  content?: ContentItem
}

// Easter egg with discovery information
export interface EasterEggWithDiscoveries extends EasterEgg {
  user_discoveries?: UserEasterEggDiscovery[]
  discovery_count?: number
}

// Story route with completion tracking
export interface StoryRouteWithProgress extends StoryRoute {
  user_progress?: UserProgress[]
  completion_rate?: number
}

// Character with full relationship data
export interface CharacterWithRelations extends Character {
  relationships?: CharacterRelationship[]
  associations?: CharacterAssociation[]
  tags?: CharacterTag[]
}

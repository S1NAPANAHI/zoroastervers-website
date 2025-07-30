-- Rollback Migration: Extend Database Schema for Hierarchy, Reviews, Progress, Routes, and Easter Eggs
-- Description: Removes reviews, user_progress, story_routes, easter_eggs tables and hierarchy columns
-- Author: System
-- Date: 2025-01-28

-- =====================================================
-- WARNING: This rollback will permanently delete data
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Starting rollback of migration 20250728051340_extend_hierarchy_and_features';
    RAISE NOTICE 'WARNING: This will permanently delete all data in the new tables';
END $$;

-- =====================================================
-- Drop Triggers First
-- =====================================================

DROP TRIGGER IF EXISTS update_easter_egg_discovery_rate_trigger ON user_easter_egg_discoveries;
DROP TRIGGER IF EXISTS update_easter_eggs_updated_at ON easter_eggs;
DROP TRIGGER IF EXISTS update_story_routes_updated_at ON story_routes;
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;

-- =====================================================
-- Drop Functions
-- =====================================================

DROP FUNCTION IF EXISTS update_easter_egg_discovery_rate();
DROP FUNCTION IF EXISTS validate_item_reference(INTEGER, VARCHAR(20));

-- =====================================================
-- Drop Tables (in reverse dependency order)
-- =====================================================

-- Drop junction table first
DROP TABLE IF EXISTS user_easter_egg_discoveries CASCADE;

-- Drop main feature tables
DROP TABLE IF EXISTS easter_eggs CASCADE;
DROP TABLE IF EXISTS story_routes CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- =====================================================
-- Remove added hierarchy columns
-- =====================================================

-- Remove parent_id and order_index from books table if they were added
DO $$ 
BEGIN
    -- Remove parent_id column if it exists and was added by this migration
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='parent_id') THEN
        -- Check if any books actually use parent_id (if not, safe to remove)
        IF NOT EXISTS (SELECT 1 FROM books WHERE parent_id IS NOT NULL) THEN
            ALTER TABLE books DROP COLUMN parent_id;
            RAISE NOTICE 'Removed parent_id column from books table';
        ELSE
            RAISE NOTICE 'WARNING: parent_id column in books table has data - manual cleanup required';
        END IF;
    END IF;
    
    -- Remove order_index column if it exists and was added by this migration
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='order_index') THEN
        -- Check if any books use non-default order_index values
        IF NOT EXISTS (SELECT 1 FROM books WHERE order_index != 1) THEN
            ALTER TABLE books DROP COLUMN order_index;
            RAISE NOTICE 'Removed order_index column from books table';
        ELSE
            RAISE NOTICE 'WARNING: order_index column in books table has non-default data - manual cleanup required';
        END IF;
    END IF;
END $$;

-- =====================================================
-- Drop Indexes (if they still exist)
-- =====================================================

-- Books hierarchy indexes
DROP INDEX IF EXISTS idx_books_parent_id;
DROP INDEX IF EXISTS idx_books_order_index;

-- Reviews table indexes
DROP INDEX IF EXISTS idx_reviews_user_id;
DROP INDEX IF EXISTS idx_reviews_item_lookup;
DROP INDEX IF EXISTS idx_reviews_rating;
DROP INDEX IF EXISTS idx_reviews_created_at;
DROP INDEX IF EXISTS idx_reviews_helpful_count;

-- User progress table indexes
DROP INDEX IF EXISTS idx_user_progress_user_id;
DROP INDEX IF EXISTS idx_user_progress_item_lookup;
DROP INDEX IF EXISTS idx_user_progress_percent_complete;
DROP INDEX IF EXISTS idx_user_progress_last_accessed;
DROP INDEX IF EXISTS idx_user_progress_completed_at;

-- Story routes table indexes
DROP INDEX IF EXISTS idx_story_routes_item_lookup;
DROP INDEX IF EXISTS idx_story_routes_route_key;
DROP INDEX IF EXISTS idx_story_routes_order_index;
DROP INDEX IF EXISTS idx_story_routes_difficulty;
DROP INDEX IF EXISTS idx_story_routes_is_default;

-- Easter eggs table indexes
DROP INDEX IF EXISTS idx_easter_eggs_item_lookup;
DROP INDEX IF EXISTS idx_easter_eggs_trigger_type;
DROP INDEX IF EXISTS idx_easter_eggs_difficulty;
DROP INDEX IF EXISTS idx_easter_eggs_is_active;
DROP INDEX IF EXISTS idx_easter_eggs_availability;

-- User easter egg discoveries indexes
DROP INDEX IF EXISTS idx_user_easter_egg_discoveries_user_id;
DROP INDEX IF EXISTS idx_user_easter_egg_discoveries_easter_egg_id;
DROP INDEX IF EXISTS idx_user_easter_egg_discoveries_discovered_at;

-- =====================================================
-- Cleanup and Verification
-- =====================================================

-- Verify tables have been removed
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_name IN ('reviews', 'user_progress', 'story_routes', 'easter_eggs', 'user_easter_egg_discoveries')
    AND table_schema = 'public';
    
    IF table_count = 0 THEN
        RAISE NOTICE 'SUCCESS: All new tables have been removed';
    ELSE
        RAISE NOTICE 'WARNING: % tables still exist - manual cleanup may be required', table_count;
    END IF;
END $$;

-- =====================================================
-- Rollback Complete
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Rollback of migration 20250728051340_extend_hierarchy_and_features completed';
    RAISE NOTICE 'Removed: reviews, user_progress, story_routes, easter_eggs tables';
    RAISE NOTICE 'Removed: hierarchy support columns (where safe)';
    RAISE NOTICE 'Cleaned up: indexes, triggers, and helper functions';
    RAISE NOTICE 'IMPORTANT: Review any warnings above for manual cleanup requirements';
END $$;

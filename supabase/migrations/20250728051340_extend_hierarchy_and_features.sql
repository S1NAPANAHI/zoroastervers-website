-- Migration: Extend Database Schema for Hierarchy, Reviews, Progress, Routes, and Easter Eggs
-- Description: Adds parent_id columns, creates reviews, user_progress, story_routes, and easter_eggs tables
-- Author: System
-- Date: 2025-01-28

-- =====================================================
-- Add missing hierarchy columns to existing tables
-- =====================================================

-- Ensure books table has all required hierarchy columns
DO $$ 
BEGIN
    -- Add parent_id column if it doesn't exist (for potential book series)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='parent_id') THEN
        ALTER TABLE books ADD COLUMN parent_id INTEGER REFERENCES books(id) ON DELETE CASCADE;
    END IF;
    
    -- Add order_index column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='order_index') THEN
        ALTER TABLE books ADD COLUMN order_index INTEGER DEFAULT 1;
    END IF;
END $$;

-- Ensure volumes table has all required hierarchy columns (already has order_index and book_id as parent reference)
-- No changes needed as volumes already have proper structure

-- Ensure sagas table has all required hierarchy columns (already has order_index and volume_id as parent reference)
-- No changes needed as sagas already have proper structure

-- Ensure arcs table has all required hierarchy columns (already has order_index and saga_id as parent reference)
-- No changes needed as arcs already have proper structure

-- Ensure issues table has all required hierarchy columns (already has order_index and arc_id as parent reference)
-- No changes needed as issues already have proper structure

-- =====================================================
-- Create Reviews Table
-- =====================================================
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    
    -- Core review data
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('book', 'volume', 'saga', 'arc', 'issue')),
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    -- Review metadata
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_spoiler BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    
    -- Technical fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one review per user per item
    CONSTRAINT reviews_user_item_unique UNIQUE (user_id, item_id, item_type)
);

-- =====================================================
-- Create User Progress Table
-- =====================================================
CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,
    
    -- Core progress data
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('book', 'volume', 'saga', 'arc', 'issue')),
    
    -- Progress tracking
    percent_complete INTEGER NOT NULL DEFAULT 0 CHECK (percent_complete >= 0 AND percent_complete <= 100),
    last_position TEXT, -- JSON string or simple text for tracking position (page, chapter, etc.)
    
    -- Progress metadata
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Reading session data
    total_reading_time INTEGER DEFAULT 0, -- in minutes
    session_count INTEGER DEFAULT 0,
    
    -- Technical fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one progress record per user per item
    CONSTRAINT user_progress_user_item_unique UNIQUE (user_id, item_id, item_type)
);

-- =====================================================
-- Create Story Routes Table
-- =====================================================
CREATE TABLE story_routes (
    id BIGSERIAL PRIMARY KEY,
    
    -- Core route data
    item_id INTEGER NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('book', 'volume', 'saga', 'arc', 'issue')),
    
    -- Route details
    route_key VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    unlock_hint TEXT,
    
    -- Route metadata
    is_default_route BOOLEAN DEFAULT FALSE,
    requires_previous_completion BOOLEAN DEFAULT TRUE,
    unlock_conditions JSONB, -- Flexible conditions for unlocking routes
    
    -- Route ordering and organization
    order_index INTEGER DEFAULT 1,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    estimated_duration INTEGER, -- in minutes
    
    -- Route rewards and outcomes
    completion_rewards JSONB, -- Experience points, unlocks, etc.
    narrative_impact JSONB, -- How this route affects the story
    
    -- Technical fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique route keys per item
    CONSTRAINT story_routes_item_route_unique UNIQUE (item_id, item_type, route_key)
);

-- =====================================================
-- Create Easter Eggs Table
-- =====================================================
CREATE TABLE easter_eggs (
    id BIGSERIAL PRIMARY KEY,
    
    -- Core easter egg data
    item_id INTEGER NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('book', 'volume', 'saga', 'arc', 'issue')),
    
    -- Easter egg details
    title VARCHAR(255) NOT NULL,
    clue TEXT NOT NULL,
    reward TEXT NOT NULL,
    
    -- Discovery mechanics
    trigger_type VARCHAR(50) NOT NULL DEFAULT 'hidden', -- hidden, sequence, time_based, achievement, etc.
    trigger_conditions JSONB, -- Specific conditions to trigger the easter egg
    
    -- Easter egg metadata
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    discovery_rate DECIMAL(5,2) DEFAULT 0.00, -- Percentage of users who found it
    hint_level INTEGER DEFAULT 1 CHECK (hint_level >= 1 AND hint_level <= 3), -- 1=cryptic, 3=obvious
    
    -- Rewards and unlocks
    reward_type VARCHAR(50) DEFAULT 'content', -- content, achievement, unlock, cosmetic, etc.
    reward_data JSONB, -- Specific reward details
    
    -- Availability
    is_active BOOLEAN DEFAULT TRUE,
    available_from TIMESTAMP WITH TIME ZONE,
    available_until TIMESTAMP WITH TIME ZONE,
    
    -- Technical fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Create User Easter Egg Discoveries Table (Junction)
-- =====================================================
CREATE TABLE user_easter_egg_discoveries (
    id BIGSERIAL PRIMARY KEY,
    
    -- Core discovery data
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    easter_egg_id BIGINT NOT NULL REFERENCES easter_eggs(id) ON DELETE CASCADE,
    
    -- Discovery details
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    discovery_method VARCHAR(100), -- how they found it
    hints_used INTEGER DEFAULT 0,
    
    -- Technical fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one discovery record per user per easter egg
    CONSTRAINT user_easter_egg_discoveries_unique UNIQUE (user_id, easter_egg_id)
);

-- =====================================================
-- Create Indexes for Performance
-- =====================================================

-- Reviews table indexes
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_item_lookup ON reviews(item_id, item_type);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_reviews_helpful_count ON reviews(helpful_count DESC);

-- User progress table indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_item_lookup ON user_progress(item_id, item_type);
CREATE INDEX idx_user_progress_percent_complete ON user_progress(percent_complete);
CREATE INDEX idx_user_progress_last_accessed ON user_progress(last_accessed);
CREATE INDEX idx_user_progress_completed_at ON user_progress(completed_at);

-- Story routes table indexes
CREATE INDEX idx_story_routes_item_lookup ON story_routes(item_id, item_type);
CREATE INDEX idx_story_routes_route_key ON story_routes(route_key);
CREATE INDEX idx_story_routes_order_index ON story_routes(order_index);
CREATE INDEX idx_story_routes_difficulty ON story_routes(difficulty_level);
CREATE INDEX idx_story_routes_is_default ON story_routes(is_default_route);

-- Easter eggs table indexes
CREATE INDEX idx_easter_eggs_item_lookup ON easter_eggs(item_id, item_type);
CREATE INDEX idx_easter_eggs_trigger_type ON easter_eggs(trigger_type);
CREATE INDEX idx_easter_eggs_difficulty ON easter_eggs(difficulty_level);
CREATE INDEX idx_easter_eggs_is_active ON easter_eggs(is_active);
CREATE INDEX idx_easter_eggs_availability ON easter_eggs(available_from, available_until);

-- User easter egg discoveries indexes
CREATE INDEX idx_user_easter_egg_discoveries_user_id ON user_easter_egg_discoveries(user_id);
CREATE INDEX idx_user_easter_egg_discoveries_easter_egg_id ON user_easter_egg_discoveries(easter_egg_id);
CREATE INDEX idx_user_easter_egg_discoveries_discovered_at ON user_easter_egg_discoveries(discovered_at);

-- Hierarchy indexes for books (if parent_id was added)
CREATE INDEX IF NOT EXISTS idx_books_parent_id ON books(parent_id);
CREATE INDEX IF NOT EXISTS idx_books_order_index ON books(order_index);

-- =====================================================
-- Enable Row Level Security (RLS)
-- =====================================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE easter_eggs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_easter_egg_discoveries ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Create RLS Policies
-- =====================================================

-- Reviews policies
CREATE POLICY "Users can view published content reviews" ON reviews
    FOR SELECT USING (true); -- Anyone can read reviews

CREATE POLICY "Users can create their own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- User progress policies
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON user_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Story routes policies
CREATE POLICY "Users can view published story routes" ON story_routes
    FOR SELECT USING (true); -- Anyone can read routes for published content

CREATE POLICY "Admins can manage story routes" ON story_routes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Easter eggs policies
CREATE POLICY "Users can view active easter eggs" ON easter_eggs
    FOR SELECT USING (
        is_active = true 
        AND (available_from IS NULL OR available_from <= CURRENT_TIMESTAMP)
        AND (available_until IS NULL OR available_until >= CURRENT_TIMESTAMP)
    );

CREATE POLICY "Admins can manage easter eggs" ON easter_eggs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- User easter egg discoveries policies
CREATE POLICY "Users can view their own discoveries" ON user_easter_egg_discoveries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own discoveries" ON user_easter_egg_discoveries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all discoveries" ON user_easter_egg_discoveries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- =====================================================
-- Create Update Triggers
-- =====================================================

-- Apply update triggers to new tables
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_routes_updated_at 
    BEFORE UPDATE ON story_routes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_easter_eggs_updated_at 
    BEFORE UPDATE ON easter_eggs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Create Helper Functions
-- =====================================================

-- Function to get item reference for foreign key validation
CREATE OR REPLACE FUNCTION validate_item_reference(item_id INTEGER, item_type VARCHAR(20))
RETURNS BOOLEAN AS $$
BEGIN
    CASE item_type
        WHEN 'book' THEN
            RETURN EXISTS (SELECT 1 FROM books WHERE id = item_id);
        WHEN 'volume' THEN
            RETURN EXISTS (SELECT 1 FROM volumes WHERE id = item_id);
        WHEN 'saga' THEN
            RETURN EXISTS (SELECT 1 FROM sagas WHERE id = item_id);
        WHEN 'arc' THEN
            RETURN EXISTS (SELECT 1 FROM arcs WHERE id = item_id);
        WHEN 'issue' THEN
            RETURN EXISTS (SELECT 1 FROM issues WHERE id = item_id);
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update easter egg discovery rate
CREATE OR REPLACE FUNCTION update_easter_egg_discovery_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE easter_eggs 
        SET discovery_rate = (
            SELECT ROUND(
                (COUNT(*) * 100.0 / GREATEST(
                    (SELECT COUNT(DISTINCT user_id) FROM user_progress), 1
                )), 2
            )
            FROM user_easter_egg_discoveries 
            WHERE easter_egg_id = NEW.easter_egg_id
        )
        WHERE id = NEW.easter_egg_id;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_easter_egg_discovery_rate_trigger
    AFTER INSERT ON user_easter_egg_discoveries
    FOR EACH ROW EXECUTE FUNCTION update_easter_egg_discovery_rate();

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Insert sample story routes for existing content
INSERT INTO story_routes (item_id, item_type, route_key, title, description, unlock_hint, is_default_route, order_index) VALUES
(1, 'book', 'main-path', 'The Main Timeline', 'Follow the primary narrative path through the ZOROASTER universe', 'Start your journey here', true, 1),
(1, 'book', 'mystery-path', 'The Hidden Mysteries', 'Uncover the secrets that lie beneath the surface of reality', 'Look for clues in character interactions', false, 2),
(1, 'book', 'lore-path', 'The Ancient Chronicles', 'Dive deep into the historical background and world-building', 'Pay attention to ancient texts and prophecies', false, 3);

-- Insert sample easter eggs
INSERT INTO easter_eggs (item_id, item_type, title, clue, reward, trigger_type, difficulty_level, hint_level, reward_type) VALUES
(1, 'book', 'The Creator''s Signature', 'Find where reality bends to the author''s will', 'A hidden message from the creator of the universe', 'hidden', 3, 2, 'content'),
(1, 'book', 'The Recursive Loop', 'When the story speaks of itself, listen carefully', 'Access to meta-narrative commentary', 'sequence', 4, 1, 'unlock'),
(1, 'book', 'The Dimensional Key', 'Numbers hold power when arranged in the right order', 'Unlock bonus character backstories', 'hidden', 5, 1, 'content');

-- =====================================================
-- Migration Complete
-- =====================================================

-- Log successful migration
DO $$
BEGIN
    RAISE NOTICE 'Migration 20250728051340_extend_hierarchy_and_features completed successfully';
    RAISE NOTICE 'Added: reviews, user_progress, story_routes, easter_eggs tables';
    RAISE NOTICE 'Enhanced: hierarchy support with parent_id/order_index validation';
    RAISE NOTICE 'Created: RLS policies, indexes, and helper functions';
END $$;

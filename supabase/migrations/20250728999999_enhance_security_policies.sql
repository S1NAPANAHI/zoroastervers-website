-- Migration: Enhanced Security Hardening with RLS Policies
-- Description: Updates RLS policies to ensure users can READ all published items, WRITE only their own reviews/progress, and admins can write anything
-- Author: Security Enhancement
-- Date: 2025-01-29

-- =====================================================
-- Drop Existing Policies to Replace with Enhanced Ones
-- =====================================================

-- Drop existing reviews policies
DROP POLICY IF EXISTS "Users can view published content reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;

-- Drop existing user progress policies
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can manage their own progress" ON user_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON user_progress;

-- =====================================================
-- Enhanced Reviews Policies
-- =====================================================

-- Users can READ all reviews for published content
CREATE POLICY "Users can read all published reviews" ON reviews
    FOR SELECT USING (true);

-- Users can only INSERT their own reviews
CREATE POLICY "Users can create own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only DELETE their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage ALL reviews (full CRUD)
CREATE POLICY "Admins full access to reviews" ON reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =====================================================
-- Enhanced User Progress Policies  
-- =====================================================

-- Users can only READ their own progress
CREATE POLICY "Users can read own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only INSERT their own progress
CREATE POLICY "Users can create own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own progress
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only DELETE their own progress
CREATE POLICY "Users can delete own progress" ON user_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage ALL user progress (full CRUD)
CREATE POLICY "Admins full access to progress" ON user_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =====================================================
-- Enhanced Content Policies for Published Items
-- =====================================================

-- Drop and recreate policies to ensure published content is readable
-- while maintaining admin write access

-- Books: Public read for published, admin write all
DROP POLICY IF EXISTS "Allow public read access to books" ON books;
DROP POLICY IF EXISTS "Allow full access for admins on books" ON books;

CREATE POLICY "Public read published books" ON books
    FOR SELECT USING (
        -- All books are considered "published" for now, but can be enhanced with published status
        TRUE
    );

CREATE POLICY "Admins full access books" ON books
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Volumes: Public read for published, admin write all
DROP POLICY IF EXISTS "Allow public read access to volumes" ON volumes;
DROP POLICY IF EXISTS "Allow full access for admins on volumes" ON volumes;

CREATE POLICY "Public read published volumes" ON volumes
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins full access volumes" ON volumes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Sagas: Public read for published, admin write all
DROP POLICY IF EXISTS "Allow public read access to sagas" ON sagas;
DROP POLICY IF EXISTS "Allow full access for admins on sagas" ON sagas;

CREATE POLICY "Public read published sagas" ON sagas
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins full access sagas" ON sagas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Arcs: Public read for published, admin write all
DROP POLICY IF EXISTS "Allow public read access to arcs" ON arcs;
DROP POLICY IF EXISTS "Allow full access for admins on arcs" ON arcs;

CREATE POLICY "Public read published arcs" ON arcs
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins full access arcs" ON arcs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Issues: Public read for published, admin write all
DROP POLICY IF EXISTS "Allow public read access to issues" ON issues;
DROP POLICY IF EXISTS "Allow full access for admins on issues" ON issues;

CREATE POLICY "Public read published issues" ON issues
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins full access issues" ON issues
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =====================================================
-- Enhanced Character Policies (commented out until characters table exists)
-- =====================================================

-- Characters: Public read for active/published characters, admin write all
-- DROP POLICY IF EXISTS "Allow read published characters" ON characters;
-- DROP POLICY IF EXISTS "Allow full access for admins on characters" ON characters;
-- 
-- CREATE POLICY "Public read active characters" ON characters
--     FOR SELECT USING (status = 'active');
-- 
-- CREATE POLICY "Admins full access characters" ON characters
--     FOR ALL USING (
--         EXISTS (
--             SELECT 1 FROM users 
--             WHERE users.id = auth.uid() 
--             AND users.role = 'admin'
--         )
--     );

-- =====================================================
-- Security Enhancements Log
-- =====================================================

-- Log successful migration
DO $$
BEGIN
    RAISE NOTICE 'Enhanced Security Migration completed successfully';
    RAISE NOTICE 'Updated: RLS policies for reviews, user_progress, and content tables';
    RAISE NOTICE 'Policy Structure: READ all published items, WRITE only own reviews/progress, Admin WRITE anything';
END $$;

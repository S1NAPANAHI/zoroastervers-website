-- Migration: Create Character Management System
-- Description: Creates characters, character_relationships, character_associations, and character_tags tables
-- Author: System
-- Date: 2025

-- =====================================================
-- Users Table (prerequisite)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Characters Table
-- =====================================================
CREATE TABLE characters (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    aliases TEXT[], -- Array of alternative names/nicknames
    description TEXT,
    
    -- Physical Appearance
    appearance JSONB, -- Flexible JSON structure for appearance details
    height VARCHAR(50),
    weight VARCHAR(50),
    eye_color VARCHAR(50),
    hair_color VARCHAR(50),
    age_range VARCHAR(50), -- e.g., "20-25", "adult", "child"
    
    -- Personality & Traits
    personality JSONB, -- Flexible JSON structure for personality traits
    skills TEXT[],
    abilities TEXT[],
    weaknesses TEXT[],
    motivations TEXT,
    fears TEXT,
    
    -- Media & Visual
    avatar_url VARCHAR(500),
    images JSONB, -- Array of image URLs and metadata
    
    -- Status & Metadata
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, deceased, unknown
    importance_level INTEGER DEFAULT 1, -- 1-10 scale for character importance
    is_main_character BOOLEAN DEFAULT false,
    is_antagonist BOOLEAN DEFAULT false,
    is_protagonist BOOLEAN DEFAULT false,
    
    -- Hierarchy Relationships (Foreign Keys)
    book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
    volume_id BIGINT REFERENCES volumes(id) ON DELETE SET NULL,
    saga_id BIGINT REFERENCES sagas(id) ON DELETE SET NULL,
    arc_id BIGINT REFERENCES arcs(id) ON DELETE SET NULL,
    issue_id BIGINT REFERENCES issues(id) ON DELETE SET NULL,
    
    -- Origin Information
    first_appearance VARCHAR(255), -- Episode/chapter where character first appears
    creator VARCHAR(255), -- Character creator/designer
    voice_actor VARCHAR(255),
    
    -- Technical Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    -- Search and Organization
    tags TEXT[],
    search_vector TSVECTOR,
    
    CONSTRAINT characters_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT characters_importance_level_range CHECK (importance_level >= 1 AND importance_level <= 10)
);

-- =====================================================
-- Character Relationships Table
-- =====================================================
CREATE TABLE character_relationships (
    id BIGSERIAL PRIMARY KEY,
    
    -- Core Relationship
    character_id BIGINT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    related_character_id BIGINT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    
    -- Relationship Details
    relationship_type VARCHAR(100) NOT NULL, -- family, friend, enemy, romantic, ally, rival, etc.
    relationship_subtype VARCHAR(100), -- brother, sister, best_friend, arch_enemy, etc.
    description TEXT,
    
    -- Relationship Metadata
    strength INTEGER DEFAULT 5, -- 1-10 scale of relationship strength/importance
    is_mutual BOOLEAN DEFAULT true, -- Whether relationship is bidirectional
    status VARCHAR(50) DEFAULT 'active', -- active, past, complicated, unknown
    
    -- Timeline
    started_at VARCHAR(255), -- When relationship began (episode/chapter reference)
    ended_at VARCHAR(255), -- When relationship ended (if applicable)
    
    -- Context
    context JSONB, -- Additional relationship context and metadata
    
    -- Technical Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT character_relationships_different_characters CHECK (character_id != related_character_id),
    CONSTRAINT character_relationships_strength_range CHECK (strength >= 1 AND strength <= 10),
    CONSTRAINT character_relationships_unique UNIQUE (character_id, related_character_id, relationship_type)
);

-- =====================================================
-- Character Associations Table
-- =====================================================
CREATE TABLE character_associations (
    id BIGSERIAL PRIMARY KEY,
    
    -- Core Association
    character_id BIGINT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    
    -- Association Type and Target
    association_type VARCHAR(100) NOT NULL, -- organization, location, item, event, concept, etc.
    association_name VARCHAR(255) NOT NULL,
    association_description TEXT,
    
    -- Association Details
    role VARCHAR(100), -- member, leader, owner, visitor, enemy, etc.
    relationship_nature VARCHAR(100), -- affiliated, opposed, neutral, dependent, etc.
    importance INTEGER DEFAULT 5, -- 1-10 scale of association importance
    
    -- Timeline
    started_at VARCHAR(255), -- When association began
    ended_at VARCHAR(255), -- When association ended (if applicable)
    status VARCHAR(50) DEFAULT 'active', -- active, past, pending, unknown
    
    -- Additional Context
    context JSONB, -- Flexible JSON for additional association details
    notes TEXT,
    
    -- Technical Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT character_associations_importance_range CHECK (importance >= 1 AND importance <= 10),
    CONSTRAINT character_associations_name_not_empty CHECK (LENGTH(TRIM(association_name)) > 0)
);

-- =====================================================
-- Character Tags Table
-- =====================================================
CREATE TABLE character_tags (
    id BIGSERIAL PRIMARY KEY,
    
    -- Core Tag Information
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50), -- personality, appearance, role, archetype, etc.
    
    -- Tag Metadata
    color VARCHAR(7), -- Hex color code for UI display
    icon VARCHAR(50), -- Icon identifier for UI display
    is_system_tag BOOLEAN DEFAULT false, -- Whether this is a system-defined tag
    
    -- Usage Statistics
    usage_count INTEGER DEFAULT 0,
    
    -- Technical Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT character_tags_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT character_tags_color_format CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$')
);

-- =====================================================
-- Character-Tag Junction Table
-- =====================================================
CREATE TABLE character_tag_assignments (
    id BIGSERIAL PRIMARY KEY,
    
    -- Junction Keys
    character_id BIGINT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES character_tags(id) ON DELETE CASCADE,
    
    -- Assignment Metadata
    confidence DECIMAL(3,2) DEFAULT 1.00, -- 0.00-1.00 confidence in tag assignment
    assigned_by VARCHAR(50) DEFAULT 'manual', -- manual, auto, ai, import, etc.
    notes TEXT,
    
    -- Technical Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT character_tag_assignments_unique UNIQUE (character_id, tag_id),
    CONSTRAINT character_tag_assignments_confidence_range CHECK (confidence >= 0.00 AND confidence <= 1.00)
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Characters table indexes
CREATE INDEX idx_characters_name ON characters USING GIN (to_tsvector('english', name));
CREATE INDEX idx_characters_book_id ON characters(book_id);
CREATE INDEX idx_characters_volume_id ON characters(volume_id);
CREATE INDEX idx_characters_saga_id ON characters(saga_id);
CREATE INDEX idx_characters_arc_id ON characters(arc_id);
CREATE INDEX idx_characters_issue_id ON characters(issue_id);
CREATE INDEX idx_characters_status ON characters(status);
CREATE INDEX idx_characters_importance_level ON characters(importance_level);
CREATE INDEX idx_characters_is_main_character ON characters(is_main_character);
CREATE INDEX idx_characters_created_at ON characters(created_at);
CREATE INDEX idx_characters_search_vector ON characters USING GIN(search_vector);
CREATE INDEX idx_characters_tags ON characters USING GIN(tags);

-- Character relationships indexes
CREATE INDEX idx_character_relationships_character_id ON character_relationships(character_id);
CREATE INDEX idx_character_relationships_related_character_id ON character_relationships(related_character_id);
CREATE INDEX idx_character_relationships_type ON character_relationships(relationship_type);
CREATE INDEX idx_character_relationships_status ON character_relationships(status);
CREATE INDEX idx_character_relationships_strength ON character_relationships(strength);

-- Character associations indexes
CREATE INDEX idx_character_associations_character_id ON character_associations(character_id);
CREATE INDEX idx_character_associations_type ON character_associations(association_type);
CREATE INDEX idx_character_associations_name ON character_associations USING GIN (to_tsvector('english', association_name));
CREATE INDEX idx_character_associations_status ON character_associations(status);

-- Character tags indexes
CREATE INDEX idx_character_tags_name ON character_tags(name);
CREATE INDEX idx_character_tags_category ON character_tags(category);
CREATE INDEX idx_character_tags_usage_count ON character_tags(usage_count DESC);

-- Character tag assignments indexes
CREATE INDEX idx_character_tag_assignments_character_id ON character_tag_assignments(character_id);
CREATE INDEX idx_character_tag_assignments_tag_id ON character_tag_assignments(tag_id);
CREATE INDEX idx_character_tag_assignments_confidence ON character_tag_assignments(confidence DESC);

-- =====================================================
-- Triggers for Maintenance
-- =====================================================

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_characters_updated_at 
    BEFORE UPDATE ON characters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_relationships_updated_at 
    BEFORE UPDATE ON character_relationships 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_associations_updated_at 
    BEFORE UPDATE ON character_associations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_tags_updated_at 
    BEFORE UPDATE ON character_tags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Search vector update trigger for characters
CREATE OR REPLACE FUNCTION update_character_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.aliases, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.personality::text, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_character_search_vector_trigger
    BEFORE INSERT OR UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_character_search_vector();

-- Tag usage count maintenance
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE character_tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE character_tags SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage_count_trigger
    AFTER INSERT OR DELETE ON character_tag_assignments
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Insert some basic character tags
INSERT INTO character_tags (name, description, category, color, is_system_tag) VALUES
('Protagonist', 'Main character who drives the story forward', 'role', '#4CAF50', true),
('Antagonist', 'Character who opposes the protagonist', 'role', '#F44336', true),
('Comic Relief', 'Character who provides humor and lightens the mood', 'role', '#FF9800', true),
('Mentor', 'Character who guides and teaches others', 'role', '#9C27B0', true),
('Anti-Hero', 'Protagonist who lacks conventional heroic qualities', 'archetype', '#607D8B', true),
('Mysterious', 'Character with hidden motives or unknown background', 'personality', '#3F51B5', true),
('Brave', 'Shows courage in the face of danger', 'personality', '#2196F3', true),
('Intelligent', 'Demonstrates high intellectual capacity', 'personality', '#00BCD4', true),
('Loyal', 'Shows faithfulness and dedication', 'personality', '#009688', true),
('Stubborn', 'Refuses to change opinion or course of action', 'personality', '#795548', true);

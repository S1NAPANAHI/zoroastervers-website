-- Migration: Add RLS Policies and Security
-- Description: Adds Row Level Security policies and indexes for character tables
-- Author: Developer
-- Date: 2025

-- Enable RLS on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE volumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE arcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_tag_assignments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Books, Volumes, Sagas, Arcs, Issues Policies
-- =====================================================

-- Public read access for all content
CREATE POLICY "Allow public read access to books" ON books
FOR SELECT USING (true);

CREATE POLICY "Allow public read access to volumes" ON volumes
FOR SELECT USING (true);

CREATE POLICY "Allow public read access to sagas" ON sagas
FOR SELECT USING (true);

CREATE POLICY "Allow public read access to arcs" ON arcs
FOR SELECT USING (true);

CREATE POLICY "Allow public read access to issues" ON issues
FOR SELECT USING (true);

-- Full CRUD for admin role on content
CREATE POLICY "Allow full access for admins on books" ON books
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Allow full access for admins on volumes" ON volumes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Allow full access for admins on sagas" ON sagas
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Allow full access for admins on arcs" ON arcs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Allow full access for admins on issues" ON issues
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- =====================================================
-- Character Policies
-- =====================================================

-- Public read for published characters
CREATE POLICY "Allow read published characters" ON characters
FOR SELECT USING (status = 'active');

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on characters" ON characters
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- =====================================================
-- Character Relationships Policies
-- =====================================================

-- Public read for relationships of published characters
CREATE POLICY "Allow read character relationships for published characters" ON character_relationships
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_relationships.character_id 
    AND characters.status = 'active'
  ) OR EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_relationships.related_character_id 
    AND characters.status = 'active'
  )
);

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on character_relationships" ON character_relationships
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- =====================================================
-- Character Associations Policies
-- =====================================================

-- Public read for associations of published characters
CREATE POLICY "Allow read character associations for published characters" ON character_associations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_associations.character_id 
    AND characters.status = 'active'
  )
);

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on character_associations" ON character_associations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- =====================================================
-- Character Tags Policies
-- =====================================================

-- Public read for all tags (tags are generally public)
CREATE POLICY "Allow read character tags" ON character_tags
FOR SELECT USING (true);

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on character_tags" ON character_tags
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- =====================================================
-- Character Tag Assignments Policies
-- =====================================================

-- Public read for tag assignments of published characters
CREATE POLICY "Allow read character tag assignments for published characters" ON character_tag_assignments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_tag_assignments.character_id 
    AND characters.status = 'active'
  )
);

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on character_tag_assignments" ON character_tag_assignments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- =====================================================
-- Additional Indexes for Content Structure
-- =====================================================

-- Books table indexes
CREATE INDEX idx_books_title ON books USING GIN (to_tsvector('english', title));
CREATE INDEX idx_books_release_date ON books(release_date);
CREATE INDEX idx_books_created_at ON books(created_at);

-- Volumes table indexes
CREATE INDEX idx_volumes_book_id ON volumes(book_id);
CREATE INDEX idx_volumes_title ON volumes USING GIN (to_tsvector('english', title));
CREATE INDEX idx_volumes_release_date ON volumes(release_date);

-- Sagas table indexes
CREATE INDEX idx_sagas_volume_id ON sagas(volume_id);
CREATE INDEX idx_sagas_title ON sagas USING GIN (to_tsvector('english', title));
CREATE INDEX idx_sagas_release_date ON sagas(release_date);

-- Arcs table indexes
CREATE INDEX idx_arcs_saga_id ON arcs(saga_id);
CREATE INDEX idx_arcs_title ON arcs USING GIN (to_tsvector('english', title));
CREATE INDEX idx_arcs_release_date ON arcs(release_date);

-- Issues table indexes
CREATE INDEX idx_issues_arc_id ON issues(arc_id);
CREATE INDEX idx_issues_title ON issues USING GIN (to_tsvector('english', title));
CREATE INDEX idx_issues_release_date ON issues(release_date);

-- =====================================================
-- Database Comments and Documentation
-- =====================================================

COMMENT ON TABLE books IS 'Top-level books in the content hierarchy';
COMMENT ON TABLE volumes IS 'Volumes within books - second level of content hierarchy';
COMMENT ON TABLE sagas IS 'Sagas within volumes - third level of content hierarchy';
COMMENT ON TABLE arcs IS 'Arcs within sagas - fourth level of content hierarchy';
COMMENT ON TABLE issues IS 'Issues within arcs - fifth and final level of content hierarchy';

COMMENT ON TABLE characters IS 'Main characters table storing comprehensive character information including appearance, personality, and relationships to hierarchy tables';
COMMENT ON TABLE character_relationships IS 'Defines relationships between characters (family, friends, enemies, etc.)';
COMMENT ON TABLE character_associations IS 'Links characters to other entities like organizations, locations, items, and events';
COMMENT ON TABLE character_tags IS 'Reusable tags for categorizing and organizing characters';
COMMENT ON TABLE character_tag_assignments IS 'Junction table linking characters to their assigned tags';

COMMENT ON COLUMN characters.aliases IS 'Array of alternative names, nicknames, and titles for the character';
COMMENT ON COLUMN characters.appearance IS 'JSON object containing detailed appearance information (build, style, clothing, etc.)';
COMMENT ON COLUMN characters.personality IS 'JSON object containing personality traits, quirks, and behavioral patterns';
COMMENT ON COLUMN characters.importance_level IS 'Scale of 1-10 indicating character importance within their universe/series';
COMMENT ON COLUMN characters.search_vector IS 'Full-text search vector automatically maintained for fast character searches';

COMMENT ON COLUMN character_relationships.is_mutual IS 'Whether the relationship is bidirectional (e.g., "friends" vs "one-sided crush")';
COMMENT ON COLUMN character_relationships.strength IS 'Scale of 1-10 indicating the strength/importance of the relationship';

COMMENT ON COLUMN character_associations.association_type IS 'Type of association (organization, location, item, event, concept, etc.)';
COMMENT ON COLUMN character_associations.role IS 'Character role within the association (member, leader, enemy, etc.)';

COMMENT ON COLUMN character_tag_assignments.confidence IS 'Confidence level (0.00-1.00) in the tag assignment, useful for AI-generated tags';

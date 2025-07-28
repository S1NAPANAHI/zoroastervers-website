-- Migration: Characters Schema
-- Description: Adds RLS policies and indexes for character tables
-- Author: Developer
-- Date: 2024

-- Enable RLS on Characters Table
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for Characters Table
-- Public read for published characters
CREATE POLICY "Allow read published characters" ON characters
FOR SELECT USING (status = 'published');

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on characters" ON characters
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policies for character_relationships
-- Public read for relationships of published characters
CREATE POLICY "Allow read character relationships for published characters" ON character_relationships
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_relationships.character_id 
    AND characters.status = 'published'
  ) OR EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_relationships.related_character_id 
    AND characters.status = 'published'
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

-- Policies for character_associations
-- Public read for associations of published characters
CREATE POLICY "Allow read character associations for published characters" ON character_associations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_associations.character_id 
    AND characters.status = 'published'
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

-- Policies for character_tags
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

-- Policies for character_tag_assignments
-- Public read for tag assignments of published characters
CREATE POLICY "Allow read character tag assignments for published characters" ON character_tag_assignments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_tag_assignments.character_id 
    AND characters.status = 'published'
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

-- Indexes for Searchable Fields
-- Note: Some indexes may already exist from the initial migration, using IF NOT EXISTS to avoid conflicts

-- Characters table - Core searchable fields
CREATE INDEX IF NOT EXISTS idx_characters_name_gin ON characters USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_characters_status_btree ON characters(status);
CREATE INDEX IF NOT EXISTS idx_characters_tags_gin ON characters USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_characters_search_vector_gin ON characters USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_characters_aliases_gin ON characters USING GIN(aliases);
CREATE INDEX IF NOT EXISTS idx_characters_importance_level ON characters(importance_level);
CREATE INDEX IF NOT EXISTS idx_characters_is_main_character ON characters(is_main_character);

-- Character Relationships - Searchable fields
CREATE INDEX IF NOT EXISTS idx_character_relationships_status_btree ON character_relationships(status);
CREATE INDEX IF NOT EXISTS idx_character_relationships_type ON character_relationships(relationship_type);
CREATE INDEX IF NOT EXISTS idx_character_relationships_character_id ON character_relationships(character_id);
CREATE INDEX IF NOT EXISTS idx_character_relationships_related_character_id ON character_relationships(related_character_id);

-- Character Associations - Searchable fields
CREATE INDEX IF NOT EXISTS idx_character_associations_name_gin ON character_associations USING GIN (to_tsvector('english', association_name));
CREATE INDEX IF NOT EXISTS idx_character_associations_status_btree ON character_associations(status);
CREATE INDEX IF NOT EXISTS idx_character_associations_type ON character_associations(association_type);
CREATE INDEX IF NOT EXISTS idx_character_associations_character_id ON character_associations(character_id);

-- Character Tags - Searchable fields
CREATE INDEX IF NOT EXISTS idx_character_tags_name_btree ON character_tags(name);
CREATE INDEX IF NOT EXISTS idx_character_tags_category ON character_tags(category);
CREATE INDEX IF NOT EXISTS idx_character_tags_usage_count ON character_tags(usage_count DESC);

-- Character Tag Assignments - Junction table indexes
CREATE INDEX IF NOT EXISTS idx_character_tag_assignments_character_id ON character_tag_assignments(character_id);
CREATE INDEX IF NOT EXISTS idx_character_tag_assignments_tag_id ON character_tag_assignments(tag_id);

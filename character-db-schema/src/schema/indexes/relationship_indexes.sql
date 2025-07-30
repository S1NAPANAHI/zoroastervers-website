-- Indexes for Character Relationships - Searchable fields
CREATE INDEX IF NOT EXISTS idx_character_relationships_status_btree ON character_relationships(status);
CREATE INDEX IF NOT EXISTS idx_character_relationships_type ON character_relationships(relationship_type);
CREATE INDEX IF NOT EXISTS idx_character_relationships_character_id ON character_relationships(character_id);
CREATE INDEX IF NOT EXISTS idx_character_relationships_related_character_id ON character_relationships(related_character_id);
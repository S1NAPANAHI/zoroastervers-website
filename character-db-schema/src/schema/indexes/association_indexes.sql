-- Indexes for Character Associations - Searchable fields
CREATE INDEX IF NOT EXISTS idx_character_associations_name_gin ON character_associations USING GIN (to_tsvector('english', association_name));
CREATE INDEX IF NOT EXISTS idx_character_associations_status_btree ON character_associations(status);
CREATE INDEX IF NOT EXISTS idx_character_associations_type ON character_associations(association_type);
CREATE INDEX IF NOT EXISTS idx_character_associations_character_id ON character_associations(character_id);
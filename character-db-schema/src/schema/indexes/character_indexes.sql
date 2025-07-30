-- Indexes for Characters Table

-- Core searchable fields
CREATE INDEX IF NOT EXISTS idx_characters_name_gin ON characters USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_characters_status_btree ON characters(status);
CREATE INDEX IF NOT EXISTS idx_characters_tags_gin ON characters USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_characters_search_vector_gin ON characters USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_characters_aliases_gin ON characters USING GIN(aliases);
CREATE INDEX IF NOT EXISTS idx_characters_importance_level ON characters(importance_level);
CREATE INDEX IF NOT EXISTS idx_characters_is_main_character ON characters(is_main_character);
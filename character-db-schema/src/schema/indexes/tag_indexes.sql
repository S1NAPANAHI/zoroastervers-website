-- Character Tags - Searchable fields
CREATE INDEX IF NOT EXISTS idx_character_tags_name_btree ON character_tags(name);
CREATE INDEX IF NOT EXISTS idx_character_tags_category ON character_tags(category);
CREATE INDEX IF NOT EXISTS idx_character_tags_usage_count ON character_tags(usage_count DESC);
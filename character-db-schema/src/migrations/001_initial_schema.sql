-- Migration: Initial Schema
-- Description: Sets up the entire database schema for character management
-- Author: Developer
-- Date: 2024

-- Create Characters Table
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    tags TEXT[],
    search_vector TSVECTOR,
    aliases TEXT[],
    importance_level INT,
    is_main_character BOOLEAN DEFAULT FALSE
);

-- Create Character Relationships Table
CREATE TABLE character_relationships (
    id SERIAL PRIMARY KEY,
    character_id INT REFERENCES characters(id),
    related_character_id INT REFERENCES characters(id),
    relationship_type VARCHAR(100),
    status VARCHAR(50) NOT NULL
);

-- Create Character Associations Table
CREATE TABLE character_associations (
    id SERIAL PRIMARY KEY,
    character_id INT REFERENCES characters(id),
    association_name VARCHAR(255),
    association_type VARCHAR(100),
    status VARCHAR(50) NOT NULL
);

-- Create Character Tags Table
CREATE TABLE character_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    usage_count INT DEFAULT 0
);

-- Create Character Tag Assignments Table
CREATE TABLE character_tag_assignments (
    id SERIAL PRIMARY KEY,
    character_id INT REFERENCES characters(id),
    tag_id INT REFERENCES character_tags(id)
);

-- Enable Row Level Security
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Include policies and indexes
\i ../schema/policies/character_policies.sql
\i ../schema/policies/relationship_policies.sql
\i ../schema/policies/association_policies.sql
\i ../schema/policies/tag_policies.sql

\i ../schema/indexes/character_indexes.sql
\i ../schema/indexes/relationship_indexes.sql
\i ../schema/indexes/association_indexes.sql
\i ../schema/indexes/tag_indexes.sql
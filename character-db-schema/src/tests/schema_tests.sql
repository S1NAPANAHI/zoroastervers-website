-- Schema Tests for Character Management Database

-- Test for Characters Table
SELECT *
FROM information_schema.tables
WHERE table_name = 'characters';

-- Test for Character Relationships Table
SELECT *
FROM information_schema.tables
WHERE table_name = 'character_relationships';

-- Test for Character Associations Table
SELECT *
FROM information_schema.tables
WHERE table_name = 'character_associations';

-- Test for Character Tags Table
SELECT *
FROM information_schema.tables
WHERE table_name = 'character_tags';

-- Test for Character Tag Assignments Table
SELECT *
FROM information_schema.tables
WHERE table_name = 'character_tag_assignments';

-- Test for Row-Level Security Policies
SELECT *
FROM pg_policies
WHERE tablename = 'characters';

SELECT *
FROM pg_policies
WHERE tablename = 'character_relationships';

SELECT *
FROM pg_policies
WHERE tablename = 'character_associations';

SELECT *
FROM pg_policies
WHERE tablename = 'character_tags';

-- Test for Indexes
SELECT *
FROM pg_indexes
WHERE tablename = 'characters';

SELECT *
FROM pg_indexes
WHERE tablename = 'character_relationships';

SELECT *
FROM pg_indexes
WHERE tablename = 'character_associations';

SELECT *
FROM pg_indexes
WHERE tablename = 'character_tags';
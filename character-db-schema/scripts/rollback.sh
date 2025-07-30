#!/bin/bash

# Rollback the last deployment of the character database schema

# Define the database connection parameters
DB_NAME="your_database_name"
DB_USER="your_username"
DB_HOST="localhost"
DB_PORT="5432"

# Function to execute SQL commands
execute_sql() {
    PGPASSWORD="your_password" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$1"
}

# Rollback commands
echo "Rolling back the last deployment..."

# Execute rollback SQL scripts in reverse order
execute_sql "../src/schema/indexes/tag_indexes.sql"
execute_sql "../src/schema/indexes/association_indexes.sql"
execute_sql "../src/schema/indexes/relationship_indexes.sql"
execute_sql "../src/schema/indexes/character_indexes.sql"

execute_sql "../src/schema/policies/tag_policies.sql"
execute_sql "../src/schema/policies/association_policies.sql"
execute_sql "../src/schema/policies/relationship_policies.sql"
execute_sql "../src/schema/policies/character_policies.sql"

execute_sql "../src/schema/tables/character_tag_assignments.sql"
execute_sql "../src/schema/tables/character_tags.sql"
execute_sql "../src/schema/tables/character_associations.sql"
execute_sql "../src/schema/tables/character_relationships.sql"
execute_sql "../src/schema/tables/characters.sql"

echo "Rollback completed."
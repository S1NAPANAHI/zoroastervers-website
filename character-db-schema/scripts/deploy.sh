#!/bin/bash

# Deploy the database schema

# Define the database connection parameters
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="your_database_name"
DB_USER="your_username"
DB_PASSWORD="your_password"

# Export the password for psql
export PGPASSWORD=$DB_PASSWORD

# Execute the SQL scripts to create tables, policies, and indexes
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/tables/characters.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/tables/character_relationships.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/tables/character_associations.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/tables/character_tags.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/tables/character_tag_assignments.sql

psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/policies/character_policies.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/policies/relationship_policies.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/policies/association_policies.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/policies/tag_policies.sql

psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/indexes/character_indexes.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/indexes/relationship_indexes.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/indexes/association_indexes.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/schema/indexes/tag_indexes.sql

# Run the initial migration
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../src/migrations/001_initial_schema.sql

echo "Database schema deployed successfully."
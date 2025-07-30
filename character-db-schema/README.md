# character-db-schema

This project provides a complete database schema for character management, including all necessary tables, indexes, and row-level security policies.

## Project Structure

```
character-db-schema
├── src
│   ├── schema
│   │   ├── tables
│   │   │   ├── characters.sql
│   │   │   ├── character_relationships.sql
│   │   │   ├── character_associations.sql
│   │   │   ├── character_tags.sql
│   │   │   └── character_tag_assignments.sql
│   │   ├── policies
│   │   │   ├── character_policies.sql
│   │   │   ├── relationship_policies.sql
│   │   │   ├── association_policies.sql
│   │   │   └── tag_policies.sql
│   │   └── indexes
│   │       ├── character_indexes.sql
│   │       ├── relationship_indexes.sql
│   │       ├── association_indexes.sql
│   │       └── tag_indexes.sql
│   ├── migrations
│   │   └── 001_initial_schema.sql
│   └── tests
│       └── schema_tests.sql
├── scripts
│   ├── deploy.sh
│   └── rollback.sh
└── README.md
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd character-db-schema
   ```

2. **Run the initial migration**:
   Execute the migration script to set up the database schema.
   ```bash
   psql -U <username> -d <database> -f src/migrations/001_initial_schema.sql
   ```

3. **Deploy the schema**:
   Use the deploy script to apply the schema to your database.
   ```bash
   ./scripts/deploy.sh
   ```

4. **Run tests**:
   Ensure that the schema is set up correctly by running the tests.
   ```bash
   psql -U <username> -d <database> -f src/tests/schema_tests.sql
   ```

## Usage

This schema is designed for managing characters in a narrative context, allowing for relationships, associations, and tagging of characters. The row-level security policies ensure that access to character data is controlled based on user roles.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
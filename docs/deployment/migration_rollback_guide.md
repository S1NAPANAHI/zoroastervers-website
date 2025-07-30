# Migration and Rollback Guide

## Migration Steps

1. **Run Migration**: Use the following command to apply migrations to the database:
   ```sh
   supabase migration apply
   ```

2. **Verify Migration**: Ensure the migration has been applied by checking the existence of new tables or columns.

3. **Data Validation**: Manually verify the integrity of the data after migration.

4. **Index and Policy Setup**: Make sure that all indexes and row-level security policies are properly set up.

5. **Testing**: Conduct thorough testing of application features pertaining to the migrated schema features.

## Rollback Steps

1. **Backup**: Ensure that the current database state is backed up before rolling back.

2. **Run Rollback**: Use the following command to roll back the changes:
   ```sh
   supabase migration rollback
   ```

3. **Verify Rollback**: Ensure the changes have been successfully rolled back by checking the absence of newly created tables or columns.

4. **Data Consistency**: Perform data consistency checks post rollback.

5. **Manual Cleanup**: Check for any manual cleanup requirements noted during the rollback script execution.

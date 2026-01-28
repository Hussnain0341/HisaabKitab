# Database Migrations

This directory contains versioned database migration scripts that are automatically applied when the app starts.

## Migration File Naming

Migration files must follow this naming pattern:
```
{version}_{description}.sql
```

Examples:
- `001_initial_schema.sql`
- `002_add_discount_column.sql`
- `003_add_audit_log_table.sql`

## How It Works

1. On app startup, the migration service:
   - Checks the current schema version in the database
   - Compares with the highest migration file version
   - Applies any pending migrations sequentially
   - Each migration runs in a transaction (rollback on failure)

2. Migration Safety:
   - All migrations run inside transactions
   - If a migration fails, it's automatically rolled back
   - Failed migrations are recorded in `schema_version` table
   - App continues to work with previous version if migration fails

3. Migration Status:
   - Check migration status via `/api/updates/migration-status`
   - View migration history in `schema_version` table

## Best Practices

1. **Always test migrations** on a backup database first
2. **Never modify existing migration files** - create new ones instead
3. **Use transactions** - wrap all changes in BEGIN/COMMIT
4. **Add rollback logic** if needed (though auto-rollback handles failures)
5. **Keep migrations small** - one logical change per migration
6. **Document changes** in migration file comments

## Example Migration

```sql
-- Migration: 002_add_discount_column
-- Description: Add discount column to sales table
-- Date: 2026-01-26

BEGIN;

-- Add discount column
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS discount DECIMAL(10, 2) DEFAULT 0;

-- Update existing records
UPDATE sales SET discount = 0 WHERE discount IS NULL;

-- Add constraint
ALTER TABLE sales 
ALTER COLUMN discount SET NOT NULL;

COMMIT;
```

## Rollback

If a migration fails:
1. The transaction is automatically rolled back
2. The app continues with the previous schema version
3. Check logs for error details
4. Fix the migration file and restart the app



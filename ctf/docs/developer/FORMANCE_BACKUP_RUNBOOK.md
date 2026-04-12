# Formance Postgres Backup & Restore Runbook

## Overview

This runbook documents the daily automated backup and manual restore lifecycle for the Formance Postgres database. The automation performs a nightly backup of the Formance database to Supabase Storage, ensuring disaster recovery and compliance with data retention policies. Backups are compressed, restorable, and timestamped, and can be restored to any compatible Postgres instance.

**Architecture:**
- GitHub Actions workflow triggers a Node.js script (`ctf/scripts/backupFormanceToSupabase.mjs`) daily at 3am UTC
- The script uses `pg_dump` to create a compressed backup and uploads it to the `backups/formance/` folder in Supabase Storage
- All credentials are managed via GitHub Actions secrets

---

## Prerequisites

- **Secrets Required:**
  - `FORMANCE_DATABASE_URL`: Postgres connection string for the Formance database (read access)
  - `SUPABASE_URL`: Supabase project URL (e.g., `https://xyzcompany.supabase.co`)
  - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (write access to storage)
- **Supabase Storage Setup:**
  - The `backups` bucket must exist in Supabase Storage
  - The `backups/formance/` folder is used for storing daily backup files

---

## Manual Execution

To run the backup script locally:

```sh
FORMANCE_DATABASE_URL=postgres://user:pass@host:port/dbname \
SUPABASE_URL=https://xyzcompany.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
node ctf/scripts/backupFormanceToSupabase.mjs
```

The script will create a timestamped `.dump` file, upload it to Supabase Storage, and clean up the local file.

---

## Restore Procedure

1. **Download the desired backup file from Supabase Storage:**
   - Use the Supabase dashboard or CLI to download from `backups/formance/formance-backup-YYYY-MM-DDTHHMMSSZ.dump`
   - Example with Supabase CLI:
     ```sh
     supabase storage list backups/formance/
     supabase storage download backups/formance/formance-backup-YYYY-MM-DDTHHMMSSZ.dump
     ```
2. **Restore to Postgres using `pg_restore`:**
   - Example command:
     ```sh
     pg_restore --clean --no-owner --no-privileges --dbname=postgres://user:pass@host:port/dbname formance-backup-YYYY-MM-DDTHHMMSSZ.dump
     ```
   - Adjust flags as needed for your environment (see `pg_restore` docs)

---

## Verification Checklist

- [ ] Confirm daily workflow runs succeeded in the GitHub Actions tab
- [ ] List contents of `backups/formance/` in Supabase Storage (dashboard or CLI)
- [ ] Periodically perform a test restore to a staging environment and verify data integrity

---

## Troubleshooting

- **Connection errors:**
  - Check that all secrets are set and valid
  - Ensure network access to both Postgres and Supabase endpoints
- **Storage permission issues:**
  - Verify the service role key has write access to the `backups` bucket
  - Confirm the bucket and folder exist in Supabase
- **Timeouts or large backup failures:**
  - Increase GitHub Actions job timeout if needed
  - Check for storage quotas or network interruptions
- **Script errors:**
  - Review error logs uploaded as workflow artifacts for details

---

## Incident Response

If a restore is required due to data loss or corruption, follow this runbook and reference the incident response protocol in [REVERT_PROTOCOL.md](./REVERT_PROTOCOL.md) for escalation and audit requirements.

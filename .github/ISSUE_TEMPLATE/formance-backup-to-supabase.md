---
title: "Automate Formance Backups to Supabase Storage"
labels: ["infra", "backup", "supabase", "postgres", "enhancement"]
---

## Goal
Automate daily Formance (Postgres) backups and store them in a Supabase Storage bucket, following workspace policies and best practices.

## Plan

1. **Create a Backup Script**
   - Write a shell or Node.js script to:
     - Run `pg_dump` for the Formance database
     - Name the file with a timestamp
2. **Upload to Supabase Storage**
   - Use the Supabase CLI or `@supabase/supabase-js` to upload the backup file to a designated bucket (e.g., `backups`).
3. **Schedule Automation**
   - Set up a cron job or GitHub Actions workflow to run the script daily.
4. **Verification**
   - After each backup, list the bucket contents to confirm upload.
   - Periodically test restore from backup to ensure integrity.
5. **Documentation**
   - Document the process in `ctf/docs/developer/BACKUP_RUNBOOK.md`.
   - Reference [ctf/docs/developer/REVERT_PROTOCOL.md](ctf/docs/developer/REVERT_PROTOCOL.md) for backup policy.
6. **Review and Approval**
   - Ensure scripts follow Supabase/Postgres best practices ([ctf/agents/skills/supabase-postgres-best-practices/README.md](ctf/agents/skills/supabase-postgres-best-practices/README.md)).
   - Place scripts in `ctf/scripts/`.

## References
- [Supabase Postgres Best Practices](ctf/agents/skills/supabase-postgres-best-practices/README.md)
- [Supabase Client Example](ctf/packages/eol/supabase-client.ts)
- [Backup Policy](ctf/docs/developer/REVERT_PROTOCOL.md)

## Acceptance Criteria
- Automated daily backups are created and uploaded to Supabase Storage
- Backups are verifiable and restorable
- Process is documented and reproducible
- All scripts and documentation follow workspace compliance and reproducibility rules

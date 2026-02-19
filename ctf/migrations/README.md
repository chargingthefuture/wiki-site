# ctf Database Migrations

Use this folder for rewrite migrations targeting the existing Neon database.

## Naming

- `YYYY-MM-DD-short-description.sql`

Examples:

- `2026-02-19-create-chyme-profiles.sql`
- `2026-02-22-add-chyme-room-index.sql`

## Authoring Rules

- SQL must be paste-ready for Neon console.
- Include explicit rollback notes in PR description.
- Prefer additive and reversible steps when possible.

## PR Checklist Snippet

- `Migration: ctf/migrations/<filename>.sql`
- Purpose:
- Rollback:

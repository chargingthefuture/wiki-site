#!/bin/bash
# formance-backup.sh
# Backup Formance Postgres DB and upload to Supabase Storage
# Place in ctf/scripts/

set -euo pipefail

# --- CONFIG ---
# Set these environment variables or replace with your values
PGUSER="${PGUSER:-postgres}"
PGHOST="${PGHOST:-localhost}"
PGDATABASE="${PGDATABASE:-formance}"
SUPABASE_URL="${SUPABASE_URL:-}"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY:-}"
SUPABASE_BUCKET="${SUPABASE_BUCKET:-backups}"

BACKUP_DIR="/tmp"
DATE=$(date +%F-%H%M)
BACKUP_FILE="formance_backup_${DATE}.dump"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

# --- BACKUP ---
echo "[INFO] Dumping Formance DB to $BACKUP_PATH"
pg_dump -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -F c -f "$BACKUP_PATH"

# --- UPLOAD ---
echo "[INFO] Uploading $BACKUP_FILE to Supabase bucket: $SUPABASE_BUCKET"

npx supabase@latest storage cp "$BACKUP_PATH" "$SUPABASE_BUCKET/$BACKUP_FILE" --project-url "$SUPABASE_URL" --service-key "$SUPABASE_SERVICE_KEY"

# --- VERIFY ---
echo "[INFO] Listing files in Supabase bucket: $SUPABASE_BUCKET"
npx supabase@latest storage ls "$SUPABASE_BUCKET" --project-url "$SUPABASE_URL" --service-key "$SUPABASE_SERVICE_KEY"

echo "[SUCCESS] Backup and upload complete."

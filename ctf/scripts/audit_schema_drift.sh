#!/bin/bash
# Audit schema drift between running DB and ctf/schema.sql
# Usage: ./audit_schema_drift.sh [DATABASE_URL]
# If DATABASE_URL is not provided, uses $DATABASE_URL from environment.

set -e

SCHEMA_FILE="$(dirname "$0")/../schema.sql"
TMP_DUMP="/tmp/ctf_db_schema_dump.sql"

if [ -z "$1" ] && [ -z "$DATABASE_URL" ]; then
  echo "Usage: $0 [DATABASE_URL]"
  echo "Or set DATABASE_URL in your environment."
  exit 1
fi

DB_URL="${1:-$DATABASE_URL}"

echo "Dumping current DB schema to $TMP_DUMP ..."
PGOPTIONS="--client-min-messages=warning" pg_dump --schema-only --no-owner --no-privileges --if-exists --exclude-schema=information_schema --exclude-schema=pg_catalog --dbname="$DB_URL" > "$TMP_DUMP"

echo "Comparing $TMP_DUMP to $SCHEMA_FILE ..."
diff -u "$SCHEMA_FILE" "$TMP_DUMP" || {
  echo "\n\033[1;31mSCHEMA DRIFT DETECTED!\033[0m"
  echo "Review the diff above."
  exit 2
}

echo "\033[1;32mNo schema drift detected.\033[0m"
exit 0
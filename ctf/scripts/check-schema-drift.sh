#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$ROOT_DIR" ]]; then
  echo "Must run inside a git repository." >&2
  exit 2
fi
cd "$ROOT_DIR"

mode="default"
ref_range=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref-range)
      mode="ref-range"
      ref_range="${2:-}"
      if [[ -z "$ref_range" ]]; then
        echo "Missing value for --ref-range" >&2
        exit 2
      fi
      shift 2
      ;;
    --all)
      mode="all"
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: $0 [--ref-range <RANGE>|--all]" >&2
      exit 2
      ;;
  esac
done

if [[ "$mode" == "ref-range" ]]; then
  mapfile -d '' -t files < <(git diff --name-only --diff-filter=ACMR -z "$ref_range")
elif [[ "$mode" == "all" ]]; then
  mapfile -d '' -t files < <(git ls-files -z)
else
  if git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
    mapfile -d '' -t files < <(git diff --name-only --diff-filter=ACMR -z "HEAD~1...HEAD")
  else
    mapfile -d '' -t files < <(git ls-files -z)
  fi
fi

db_impacting_changed=false
migration_sql_changed=false
seed_changed=false
contract_changed=false
versioning_note_changed=false

for file in "${files[@]}"; do
  [[ -z "$file" ]] && continue
  file_lc="$(echo "$file" | tr '[:upper:]' '[:lower:]')"
  keyword_db_eligible=true

  if [[ ! "$file" =~ ^ctf/ ]]; then
    keyword_db_eligible=false
  fi
  if [[ "$file" =~ ^ctf/docs/ ]] || [[ "$file" =~ ^ctf/scripts/ ]] || [[ "$file" =~ ^ctf/packages/mobile/ ]] || [[ "$file" =~ ^ctf/packages/web/ ]]; then
    keyword_db_eligible=false
  fi

  if [[ "$file" =~ ^ctf/migrations/ ]]; then
    db_impacting_changed=true
  fi

  if [[ "$keyword_db_eligible" == true && "$file_lc" =~ schema|migration|drizzle|sql ]]; then
    db_impacting_changed=true
  fi

  if [[ "$file" =~ ^ctf/server/ ]] || [[ "$file" =~ ^ctf/packages/shared/ ]]; then
    if [[ ! "$file" =~ (^|/)(docs?|tests?|__tests__|testing)(/|$) ]]; then
      db_impacting_changed=true
    fi
  fi

  if [[ "$file" =~ ^ctf/migrations/.*\.sql$ ]]; then
    migration_sql_changed=true
  fi

  if [[ "$file" =~ ^ctf/scripts/ ]] && [[ "$file_lc" =~ seed ]]; then
    seed_changed=true
  fi
  if [[ "$file" =~ ^ctf/docs/ ]] && [[ "$file_lc" =~ seed ]]; then
    seed_changed=true
  fi

  if [[ "$file" =~ ^ctf/packages/ ]] && [[ "$file_lc" =~ contract|schema|command|access-policy|audit ]]; then
    contract_changed=true
  fi
  if [[ "$file" =~ ^\.claude/rules/20[0-9].*\.mdc$ ]]; then
    contract_changed=true
  fi

  if [[ "$file" =~ ^ctf/docs/developer/ ]]; then
    versioning_note_changed=true
  fi
  if [[ "$file" == ".claude/rules/122-schema-drift-predeployment-rules.mdc" ]]; then
    versioning_note_changed=true
  fi
done

failed=0

if [[ "$db_impacting_changed" == true && "$migration_sql_changed" != true ]]; then
  echo "Schema drift gate failed: DB-impacting changes detected without a migration SQL change in ctf/migrations/." >&2
  failed=1
fi

if [[ "$seed_changed" == true && "$migration_sql_changed" != true ]]; then
  echo "Schema drift gate failed: seed-related changes require a migration SQL change (seed/schema blocker policy)." >&2
  failed=1
fi

if [[ "$contract_changed" == true && "$migration_sql_changed" != true && "$versioning_note_changed" != true ]]; then
  echo "Schema drift gate failed: contract/schema command or policy changes require versioning evidence (ctf/docs/developer/**, .claude/rules/122-schema-drift-predeployment-rules.mdc, or a migration SQL change)." >&2
  failed=1
fi

if [[ "$failed" -ne 0 ]]; then
  echo "Summary: db_impacting_changed=$db_impacting_changed migration_sql_changed=$migration_sql_changed seed_changed=$seed_changed contract_changed=$contract_changed versioning_note_changed=$versioning_note_changed" >&2
  exit 1
fi

echo "Schema drift gate passed: db_impacting_changed=$db_impacting_changed migration_sql_changed=$migration_sql_changed seed_changed=$seed_changed contract_changed=$contract_changed versioning_note_changed=$versioning_note_changed"

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

max_lines=300
failed=0
allowlist_file="config/file-size-exceptions.txt"

is_allowlisted() {
  local file="$1"

  if [ ! -f "$allowlist_file" ]; then
    return 1
  fi

  while IFS= read -r entry || [ -n "$entry" ]; do
    entry="${entry%%#*}"
    entry="$(echo "$entry" | xargs)"
    [ -z "$entry" ] && continue
    if [ "$file" = "$entry" ]; then
      return 0
    fi
  done < "$allowlist_file"

  return 1
}

while IFS= read -r -d '' file; do
  relative_path="${file#./}"

  if is_allowlisted "$relative_path"; then
    continue
  fi

  lines=$(wc -l < "$file")
  if [ "$lines" -gt "$max_lines" ]; then
    echo "File exceeds ${max_lines} lines: ${relative_path} (${lines} lines)"
    failed=1
  fi
done < <(find packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  -not -path "*/.next/*" \
  -not -path "*/android/*" \
  -not -path "*/ios/*" \
  -not -path "*/build/*" \
  -print0)

if [ "$failed" -ne 0 ]; then
  echo "File-size budget check failed. Split large files into focused modules or add a justified temporary exception in ${allowlist_file}."
  exit 1
fi

echo "File-size budget check passed."

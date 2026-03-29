#!/usr/bin/env bash
set -euo pipefail

CTF_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$CTF_ROOT"

if ! ESLINT_USE_FLAT_CONFIG=false pnpm exec eslint --version >/dev/null 2>&1; then
  echo "❌ Modularity/complexity governance check failed: eslint is not available via pnpm exec."
  echo "Install dependencies in ctf first (for example: pnpm install)."
  exit 1
fi

echo "🔍 Running modularity/complexity governance checks on ctf/packages..."

collect_changed_files() {
  local changed
  changed="$(git diff --name-only --diff-filter=ACMRTUXB HEAD -- 2>/dev/null || true)"

  if [ -n "$changed" ]; then
    printf '%s\n' "$changed"
  fi

  git ls-files --others --exclude-standard -- packages 2>/dev/null || true
}

mapfile -t target_files < <(
  collect_changed_files \
    | grep -E '^packages/.+\.(ts|tsx|js|jsx)$' \
    | grep -Ev '\.(test|spec|stories)\.(ts|tsx|js|jsx)$' \
    | sort -u
)

if [ "${#target_files[@]}" -eq 0 ]; then
  echo "✅ No changed package source files detected for modularity governance checks."
  exit 0
fi

if ESLINT_USE_FLAT_CONFIG=false pnpm exec eslint \
  --quiet \
  --no-error-on-unmatched-pattern \
  --rule 'complexity:["error",10]' \
  --rule 'max-lines-per-function:["error",{"max":200,"skipBlankLines":true,"skipComments":true,"IIFEs":true}]' \
  "${target_files[@]}"; then
  echo "✅ Modularity/complexity governance check passed."
else
  echo "❌ Modularity/complexity governance check failed. Resolve ESLint errors before merging."
  exit 1
fi
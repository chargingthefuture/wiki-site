#!/usr/bin/env bash
set -euo pipefail

mode="all"
ref_range=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --staged)
      mode="staged"
      shift
      ;;
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
      echo "Usage: $0 [--staged|--ref-range <RANGE>|--all]" >&2
      exit 2
      ;;
  esac
done

prompt_pattern='(^|[^[:alpha:]])(system|developer|user)[[:space:]]+prompt([^[:alpha:]]|$)|follow[[:space:]]+microsoft[[:space:]]+content[[:space:]]+policies|you[[:space:]]+are[[:space:]]+an?[[:space:]]+.*ai[[:space:]]+(programming[[:space:]]+)?assistant|<coding_agent_instructions>|<task_execution>|<applyPatchInstructions>|begin[[:space:]]+prompt'

if [[ "$mode" == "staged" ]]; then
  mapfile -d '' -t files < <(git diff --cached --name-only --diff-filter=ACMR -z)
elif [[ "$mode" == "ref-range" ]]; then
  mapfile -d '' -t files < <(git diff --name-only --diff-filter=ACMR -z "$ref_range")
else
  mapfile -d '' -t files < <(git ls-files -z)
fi

if [[ ${#files[@]} -eq 0 ]]; then
  exit 0
fi

failed=0
for file in "${files[@]}"; do
  [[ -z "$file" ]] && continue

  case "$file" in
    scripts/check-no-ai-prompts.sh)
      continue
      ;;
  esac

  target_path=""
  temp_file=""

  if [[ "$mode" == "staged" ]]; then
    if ! git cat-file -e ":$file" 2>/dev/null; then
      continue
    fi
    temp_file="$(mktemp)"
    if ! git show ":$file" >"$temp_file"; then
      rm -f "$temp_file"
      continue
    fi
    target_path="$temp_file"
  else
    if [[ ! -f "$file" ]]; then
      continue
    fi
    target_path="$file"
  fi

  if ! grep -Iq . "$target_path"; then
    rm -f "$temp_file"
    continue
  fi

  if grep -Ein "$prompt_pattern" "$target_path" >/tmp/ai_prompt_matches.txt; then
    echo "Potential AI prompt content detected in $file"
    cat /tmp/ai_prompt_matches.txt
    echo
    failed=1
  fi

  rm -f "$temp_file"
done

rm -f /tmp/ai_prompt_matches.txt

if [[ "$failed" -ne 0 ]]; then
  echo "Commit/push blocked: remove prompt text or move it to an ignored path (e.g. .ai/)." >&2
  exit 1
fi

exit 0

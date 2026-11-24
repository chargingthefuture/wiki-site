#!/usr/bin/env bash
# Brings the checked-out post branch up to date with origin/main and commits the result, the way
# /s does: merge main, take main's generated files and hand-written paste sheet, date the post
# today (Eastern), sync, put the post's paste sheet entry back with its new number, regenerate the
# full and text-to-speech sheets, and run every check. Pushes nothing. Used by
# .github/workflows/publish-post.yml; run from wiki-site/ with full git history.
#
# Exit codes: 0 committed (or nothing to do), 3 a conflict outside the generated files, 4 more than
# one post on the branch, 5 no post on the branch, anything else a failed step.
set -euo pipefail

work="${RUNNER_TEMP:-$(mktemp -d)}/settle"
mkdir -p "$work"
today="$(TZ=America/New_York date +%F)"

# The branch's own sheet and its added posts, read before main is merged in.
git show HEAD:wiki-site/QUORA_PASTE_SHEET.txt > "$work/branch-sheet.txt"
# Posts on the branch that main does not have yet. git prints paths from the repository root;
# the script reads them from wiki-site/.
git diff --name-only --diff-filter=A origin/main HEAD -- content \
  | grep '\.md$' | grep -v '/archive/' | grep -v '/README\.md$' | sed 's|^wiki-site/||' > "$work/posts.txt" || true
if [ ! -s "$work/posts.txt" ]; then
  echo "No new post on this branch. This workflow publishes posts; other changes are merged by hand."
  exit 5
fi
if [ "$(wc -l < "$work/posts.txt")" -gt 1 ]; then
  echo "More than one post on this branch: $(tr '\n' ' ' < "$work/posts.txt"). One post per pull request."
  exit 4
fi

generated=(QUORA_PASTE_SHEET.txt QUORA_PASTE_SHEET_FULL.txt TTS_PASTE_SHEET.txt artifacts/wiki/src/lib/articles.ts content/feed-numbers.json)
if ! git merge --no-edit origin/main >/dev/null; then
  for f in "${generated[@]}"; do
    git checkout --theirs -- "$f" 2>/dev/null && git add -- "$f" || true
  done
  if [ -n "$(git diff --name-only --diff-filter=U)" ]; then
    echo "Conflicts with main outside the generated files: $(git diff --name-only --diff-filter=U | tr '\n' ' ')"
    git merge --abort
    exit 3
  fi
  git commit --no-edit -q
else
  # A clean merge still carries the branch's own copy of the sheet; main's is the base.
  git checkout origin/main -- QUORA_PASTE_SHEET.txt
fi

# The merge is committed before the sync: the sync ranks same-day posts by each file's first commit
# as seen from HEAD. Main may have changed the dependencies, so they are installed after it.
pnpm install --frozen-lockfile
pnpm --filter @workspace/scripts exec tsx ./src/settle-post-pr.ts prepare \
  --branch-sheet "$work/branch-sheet.txt" --posts "$work/posts.txt" --today "$today" --out "$work/saved.json"
pnpm --filter @workspace/scripts run sync-articles
pnpm --filter @workspace/scripts exec tsx ./src/settle-post-pr.ts place --in "$work/saved.json"
pnpm --filter @workspace/scripts run paste-sheet-full
pnpm --filter @workspace/scripts run paste-sheet-tts

node scripts/check-us-spelling.mjs
pnpm --filter @workspace/scripts run check-banned-words
pnpm --filter @workspace/scripts run check-app-address
pnpm --filter @workspace/scripts run validate
pnpm --filter @workspace/scripts run check-paste-sheet-numbers
pnpm run wiki:build

git add -A content QUORA_PASTE_SHEET.txt QUORA_PASTE_SHEET_FULL.txt TTS_PASTE_SHEET.txt artifacts/wiki/src/lib/articles.ts
if git diff --cached --quiet; then
  echo "Already up to date with main."
else
  git commit -q -m "chore: sync registry and feed numbers" -m "Dated $today by the publish-post workflow."
fi

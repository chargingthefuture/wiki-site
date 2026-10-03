---
description: Run pnpm wiki:sync and settle what follows from it — regenerated files, feed numbers, the paste sheet — then push.
---

Run the registry sync and finish everything that falls out of it. `$ARGUMENTS` may name a branch
or a pull request number; with nothing, work on the current branch. Never run this on `main`
directly: if the current branch is `main`, create `chore/sync-<date>` first (per `/br`).

1. Bring the branch up to date: `git fetch origin main && git merge origin/main`. Resolve a
   conflict in a generated file by regenerating it, never by hand. Commit the merge before step 2:
   the sync ranks same-day posts by each file's first commit as seen from `HEAD`, and during an
   unresolved merge `HEAD` is still the branch tip, so every post arriving from `main` has no
   history yet and sorts last.
2. From `wiki-site/`: `pnpm wiki:sync`, then `pnpm wiki:paste-full` and `pnpm wiki:paste-tts`.
3. `pnpm wiki:check-numbers`. If it reports a page whose paste sheet `No. N` differs from
   `/feed`, change that entry's number in `QUORA_PASTE_SHEET.txt` to the number the check names,
   and nothing else in the entry. Never edit `content/feed-numbers.json` by hand; `wiki:sync`
   owns it. Re-run the check until it passes.
4. `pnpm wiki:validate`, `pnpm wiki:spelling`, `pnpm wiki:banned-words`, `pnpm wiki:build`.
   Do not push red.
5. Commit as `chore: sync registry and feed numbers`, push. If the branch has no open pull
   request, open one (ready, not draft, Conventional Commit title). Do not watch it.

Reply in at most three lines: the branch, which numbers changed (old → new, with the page), and
the PR link. Nothing else.

Why it exists: a post merged ahead of another takes the next free feed number, and the one
behind it carries a number already spoken into a recording or pasted somewhere. Running the sync
and the number check together, on the branch that fell behind, is the entire fix, and the owner
should not have to type it out.

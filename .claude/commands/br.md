---
description: Do the task on a descriptive branch and open the PR correctly the first time, title and body set at creation.
---

Do the work described in `$ARGUMENTS` on a properly named branch and open its PR so that every
metadata check passes on the first run. This is the default workflow this repo already mandates —
this command exists because sessions keep ignoring it and developing on the auto-generated
`claude/<slug>` branch. If `$ARGUMENTS` is empty, apply this routine to the work already done in
this session: move any commits off the session branch onto a descriptive branch and open the PR
from there.

## 1. Branch first, before any code

- Create a descriptive branch off the latest `main`: a Conventional-Commit-style prefix plus a
  short kebab-case summary of the task (`feat/lighthouse-listing-filters`,
  `fix/feed-csrf-dedup`, `docs/brand-voice-lexicon`).
- Never develop on, commit to, or open a PR from the session's auto-generated `claude/<slug>`
  branch. If commits already exist there, move them: branch off `main` with the descriptive name,
  cherry-pick or rebase the commits onto it, and abandon the session branch.

## 2. Do the task

- Keep the change minimal and surgical — change only what the task requires.
- Never overwrite approved production design or copy without explicit owner approval.
- Regenerate what a post change requires in the same commit (`pnpm wiki:sync`, the full and TTS
  paste sheets) and never hand-edit a generated file. A change is not done until those match.
- Commit messages end with the session URL on its own line, per `CLAUDE.md`. Never put a model
  identifier in any repo artifact.

## 3. Verify locally before pushing

Run the checks CI runs, from `wiki-site/`: `pnpm wiki:spelling`, `pnpm wiki:banned-words`,
`pnpm wiki:app-address`, `pnpm wiki:validate`, `pnpm wiki:sync`, `pnpm wiki:check-numbers`,
`pnpm run typecheck` and `pnpm wiki:build`. Fix what they find. Do not push red.

## 4. Open the PR correctly the first time

Set the title and body **at creation** so no check goes red and needs re-triggering:

- Title: Conventional Commit (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `ci:`, `perf:`,
  `test:`, `build:`, `style:`, `revert:`).
- Body: say what changed and why, and `Closes #<issue>` for any issue it resolves.
- Open ready for review, never as a draft.

## 5. Merge is the owner's

Auto-merge is off in this repository, so every PR waits on a human merge. A post is `docs:`, a
correction or copy edit to a published post is `fix:`, and `feat:` is for the site's own machinery.
No `Parity Status:` line: this repository has no parity check.

## 6. Report and stop — no PR watching

Do not watch the PR (owner directive, 2026-09-26). Do not subscribe to its activity, do not schedule
a check-in, and do not wait for CI to finish. Watching fills the session with notices and check
lists, which brings on compaction sooner, and the owner sees the checks on their phone anyway. The
local checks in step 3 are what keep the PR from going red; that is why they are not optional.

Report once, right after opening, in one short summary: branch name, PR number, and what the
local checks showed. Plain language, no jargon, no pleasantries. When the owner wants to know where
open PRs stand, they run `/pr`.

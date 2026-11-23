---
description: Do the task on a descriptive branch and open the PR correctly the first time — title and body set at creation.
---

Do the work described in `$ARGUMENTS` on a properly named branch and open its PR with the title and
body set at creation. This is the default workflow this repo already mandates — this command exists
because sessions keep ignoring it and developing on the auto-generated `claude/<slug>` branch. If
`$ARGUMENTS` is empty, apply this routine to the work already done in this session: move any commits
off the session branch onto a descriptive branch and open the PR from there.

Adapted from `commands/br.md` in `chargingthefuture/agents`. What differs here: no parity line, no
semantic-title check, no drift gates, and auto-merge is off.

## 1. Branch first, before any edit

- Create a descriptive branch off the latest `main`, named `<type>/<short-description>`
  (`docs/post-slug`, `fix/feed-date-label`, `feat/rss-autodiscovery`).
- Never develop on, commit to, or open a PR from the session's auto-generated `claude/<slug>`
  branch. If commits already exist there, move them: branch off `main` with the descriptive name,
  cherry-pick or rebase the commits onto it, and abandon the session branch.

## 2. Do the task

- Keep the change minimal and surgical — change only what the task requires.
- A post carries its paste sheet entry and the regenerated files in the same PR, one post per PR,
  per `CLAUDE.md`. Never hand-edit a generated file; regenerate it.
- Dates come from the owner's clock (UTC-4), per `CLAUDE.md`.

## 3. Verify locally before pushing

Run the checks `wiki-validate.yml` runs, from `wiki-site/`: `pnpm wiki:spelling`,
`pnpm wiki:banned-words`, `pnpm wiki:app-address`, `pnpm wiki:validate`, `pnpm wiki:sync`,
`pnpm wiki:check-numbers`, `pnpm run typecheck` and `pnpm wiki:build`. Fix what they find. Do not
push red.

## 4. Open the PR correctly the first time

- Title: Conventional Commit. A post is `docs:`, a correction or copy edit to a published post is
  `fix:`, the site's own machinery is `feat:`.
- Body: what changed, in plain words. No `Parity Status:` line. Never quote the owner.
- Open ready for review, never as a draft. Auto-merge is off here; the PR waits on the owner's merge.

## 5. Report and stop — no PR watching

Do not watch the PR (owner directive, 2026-09-26). Do not subscribe to its activity, do not schedule
a check-in, and do not wait for CI to finish. The harness may subscribe on its own; unsubscribe
straight away.

Report once, right after opening: branch name, PR number, and what the local checks showed. Plain
language, no pleasantries. When the owner wants to know where open PRs stand, they run `/pr`.

---
description: Unblock open PRs — fix conflicts, fix failing checks, update branches, and drive each one to merge without being told twice.
---

Work the repository's open pull requests until they merge, without asking me to confirm each step.
`$ARGUMENTS` may name one or more PR numbers or a branch name; if it is empty, sweep every open PR
that is blocked, behind, conflicted, or failing checks. Too many PRs get opened by agents and then
abandoned, and nothing reaches the blog until it is on `main`. Opening a PR is the start of the job,
not the end. Do not report back with "the PR needs X"; do X.

Adapted from `.claude/commands/pr.md` in the product repository (`chargingthefuture/chargingthefuture`).
What differs here: no parity check, no semantic-title check, no drift gates, auto-merge is off, and
almost every PR is a post, whose conflicts are in generated files.

## 1. Take stock

List all open PRs with their `mergeable_state`, check status, and review state. For each one decide
what is in the way:

- `dirty`: merge conflicts against `main`. On a post PR these are `content/feed-numbers.json`,
  `articles.ts`, the three paste sheets, or all five at once, because every merged post moves them.
- `behind`: out of date with `main`.
- `blocked`: failing or pending checks.
- Waiting on owner review with green checks: nothing to fix; leave it, and say so.

Skip a PR only when it is a draft someone is actively working, or it sits green and waiting on the
owner. Everything else gets worked.

## 2. Fix conflicts

A post PR that conflicts is behind on the registry, and `/s <number>` is the fix: merge `main`, take
`main`'s `feed-numbers.json` and hand-written `QUORA_PASTE_SHEET.txt`, commit the merge, set the
post's `date` to today's Eastern date, run the sync, put the post's sheet entry back where `/feed`
shows it with the number the sync gave it, regenerate the full and TTS sheets, run the checks, push.
Never resolve a generated file by hand and never edit `feed-numbers.json` by hand.

Any other conflict is resolved by understanding both sides. If both sides changed the same wording
and picking one loses the other, stop on that PR, say what each side does, and work the rest.

## 3. Fix failing checks

Read the failing step's log, and only that. Then:

- Front matter, spelling, banned words, paste sheet numbers or order, invites back to back, build:
  fix it on the branch, run the same check locally until it passes, push.
- Environmental (runner lost, rate limit): re-run once. Do not push commits to paper over it, and
  say which failures were environmental.

## 4. One post per PR, and stacked PRs

A PR carries one post (owner directive, 2026-09-25). When an agent stacked several posts into one
PR, or branched one PR off another so the second carries the first's post too, say so in the
summary and name the merge order. Do not split a PR the owner has already merged another PR into;
that stack is the owner's decision.

Sibling post PRs cannot all be synced in one pass: each would take the same next feed number, and
each merge moves the numbers the rest need. Sync the one nearest to merging, say which, and run
`/pr` again after it merges. The owner merges; auto-merge is off in this repository, so never
enable it and never merge without being told to.

## 5. Address review comments

Verify each unresolved review comment against the post or the code. Fix the real ones and reply
once, briefly, on any that does not hold. Do not leave a comment unanswered.

## 6. Know when a PR is dead

If a PR is superseded (its post or change already landed another way) or its branch is beyond
saving, say so and recommend closing it, with the reason, instead of pouring commits into it. Do
not close someone else's PR without saying so in the summary.

## 7. One pass, then stop

This command is one pass, not a watch (owner directive, 2026-09-26). Do not subscribe to PR
activity, do not schedule check-ins, and do not wait for checks you just triggered to finish.

## 8. Report back

One short summary as a table: what merged, what is green and waiting on the owner, what you fixed
and how, what was environmental, and anything stuck with the exact reason. Plain language, no
pleasantries. Commit messages end with the session URL on its own line, per `CLAUDE.md`. Never put
a model identifier in any repo artifact.

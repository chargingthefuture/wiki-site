# Commit Workflow (Low-Friction)

This guide keeps commit messages standardized with minimal typing.

## 1) One-time setup

Run from repository root:

```bash
git config commit.template .gitmessage.txt
git config pull.rebase false
```

This opens a pre-filled template whenever you run `git commit` without `-m`.

## 2) Recommended daily flow

1. Make small focused commits (message can be short but formatted).
2. Run quick local checks before commit:
  - `pnpm run format:check`
  - `pnpm run filesize:check`
2. Open a pull request with semantic title, for example:
   - `feat(chat): add thread summary command`
   - `fix(mobile): handle offline reconnect`
3. Use **Squash and merge** so final history is clean even with many incremental commits.

## 3) Required CI checks

- PR title must be semantic (`PR Title Semantic` workflow).
- Parity status line must be present in PR description:
  - `Parity Status: web+android complete`
  - or `Parity Ticket: <issue-or-link>`

## 4) Why this works well on a Chromebook

- No heavy local commit tooling required.
- Most standardization happens via lightweight template + CI validation.
- You can commit frequently while keeping merge history clean.

# Mockups Submodule Sync Runbook

This project tracks design mockups as a Git submodule at:

- `design/mockups`
- Source repo: `https://github.com/chargingthefuture/mockups`
- Source branch: `master`

## One-Time Setup

If the submodule is already added, skip to "Future Updates".

```bash
git submodule add https://github.com/chargingthefuture/mockups.git design/mockups
git submodule update --init --recursive
```

## Future Updates (Most Common)

Run this from the root of this repository:

```bash
git submodule update --remote --merge
```

Then commit the updated submodule pointer in this repo:

```bash
git add design/mockups .gitmodules
git commit -m "chore(design): update mockups submodule"
```

## Verify It Worked

```bash
git submodule status
cd design/mockups && git log --oneline -n 5
```

## Common Gotchas

1. You are not at repo root:

```bash
pwd
git rev-parse --show-toplevel
```

2. Submodule has local edits and cannot fast-forward:

```bash
cd design/mockups
git status
# commit or discard changes in submodule, then retry
```

If this repo should treat `design/mockups` as reference-only (no local edits kept), run:

```bash
git -C design/mockups restore --staged --worktree .
git -C design/mockups clean -fd
git status --short
```

Expected result: `design/mockups` no longer shows `modified content` in the parent repo.

3. Teammate freshly cloned the main repo and submodule is empty:

```bash
git submodule update --init --recursive
```

## Optional: Pull Explicit Branch

If you want to explicitly track `master` during update:

```bash
git submodule update --remote --merge -- design/mockups
```

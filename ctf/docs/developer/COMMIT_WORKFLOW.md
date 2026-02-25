# Commit Workflow (Low-Friction)

Use the interactive prompt to create consistent commit messages quickly, especially in Codespaces or low-end machines.

## 1) One-time setup

Run from repository root:

```bash
pnpm install
```

Optional (recommended if you hit pull strategy warnings):

```bash
git config pull.rebase false
```

## 2) Recommended daily flow

1. Make a small, focused change.
2. Stage files (`git add ...`).
3. Run:

```bash
pnpm commit
```

4. Answer the repo custom prompt script fields:

- `type`: choose the change kind by number or name (`feat`, `fix`, `docs`, etc.)
- `summary`: short, clear description (required)
- `confirm`: press Enter to create the commit by default, or type `n` to cancel

5. Open a pull request with a semantic title, for example:

- `feat(chat): add thread summary command`
- `fix(mobile): handle offline reconnect`

6. Use **Squash and merge** so history stays clean even with frequent incremental commits.

## 3) Required CI checks

- PR title must be semantic (`PR Title Semantic` workflow).
- Modularity/complexity governance must pass (`Modularity and Complexity Governance` in rewrite CI).
- Parity status line must be present in PR description:
  - `Parity Status: web+android complete`
  - or `Parity Ticket: <issue-or-link>`

## 4) Why this works for lightweight environments

- Prompted commit flow reduces typing and formatting mistakes.
- No custom local hooks are required to write valid semantic commits.
- Works well with frequent small commits plus squash merge at PR time.

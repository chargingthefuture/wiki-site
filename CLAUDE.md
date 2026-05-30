# CLAUDE.md

Repo: `chargingthefuture/wiki-site`. Public-facing blog/wiki site. App lives in [wiki-site/](wiki-site/) (pnpm workspace).

## Agent Communication Rules (always apply)

Full rules: [.github/instructions/098-agent-communication-rules.mdc](.github/instructions/098-agent-communication-rules.mdc). Summary:

- Communicate as a system agent, not a human. No greetings, pleasantries, hedging, or "I will now…" preamble. No TL;DR.
- Maximally concise. Lead with facts/actions. Structured formats (lists, tables, code blocks) over prose.
- Combine related info into one message; avoid multi-step back-and-forth unless necessary.

## Architecture (publishing pipeline)

- Content source of truth: GitHub Wiki repo `chargingthefuture.wiki.git` (submodule at `wiki/`). Blog fetches wiki markdown live at render time — editing a wiki page updates the site without a rebuild.
- Article registry: `wiki-site/content-index.yaml` (canonical). Synced into `wiki-site/artifacts/wiki/src/lib/articles.ts` via `pnpm wiki:sync`. A post appears on the blog only after a `content-index.yaml` entry exists, is synced, committed, and pushed.
- Deploy: push to `main` touching `wiki-site/**` → `.github/workflows/deploy-wiki-gh-pages.yml` builds and deploys to GitHub Pages at base path `/chargingthefuture/`.
- CI (no publish): `.github/workflows/wiki-validate.yml` on `main` pushes and PRs.

## Commands (run from `wiki-site/`)

| Command | Action |
|---|---|
| `pnpm wiki:validate` | Validate `content-index.yaml` |
| `pnpm wiki:sync` | Regenerate `articles.ts` from the index |
| `pnpm wiki:sync:dry` | Preview sync changes |
| `pnpm wiki:preview` | Local dev server (http://localhost:5000) |
| `pnpm wiki:build` | Build (base `/`) |
| `pnpm wiki:build:pages` | GitHub Pages build (base `/chargingthefuture/` + 404.html) |

Full operator runbook: [wiki-site/PUBLISHING.md](wiki-site/PUBLISHING.md).

## Git Branch and PR Naming (always apply)

- Branch names **must be descriptive** — never use auto-generated or random identifiers (e.g. `claude/gifted-archimedes-oHMEA`).
- Use the pattern `<type>/<short-description>`, e.g. `fix/blog-dates-et-label`, `feat/category-filter`, `ci/submodule-checkout`.
- PR titles must match: concise, action-oriented, no random strings.
- If a branch was created with a bad name, rename it before opening the PR: create a new descriptive branch from the same commits, open the PR from that, close the old one, delete the old branch.

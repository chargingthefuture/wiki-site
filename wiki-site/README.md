# Charging The Future — Wiki Site

[![Validate & Build](https://github.com/chargingthefuture/wiki-site/actions/workflows/wiki-validate.yml/badge.svg?branch=main)](https://github.com/chargingthefuture/wiki-site/actions/workflows/wiki-validate.yml)
[![Deploy to GitHub Pages](https://github.com/chargingthefuture/wiki-site/actions/workflows/deploy-wiki-gh-pages.yml/badge.svg?branch=main)](https://github.com/chargingthefuture/wiki-site/actions/workflows/deploy-wiki-gh-pages.yml)

Public-facing blog and wiki for [Charging The Future](https://chargingthefuture.com).

**Live site:** https://chargingthefuture.github.io/chargingthefuture/

---

## Architecture

| Layer | What it is |
|---|---|
| **Content source** | GitHub Wiki repo [`chargingthefuture.wiki.git`](https://github.com/chargingthefuture/chargingthefuture/wiki) — markdown fetched live at render time |
| **Article registry** | `wiki-site/content-index.yaml` — canonical list of published articles |
| **Generated registry** | `artifacts/wiki/src/lib/articles.ts` — synced from `content-index.yaml` via `pnpm wiki:sync` |
| **Frontend** | React + Vite app in `artifacts/wiki/` |
| **Deploy** | Push to `main` touching `wiki-site/**` → GitHub Pages at `/chargingthefuture/` |

Editing a wiki page updates the live site immediately (no rebuild needed). Adding a new article requires a `content-index.yaml` entry, a sync, and a push to `main`.

---

## Setup

All commands run from the `wiki-site/` directory.

```bash
# Install dependencies (requires pnpm)
pnpm install
```

---

## Commands

| Command | Action |
|---|---|
| `pnpm wiki:validate` | Validate `content-index.yaml` (metadata, duplicates, dates) |
| `pnpm wiki:sync:dry` | Preview what `articles.ts` would change (no writes) |
| `pnpm wiki:sync` | Regenerate `articles.ts` from `content-index.yaml` |
| `pnpm wiki:preview` | Local dev server at http://localhost:5000 |
| `pnpm wiki:build` | Production build (base `/`) |
| `pnpm wiki:build:pages` | GitHub Pages build (base `/chargingthefuture/` + `404.html`) |
| `pnpm typecheck` | TypeScript typecheck across all workspace packages |

---

## Publishing

A post goes live only after its `content-index.yaml` entry is synced, committed, and pushed to `main`.

**Quick single post:**

1. Write/edit the page in the [GitHub Wiki](https://github.com/chargingthefuture/chargingthefuture/wiki).
2. Add an entry to `content-index.yaml`:
   ```yaml
   - slug: "My-Page-Title"
     title: "My Page Title"
     repo: "chargingthefuture/chargingthefuture"
     date: "2026-05-30"
     excerpt: "Short description (60–160 chars)."
     category: "Updates"
   ```
3. Validate, sync, preview:
   ```bash
   pnpm wiki:validate
   pnpm wiki:sync
   pnpm wiki:preview
   ```
4. Commit `content-index.yaml` + `artifacts/wiki/src/lib/articles.ts` and push to `main`.

**Automated product updates** are generated and published by the `generate-product-update.yml` workflow in the product repo — no manual step required.

Full operator runbook (batch imports, Quora/Discourse converters, rollback, media handling): **[PUBLISHING.md](PUBLISHING.md)**

---

## Deploy

Pushing to `main` with changes under `wiki-site/**` triggers `.github/workflows/deploy-wiki-gh-pages.yml`, which builds and deploys to GitHub Pages automatically.

**One-time GitHub Pages setup:**
1. Repository Settings → Pages
2. Under *Build and deployment*, set *Source* to **GitHub Actions**

---

## CI

Two workflows run on `main` and on PRs touching `wiki-site/**`:

| Workflow | What it checks |
|---|---|
| `wiki-validate.yml` | Content validation, sync consistency, typecheck, build |
| `deploy-wiki-gh-pages.yml` | Builds and deploys (on `main` only) |

---

## Workspace layout

```
wiki-site/
├── content-index.yaml          # Article registry (source of truth)
├── artifacts/
│   └── wiki/                   # React/Vite frontend
│       └── src/
│           └── lib/articles.ts # Generated from content-index.yaml
├── scripts/                    # validate, sync, convert tools
└── wiki/                       # Git submodule → chargingthefuture.wiki.git
```

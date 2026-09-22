# Charging The Future — Wiki Site

[![Validate & Build](https://github.com/chargingthefuture/wiki-site/actions/workflows/wiki-validate.yml/badge.svg?branch=main)](https://github.com/chargingthefuture/wiki-site/actions/workflows/wiki-validate.yml)
[![Deploy to GitHub Pages](https://github.com/chargingthefuture/wiki-site/actions/workflows/deploy-wiki-gh-pages.yml/badge.svg?branch=main)](https://github.com/chargingthefuture/wiki-site/actions/workflows/deploy-wiki-gh-pages.yml)

Public-facing blog and wiki for [Charging The Future](https://chargingthefuture.com).

Live site: https://chargingthefuture.github.io/chargingthefuture/

The writing rules — voice, vocabulary, dating, crediting people, the sign-up block, the paste
sheets — live in [`../CLAUDE.md`](../CLAUDE.md). Read it before editing a post.

---

## Architecture

| Layer | What it is |
|---|---|
| Content source | Markdown with YAML front matter under [`content/`](content/), organized in collections (`posts/`, `product-updates/`, `guides/`, `insights/`, `member-of-the-day/`, `archive/`). Bundled at build time. Schema: [`content/README.md`](content/README.md). |
| Article registry | `artifacts/wiki/src/lib/articles.ts`, generated from the front matter by `pnpm wiki:sync` and committed. There is no separate index file. |
| Fireside comments | `artifacts/wiki/src/lib/fireside-exports.ts`, the comments the app has cleared for publication, copied in by `pnpm fireside:sync` and committed after a person reads the diff. The live conversation is fetched from the app after the page loads. |
| Build outputs | `artifacts/wiki/public/feed.xml` (RSS), `invites.json` (invite cards), `pb2-messages.json` (Peace Battle 2 share messages). Written by the build scripts, gitignored, never hand-edited. |
| Frontend | React + Vite app in `artifacts/wiki/` |
| Counter | `artifacts/api-server/`, the view/read counter. Runs on Railway, separately from the static site. See its [README](artifacts/api-server/README.md). |
| Deploy | Push to `main` touching `wiki-site/**` builds, deploys to GitHub Pages at `/chargingthefuture/`, then submits the changed pages to the Wayback Machine. |

Migrated pages keep their original wiki slug and repo namespace in front matter so pre-migration
URLs stay stable. Do not change `slug` or `repo` on a migrated file.

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
| `pnpm wiki:validate` | Validate front matter across `content/` (metadata, duplicates, dates) |
| `pnpm wiki:spelling` | Fail on any British spelling (runs in CI) |
| `pnpm wiki:sync:dry` | Preview what `articles.ts` would change (no writes) |
| `pnpm wiki:sync` | Regenerate `articles.ts` from the front matter |
| `pnpm wiki:feed` | Regenerate the RSS feed |
| `pnpm wiki:invites` | Regenerate the invite cards |
| `pnpm wiki:pb2` | Regenerate the Peace Battle 2 share messages from `content/pb2-share-messages.yaml` |
| `pnpm wiki:paste-full` | Regenerate `QUORA_PASTE_SHEET_FULL.txt` from the posts |
| `pnpm fireside:sync` | Copy the cleared Fireside comments into `fireside-exports.ts` |
| `pnpm fireside:sync:dry` | Preview that copy without writing |
| `pnpm wiki:convert:discourse` / `pnpm wiki:convert:quora` | Convert an export into archive entries |
| `pnpm wiki:preview` | Local dev server at http://localhost:5000 |
| `pnpm wiki:build` | Production build (base `/`); runs the feed, invites, and share-message builds first |
| `pnpm wiki:build:pages` | GitHub Pages build (base `/chargingthefuture/` + `404.html`) |
| `pnpm typecheck` | TypeScript typecheck across all workspace packages |
| `pnpm counter:dev` / `pnpm counter:build` | Run or build the counter service |

---

## Publishing

A post goes live once its markdown file and the regenerated `articles.ts` are merged to `main`.

1. Write the page as a markdown file in the right collection under [`content/`](content/), with
   the front matter that collection's schema asks for. The date is the owner's day, UTC-4, not the
   container's clock.
2. Validate, check spelling, sync, preview:
   ```bash
   pnpm wiki:validate
   pnpm wiki:spelling
   pnpm wiki:sync
   pnpm wiki:preview
   ```
3. Add the post's entry to `QUORA_PASTE_SHEET.txt` (hand-written summary plus a `Full post:` line)
   and regenerate `QUORA_PASTE_SHEET_FULL.txt` with `pnpm wiki:paste-full`.
4. Commit the post, `articles.ts`, and both paste sheets on a descriptive branch and open a pull
   request. Auto-merge is off in this repository, so the PR waits on a human merge.

Weekly product updates are written into `content/product-updates/` by the
`generate-product-update.yml` workflow in the product repo; no manual step is needed.

Full operator runbook (batch imports, Quora/Discourse converters, rollback, media handling):
[PUBLISHING.md](PUBLISHING.md).

---

## Deploy

Pushing to `main` with changes under `wiki-site/**` triggers `.github/workflows/deploy-wiki-gh-pages.yml`,
which builds, deploys to GitHub Pages, and then submits the changed content files to the Wayback
Machine (best effort). `wayback-backfill.yml` re-submits chosen files by hand.

One-time GitHub Pages setup:
1. Repository Settings → Pages
2. Under *Build and deployment*, set *Source* to GitHub Actions

---

## CI

| Workflow | Runs on | What it checks |
|---|---|---|
| `wiki-validate.yml` | PRs, and pushes to `main`, touching `wiki-site/**` | US spelling, front matter validation, article sync, typecheck, counter build, site build. No publish. |
| `deploy-wiki-gh-pages.yml` | Pushes to `main` touching `wiki-site/**` | Builds, deploys to GitHub Pages, submits changed pages to the Wayback Machine. |
| `wayback-backfill.yml` | Manual | Re-submits the given content files to the Wayback Machine. |

There is no semantic-title check and no parity check here. Use a Conventional Commit PR title
anyway (`docs:` for a post, `fix:` for a correction, `feat:` for the site's own machinery).

---

## Workspace layout

```
wiki-site/
├── content/                    # Posts and images, by collection (source of truth)
│   ├── README.md               # Front matter schema
│   └── pb2-share-messages.yaml # Hand-written share messages for Peace Battle 2
├── artifacts/
│   ├── wiki/                   # React/Vite frontend
│   │   ├── public/             # feed.xml, invites.json, pb2-messages.json (build output)
│   │   └── src/lib/articles.ts # Generated from the front matter
│   └── api-server/             # View/read counter (Railway)
├── scripts/                    # validate, sync, feed, invites, converters, paste sheet
├── PUBLISHING.md               # Operator runbook
├── QUORA_PASTE_SHEET.txt       # One hand-written summary per published page
└── QUORA_PASTE_SHEET_FULL.txt  # Full text of each post, generated
```

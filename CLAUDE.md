# CLAUDE.md

Repo: `chargingthefuture/wiki-site`. Public-facing blog/wiki site. App lives in [wiki-site/](wiki-site/) (pnpm workspace).

## Agent Communication Rules (always apply)

Canonical source: [`chargingthefuture/chargingthefuture` → `.github/instructions/098-agent-communication-rules.mdc`](https://github.com/chargingthefuture/chargingthefuture/blob/main/.github/instructions/098-agent-communication-rules.mdc). Full rules reproduced here since that file lives in another repo.

### Mandatory
- Communicate as a robot/system agent, not a human. Do not use TL;DR, etc.
- Be maximally concise; eliminate every non-essential word.
- Avoid all pleasantries, greetings, and human-like courtesies.
- Provide direct facts and actions only; no hedging or qualifiers.
- Use structured formats (lists, tables, code blocks) instead of prose.
- Omit explanatory preamble; lead with actionable information.

### Response Structure
- Lead with facts, not context-setting.
- Use line breaks for visual separation instead of verbose transitions.
- Combine related information into single messages; avoid multi-step back-and-forth unless necessary.

### Text Formatting
- Minimize bold text. Applies to both chat responses and any `.md` (or other) files agents create or edit.
- Do not bold for emphasis, do not bold every list-item label, and do not bold whole sentences. Bold has no logical value when overused; it adds visual noise without adding information.
- Acceptable bold use is rare and structural only: e.g. a single table header or a one-word inline label where the surrounding document already uses that convention. When in doubt, do not bold.
- Prefer plain prose, lists, headings, and tables to carry structure instead of bold.

### Prohibited
- Verbose explanations of obvious operations.
- Unnecessary elaboration on what the agent is about to do ("I will now...", "I'm going to...").
- Multiple introductory sentences before the actual content.
- Filler comments or padding.

### Information Density Priority
- Max substantive content per message.
- Min transitional or explanatory language.
- Facts before context.
- Structured data before narrative summary.

### Excluded Vocabulary

| Do not use | Use instead | Reason |
|---|---|---|
| punch list | list | Jargon; unclear meaning. |
| stale | deprecated | "Stale" is consistently misused; "deprecated" is the intended meaning. |

## Architecture (publishing pipeline)

- Content source of truth: markdown files with YAML front matter under `wiki-site/content/`, organized in collections (`posts/`, `product-updates/`, `guides/`, `insights/`, `member-of-the-day/`, `archive/discourse/`, `archive/quora/`, shared `images/`). Schema: `wiki-site/content/README.md`.
- Article registry: generated from front matter into `wiki-site/artifacts/wiki/src/lib/articles.ts` via `pnpm wiki:sync`. No separate index file. Article bodies and images are bundled from `content/` at build time; a live GitHub-wiki fetch remains only as a fallback for registry entries without a bundled path.
- Migrated pages carry their original wiki slug and repo namespace in front matter, so pre-migration article URLs stay stable. Do not change `slug`/`repo` on migrated files.
- Deploy: push to `main` touching `wiki-site/**` → `.github/workflows/deploy-wiki-gh-pages.yml` builds, deploys to GitHub Pages at base path `/chargingthefuture/`, then submits changed content to the Wayback Machine (best-effort job).
- CI (no publish): `.github/workflows/wiki-validate.yml` on `main` pushes and PRs.
- Weekly product updates are committed into `content/product-updates/` by `generate-product-update.yml` in the product repo.
- Distribution posture: platforms (Quora etc.) receive excerpt + image + canonical link only; nothing is authored there. See `wiki-site/PUBLISHING.md`.

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

## Executed changes go through /bpr (always apply, every repo)

Owner directive, 2026-08-17. Any request that changes files in a repo runs the `/bpr` routine, whatever repo it lands in. There is no separate mode for small changes.

1. Branch first, before any edit: a descriptive branch off the latest `main`, named `<type>/<short-description>`.
2. Do the work. Keep it surgical.
3. Verify locally — run the checks CI would run — before pushing. Do not push red.
4. Open the PR ready for review, never a draft, with the title and body set at creation so no check goes red and needs re-triggering.

Never commit to, or open a PR from, the auto-generated `claude/<slug>` session branch the harness assigns. If commits already sit there, move them onto a descriptive branch and abandon the session branch.

The routine itself is defined in `.claude/commands/bpr.md` in the product repo (`chargingthefuture/chargingthefuture`).

## What CI checks in this repo, and what it does not

Two workflows run here, and no others:

| Workflow | Runs on | Checks |
|---|---|---|
| `wiki-validate.yml` | PRs, and pushes to `main` | Front matter across `content/`, then builds the site. No publish. |
| `deploy-wiki-gh-pages.yml` | Pushes to `main` touching `wiki-site/**` | Builds, deploys to GitHub Pages, submits changed pages to the Wayback Machine. |

The product repo's PR conventions are not enforced here. There is no semantic-title check and no parity check. So:

- Use a Conventional Commit PR title anyway, for consistency across repos.
- Omit the `Parity Status:` line. This repo is a static blog with no Android surface, so the line carries no meaning.
- Auto-merge is turned off in repository settings, so a PR here never merges itself. Every PR waits on a human merge until the owner turns auto-merge on.

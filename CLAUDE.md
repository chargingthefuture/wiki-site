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

## Stats Vocabulary in Posts (always apply — owner directives, 2026-08-18)

This is not a typical app, and agents keep framing its numbers the way a typical app would. That framing is wrong here every time. When writing or editing posts:

| Term | Meaning | Source screen |
|---|---|---|
| Signed up / approved members | People who created their own account and were approved. The only number the 384 goal measures. Use "sign-ups" only when literally meaning this. | Unlock admin |
| Recruited | People the owner researched individually — skills stated in their own words in public — and placed on the skills map with a community-generated directory profile (claimable; deletable on request; nobody has asked, and some were outraged at the suggestion). Capacity math runs on this number. | Workforce |
| Community Value Index | Value actually exchanged and settled in the community, cumulative (since 2026-06-12). A relative index in the spirit of GDP. Never money, a price, or an exchange/redemption value. | Skills Economy — Live |
| Value waiting to happen / GDP Projected | What the open posts on the board would add if every one closed. Most posts never close: interest, not achievement. Not part of the Community Value Index, and not money. | Skills Economy — Live |

Rules that go with the table:

- Never conflate signed-up and recruited. The gap between them is not people who declined — this community is in trauma, and engagement does not always look like signing up for another app.
- Never frame low or zero figures with an underselling litany ("nothing has closed yet — not one job, not one ride"). A lot of work and activity happens that those figures do not capture. State a figure factually, the way the app's own screens do, and move on.
- Never state or imply the owner reported their situation to any body. They have never reported to anyone; that fact is itself the under-reporting argument.
- Progress posts follow a fixed shape with these definitions (first instance: the-manifesto-seven-months-later.md) so any two are comparable.

## Capitalizing Targeted Individual (owner directive, 2026-08-18)

Write it Targeted Individual, capitalized, every time — singular or plural, and Targeted
Individuals (TIs) on first use when the abbreviation follows. Never "targeted individual" in
lower case. This matches the Dictionary entry, the manifesto, and the rest of `posts/`. Survivors
remains the default word for the people here; Targeted Individual is the bridge term, and when it
appears it takes this form.

Archive entries keep whatever the original writing used — they are historical record, not current
copy.

## Snapshots vs Living Pages (owner decision, 2026-08-18)

Two kinds of pages live in `posts/`, and they age differently:

- Snapshot posts — arguments, announcements, progress posts. Frozen once published: never update
  their numbers or wording (a dated record proves what was claimed and when). The manifesto and
  the progress-post series are snapshots.
- Living pages — standing references, kept current by editing in place. Currently two:
  `old-links-new-links.md` and `Dictionary.md`. On every real update, bump the `date` field —
  that moves the page to the top of the feed, which is how readers learn it changed — and, on
  Dictionary, add a dated line to its "Latest changes" section (newest first). Each living page
  opens with the same header line: "This is a living page. It is kept current, and its date
  moves it to the top of the feed whenever it changes. Every change is on the public record in
  the repository's history." The git history is the changelog; never silently rewrite one.

When a term changes anywhere (product names, stats vocabulary, capability list), Dictionary is
the page that changes — do not scatter definitions across new posts. Dated posts may still
define terms in context; Dictionary is where the current version lives.

## Sign-Up Line in Posts (owner decision, 2026-08-18)

Readers ask where to sign up; consumer apps need it explicit. Every post that invites participation ends with this exact block, verbatim, as the final paragraph — once per post, never in the body, never varied:

> To sign up: https://chargingthefuture.com. It is free, invite-only, and you can use one part of it and ignore the rest.

The landing page, not the direct app URL: it explains before asking, and it still works (waitlist) when the app is offline. The sameness is the anti-salesy mechanism — a fixed block reads as documentation, a varied pitch reads as pressure. Archive entries, reference pages, and product updates do not carry it.

## Agent Slash Commands (always apply, every repo)

Owner directive, 2026-08-17. Three routines are defined in `.claude/commands/` in the product repo (`chargingthefuture/chargingthefuture`). Each is the standing way to do its kind of work, and the owner does not have to type the slash command for it to apply — the request itself is the trigger. Two of the three apply here.

### /bpr — every executed change

Any request that changes files runs this routine, whatever repo it lands in. There is no separate mode for small changes.

1. Branch first, before any edit: a descriptive branch off the latest `main`, named `<type>/<short-description>`.
2. Do the work. Keep it surgical.
3. Verify locally — run the checks CI would run — before pushing. Do not push red.
4. Open the PR ready for review, never a draft, with the title and body set at creation so no check goes red and needs re-triggering.

Never commit to, or open a PR from, the auto-generated `claude/<slug>` session branch the harness assigns. If commits already sit there, move them onto a descriptive branch and abandon the session branch.

### /pr — opening a PR is the start of the job, not the end

Agents open pull requests and abandon them. A PR left alone is work that never shipped, and in this repo that matters more than usual: nothing reaches the blog until it is on `main`, and auto-merge is off, so a PR sits until someone acts. Sweep every open PR that is blocked, behind, conflicted, or failing checks, and drive each one to merge — resolve conflicts by understanding both sides, read the actual failure log before touching anything, bring behind branches up to date. Do not report that a PR needs something; do it. Leave alone only a draft someone is actively working, or a PR sitting green and waiting on the owner's review, and say which those are.

### /cr — product repo only

Working open code-review findings. The code-review issues and their labels live in the product repo, so the routine does not apply here.

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

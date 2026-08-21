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
| `pnpm wiki:spelling` | Fail on any British spelling outside `content/archive/` |
| `pnpm wiki:sync` | Regenerate `articles.ts` from the index |
| `pnpm wiki:sync:dry` | Preview sync changes |
| `pnpm wiki:preview` | Local dev server (http://localhost:5000) |
| `pnpm wiki:build` | Build (base `/`) |
| `pnpm wiki:build:pages` | GitHub Pages build (base `/chargingthefuture/` + 404.html) |

Full operator runbook: [wiki-site/PUBLISHING.md](wiki-site/PUBLISHING.md).

## US Spelling (enforced by CI)

The blog writes US English. `pnpm wiki:spelling` fails on any British spelling and runs in CI on
every pull request, because a British spelling passes front matter validation and the build
without complaint — nothing else in the pipeline knows the difference. The word list is copied
verbatim from `ctf/scripts/lib/us-spelling.mjs` in the product repository, whose own gate skips
wiki-site precisely because this is a separate repository; if that list changes, copy it across.

One rule deliberately differs. `grey` carries `wholeWord: true` here, because without it the rule
matches the carrier name Greyhound, and a company's name is not ours to respell. `grey` on its own
is still caught. The product repository's copy has the same latent problem and has simply never
written the word.

`content/archive/` is checked too. A British spelling in an archived post is a typo, and typos get
fixed here — the copy-edit passes over the archive have been doing exactly that.

What is never respelled is an archived title. Every file under `content/archive/` carries
`status: closed` — 153 of them do — and that is the point: the topic was closed at export and the
record is frozen as captured. A Quora title is also the thing the URL was minted from, so it is not
free-floating text. Leave the title and its slug exactly as exported, wrap them in
`spelling:disable` / `spelling:enable` with the reason, and correct the body around them.

Whose words they are is not what settles it. Quora is global, and a British spelling from another
writer is unremarkable there. It stays because the topic is closed and the title became an address,
not because of who typed it.

Everything else, including a URL on a page that is not a closed archive entry, gets fixed (owner
directive, 2026-08-20). A British spelling in a slug is still a typo, and breaking the link is
acceptable: Quora deleted the accounts those links were shared from, so the audience that held them
is gone and the project is starting over. When you change a slug, update every internal reference in
the same commit — `content/`, the paste sheet, and the archive index — or the referring pages 404.

A file that disables and never re-enables is itself a failure, so a region cannot quietly swallow
the rest of a file.

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

## This Is Not a Sign-Up Product (owner directive, 2026-08-20)

The app is an aid in coordination. It helps people find each other and arrange things between
themselves. It is not a nation state, not a serial number, not a tax tracker, not a scorekeeper,
and not a register of who counts. Every figure it shows exists to help someone decide what to do
next, never to rank people or to settle up with them.

Agents keep writing about this app the way they would write about a commercial one, where the
number that matters is sign-ups and every sentence works toward one. That framing is wrong here,
and it produces copy the owner has to reject.

- Do not advocate signing up as the goal, and do not build a post around driving people to it.
  The sign-up block at the end of a post is the whole of the ask; the body does not repeat it.
- Being on the skills map is something people ask for, not a lesser version of joining. Never
  present recruited as a consolation number next to signed-up, never call either one small, and
  never explain the gap between them.
- Most real help never touches the app and is never recorded in it. Three survivors have helped
  the owner directly and none of it was captured; all three are listed in the Directory. The
  Directory listing is what made them findable — the help itself happened between people. A figure
  that does not capture it is not a gap in the data, it is the shape of the thing.
- In the owner's words: real help is not an email in a database. Do not write copy that implies
  otherwise, and never inflate a figure or arrange a sentence so that it seems to.

The Directory is the ask, and it is not an account. It is the number one thing survivors want:
a findable list of people and what they can do. It launched on 2025-10-31 as exactly that — "a
running list of TIs listed alongside their talents", opt-in, one person at a time, with profiles
at a public address. Write about it as the thing itself, not as a feature waiting behind a login.

And the people on that list are doing rather than saying, which counts for more than a stated
position does. That is the distinction worth drawing in a post — not who has an account.

State a figure the way the app's own screens state it, then move on to what a reader can do.

## Capitalizing Targeted Individual (owner directive, 2026-08-18)

Write it Targeted Individual, capitalized, every time — singular or plural, and Targeted
Individuals (TIs) on first use when the abbreviation follows. Never "targeted individual" in
lower case. This matches the Dictionary entry, the manifesto, and the rest of `posts/`. Survivors
remains the default word for the people here; Targeted Individual is the bridge term, and when it
appears it takes this form.

Archive entries keep whatever the original writing used — they are historical record, not current
copy.

## Pagination, Never Endless Scroll (accessibility rule — owner directive, 2026-08-19)

This is an accessibility rule, not a preference. Endless scroll traps keyboard and screen-reader
users before the footer, gives no sense of position or length, and makes a place in a list
impossible to return to.

Any list that can grow — the feed, the home listing, an archive index, anything added later —
is paged. Never an endless scroll, and never a page that renders its whole collection at once.
Put the page number in the URL (`/feed?page=3`) so a page can be linked and the back button
works, show which range of how many is on screen, and clamp an out-of-range page number rather
than showing nothing.

The same rule is recorded for the app in the product repo, under Accessibility Rules in
`.claude/rules/100-product-context-and-experience-rules.mdc`.

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

## Quora Paste Sheet (owner directive, 2026-08-19)

`wiki-site/QUORA_PASTE_SHEET.txt` holds one Quora-ready summary per published page, with its
canonical link. Every summary is written fresh rather than copied from the page's teaser or
excerpt, so a paste is never identical to what the blog already shows — an account that gets
deleted and rebuilt can repost the same piece without the text matching a previous post.

Each entry ends with a `Full post: <url>` line, and the label is load-bearing: a bare URL alone on
its own line is what Quora's editor converts into a preview card, while a URL inside a sentence is
left as written. Paste the summary and that line together.

Publishing a post is not finished until that file carries the new page. Every publish does three
things: merge the post, add its entry to the paste sheet, and give the owner the Quora excerpt in
the reply.

## Link the Plugins a Post Names (owner decision, 2026-08-20)

Version 3 of the app launched in June 2026. Any post dated on or after 2026-06-01 that speaks
about a part of the app must link that part directly, plus its guide section. A post that names a
capability and makes the reader go find it costs readers — they search, do not find it, and leave.

Every such post ends with this section, placed immediately before the sign-up block:

```
## Where to find it in the app

- [ClickLog](https://app.chargingthefuture.com/apps/click-log) — [guide](https://app.chargingthefuture.com/guide#click-log)
```

One list item per part, in the order the post raises them. Link the part even when the post only
describes it rather than naming it — a post that mentions "a vetted ride" links TrustTransport,
because that is what the reader will go looking for.

URLs:

| Part | Address |
|---|---|
| Most plugins | `https://app.chargingthefuture.com/apps/<slug>` |
| Knowledge Library | `https://app.chargingthefuture.com/knowledge` |
| Unlock | `https://app.chargingthefuture.com/plugin/unlock` |
| Commons (the group chat) | `https://app.chargingthefuture.com` |

Every part has a guide section as of 2026-08-20 — all twenty-five: beacon, bug-reporting, chyme,
click-log, commons, contributions, directory, foundation, gdp, knowledge, level-up, lighthouse,
mood, mutual-time, peer-programming, recurring-activity, service-credits, skills-hunt,
skills-taxonomy, socket-relay, trust, trust-transport, unlock, what-works, workforce. The list is
generated from `ctf/packages/web/app/guide/guide-content.json` in the product repo — check it
rather than guessing, because a new part arrives before its section does. A part with no section
gets the plugin link alone; never invent an anchor, since a wrong one lands the reader on the
guide's top with no explanation.

Snapshot posts get the section too (owner decision, 2026-08-20). Adding links changes none of a
snapshot's numbers or wording, and its claims are exactly what makes a reader want to go check
the data — so the links belong there most. A snapshot's date does not move when they are added;
only living pages bump their date. The one page that stays untouched is the manifesto
(`The-Answer:-EXIT-THEIR-ECONOMY,-EXIT-THE-PSYOP.md`), which the owner froze outright.

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

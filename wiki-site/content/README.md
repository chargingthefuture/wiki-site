# Content — canonical authoring surface

Every post on the blog is a markdown file in this directory. This repo is the canon: full
history, first-class images, PR review, CI. Platforms (Quora and any surface after it) are
distribution only — a platform post is an excerpt plus a link back to the canonical page here.
Nothing is authored on a platform.

The article registry (`artifacts/wiki/src/lib/articles.ts`) is generated from the front matter
of these files by `pnpm wiki:sync`. There is no separate index file to edit.

## Collections

| Directory | Contents |
|---|---|
| `posts/` | Essays, announcements, community writing |
| `product-updates/` | Weekly product change posts (written by the `generate-product-update.yml` workflow in the product repo) |
| `guides/` | How-to guides, including per-plugin subfolders |
| `insights/` | Insight posts |
| `member-of-the-day/` | Member of the Day posts |
| `archive/discourse/` | Historical record: posts from the closed Discourse forum |
| `archive/quora/` | Historical record: copy-edited posts from erased Quora accounts |
| `images/` | Shared images, referenced from any post as `images/<file>` |

Collections keep the blog navigable: `posts/` is the blog proper, `product-updates/` is the
product changelog, and `archive/` is the historical record — related, but not the same thing.

A new screenshot or image is committed here next to the post that uses it. The blog renders it
from the repo; the same file is attached natively to any platform excerpt post.

## Front matter

Every file starts with a YAML block:

```yaml
---
title: "Plain-language title"
date: "2026-08-17"
excerpt: "One or two sentences, 60-160 characters, shown on the article card."
category: "Updates"
---
```

Optional fields:

| Field | Meaning |
|---|---|
| `slug` | URL slug. Defaults to the file path inside its collection, without `.md`. Migrated pages carry their original wiki slug here so existing links keep working. Omit for new posts. |
| `repo` | Legacy URL namespace (`chargingthefuture/chargingthefuture` or `chargingthefuture/mono`) kept so pre-migration article URLs stay stable. Omit for new posts. |
| `featured` | `true` to feature on the home page. |
| `listed` | `false` to keep a page out of the article grid (it stays reachable by URL). Default `true`. |
| `teaser` | The short standalone version of the post, aim for 280-500 characters. Shown on the feed page (`/feed`) and pasted as the platform post. It carries the post's whole point in 2-4 short sentences — a reader who never clicks through still got the idea. Not a cliffhanger. Posts without one fall back to `excerpt` on the feed. |
| `topics` | Free-form tag list for future filtering. |
| `archive` | Provenance block, required in `archive/` collections — see below. |

Categories in use: Foundation, Updates, Guides, Insights, Member of the Day, Platform,
Philosophy, Community, Security, Resources, Services, Events, Stories, Technical, Advocacy,
Discourse Community Legacy Post.

## Archive provenance

Files under `archive/` add an `archive` block recording where the content originally lived:

```yaml
archive:
  source: "quora"            # or "discourse"
  account: "pedigree101"     # the account that posted it
  original_url: "https://www.quora.com/..."   # original public URL, where one exists
  original_date: "2025-05-23"                 # when it was originally posted
  status: "erased"           # erased (account deleted) or closed (platform shut down)
  kind: "answer-comment"     # what it was on the platform
  space: "US-PSYOPS-TARGETED-INDIVIDUALS"     # the space it was written in
  question: "Why won't anyone help me?"       # the question it was written under
  removed: true              # taken down by the platform while the account still lived
  shared_to: ["Targeted Ideas"]               # other spaces the same piece was carried into
  screenshot: "images/qimg-fa8f49f0.png"      # a picture of the original page
  snapshot_url: "https://web.archive.org/web/..."
```

Everything below `status` is optional and feeds The Record (`/record`), which reads the Quora
archive oldest-first:

| Field | Meaning |
|---|---|
| `kind` | What the entry was where it was written: `answer`, `answer-comment`, `answer-draft`, `credential`, `post-comment`, `question`, `question-comment`, `space-post`, `space-submission`, `forum-topic`. The Record labels and filters on it. |
| `space` | The space it was written in, when that space was not the author's own. |
| `question` | The question title it was written under, where the export carries one. |
| `removed` | The platform took this one down while the account was still live — separate from the account-wide deletion that came later. |
| `shared_to` | Other spaces the same piece was submitted to. Set by the importer when it folds a duplicate submission into the entry it repeats. |
| `screenshot` | `images/<file>` — a picture of the original page, committed to `content/images/`, named with the person pictured and the date. Every original address in the Quora archive is dead, so the screenshot is the only way the page itself can still be looked at. Added one entry at a time. Requires `screenshot_alt`. |
| `screenshot_credit` | The visible credit under the picture: the name in plain text with the address written out, e.g. `Lorenzo (https://www.quora.com/profile/Lorenzo-896)`. The alt text survives deletion, but only a screen reader meets it — this line is what a sighted reader sees. Set it whenever the picture shows somebody else's words. |
| `screenshot_alt` | The pictured words, written out — who wrote them, under what question, and the full text. This is the credit rule applied to the archive: the alt text is the part that survives, keeping the words available to a screen reader and available at all once the image cannot be seen. Validation fails a screenshot without it. |
| `snapshot_url` | A saved copy of the original page, where one exists. Resolved once at import time and written here, because the site is static and cannot look it up when a reader opens the page. |

## Importing a Quora export

`pnpm --filter @workspace/scripts run import:quora-export -- --account=<slug> <export-dir>...`

Takes any number of export directories for one account and writes one file per entry into
`content/archive/quora/<account>/`, with images copied into `content/images/`. Raw exports are
never committed: they carry inbox messages, IP addresses and other people's names.

What it leaves out, and why:

- Inbox messages and the profile photo. Private, and not writing.
- Posts to the author's own space. Those are whole pieces and belong to the blog's own archive;
  The Record carries the writing that lived on other people's pages.
- Shares and submissions with no words of the author's own — a link pushed into a space is an
  act of distribution, not a piece of writing.
- Items with an empty body, which is most of the answer drafts.

It reports every one of those counts when it runs. A silent drop in an import of this size is
indistinguishable from a parsing fault.

Every entry it writes carries `listed: false`, without exception. The feed carries copy-edited
writing, and an import is raw export text — the copy-edit pass in the `chargingthefuture/quora`
repository is what promotes a piece to the feed, and it has not run on any of this. The entries
still have real addresses and still appear on The Record; they simply are not published writing
yet.

### Promoting an imported entry to the feed

There is one file per entry and both surfaces read it, so a copy edit updates The Record and the
feed together. There is nothing to copy, move, or keep in step.

1. Copy edit the entry in the `chargingthefuture/quora` repository, where the copy-edit pass and
   its review live.
2. Bring the edited text across into this file. The Record now shows the edited wording, because
   it reads this file and always did.
3. Add a `teaser`. The feed shows `teaser` and falls back to `excerpt`; an imported entry has no
   teaser, so without one the feed would show the first 190 characters of the answer rather than
   a short standalone version of it. This is the only field promotion adds.
4. Remove the `listed: false` line. The entry joins the feed, in date order, the way the 153
   Discourse archive entries already do.

Never do step 4 on its own. `listed: false` coming off a file that has not been through the
copy-edit pass is the one thing this arrangement exists to prevent. Nothing else changes: the file
stays in `content/archive/quora/`, keeps its slug and address, and keeps its place on The Record.

`date` in the main block stays the original posting date too, so the blog orders archive
entries by when they were actually written. The commit adding the file records when it entered
the repo.

Mapping from the quora repo's per-post header (used during import; the raw exports themselves
stay in the private `chargingthefuture/quora` repo):

| Quora repo header | Front matter |
|---|---|
| `Created:` | `archive.original_date` and `date` |
| `Question URL (derived):` | `archive.original_url` |
| account directory (e.g. `pedigree101/`) | `archive.account` |
| — | `archive.status: "erased"` |

Only the author's own words plus the question title and URL cross into this public repo.
Other people's comments and answers stay in the private quora repo.

## Publishing a post

1. Write the markdown file in the right collection, with front matter. Commit images next to it
   (`content/images/`).
2. `pnpm wiki:validate` — checks front matter across all content files.
3. `pnpm wiki:sync` — regenerates the article registry.
4. `pnpm wiki:preview` — check it renders.
5. Commit the content file plus the regenerated `articles.ts`, push to `main`. The Pages deploy
   publishes automatically.
6. For platform distribution: post an excerpt plus the canonical link (and the same image file)
   on the platform. See `PUBLISHING.md`.

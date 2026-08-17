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
```

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

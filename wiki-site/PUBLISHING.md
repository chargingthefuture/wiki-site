# Publishing Workflow — Charging The Future

This repo is the canon: every post is authored as a markdown file under `wiki-site/content/`,
with full git history. The blog is the reading surface. Platforms (Quora and any surface after
it) are distribution only — a platform post is an excerpt, an image, and a link back to the
canonical page. Platform accounts are disposable by design; when one is erased, nothing is lost
but that account's reach.

Collections and the front-matter schema: [content/README.md](content/README.md).

Run all `pnpm` commands from the `wiki-site/` directory.

---

## Publish from your phone (no computer needed)

1. Open github.com/chargingthefuture/wiki-site in the GitHub app or a mobile browser.
2. Navigate to `wiki-site/content/posts/` → Add file → Create new file. Name it
   `my-post-title.md` (the file name becomes the URL slug).
3. Paste the front matter, then the post body below it:

   ```yaml
   ---
   title: "My Post Title"
   date: "2026-08-17"
   excerpt: "A short, descriptive summary (aim for 60-160 chars)."
   category: "Community"
   ---
   ```

4. Commit directly to `main`. Done — CI regenerates the article registry, builds, deploys, and
   triggers the live blog rebuild. No local commands needed. The post is live at
   `https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/<file-name>` within a
   few minutes.
5. For an image: upload it to `wiki-site/content/images/` first (Add file → Upload files), then
   reference it in the post as `images/<file>.png`.
6. Grab the article URL and post the excerpt + link (+ the same image) on Quora.

If the live blog does not update (the `GH_PAT` secret is missing in this repo), run the
`Github Pages — Deploy Blog` workflow in the product repo by hand: Actions tab → select the
workflow → Run workflow.

## Write and publish a post

1. Create the markdown file in the right collection (usually `content/posts/`), with front
   matter:

   ```yaml
   ---
   title: "My Post Title"
   date: "2026-08-17"
   excerpt: "A short, descriptive summary (aim for 60-160 chars)."
   category: "Community"
   ---
   ```

   The file name becomes the URL slug. Commit screenshots to `content/images/` and reference
   them as `images/<file>.png` — they render on the blog and the same file is attached natively
   to any platform excerpt post.

2. Validate, sync, preview:

   ```bash
   pnpm wiki:validate
   pnpm wiki:sync
   pnpm wiki:preview      # http://localhost:5000
   ```

3. Commit the content file (plus images) and the regenerated
   `artifacts/wiki/src/lib/articles.ts`, push to `main`. The Pages deploy publishes
   automatically, then submits the changed pages to the Wayback Machine for third-party
   timestamped copies.

---

## Distribute to a platform (Quora posture)

After the post is live:

1. Write a short excerpt (a few sentences in your own words — not the full post).
2. Attach the same screenshot file committed with the post, if any.
3. Link the canonical page: `https://chargingthefuture.github.io/chargingthefuture/article/...`
4. Post from the current platform account.

Rules of the posture:

- Nothing is authored on a platform. If it is worth writing, it goes in the repo first.
- Keep platform volume low. Excerpt posts only.
- Treat every platform account as disposable. No content, history, or images live only there.
- Invitations: the app's existing invite flow is unchanged. Invitation posting on Quora
  continues, in a format the owner defines — the constraint to design around is the repetition
  signature (many per-person posts linking the same outside domain from one account), which is
  what platform filters remove accounts for.

---

## Automated product updates

Product updates are generated and published by the `generate-product-update.yml` workflow in the
product repo (`chargingthefuture/chargingthefuture`). On its schedule it:

1. Generates the update via the Anthropic API (key from Infisical).
2. Commits the markdown file to this repo's `content/product-updates/` with front matter, runs
   `wiki:sync`, and pushes — which triggers the deploy here.
3. Opens a `quora-draft` issue in the product repo with copy-paste excerpt for platform posting.

No manual step is required for these.

---

## Import archive material (erased Quora accounts)

Copy-editing of the raw exports happens in the private `chargingthefuture/quora` repo — one file
per post, with a provenance header. When an account's copy-edit is finished, import into
`content/archive/quora/<account>/`:

- One markdown file per post; front matter per [content/README.md](content/README.md) with the
  `archive` block (`source: "quora"`, `account`, `original_url`, `original_date`,
  `status: "erased"`).
- `date` = the original posting date, so the archive sorts by when things were written.
- Only the author's own words plus the question title and URL cross into this public repo.
  Other people's comments and answers stay in the private repo.

The converters (`pnpm wiki:convert:quora`, `pnpm wiki:convert:discourse`) can still help turn a
platform export into markdown; review their output and add front matter before committing.

---

## Commands

| Command | Action |
|---|---|
| `pnpm wiki:validate` | Validate front matter across `content/` |
| `pnpm wiki:sync` | Regenerate `articles.ts` from front matter |
| `pnpm wiki:sync:dry` | Preview sync changes |
| `pnpm wiki:preview` | Local dev server (http://localhost:5000) |
| `pnpm wiki:build` | Build (base `/`) |
| `pnpm wiki:build:pages` | GitHub Pages build (base `/chargingthefuture/` + 404.html) |

## History

Until 2026-08, content lived in the GitHub Wiki of the product repo (mirrored in the mono repo's
wiki) and was fetched live at render time, with a separate `content-index.yaml` registry. The
`migrate-wiki-to-content.ts` script performed the one-time move into `content/`; migrated pages
keep their original slugs and URL namespaces in front matter, so pre-migration article links
still resolve. The old wikis remain in place as inert mirrors but are no longer read by the
pipeline and receive no new content.

# Publishing Workflow — Charging The Future Wiki Blog

All blog posts are fetched live from the **GitHub Wiki** and declared in `content-index.yaml`.  
This document is the operator runbook for every publishing scenario.

---

## Quick-Add (Single Off-Hand Post)

1. Write or edit the page directly in [GitHub Wiki](https://github.com/chargingthefuture/chargingthefuture/wiki).  
   The URL slug (`My-Page-Title`) becomes the `slug` field.

2. Add an entry to `content-index.yaml`:
   ```yaml
   - slug: "My-Page-Title"
     title: "My Page Title"
     repo: "chargingthefuture/chargingthefuture"
     date: "2026-03-23"
     excerpt: "A short, descriptive summary (aim for 60-160 chars)."
     category: "Updates"
   ```

3. Validate, sync, and preview:
   ```bash
   pnpm blog:validate
   pnpm blog:sync
   pnpm blog:preview      # http://localhost:5000
   ```

4. Build and deploy:
   ```bash
   pnpm blog:build        # output → artifacts/blog/dist/public/
   ```

---

## Large Batch — Quora Export

1. Download your data from [quora.com/privacy/download_your_data](https://www.quora.com/privacy/download_your_data).
2. Unzip the archive:
   ```bash
   unzip quora-data-XXXXX.zip -d /tmp/quora-export
   ```
3. Run the converter (from `wiki-blog`):
   ```bash
   pnpm blog:convert:quora /tmp/quora-export /tmp/quora-md --category=Stories
   ```
   - If Quora gives you a single `answers.html` file, pass that directly:
     ```bash
     pnpm blog:convert:quora /tmp/quora-export/answers.html /tmp/quora-md
     ```
4. Review the generated `.md` files — fix slugs, clean up any formatting artefacts.
5. Push markdown files to GitHub Wiki:
   ```bash
   cp /tmp/quora-md/*.md /path/to/your/wiki-clone/
   cd /path/to/your/wiki-clone
   git add . && git commit -m "feat: add Quora answers" && git push
   ```
   *(See "Pushing to GitHub Wiki" section below.)*

6. Append the generated manifest into `content-index.yaml`:
   ```bash
   cat /tmp/quora-md/_manifest.yaml   # review entries first
   # Open content-index.yaml and paste the entries under the 'articles:' key
   ```

7. Validate, sync, preview:
   ```bash
   pnpm blog:validate
   pnpm blog:sync
   pnpm blog:preview
   ```

**Tips:**
- Set the correct date per answer in `_manifest.yaml` before copying — the converter infers it from HTML but it may be wrong.
- Quora slugs are auto-generated from question titles; check for near-duplicates.
- Category `Stories` is the right default for personal answers.

---

## Large Batch — Discourse Export

You have saved your Discourse pages as HTML files (browser save or export tool).

1. Put all `.html` files into a staging folder:
   ```bash
   mkdir /tmp/discourse-html
   # copy .html files there
   ```

2. Run the converter (from `wiki-blog`):
   ```bash
   pnpm blog:convert:discourse /tmp/discourse-html /tmp/discourse-md --category=Community
   ```

3. Review output — tables usually convert well; embedded images need manual fixing (see Media section below).

4. Push `.md` files to GitHub Wiki (see section below).

5. Paste `_manifest.yaml` entries into `content-index.yaml`, then:
   ```bash
   pnpm blog:validate
   pnpm blog:sync
   pnpm blog:preview
   ```

---

## Pushing Markdown Files to GitHub Wiki

The GitHub Wiki is a **separate git repository** from the main code.

```bash
# Clone the wiki (one-time setup)
git clone https://github.com/chargingthefuture/chargingthefuture.wiki.git ~/ctf-wiki
# — or for the mono wiki —
git clone https://github.com/chargingthefuture/mono.wiki.git ~/mono-wiki

# Copy your new .md files
cp /tmp/quora-md/*.md ~/ctf-wiki/    # or ~/mono-wiki/

# Commit and push
cd ~/ctf-wiki
git add .
git commit -m "chore: add batch import (Quora answers)"
git push
```

Pages are then available at:
`https://raw.githubusercontent.com/wiki/chargingthefuture/chargingthefuture/<slug>.md`

---

## Validate → Sync → Preview Pipeline

Always run these before deploying:

```bash
pnpm blog:validate        # fail-fast: checks metadata, duplicate slugs, dates
pnpm blog:sync:dry        # preview: shows what would change in articles.ts (no writes)
pnpm blog:sync            # apply: regenerates articles.ts from content-index.yaml
pnpm blog:preview         # local dev server at http://localhost:5000
```

---

## Deploy

```bash
pnpm blog:build           # produces static files in artifacts/blog/dist/public/
```

Deploy `artifacts/blog/dist/public/` to:
- **Railway**: configured in `railway.toml` — `railway up` from within `artifacts/blog/`.
- **GitHub Pages**: push `dist/public/` contents to the `gh-pages` branch, or configure the Pages deploy action.

---

## Rollback

| Scenario | Fix |
|----------|-----|
| Bad entry in `content-index.yaml` | Remove/revert the entry, re-run `blog:sync`, rebuild. |
| Article renders badly | Edit the wiki markdown page directly (no rebuild needed; the renderer fetches live). |
| Bad `articles.ts` committed | `git revert` the commit that changed it, or re-run `blog:sync` after fixing the YAML. |
| Bad deploy | Re-deploy the last good build, or re-run `blog:build` after reverting the source. |

---

## Media Handling

Images in converted posts may not display correctly. Use this checklist:

- **Quora images**: Quora CDN links expire. Download important images and re-host them:
  - In `artifacts/blog/public/images/` for self-hosted blog images.
  - Or a permanent external host (GitHub Issues attachment, Cloudinary, etc.).
- **Discourse images**: Same — save and re-upload to a permanent host.
- **Markdown reference**: `![Alt text](/images/my-image.png)` for self-hosted, or absolute URL for external.
- **Test locally**: Run `pnpm blog:preview` and verify all images render before deploying. Broken images are silently hidden by the renderer.

---

## Valid Categories

| Category | Use For |
|----------|---------|
| `Foundation` | Core platform concepts, origin story |
| `Updates` | Weekly/monthly state-of-the-platform posts |
| `Guides` | How-to and onboarding content |
| `Platform` | Technical service documentation |
| `Philosophy` | Ideology, worldview, manifestos |
| `Community` | Community organizing, groups, Discourse threads |
| `Security` | Safety, verification, privacy |
| `Resources` | External resources, tools, links |
| `Services` | Specific platform service docs |
| `Events` | Meetups, calls, live events |
| `Stories` | Personal stories, Quora answers, testimonials |
| `Technical` | Technical deep-dives, architecture |
| `Advocacy` | Outreach, activism, policy |

---

## Adding a New Category

1. Add it to the table above.
2. Use it freely in `content-index.yaml`.
3. The category will automatically appear in the blog filter bar once an article with that category is added.

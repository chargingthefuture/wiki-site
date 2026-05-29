# Publishing Workflow — Charging The Future Wiki Site

All posts are fetched live from the **GitHub Wiki** and declared in `content-index.yaml`.
This document is the operator runbook for every publishing scenario.

Run all `pnpm` commands from the `wiki-site/` directory.

---

## Quick-Add (Single Off-Hand Post)

1. Write or edit the page directly in [GitHub Wiki](https://github.com/chargingthefuture/chargingthefuture/wiki).
   The URL slug (`My-Page-Title`) becomes the `slug` field.

2. Add an entry to `content-index.yaml` (under the `articles:` key):

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
   pnpm wiki:validate
   pnpm wiki:sync
   pnpm wiki:preview      # http://localhost:5000
   ```

4. Commit `content-index.yaml` + `artifacts/wiki/src/lib/articles.ts` and push to `main`.
   The deploy workflow publishes automatically (see Deploy below).

---

## Automated Product Updates

Product updates are generated and published automatically by the
`generate-product-update.yml` workflow in the **product repo**
(`chargingthefuture/chargingthefuture`). On its schedule it:

1. Generates the update via the Anthropic API (key from Infisical).
2. Posts to the in-app feed.
3. Commits the markdown page to the GitHub Wiki.
4. Appends the registry entry to this repo's `content-index.yaml`, runs `wiki:sync`,
   commits, and pushes — which triggers the deploy here.
5. Opens a `quora-draft` GitHub issue with copy-paste body for Quora.

No manual step is required for these. Manual quick-add (above) remains for one-off posts.

---

## Large Batch — Quora Export

1. Download your data from [quora.com/privacy/download_your_data](https://www.quora.com/privacy/download_your_data).
2. Unzip the archive:
   ```bash
   unzip quora-data-XXXXX.zip -d /tmp/quora-export
   ```
3. Run the converter (from `wiki-site`):

   ```bash
   pnpm wiki:convert:quora /tmp/quora-export /tmp/quora-md --category=Stories
   ```

   - If Quora gives you a single `answers.html` file, pass that directly:
     ```bash
     pnpm wiki:convert:quora /tmp/quora-export/answers.html /tmp/quora-md
     ```

4. Review the generated `.md` files — fix slugs, clean up any formatting artefacts.
5. Push markdown files to GitHub Wiki:

   ```bash
   cp /tmp/quora-md/*.md /path/to/your/wiki-clone/
   cd /path/to/your/wiki-clone
   git add . && git commit -m "feat: add Quora answers" && git push
   ```

   _(See "Pushing to GitHub Wiki" section below.)_

6. Append the generated manifest into `content-index.yaml`:

   ```bash
   cat /tmp/quora-md/_manifest.yaml   # review entries first
   # Open content-index.yaml and paste the entries under the 'articles:' key
   ```

7. Validate, sync, preview:
   ```bash
   pnpm wiki:validate
   pnpm wiki:sync
   pnpm wiki:preview
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

2. Run the converter (from `wiki-site`):

   ```bash
   pnpm wiki:convert:discourse /tmp/discourse-html /tmp/discourse-md --category=Community
   ```

3. Review output — tables usually convert well; embedded images need manual fixing (see Media section below).

4. Push `.md` files to GitHub Wiki (see section below).

5. Paste `_manifest.yaml` entries into `content-index.yaml`, then:
   ```bash
   pnpm wiki:validate
   pnpm wiki:sync
   pnpm wiki:preview
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
pnpm wiki:validate        # fail-fast: checks metadata, duplicate slugs, dates
pnpm wiki:sync:dry        # preview: shows what would change in articles.ts (no writes)
pnpm wiki:sync            # apply: regenerates articles.ts from content-index.yaml
pnpm wiki:preview         # local dev server at http://localhost:5000
```

---

## Deploy

```bash
pnpm wiki:build           # produces static files in artifacts/wiki/dist/public/
pnpm wiki:build:pages     # GitHub Pages build with /chargingthefuture/ base path + 404.html fallback
```

Deploy `artifacts/wiki/dist/public/` to:

- **GitHub Pages**: use the workflow in [.github/workflows/deploy-wiki-gh-pages.yml](../.github/workflows/deploy-wiki-gh-pages.yml).

### GitHub Pages Setup

GitHub Pages is configured mostly in code.

You still need one setting in GitHub.com:

1. Open the repository settings.
2. Go to **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

After that, pushes to `main` that touch `wiki-site/**` build and deploy automatically.

Notes:

- The workflow builds with `BASE_PATH=/chargingthefuture/` (set in the `wiki:build:pages` script).
  The served site must live at that path — i.e. `https://chargingthefuture.github.io/chargingthefuture/`.
  If you move to a custom domain or a different Pages path, update the `BASE_PATH` in the
  `wiki:build:pages` script in [wiki-site/package.json](package.json).
- It also copies `index.html` to `404.html` so deep links like `/article/...` still work on GitHub Pages.

### Validation Workflow

The validation workflow is separate from deployment.

Validation means these CI checks run without publishing anything:

- content index validation
- article sync consistency check
- TypeScript typecheck
- production build verification

It runs on `main` pushes and on pull requests that touch `wiki-site/**`. See
[.github/workflows/wiki-validate.yml](../.github/workflows/wiki-validate.yml).

---

## Rollback

| Scenario                          | Fix                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| Bad entry in `content-index.yaml` | Remove/revert the entry, re-run `wiki:sync`, rebuild.                                 |
| Article renders badly             | Edit the wiki markdown page directly (no rebuild needed; the renderer fetches live).  |
| Bad `articles.ts` committed       | `git revert` the commit that changed it, or re-run `wiki:sync` after fixing the YAML. |
| Bad deploy                        | Re-deploy the last good build, or re-run `wiki:build` after reverting the source.     |

---

## Media Handling

Images in converted posts may not display correctly. Use this checklist:

- **Quora images**: Quora CDN links expire. Download important images and re-host them:
  - In `artifacts/wiki/public/images/` for self-hosted wiki images.
  - Or a permanent external host (GitHub Issues attachment, Cloudinary, etc.).
- **Discourse images**: Same — save and re-upload to a permanent host.
- **Markdown reference**: `![Alt text](/images/my-image.png)` for self-hosted, or absolute URL for external.
- **Test locally**: Run `pnpm wiki:preview` and verify all images render before deploying. Broken images are silently hidden by the renderer.

---

## Valid Categories

| Category     | Use For                                         |
| ------------ | ----------------------------------------------- |
| `Foundation` | Core platform concepts, origin story            |
| `Updates`    | Weekly/monthly state-of-the-platform posts      |
| `Guides`     | How-to and onboarding content                   |
| `Platform`   | Technical service documentation                 |
| `Philosophy` | Ideology, worldview, manifestos                 |
| `Community`  | Community organizing, groups, Discourse threads |
| `Security`   | Safety, verification, privacy                   |
| `Resources`  | External resources, tools, links                |
| `Services`   | Specific platform service docs                  |
| `Events`     | Meetups, calls, live events                     |
| `Stories`    | Personal stories, Quora answers, testimonials   |
| `Technical`  | Technical deep-dives, architecture              |
| `Advocacy`   | Outreach, activism, policy                      |

---

## Adding a New Category

1. Add it to the table above.
2. Use it freely in `content-index.yaml`.
3. The category will automatically appear in the blog filter bar once an article with that category is added.

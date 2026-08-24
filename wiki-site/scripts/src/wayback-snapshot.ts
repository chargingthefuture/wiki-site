#!/usr/bin/env node
/**
 * Submits published content to the Wayback Machine (web.archive.org/save).
 *
 * For each changed content file, two URLs are submitted:
 *   1. The raw markdown on GitHub — a full-text, third-party-timestamped copy.
 *   2. The article page on the blog.
 * The blog home page is always submitted as well.
 *
 * Best-effort by design: failures are logged and never exit non-zero, so a
 * deploy can never be blocked by archive.org rate limits.
 *
 * Pacing: archive.org refuses with HTTP 429 after roughly five saves in a
 * couple of minutes. A normal publish changes one file, so the spacing costs
 * nothing there; it exists so a backfill of several files actually finishes
 * instead of getting a handful in and then being turned away.
 *
 * Usage:
 *   tsx wayback-snapshot.ts <changed-file> [<changed-file> ...]
 *   (paths relative to the repo root, e.g. wiki-site/content/posts/foo.md)
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { parseFrontMatter } from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');
const SITE_BASE = 'https://chargingthefuture.github.io/chargingthefuture';
const RAW_BASE = 'https://raw.githubusercontent.com/chargingthefuture/wiki-site/main';
const MAX_FILES = 5; // archive.org starts refusing after roughly five saves in a couple of minutes
const SPACING_MS = 20_000; // measured: 4s was fast enough to trigger HTTP 429 partway through a batch

const COLLECTIONS = [
  'posts',
  'product-updates',
  'guides',
  'insights',
  'member-of-the-day',
  'archive/discourse',
  'archive/quora',
];

function articleUrlFor(repoRelPath: string): string | null {
  // repoRelPath: wiki-site/content/<collection>/<inner>.md
  const contentRel = repoRelPath.replace(/^wiki-site\/content\//, '');
  const collection = COLLECTIONS.find((c) => contentRel.startsWith(`${c}/`));
  if (!collection) return null;

  let slug = contentRel.slice(collection.length + 1).replace(/\.md$/i, '');
  let repo = 'chargingthefuture/wiki-site';
  try {
    const raw = readFileSync(resolve(REPO_ROOT, repoRelPath), 'utf8');
    const { meta } = parseFrontMatter(raw);
    if (meta?.slug) slug = meta.slug;
    if (meta?.repo) repo = meta.repo;
  } catch {
    return null; // deleted or unreadable — nothing to snapshot
  }
  const shortRepo = repo.split('/')[1] || repo;
  return `${SITE_BASE}/article/${shortRepo}/${encodeURIComponent(slug)}`;
}

async function save(url: string): Promise<void> {
  try {
    const res = await fetch(`https://web.archive.org/save/${url}`, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(60_000),
    });
    console.log(`  ${res.ok ? '✓' : `⚠ (HTTP ${res.status})`} ${url}`);
  } catch (e) {
    console.log(`  ⚠ ${url} — ${(e as Error).message}`);
  }
}

async function main() {
  const changed = process.argv
    .slice(2)
    .filter((p) => p.startsWith('wiki-site/content/') && p.toLowerCase().endsWith('.md'))
    .filter((p) => !p.toLowerCase().endsWith('/readme.md'));

  const batch = changed.slice(0, MAX_FILES);
  if (changed.length > batch.length) {
    console.log(`Snapshotting first ${batch.length} of ${changed.length} changed files (rate-limit cap).`);
  }

  console.log('Submitting to the Wayback Machine:');
  await save(`${SITE_BASE}/`);
  for (const file of batch) {
    const rawUrl = `${RAW_BASE}/${file.split('/').map(encodeURIComponent).join('/')}`;
    await save(rawUrl);
    const articleUrl = articleUrlFor(file);
    if (articleUrl) await save(articleUrl);
    await new Promise((r) => setTimeout(r, SPACING_MS));
  }
  console.log('Done (best-effort).');
}

main();

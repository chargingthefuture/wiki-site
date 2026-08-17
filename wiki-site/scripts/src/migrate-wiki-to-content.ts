#!/usr/bin/env node
/**
 * One-time migration: GitHub Wiki clone -> wiki-site/content/ collections.
 *
 * Reads every wiki page plus the legacy content-index.yaml registry, writes
 * each page as a front-mattered markdown file in its collection, and copies
 * the wiki images/ directory to content/images/. Existing article URLs are
 * preserved: each migrated file carries its original slug and repo namespace
 * in front matter.
 *
 * Usage:
 *   tsx migrate-wiki-to-content.ts <path-to-wiki-clone>
 *
 * Facts this script relies on (verified 2026-08-17):
 *   - The main wiki (chargingthefuture.wiki) and the mono wiki (mono.wiki)
 *     are byte-identical, so one clone is the single source.
 *   - wiki discourse/ is a byte-identical duplicate of discourse-migrate/;
 *     only discourse-migrate/ pages are migrated.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { load } from 'js-yaml';
import {
  type ContentMeta,
  inferMetaFromMarkdown,
  isDiscourseImport,
  serializeFrontMatter,
} from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const CONTENT_ROOT = resolve(BLOG_ROOT, 'content');
const CONTENT_INDEX = resolve(BLOG_ROOT, 'content-index.yaml');

const wikiRoot = process.argv[2];
if (!wikiRoot || !existsSync(wikiRoot)) {
  console.error('Usage: tsx migrate-wiki-to-content.ts <path-to-wiki-clone>');
  process.exit(1);
}

interface RegistryEntry {
  slug: string;
  title: string;
  repo: string;
  date: string;
  excerpt: string;
  category: string;
  featured?: boolean;
}

// Wiki chrome and exact-duplicate directories, not blog content.
// Home.md is NOT skipped: it is a registered, featured article on the blog.
const SKIP_ROOT_FILES = new Set(['_Footer.md', '_Sidebar.md']);
const SKIP_DIRS = new Set(['discourse', 'images', '.git']);

// Registry entries whose slug never matched a wiki file (already broken 404s
// on the live blog). Map them onto the real file, or drop with a note.
const REGISTRY_SLUG_TO_FILE: Record<string, string | null> = {
  'Getting-Started': 'guides/getting-started.md',
  'The-12-Services-of-the-TI-Skills-Economy': 'guides/The-12-Services-of-the-TI-Skills-Economy.md',
  'Chyme:-TI-social-audio-app': 'What-is-Chyme?.md',
  'What-is-SupportMatch%3F': 'What-is-SupportMatch?.md',
};

function collectionFor(relPath: string, markdown: string): string {
  if (relPath.startsWith('discourse-migrate/')) return 'archive/discourse';
  if (relPath.startsWith('guides/')) return 'guides';
  if (relPath.startsWith('insights/')) return 'insights';
  if (relPath.startsWith('member of the day/')) return 'member-of-the-day';
  const base = relPath.split('/').pop() ?? relPath;
  if (base.startsWith('Product-Update-')) return 'product-updates';
  if (!relPath.includes('/') && isDiscourseImport(markdown)) return 'archive/discourse';
  return 'posts';
}

function defaultCategoryFor(collection: string): string {
  switch (collection) {
    case 'product-updates':
      return 'Updates';
    case 'guides':
      return 'Guides';
    case 'insights':
      return 'Insights';
    case 'member-of-the-day':
      return 'Member of the Day';
    case 'archive/discourse':
      return 'Discourse Community Legacy Post';
    default:
      return 'Community';
  }
}

function outPathFor(collection: string, relPath: string): string {
  let inner = relPath;
  for (const prefix of ['discourse-migrate/', 'guides/', 'insights/', 'member of the day/']) {
    if (inner.startsWith(prefix)) inner = inner.slice(prefix.length);
  }
  // '#', '?' and '%' are URL-special and break bundler module resolution.
  // The original slug (with those chars) is preserved in front matter, so
  // article URLs are unaffected by the on-disk rename.
  inner = inner.replace(/[#?%]/g, '');
  return join(CONTENT_ROOT, collection, inner);
}

function listMarkdownFiles(dir: string, base: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    const rel = relative(base, fullPath).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...listMarkdownFiles(fullPath, base));
      continue;
    }
    if (!entry.name.toLowerCase().endsWith('.md')) continue;
    if (!rel.includes('/') && SKIP_ROOT_FILES.has(entry.name)) continue;
    files.push(rel);
  }
  return files;
}

function main() {
  const registry = (load(readFileSync(CONTENT_INDEX, 'utf8')) as { articles: RegistryEntry[] }).articles;
  const registryBySlug = new Map<string, RegistryEntry>();
  for (const entry of registry) registryBySlug.set(entry.slug.toLowerCase(), entry);

  // Remap registry entries whose slug points at no file.
  const remappedByFile = new Map<string, RegistryEntry>();
  const dropped: string[] = [];
  for (const [slug, file] of Object.entries(REGISTRY_SLUG_TO_FILE)) {
    const entry = registryBySlug.get(slug.toLowerCase());
    if (!entry) continue;
    registryBySlug.delete(slug.toLowerCase());
    if (file === null) {
      dropped.push(slug);
      continue;
    }
    remappedByFile.set(file, entry);
  }

  const files = listMarkdownFiles(wikiRoot, wikiRoot).sort();
  const usedRegistrySlugs = new Set<string>();
  let written = 0;
  const byCollection: Record<string, number> = {};

  for (const relPath of files) {
    const markdown = readFileSync(join(wikiRoot, relPath), 'utf8');
    const slug = relPath.replace(/\.md$/i, '');
    const collection = collectionFor(relPath, markdown);
    const entry = registryBySlug.get(slug.toLowerCase()) ?? remappedByFile.get(relPath);
    if (entry) usedRegistrySlugs.add(entry.slug.toLowerCase());

    const fallbackCategory = entry?.category ?? defaultCategoryFor(collection);
    const inferred = inferMetaFromMarkdown(markdown, slug, fallbackCategory);

    const meta: ContentMeta = {
      title: entry?.title ?? inferred.title,
      date: entry?.date ?? inferred.date ?? '2026-01-01',
      excerpt: entry?.excerpt ?? inferred.excerpt,
      category: fallbackCategory,
      slug: entry?.slug && REGISTRY_SLUG_TO_FILE[entry.slug] === undefined ? entry.slug : slug,
      repo: entry?.repo ?? 'chargingthefuture/chargingthefuture',
    };
    if (entry?.featured) meta.featured = true;

    if (collection === 'archive/discourse') {
      const originalDate = inferred.created ?? entry?.date;
      meta.archive = {
        source: 'discourse',
        account: 'chargingthefuture.discourse.group',
        ...(originalDate ? { original_date: originalDate } : {}),
        status: 'closed',
      };
      if (originalDate) meta.date = originalDate;
    }

    const outPath = outPathFor(collection, relPath);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, serializeFrontMatter(meta, markdown), 'utf8');
    written++;
    byCollection[collection] = (byCollection[collection] ?? 0) + 1;
  }

  // Copy shared images.
  const imagesDir = join(wikiRoot, 'images');
  let imagesCopied = 0;
  if (existsSync(imagesDir)) {
    const outImages = join(CONTENT_ROOT, 'images');
    mkdirSync(outImages, { recursive: true });
    for (const name of readdirSync(imagesDir)) {
      copyFileSync(join(imagesDir, name), join(outImages, name));
      imagesCopied++;
    }
  }

  const unmatched = registry.filter(
    (e) =>
      !usedRegistrySlugs.has(e.slug.toLowerCase()) &&
      REGISTRY_SLUG_TO_FILE[e.slug] === undefined
  );

  console.log(`✓ Wrote ${written} content files:`);
  for (const [collection, count] of Object.entries(byCollection).sort()) {
    console.log(`    ${collection}: ${count}`);
  }
  console.log(`✓ Copied ${imagesCopied} images`);
  if (dropped.length) console.log(`✓ Dropped dead registry entries (no content anywhere): ${dropped.join(', ')}`);
  if (unmatched.length) {
    console.error(`✗ ${unmatched.length} registry entries matched no wiki file:`);
    for (const e of unmatched) console.error(`    ${e.repo} ${e.slug}`);
    process.exit(1);
  }
}

main();

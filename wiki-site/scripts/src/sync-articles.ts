#!/usr/bin/env node
/**
 * Scans wiki-site/content/ front matter and regenerates
 * artifacts/wiki/src/lib/articles.ts. Articles are sorted by date descending
 * (newest first).
 *
 * The front matter of the content files is the single source of truth for the
 * article registry. There is no separate index file.
 *
 * Usage:
 *   tsx sync-articles.ts            # write changes
 *   tsx sync-articles.ts --dry-run  # preview only, no writes
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { parseFrontMatter } from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const CONTENT_ROOT = resolve(BLOG_ROOT, 'content');
const ARTICLES_TS = resolve(BLOG_ROOT, 'artifacts/wiki/src/lib/articles.ts');
const isDryRun = process.argv.includes('--dry-run');

const COLLECTIONS = [
  'posts',
  'product-updates',
  'guides',
  'insights',
  'member-of-the-day',
  'archive/discourse',
  'archive/quora',
];

interface ArticleRecord {
  slug: string;
  title: string;
  repo: string;
  date: string;
  excerpt: string;
  category: string;
  collection: string;
  path: string;
  featured?: boolean;
  listed?: boolean;
  teaser?: string;
  topics?: string[];
  archive?: {
    source: string;
    account?: string;
    originalUrl?: string;
    originalDate?: string;
    status?: string;
  };
}

function listMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
      continue;
    }
    if (!entry.name.toLowerCase().endsWith('.md')) continue;
    if (entry.name.toLowerCase() === 'readme.md') continue;
    files.push(fullPath);
  }
  return files;
}

function collectArticles(): ArticleRecord[] {
  const articles: ArticleRecord[] = [];
  for (const collection of COLLECTIONS) {
    const dir = join(CONTENT_ROOT, collection);
    let files: string[] = [];
    try {
      files = listMarkdownFiles(dir);
    } catch {
      continue; // collection directory may not exist yet
    }
    for (const file of files.sort()) {
      const relPath = relative(CONTENT_ROOT, file).replace(/\\/g, '/');
      const raw = readFileSync(file, 'utf8');
      const { meta } = parseFrontMatter(raw);
      if (!meta) {
        console.error(`✗ ${relPath}: missing front matter — run wiki:validate for details`);
        process.exit(1);
      }
      const innerPath = relative(dir, file).replace(/\\/g, '/');
      const record: ArticleRecord = {
        slug: meta.slug ?? innerPath.replace(/\.md$/i, ''),
        title: meta.title,
        repo: meta.repo ?? 'chargingthefuture/wiki-site',
        date: String(meta.date),
        excerpt: meta.excerpt,
        category: meta.category,
        collection,
        path: relPath,
      };
      if (meta.featured === true) record.featured = true;
      if (meta.listed === false) record.listed = false;
      if (meta.teaser?.toString().trim()) record.teaser = meta.teaser.toString().trim();
      if (meta.topics?.length) record.topics = meta.topics;
      if (meta.archive) {
        record.archive = {
          source: meta.archive.source,
          ...(meta.archive.account ? { account: meta.archive.account } : {}),
          ...(meta.archive.original_url ? { originalUrl: meta.archive.original_url } : {}),
          ...(meta.archive.original_date ? { originalDate: String(meta.archive.original_date) } : {}),
          ...(meta.archive.status ? { status: meta.archive.status } : {}),
        };
      }
      articles.push(record);
    }
  }
  return articles;
}

function render(articles: ArticleRecord[]): string {
  const sorted = [...articles].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return diff !== 0 ? diff : a.slug.localeCompare(b.slug);
  });

  const blocks = sorted.map((a) => '  ' + JSON.stringify(a, null, 2).split('\n').join('\n  '));

  return [
    '// AUTO-GENERATED — do not edit by hand.',
    '// Edit front matter in wiki-site/content/, then run:',
    '//   pnpm wiki:sync',
    '',
    'export interface ArticleArchive {',
    '  source: string;',
    '  account?: string;',
    '  originalUrl?: string;',
    '  originalDate?: string;',
    '  status?: string;',
    '}',
    '',
    'export interface ArticleMeta {',
    '  slug: string;',
    '  title: string;',
    '  repo: string;',
    '  date: string;',
    '  excerpt: string;',
    '  category: string;',
    '  collection: string;',
    '  path: string;',
    '  featured?: boolean;',
    '  listed?: boolean;',
    '  teaser?: string;',
    '  topics?: string[];',
    '  archive?: ArticleArchive;',
    '}',
    '',
    'export const ARTICLES: ArticleMeta[] = [',
    blocks.join(',\n') + ',',
    '];',
    '',
    '// Helper to extract a clean URL component',
    'export const getArticleUrl = (repo: string, slug: string) => {',
    "  const shortRepo = repo.split('/')[1] || repo;",
    '  const encodedSlug = encodeURIComponent(slug);',
    '  return `/article/${shortRepo}/${encodedSlug}`;',
    '};',
    '',
  ].join('\n');
}

function main() {
  const articles = collectArticles();
  if (!articles.length) {
    console.error('No content files found under wiki-site/content/.');
    process.exit(1);
  }
  const generated = render(articles);

  if (isDryRun) {
    let current = '';
    try { current = readFileSync(ARTICLES_TS, 'utf8'); } catch { /* new file */ }

    if (current === generated) {
      console.log('Dry run: articles.ts is already up-to-date. No changes needed.');
      return;
    }

    console.log('Dry run: articles.ts WILL BE UPDATED\n');
    const oldLines = current.split('\n');
    const newLines = generated.split('\n');
    let shown = 0;
    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen && shown < 40; i++) {
      if (oldLines[i] !== newLines[i]) {
        if (oldLines[i] !== undefined) console.log(`\x1b[31m- ${oldLines[i]}\x1b[0m`);
        if (newLines[i] !== undefined) console.log(`\x1b[32m+ ${newLines[i]}\x1b[0m`);
        shown++;
      }
    }
    if (shown >= 40) console.log('  ... (more lines differ — run without --dry-run to apply)');
    return;
  }

  writeFileSync(ARTICLES_TS, generated, 'utf8');
  console.log(`✓ Wrote ${articles.length} articles from content/ → ${ARTICLES_TS}`);
}

main();

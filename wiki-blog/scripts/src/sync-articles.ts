#!/usr/bin/env node
/**
 * Reads content-index.yaml and regenerates artifacts/blog/src/lib/articles.ts.
 * Articles are sorted by date descending (newest first).
 *
 * Usage:
 *   tsx sync-articles.ts            # write changes
 *   tsx sync-articles.ts --dry-run  # preview only, no writes
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { load } from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const CONTENT_INDEX = resolve(BLOG_ROOT, 'content-index.yaml');
const ARTICLES_TS = resolve(BLOG_ROOT, 'artifacts/blog/src/lib/articles.ts');
const isDryRun = process.argv.includes('--dry-run');

interface ArticleEntry {
  slug: string;
  title: string;
  repo: string;
  date: string;
  excerpt: string;
  category: string;
  featured?: boolean;
}

interface ContentIndex {
  articles: ArticleEntry[];
}

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function render(articles: ArticleEntry[]): string {
  const sorted = [...articles].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return diff !== 0 ? diff : a.slug.localeCompare(b.slug);
  });

  const blocks = sorted.map((a) => {
    const fields = [
      `    slug: "${esc(a.slug)}"`,
      `    title: "${esc(a.title)}"`,
      `    repo: "${esc(a.repo)}"`,
      `    date: "${esc(a.date)}"`,
      `    excerpt: "${esc(a.excerpt)}"`,
      `    category: "${esc(a.category)}"`,
      ...(a.featured === true ? ['    featured: true'] : []),
    ];
    return `  {\n${fields.join(',\n')}\n  }`;
  });

  return [
    '// AUTO-GENERATED — do not edit by hand.',
    '// Edit wiki-blog/content-index.yaml, then run:',
    '//   pnpm --filter @workspace/scripts run sync-articles',
    '',
    'export interface ArticleMeta {',
    '  slug: string;',
    '  title: string;',
    '  repo: string;',
    '  date: string;',
    '  excerpt: string;',
    '  category: string;',
    '  featured?: boolean;',
    '}',
    '',
    'export const ARTICLES: ArticleMeta[] = [',
    blocks.join(',\n') + ',',
    '];',
    '',
    '// Helper to extract a clean URL component',
    'export const getArticleUrl = (repo: string, slug: string) => {',
    "  const shortRepo = repo.split('/')[1] || repo;",
    '  return `/article/${shortRepo}/${slug}`;',
    '};',
    '',
  ].join('\n');
}

function main() {
  let raw: string;
  try {
    raw = readFileSync(CONTENT_INDEX, 'utf8');
  } catch {
    console.error(`Cannot read ${CONTENT_INDEX}\nRun this script from within wiki-blog.`);
    process.exit(1);
  }

  const parsed = load(raw) as ContentIndex;
  if (!parsed?.articles?.length) {
    console.error('No articles found in content-index.yaml');
    process.exit(1);
  }

  const generated = render(parsed.articles);

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
  console.log(`✓ Wrote ${parsed.articles.length} articles → ${ARTICLES_TS}`);
}

main();

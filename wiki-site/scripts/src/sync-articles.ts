#!/usr/bin/env node
/**
 * Reads content-index.yaml and regenerates artifacts/wiki/src/lib/articles.ts.
 * Articles are sorted by date descending (newest first).
 *
 * Usage:
 *   tsx sync-articles.ts            # write changes
 *   tsx sync-articles.ts --dry-run  # preview only, no writes
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, relative, resolve } from 'node:path';
import { load } from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const WIKI_ROOT = resolve(BLOG_ROOT, '../wiki');
const CONTENT_INDEX = resolve(BLOG_ROOT, 'content-index.yaml');
const ARTICLES_TS = resolve(BLOG_ROOT, 'artifacts/wiki/src/lib/articles.ts');
const isDryRun = process.argv.includes('--dry-run');
const DEFAULT_INFERRED_DATE = '2026-01-01';
const FOLDER_CATEGORY_MAP: Record<string, string> = {
  guides: 'Guides',
  insights: 'Insights',
  'member of the day': 'Member of the Day',
};

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

interface InferredMeta {
  title: string;
  date: string;
  excerpt: string;
}

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function cleanExcerptLine(line: string): string {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_>#|]/g, ' ')
    .replace(/&hellip;/gi, '...')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toIsoDate(raw?: string): string | undefined {
  if (!raw) return undefined;
  const d = new Date(raw.trim());
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

function inferMetaFromMarkdown(markdown: string, slug: string, category: string): InferredMeta {
  const comment = markdown.match(/<!--([\s\S]*?)-->/)?.[1] ?? '';
  const titleFromMeta = comment.match(/^\s*Title:\s*(.+)$/im)?.[1]?.trim();
  const created = comment.match(/^\s*Created:\s*(.+)$/im)?.[1]?.trim();
  const updated = comment.match(/^\s*Updated:\s*(.+)$/im)?.[1]?.trim();
  const excerptFromMeta = comment.match(/^\s*Excerpt:\s*(.+)$/im)?.[1]?.trim();
  const titleFromHeading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();

  const title = titleFromMeta || titleFromHeading || slug.split('/').pop()?.replace(/-/g, ' ') || slug;
  const date = toIsoDate(created) || toIsoDate(updated) || DEFAULT_INFERRED_DATE;

  let excerpt = excerptFromMeta ? cleanExcerptLine(excerptFromMeta) : '';
  if (!excerpt) {
    for (const line of markdown.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#') || t.startsWith('<!--') || t.startsWith('>')) continue;
      const cleaned = cleanExcerptLine(t);
      if (cleaned.length >= 24) {
        excerpt = cleaned;
        break;
      }
    }
  }
  if (!excerpt) excerpt = `${category} post from Charging The Future Wiki.`;
  if (excerpt.length > 160) excerpt = `${excerpt.slice(0, 159)}...`;

  return { title, date, excerpt };
}

function listMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function mergeFolderMappedArticles(contentIndexArticles: ArticleEntry[]): { merged: ArticleEntry[]; inferredCount: number } {
  const merged = [...contentIndexArticles];
  const knownSlugs = new Set(contentIndexArticles.map((a) => a.slug.toLowerCase()));
  let inferredCount = 0;

  for (const [folder, category] of Object.entries(FOLDER_CATEGORY_MAP)) {
    const folderPath = resolve(WIKI_ROOT, folder);
    let markdownFiles: string[] = [];
    try {
      markdownFiles = listMarkdownFiles(folderPath);
    } catch {
      continue;
    }

    for (const file of markdownFiles.sort((a, b) => a.localeCompare(b))) {
      const relPath = relative(folderPath, file).replace(/\\/g, '/');
      const slug = `${folder}/${relPath.replace(/\.md$/i, '')}`;
      if (knownSlugs.has(slug.toLowerCase())) continue;

      const markdown = readFileSync(file, 'utf8');
      const meta = inferMetaFromMarkdown(markdown, slug, category);

      merged.push({
        slug,
        title: meta.title,
        repo: 'chargingthefuture/chargingthefuture',
        date: meta.date,
        excerpt: meta.excerpt,
        category,
      });
      knownSlugs.add(slug.toLowerCase());
      inferredCount++;
    }
  }

  return { merged, inferredCount };
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
    '// Edit wiki-site/content-index.yaml, then run:',
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
    '  const encodedSlug = encodeURIComponent(slug);',
    '  return `/article/${shortRepo}/${encodedSlug}`;',
    '};',
    '',
  ].join('\n');
}

function main() {
  let raw: string;
  try {
    raw = readFileSync(CONTENT_INDEX, 'utf8');
  } catch {
    console.error(`Cannot read ${CONTENT_INDEX}\nRun this script from within wiki-site.`);
    process.exit(1);
  }

  const parsed = load(raw) as ContentIndex;
  if (!parsed?.articles?.length) {
    console.error('No articles found in content-index.yaml');
    process.exit(1);
  }

  const { merged, inferredCount } = mergeFolderMappedArticles(parsed.articles);
  const generated = render(merged);

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
  console.log(
    `✓ Wrote ${merged.length} articles (content-index: ${parsed.articles.length}, folder-inferred: ${inferredCount}) → ${ARTICLES_TS}`
  );
}

main();

#!/usr/bin/env node
/**
 * Validates front matter across wiki-site/content/ before it is synced to
 * articles.ts.
 *
 * Usage:
 *   tsx validate.ts [path/to/content]
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { parseFrontMatter } from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONTENT = resolve(__dirname, '../../content');
const CONTENT_ROOT = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_CONTENT;

const COLLECTIONS = [
  'posts',
  'product-updates',
  'guides',
  'insights',
  'member-of-the-day',
  'archive/discourse',
  'archive/quora',
];

const VALID_REPOS = new Set([
  'chargingthefuture/chargingthefuture',
  'chargingthefuture/mono',
  'chargingthefuture/wiki-site',
]);

const ARCHIVE_SOURCES = new Set(['discourse', 'quora']);
const ARCHIVE_STATUSES = new Set(['erased', 'closed', 'live']);

/**
 * What an archive entry was on the platform it was written on. The Record
 * (/record) labels and filters on this, so a reader can tell a comment left
 * under someone else's answer from a post written in their space. An entry
 * without one still renders; it is labeled by its source instead.
 */
const ARCHIVE_KINDS = new Set([
  'answer',
  'answer-comment',
  'answer-draft',
  'credential',
  'forum-topic',
  'post-comment',
  'question',
  'question-comment',
  'space-post',
  'space-submission',
]);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

let errorCount = 0;
let warnCount = 0;

function fail(pos: string, msg: string) {
  console.error(`  ✗ ERROR  [${pos}] ${msg}`);
  errorCount++;
}

function warn(pos: string, msg: string) {
  console.warn(`  ⚠ WARN   [${pos}] ${msg}`);
  warnCount++;
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

function main() {
  const seenSlugs = new Map<string, string>();
  let fileCount = 0;

  for (const collection of COLLECTIONS) {
    const dir = join(CONTENT_ROOT, collection);
    let files: string[] = [];
    try {
      files = listMarkdownFiles(dir);
    } catch {
      continue;
    }

    for (const file of files.sort()) {
      fileCount++;
      const pos = relative(CONTENT_ROOT, file).replace(/\\/g, '/');
      const raw = readFileSync(file, 'utf8');

      let meta;
      try {
        ({ meta } = parseFrontMatter(raw));
      } catch (e) {
        fail(pos, `front matter is not valid YAML: ${(e as Error).message}`);
        continue;
      }
      if (!meta) {
        fail(pos, 'missing front matter block (--- ... ---) at the top of the file');
        continue;
      }

      if (!meta.title?.toString().trim()) fail(pos, 'missing or empty "title"');
      if (!meta.excerpt?.toString().trim()) fail(pos, 'missing or empty "excerpt"');
      if (!meta.category?.toString().trim()) fail(pos, 'missing or empty "category"');

      const date = String(meta.date ?? '');
      if (!date.trim()) fail(pos, 'missing "date"');
      else if (!DATE_RE.test(date)) fail(pos, `"date" must be YYYY-MM-DD, got "${date}"`);

      if (meta.repo && !VALID_REPOS.has(meta.repo)) {
        fail(pos, `"repo" must be one of: ${[...VALID_REPOS].join(', ')} — got "${meta.repo}"`);
      }

      // An archive entry's excerpt is the entry — a comment of eight words is
      // eight words, and padding it would put words in someone's mouth. The
      // length guidance applies to writing that is being composed for the blog.
      const isArchive = collection.startsWith('archive/');
      const excerpt = meta.excerpt?.toString() ?? '';
      if (!isArchive && excerpt && (excerpt.length < 24 || excerpt.length > 200)) {
        warn(pos, `excerpt is ${excerpt.length} chars (aim for 60-160)`);
      }

      // The teaser is the short standalone version of the post shown on the
      // feed page and pasted to platforms. It should carry the post's whole
      // point, not tease it — so it is longer than the excerpt.
      const teaser = meta.teaser?.toString() ?? '';
      if (teaser && (teaser.length < 120 || teaser.length > 700)) {
        warn(pos, `teaser is ${teaser.length} chars (aim for 280-500)`);
      }

      const slug = meta.slug ?? relative(dir, file).replace(/\\/g, '/').replace(/\.md$/i, '');
      const existing = seenSlugs.get(slug.toLowerCase());
      if (existing) fail(pos, `duplicate slug "${slug}" (also in ${existing})`);
      else seenSlugs.set(slug.toLowerCase(), pos);

      if (isArchive) {
        if (!meta.archive) {
          fail(pos, 'archive collections require an "archive" front-matter block (source, original_date, status)');
        } else {
          if (!ARCHIVE_SOURCES.has(meta.archive.source)) {
            fail(pos, `"archive.source" must be one of: ${[...ARCHIVE_SOURCES].join(', ')}`);
          }
          if (meta.archive.status && !ARCHIVE_STATUSES.has(meta.archive.status)) {
            fail(pos, `"archive.status" must be one of: ${[...ARCHIVE_STATUSES].join(', ')}`);
          }
          const od = meta.archive.original_date ? String(meta.archive.original_date) : '';
          if (od && !DATE_RE.test(od)) {
            fail(pos, `"archive.original_date" must be YYYY-MM-DD, got "${od}"`);
          }
          if (meta.archive.kind && !ARCHIVE_KINDS.has(meta.archive.kind)) {
            fail(pos, `"archive.kind" must be one of: ${[...ARCHIVE_KINDS].join(', ')}`);
          }
          // The screenshot is what keeps an erased entry legible: the original
          // page is gone, so a picture of it is the only thing left to look at.
          // A reference that does not point into content/images/ renders
          // nothing at all, which is worse than carrying no screenshot.
          const shot = meta.archive.screenshot ? String(meta.archive.screenshot) : '';
          if (shot && !/^images\/[^/]+$/.test(shot)) {
            fail(pos, `"archive.screenshot" must be "images/<file>" (a file in content/images/), got "${shot}"`);
          }
          const snap = meta.archive.snapshot_url ? String(meta.archive.snapshot_url) : '';
          if (snap && !/^https?:\/\//.test(snap)) {
            fail(pos, `"archive.snapshot_url" must be an http(s) URL, got "${snap}"`);
          }
        }
      } else if (meta.archive) {
        warn(pos, '"archive" block outside an archive/ collection');
      }
    }
  }

  console.log(`\nChecked ${fileCount} content files: ${errorCount} error(s), ${warnCount} warning(s).`);
  if (!fileCount) {
    console.error(`No content files found under ${CONTENT_ROOT}`);
    process.exit(1);
  }
  if (errorCount > 0) process.exit(1);
}

main();

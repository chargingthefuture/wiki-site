#!/usr/bin/env node
/**
 * Validates content-index.yaml before it is synced to articles.ts.
 *
 * Usage:
 *   tsx validate.ts [path/to/content-index.yaml]
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { load } from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_INDEX = resolve(__dirname, '../../content-index.yaml');
const CONTENT_INDEX = process.argv[2] ?? DEFAULT_INDEX;

const VALID_REPOS = new Set([
  'chargingthefuture/chargingthefuture',
  'chargingthefuture/mono',
]);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

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

function main() {
  let raw: string;
  try {
    raw = readFileSync(CONTENT_INDEX, 'utf8');
  } catch {
    console.error(`Cannot read: ${CONTENT_INDEX}`);
    process.exit(1);
  }

  let parsed: ContentIndex;
  try {
    parsed = load(raw) as ContentIndex;
  } catch (e) {
    console.error(`YAML parse error: ${e}`);
    process.exit(1);
  }

  if (!parsed || !Array.isArray(parsed.articles)) {
    console.error('content-index.yaml must have a top-level "articles" list.');
    process.exit(1);
  }

  console.log(`Validating ${parsed.articles.length} articles in ${CONTENT_INDEX}...\n`);

  const slugsSeen = new Map<string, number>();

  for (let i = 0; i < parsed.articles.length; i++) {
    const a = parsed.articles[i];
    const pos = `${i} / ${a?.slug ?? '?'}`;

    if (!a.slug) {
      fail(pos, 'missing "slug"');
    } else {
      const key = a.slug.toLowerCase();
      if (slugsSeen.has(key)) {
        fail(pos, `duplicate slug (also at index ${slugsSeen.get(key)})`);
      } else {
        slugsSeen.set(key, i);
      }
    }

    if (!a.title) {
      fail(pos, 'missing "title"');
    } else if (a.title.trim().length < 3) {
      fail(pos, `"title" is too short: "${a.title}"`);
    }

    if (!a.repo) {
      fail(pos, 'missing "repo"');
    } else if (!VALID_REPOS.has(a.repo)) {
      fail(pos, `invalid "repo" "${a.repo}". Valid values: ${[...VALID_REPOS].join(', ')}`);
    }

    if (!a.date) {
      fail(pos, 'missing "date"');
    } else if (!DATE_RE.test(a.date)) {
      fail(pos, `"date" must be YYYY-MM-DD, got "${a.date}"`);
    } else {
      const d = new Date(a.date);
      if (isNaN(d.getTime())) fail(pos, `"date" is not a valid calendar date: "${a.date}"`);
    }

    if (!a.excerpt) {
      fail(pos, 'missing "excerpt"');
    } else if (a.excerpt.trim().length < 20) {
      warn(pos, `"excerpt" is very short (${a.excerpt.trim().length} chars — aim for 60-160)`);
    } else if (a.excerpt.includes('(add excerpt')) {
      warn(pos, '"excerpt" still has the placeholder text — update it');
    }

    if (!a.category) fail(pos, 'missing "category"');
  }

  console.log('');
  if (errorCount > 0) {
    console.error(`Validation FAILED — ${errorCount} error(s), ${warnCount} warning(s).`);
    process.exit(1);
  }
  const suffix = warnCount > 0 ? ` with ${warnCount} warning(s)` : '';
  console.log(`✓ All ${parsed.articles.length} articles valid${suffix}.`);
}

main();

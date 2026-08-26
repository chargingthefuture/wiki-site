#!/usr/bin/env node
/**
 * Turns a Quora data export into archive content files for The Record.
 *
 * Quora's export is one `index.html` per download, split into one `<div>` per
 * section (Answers, Answer Comments, Spaces Items, and so on), each holding a
 * flat run of `<p><h2>Item</h2></p>` followed by one `<div><strong>Field:
 * </strong><span>value</span></div>` per field and an `<hr />` between items.
 * A large account arrives as several downloads, so this script takes any
 * number of export directories and treats them as one account.
 *
 * What crosses into the repo is the author's own words, the question title
 * they were written under, and the parent address. Everything else in the
 * export stays out: inbox messages are private, and other people's answers
 * and posts are theirs. Posts to the author's own space are skipped too —
 * those are the blog's own archive material, and The Record is the writing
 * that lived on other people's pages.
 *
 * Usage:
 *   tsx import-quora-export.ts --account=<slug> --out=<dir> <export-dir>...
 *
 * Options:
 *   --account=<slug>   Account slug written into front matter (required)
 *   --own-space=<a,b>  Space names belonging to the author (skipped)
 *   --images=<dir>     Where referenced images are copied (default content/images)
 *   --dry-run          Report what would be written, write nothing
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { parse as parseHtml, type HTMLElement } from 'node-html-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { toUsEnglish } from '../lib/us-spelling.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');

// ---------- CLI ----------

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const exportDirs = args.filter((a) => !a.startsWith('--')).map((a) => resolve(a));
const account = flag('account');
const outDir = resolve(flag('out') ?? join(BLOG_ROOT, 'content/archive/quora', account ?? ''));
const imagesDir = resolve(flag('images') ?? join(BLOG_ROOT, 'content/images'));
const isDryRun = args.includes('--dry-run');
const ownSpaces = new Set(
  (flag('own-space') ?? 'Skills Economy,TI Skills Network').split(',').map((s) => s.trim()).filter(Boolean),
);

if (!account || exportDirs.length === 0) {
  console.error(
    'Usage: tsx import-quora-export.ts --account=<slug> --out=<dir> <export-dir>...',
  );
  process.exit(1);
}

// ---------- Export parsing ----------

interface Field {
  text: string;
  html: string;
}

interface ExportItem {
  section: string;
  fields: Record<string, Field>;
  dir: string;
}

/**
 * Walks one export file. The sections are siblings at the top of the document
 * and the items inside each are a flat run rather than nested, because the
 * export's `<p>` never closes before the `<div>`s that follow it — so this
 * reads the element stream in order instead of querying for containers.
 */
function parseExport(dir: string): ExportItem[] {
  const root = parseHtml(readFileSync(join(dir, 'index.html'), 'utf8'));
  const html = root.querySelector('html') ?? root;
  const items: ExportItem[] = [];

  for (const node of html.childNodes) {
    const section = (node as HTMLElement).tagName ? (node as HTMLElement).querySelector('h1')?.text.trim() : undefined;
    if (!section) continue;
    let current: ExportItem | null = null;

    for (const child of (node as HTMLElement).childNodes) {
      const el = child as HTMLElement;
      if (!el.tagName) continue;
      const tag = el.tagName.toUpperCase();

      if (tag === 'P' && el.querySelector('h2')) {
        current = { section, fields: {}, dir };
        items.push(current);
        continue;
      }
      if (tag === 'DIV' && current) {
        const label = el.querySelector('strong')?.text.replace(/:\s*$/, '').trim();
        const span = el.querySelector('span');
        if (label) current.fields[label] = { text: span?.text.trim() ?? '', html: span?.innerHTML ?? '' };
      }
    }
  }
  return items;
}

// ---------- Dates ----------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Export timestamps are stamped in Quora's Pacific time; the blog dates a page
 * by the day it was written where the author is, which is Eastern. A late
 * evening Pacific post is already the next day there, so converting rather
 * than slicing the string is what keeps an entry from landing on the wrong day
 * of the timeline.
 */
function toEasternDate(stamp: string): string | null {
  const m = stamp.match(/^(\w{3}) (\d{1,2}), (\d{4}) (\d{2}):(\d{2}) (AM|PM) (PDT|PST)$/);
  if (!m) return null;
  const [, mon, day, year, hh, mm, ampm, zone] = m;
  const monthIndex = MONTHS.indexOf(mon);
  if (monthIndex < 0) return null;
  let hour = Number(hh) % 12;
  if (ampm === 'PM') hour += 12;
  const offset = zone === 'PDT' ? 7 : 8;
  const utc = Date.UTC(Number(year), monthIndex, Number(day), hour + offset, Number(mm));
  return new Date(utc).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function itemDate(item: ExportItem): string | null {
  for (const key of ['Creation time', 'Time', 'Last updated']) {
    const raw = item.fields[key]?.text;
    if (raw) {
      const d = toEasternDate(raw);
      if (d) return d;
    }
  }
  return null;
}

// ---------- Markdown ----------

const td = new TurndownService({ headingStyle: 'atx', hr: '---', bulletListMarker: '-', codeBlockStyle: 'fenced' });
td.use(gfm);
td.remove(['script', 'style']);

function toMarkdown(html: string): string {
  return td
    .turndown(html)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

let respelled = 0;

/**
 * The blog writes US English and CI fails on a British spelling anywhere in
 * content/, the archive included — an archived typo is still a typo. This is a
 * mechanical dialect fix, not a copy edit: no word choice or meaning changes.
 *
 * Addresses are left exactly as they were. A URL is how a page was reached, and
 * on this collection it is the evidence of where the writing lived; respelling
 * one would make the record wrong to make the prose right.
 */
function usEnglishOutsideAddresses(text: string): string {
  const out = text
    .split(/(https?:\/\/\S+)/)
    .map((part, i) => (i % 2 === 1 ? part : toUsEnglish(part)))
    .join('');
  if (out !== text) respelled += 1;
  return out;
}

function plain(html: string): string {
  return parseHtml(html || '').text.replace(/\s+/g, ' ').trim();
}

/** A short, faithful label: the opening of what was written, cut at a sentence. */
function summarize(text: string, max = 90): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (stop > max * 0.4) return cut.slice(0, stop + 1).trim();
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.5 ? cut.slice(0, space) : cut).trim()}…`;
}

/**
 * The readable question or post a comment was left under, recovered from its
 * address. A comment's own opening words make a poor title — the card would
 * then print the same sentence twice, once as a heading and once as the text.
 * The address carries where it was said, which is the part the words alone do
 * not tell you.
 */
function titleFromParentUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    return undefined;
  }
  // A permalink to somebody's answer ends in /answer/<their-handle>; the
  // question it answers is the segment before that, not the handle.
  const question = path.split('/answer/')[0];
  const segment = question.split('/').filter(Boolean).pop();
  if (!segment) return undefined;
  const words = segment
    // Quora appends -1, -2 to disambiguate two questions with the same wording.
    .replace(/-\d{1,2}$/, '')
    .split('-')
    .join(' ')
    .trim();
  // Some parent addresses end in a numeric post id rather than a worded slug.
  // A bare id is not a title, so those fall back to the entry's own words.
  const worded = /[a-z]{3,}/i.test(words) && words.includes(' ');
  return worded && words.length >= 12 ? summarize(words, 110) : undefined;
}

function slugify(s: string): string {
  return (
    s
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 70)
      .replace(/-$/, '') || 'entry'
  );
}

// ---------- Images ----------

const IMAGE_SIGNATURES: Array<[string, (b: Buffer) => boolean]> = [
  ['.png', (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))],
  ['.jpg', (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
  ['.gif', (b) => b.subarray(0, 3).toString() === 'GIF'],
  ['.webp', (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP'],
];

const copiedImages = new Map<string, string>();

/** Copies one export image into content/images/, naming it by its real type. */
function importImage(name: string, dirs: string[]): string | null {
  if (copiedImages.has(name)) return copiedImages.get(name) ?? null;
  for (const dir of dirs) {
    const source = join(dir, 'images', name);
    if (!existsSync(source)) continue;
    const bytes = readFileSync(source);
    const ext = IMAGE_SIGNATURES.find(([, test]) => test(bytes))?.[0] ?? '.png';
    const target = `${name}${ext}`;
    if (!isDryRun) {
      mkdirSync(imagesDir, { recursive: true });
      writeFileSync(join(imagesDir, target), bytes);
    }
    copiedImages.set(name, target);
    return target;
  }
  copiedImages.set(name, '');
  return null;
}

/** Rewrites export image references to the blog's shared images directory. */
function rewriteImages(html: string, dirs: string[]): string {
  return html.replace(/src="images\/([^"]+)"/g, (whole, name: string) => {
    const target = importImage(name, dirs);
    return target ? `src="images/${target}"` : whole;
  });
}

// ---------- Entries ----------

interface Entry {
  kind: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  originalUrl?: string;
  questionTitle?: string;
  spaceName?: string;
  removed?: boolean;
  sharedTo: string[];
  dedupeKey: string;
}

const SECTION_KINDS: Record<string, string> = {
  Answers: 'answer',
  Questions: 'question',
  'Answer Comments': 'answer-comment',
  'Question Comments': 'question-comment',
  'Post Comments': 'post-comment',
  'Answer Drafts': 'answer-draft',
  Credentials: 'credential',
  'Spaces Items': 'space-post',
  'Space Submissions': 'space-submission',
};

/** Everything not listed here never leaves the export. */
const NEVER_IMPORT = new Set(['Inbox Messages', 'Profile Photo']);

/**
 * Why an export item did not become an entry. Reported at the end: a silent
 * drop in an import of this size is indistinguishable from a parsing bug.
 */
const drops: Record<string, number> = {
  own_space: 0,
  no_words_of_own: 0,
  empty: 0,
  undated: 0,
  untitled: 0,
};

function normalizeForDedupe(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 200);
}

function buildEntry(item: ExportItem, dirs: string[]): Entry | null {
  const kind = SECTION_KINDS[item.section];
  if (!kind) return null;
  const date = itemDate(item);
  if (!date) {
    drops.undated++;
    return null;
  }

  const f = item.fields;
  // Checked before the body is touched: an own-space post is not imported, and
  // copying its images would drag the whole export's picture library into the
  // repo for pages that never render.
  if (kind === 'space-post' && ownSpaces.has(f['Space name']?.text ?? '')) {
    drops.own_space++;
    return null;
  }

  // A credential keeps its text in its own field, so it is decided before the
  // shared body check below, which would otherwise read it as empty.
  if (kind === 'credential') {
    const experience = f.Experience?.text ?? '';
    if (!experience) {
      drops.empty++;
      return null;
    }
    return {
      kind,
      title: 'Profile credential',
      date,
      excerpt: usEnglishOutsideAddresses(summarize(experience, 180)),
      body: usEnglishOutsideAddresses(experience),
      sharedTo: [],
      dedupeKey: `credential:${normalizeForDedupe(experience)}`,
    };
  }

  const rawHtml = f.Content?.html || f['Post content']?.html || f.Text?.html || '';
  if (!plain(rawHtml)) {
    drops[kind === 'space-post' || kind === 'space-submission' ? 'no_words_of_own' : 'empty']++;
    return null;
  }
  const contentHtml = rewriteImages(rawHtml, dirs);
  const contentText = plain(contentHtml);

  const questionTitle = ['answer', 'answer-draft', 'question-comment', 'space-submission'].includes(kind)
    ? f.Question?.text || undefined
    : undefined;

  const originalUrl = f.Answer?.text || f.Post?.text || f['Share url']?.text || undefined;
  const parentUrl = originalUrl && /^https?:\/\//.test(originalUrl) ? originalUrl : undefined;

  const title =
    kind === 'question'
      ? summarize(contentText || f.Text?.text || '', 110)
      : kind === 'answer' || kind === 'answer-draft'
        ? summarize(questionTitle ?? contentText, 110)
        : kind === 'space-submission'
          ? summarize(f['Post title']?.text || questionTitle || contentText, 110)
          : titleFromParentUrl(parentUrl) ?? summarize(contentText, 90);

  if (!title) {
    drops.untitled++;
    return null;
  }

  return {
    kind,
    title: usEnglishOutsideAddresses(title),
    date,
    excerpt: usEnglishOutsideAddresses(summarize(contentText, 190)),
    body: usEnglishOutsideAddresses(toMarkdown(contentHtml)),
    originalUrl: parentUrl,
    questionTitle,
    spaceName: f['Space name']?.text || undefined,
    removed: f.Deleted?.text === 'yes' || undefined,
    sharedTo: [],
    dedupeKey: `${kind === 'space-submission' ? 'sub' : 'body'}:${normalizeForDedupe(contentText)}`,
  };
}

// ---------- Front matter ----------

function yamlString(s: string): string {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function render(entry: Entry, slug: string): string {
  const lines = [
    '---',
    `title: ${yamlString(entry.title)}`,
    `date: ${yamlString(entry.date)}`,
    `excerpt: ${yamlString(entry.excerpt)}`,
    'category: "Community"',
  ];
  // Nothing imported here enters the feed, whatever kind it is. The feed carries
  // copy-edited writing, and this is raw export text: the copy-edit pass in the
  // chargingthefuture/quora repository is what promotes a piece to the feed, and
  // it has not run on any of this. Every entry still has a real address and shows
  // on The Record.
  lines.push('listed: false');
  lines.push('archive:', '  source: "quora"', `  account: ${yamlString(account!)}`, `  kind: ${yamlString(entry.kind)}`);
  if (entry.originalUrl) lines.push(`  original_url: ${yamlString(entry.originalUrl)}`);
  lines.push(`  original_date: ${yamlString(entry.date)}`, '  status: "erased"');
  if (entry.spaceName) lines.push(`  space: ${yamlString(entry.spaceName)}`);
  if (entry.questionTitle) lines.push(`  question: ${yamlString(entry.questionTitle)}`);
  if (entry.removed) lines.push('  removed: true');
  if (entry.sharedTo.length) {
    lines.push('  shared_to:');
    for (const s of entry.sharedTo) lines.push(`    - ${yamlString(s)}`);
  }
  lines.push('---', '', entry.body, '');
  return lines.join('\n');
}

// ---------- Main ----------

function existingSlugs(): Set<string> {
  const slugs = new Set<string>();
  const contentRoot = join(BLOG_ROOT, 'content');
  const walk = (dir: string) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.toLowerCase().endsWith('.md') && e.name.toLowerCase() !== 'readme.md') {
        const raw = readFileSync(p, 'utf8');
        const declared = raw.match(/^slug:\s*"?([^"\n]+)"?\s*$/m)?.[1];
        slugs.add((declared ?? e.name.replace(/\.md$/i, '')).toLowerCase());
      }
    }
  };
  walk(contentRoot);
  return slugs;
}

function main() {
  const rawItems = exportDirs.flatMap(parseExport);
  const skipped = rawItems.filter((i) => NEVER_IMPORT.has(i.section)).length;

  const entries = rawItems.map((i) => buildEntry(i, exportDirs)).filter((e): e is Entry => e !== null);

  // A submission records the same answer or post being pushed into another
  // space. Kept as its own entry it would double-count the writing; folded
  // into the entry it repeats, it becomes the more useful fact — how many
  // other people's spaces one piece was carried into.
  const byBody = new Map<string, Entry>();
  for (const e of entries) {
    if (e.kind === 'space-submission') continue;
    const key = e.dedupeKey.replace(/^body:/, '');
    if (!byBody.has(key)) byBody.set(key, e);
  }

  const kept: Entry[] = [];
  let folded = 0;
  for (const e of entries) {
    if (e.kind === 'space-submission') {
      const host = byBody.get(e.dedupeKey.replace(/^sub:/, ''));
      if (host) {
        if (e.spaceName && !host.sharedTo.includes(e.spaceName)) host.sharedTo.push(e.spaceName);
        folded++;
        continue;
      }
    }
    kept.push(e);
  }

  kept.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const used = existingSlugs();
  const counts = new Map<string, number>();
  let written = 0;

  if (!isDryRun) mkdirSync(outDir, { recursive: true });

  for (const entry of kept) {
    let slug = slugify(entry.title);
    if (used.has(slug)) {
      let n = 2;
      while (used.has(`${slug}-${n}`)) n++;
      slug = `${slug}-${n}`;
    }
    used.add(slug);
    counts.set(entry.kind, (counts.get(entry.kind) ?? 0) + 1);
    if (!isDryRun) writeFileSync(join(outDir, `${slug}.md`), render(entry, slug), 'utf8');
    written++;
  }

  console.log(`\nAccount: ${account}`);
  console.log(`  export items read:        ${rawItems.length}`);
  console.log(`  private/never imported:   ${skipped}`);
  console.log(`  submissions folded in:    ${folded}`);
  console.log(`  images copied:            ${[...copiedImages.values()].filter(Boolean).length}`);
  console.log(`  dialect fixes applied:    ${respelled} (British spelling → US; addresses untouched)`);
  console.log(`  entries ${isDryRun ? 'that would be written' : 'written'}: ${written}`);
  for (const [kind, n] of [...counts].sort((a, b) => b[1] - a[1])) console.log(`      ${String(n).padStart(4)}  ${kind}`);
  console.log('  not imported:');
  console.log(`      ${String(drops.own_space).padStart(4)}  posts to the author's own space`);
  console.log(`      ${String(drops.no_words_of_own).padStart(4)}  shares and submissions carrying no words of the author's own`);
  console.log(`      ${String(drops.empty).padStart(4)}  items with an empty body`);
  console.log(`      ${String(drops.undated).padStart(4)}  items with no usable timestamp`);
  console.log(`      ${String(drops.untitled).padStart(4)}  items no title could be formed from`);
  if (!isDryRun) console.log(`  → ${outDir}`);
}

main();

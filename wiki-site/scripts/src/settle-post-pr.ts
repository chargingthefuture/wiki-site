/**
 * The non-git half of bringing a post pull request up to date with main, used by the workflow
 * "Publish a post" (.github/workflows/publish-post.yml) so a post can be published without a chat
 * session (owner request, 2026-11-24). The workflow merges main into the branch and takes main's
 * copy of every generated file and of the hand-written paste sheet; this script does the rest.
 *
 *   prepare --branch-sheet FILE --posts FILE --today YYYY-MM-DD --out FILE
 *     For each post the branch adds (one path per line in --posts, relative to the wiki root):
 *     sets its `date` to --today (a post's date is the day it reaches main, Eastern), and copies
 *     its entry out of the branch's own paste sheet (--branch-sheet) into --out.
 *
 *   place --in FILE
 *     Run after wiki:sync. Puts each saved entry back into QUORA_PASTE_SHEET.txt with the number
 *     the sync gave the post and today's date, where /feed shows it, and corrects the entry count.
 *
 * It never touches content/feed-numbers.json: wiki:sync owns it.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontMatter } from './frontmatter.js';
import { feedEntries } from './feed-numbers.js';
import { feedOrder, feedKey } from './feed-order.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '../..');
const SHEET = resolve(WIKI_ROOT, 'QUORA_PASTE_SHEET.txt');
const ARTICLE_BASE = 'https://chargingthefuture.github.io/chargingthefuture/article/';
const SEPARATOR = '='.repeat(78);

type Saved = { key: string; title: string; listed: boolean; body: string | null };

function arg(name: string): string {
  const i = process.argv.indexOf(`--${name}`);
  const value = i === -1 ? undefined : process.argv[i + 1];
  if (!value) throw new Error(`--${name} is required`);
  return value;
}

/** The sheet split into the text before the first entry, the entries, and the text after them. */
function splitSheet(text: string): { head: string; entries: string[]; tail: string } {
  const first = text.indexOf(`${SEPARATOR}\nNo. `);
  if (first === -1) throw new Error('QUORA_PASTE_SHEET.txt: no entries found');
  const updates = text.search(new RegExp(`^${SEPARATOR}\\nUPDATE PASTES$`, 'm'));
  const end = updates === -1 ? text.length : updates;
  const entries = text
    .slice(first, end)
    .split(new RegExp(`(?=^${SEPARATOR}\\nNo\\. )`, 'm'))
    .filter((e) => e.length > 0);
  return { head: text.slice(0, first), entries, tail: text.slice(end) };
}

function entryKey(entry: string): string | undefined {
  const link = new RegExp(`^Full post: ${ARTICLE_BASE.replace(/[.]/g, '\\.')}(\\S+)$`, 'm').exec(entry)?.[1];
  return link ? decodeURIComponent(link) : undefined;
}

function prepare(): void {
  const today = arg('today');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error(`--today "${today}" is not YYYY-MM-DD`);
  const branchSheet = splitSheet(readFileSync(arg('branch-sheet'), 'utf8'));
  const posts = readFileSync(arg('posts'), 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  const saved: Saved[] = [];

  for (const rel of posts) {
    const path = resolve(WIKI_ROOT, rel);
    const text = readFileSync(path, 'utf8');
    const { meta } = parseFrontMatter(text);
    if (!meta) throw new Error(`${rel}: no front matter`);
    const slug = meta.slug ?? basename(rel).replace(/\.md$/i, '');
    const key = feedKey({ repo: meta.repo ?? 'chargingthefuture/wiki-site', slug });
    const listed = meta.listed !== false;

    if (!/^date: .*$/m.test(text)) throw new Error(`${rel}: no date line in its front matter`);
    writeFileSync(path, text.replace(/^date: .*$/m, `date: "${today}"`));

    const entry = branchSheet.entries.find((e) => entryKey(e) === key);
    if (listed && !entry) {
      throw new Error(`${rel}: the branch's QUORA_PASTE_SHEET.txt has no entry linking ${ARTICLE_BASE}${key}. A post is not finished without one.`);
    }
    // The body is everything after the header line; the header is rewritten in place().
    const body = entry ? entry.split('\n').slice(2).join('\n').replace(/\n+$/, '') : null;
    saved.push({ key, title: meta.title, listed, body });
    console.log(`${rel}: dated ${today}${entry ? ', paste sheet entry saved' : ''}`);
  }
  writeFileSync(arg('out'), JSON.stringify({ today, saved }, null, 2));
}

function place(): void {
  const { today, saved } = JSON.parse(readFileSync(arg('in'), 'utf8')) as { today: string; saved: Saved[] };
  const numbers = new Map(feedEntries(WIKI_ROOT).map((e) => [`${e.repo.split('/')[1]}/${e.slug}`, e.number]));
  const rank = new Map(feedOrder(WIKI_ROOT).map((page, i) => [feedKey(page), i]));
  const sheet = splitSheet(readFileSync(SHEET, 'utf8'));

  for (const post of saved) {
    if (!post.body) continue;
    const number = numbers.get(post.key);
    const position = rank.get(post.key);
    if (number === undefined || position === undefined) throw new Error(`${post.key}: not on /feed after the sync`);
    // Main may already carry an entry for this page (a rerun); it is replaced, never doubled.
    sheet.entries = sheet.entries.filter((e) => entryKey(e) !== post.key);
    const entry = `${SEPARATOR}\nNo. ${number} · ${today} · ${post.title}\n${post.body}\n\n`;
    const at = sheet.entries.findIndex((e) => (rank.get(entryKey(e) ?? '') ?? Infinity) > position);
    sheet.entries.splice(at === -1 ? sheet.entries.length : at, 0, entry);
    console.log(`${post.key}: paste sheet entry placed as No. ${number}`);
  }

  const count = sheet.entries.length;
  const head = sheet.head.replace(/^\d+ of \d+ written\.$/m, `${count} of ${count} written.`);
  writeFileSync(SHEET, head + sheet.entries.join('') + sheet.tail);
}

const command = process.argv[2];
if (command === 'prepare') prepare();
else if (command === 'place') place();
else {
  console.error('usage: settle-post-pr.ts prepare|place …');
  process.exit(2);
}

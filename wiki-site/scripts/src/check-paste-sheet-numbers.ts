/**
 * Fails when a post number in a paste sheet differs from the number the blog feed shows.
 *
 * Why this exists: QUORA_PASTE_SHEET.txt is numbered by hand, and by 2026-09-30 128 of its 405
 * numbers had drifted from /feed, mostly posts from the same day in swapped order. The teaser
 * readings speak those numbers ("Full post, No. N, available on the blog."), so 15 recordings
 * point listeners at the wrong post and cannot be fixed without paying to record them again
 * (owner report, 2026-09-30). This check catches a drifted number before anything is read aloud.
 *
 * It checks QUORA_PASTE_SHEET.txt (each "No. N · date · title" against the post its "Full post:"
 * link names) and TTS_PASTE_SHEET.txt (each "Full post, No. N, available on the blog." against the
 * post of its entry), against the permanent numbers in content/feed-numbers.json.
 *
 *   Run: pnpm wiki:check-numbers
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feedEntries } from './feed-numbers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '../..');
const ARTICLE_BASE = 'https://chargingthefuture.github.io/chargingthefuture/article/';

const feed = feedEntries(WIKI_ROOT);
const byLink = new Map(feed.map((e) => [`${e.repo.split('/')[1]}/${e.slug}`, e.number]));
const bySlug = new Map(feed.map((e) => [e.slug.split('/').pop() ?? e.slug, e.number]));
const problems: string[] = [];

const quora = readFileSync(resolve(WIKI_ROOT, 'QUORA_PASTE_SHEET.txt'), 'utf8');
const listEnd = quora.search(/^UPDATE PASTES$/m);
const list = listEnd === -1 ? quora : quora.slice(0, listEnd);
const headers = [...list.matchAll(/^No\. (\d+) · [^\n]*$/gm)];
headers.forEach((header, k) => {
  const entry = list.slice(header.index!, k + 1 < headers.length ? headers[k + 1].index : undefined);
  const link = new RegExp(`Full post: ${ARTICLE_BASE.replace(/[.]/g, '\\.')}(\\S+)`).exec(entry)?.[1];
  const expected = link ? byLink.get(decodeURIComponent(link)) : undefined;
  if (expected === undefined) problems.push(`QUORA_PASTE_SHEET.txt: "${header[0]}" links no listed post (${link ?? 'no Full post line'}).`);
  else if (Number(header[1]) !== expected) problems.push(`QUORA_PASTE_SHEET.txt: "${header[0]}" is No. ${expected} on the feed.`);
});

const tts = readFileSync(resolve(WIKI_ROOT, 'TTS_PASTE_SHEET.txt'), 'utf8');
for (const entry of tts.split(/\n=+ \d{4}-\d{2}-\d{2}[^\n]*=+\n/).slice(1)) {
  const slug = entry.trim().split('\n')[0];
  const said = /^Full post, No\. (\d+), available on the blog\.$/m.exec(entry)?.[1];
  if (said && Number(said) !== bySlug.get(slug)) problems.push(`TTS_PASTE_SHEET.txt: ${slug} says No. ${said}; the feed shows No. ${bySlug.get(slug)}.`);
}

if (problems.length > 0) {
  console.error(`✗ ${problems.length} post number(s) in the paste sheets differ from /feed:`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('Fix the number to the one /feed shows (pnpm wiki:paste-tts regenerates the TTS sheet).');
  process.exit(1);
}
console.log(`✓ Paste sheet numbers match /feed (${headers.length} Quora entries, ${feed.length} listed pages).`);

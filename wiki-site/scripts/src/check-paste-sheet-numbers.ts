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
 * It also fails when either Quora sheet lists its entries in an order other than the one /feed
 * shows (owner directive, 2026-10-03: the sheets follow the blog). The order is read from the
 * registry wiki:sync writes, so run the sync first. And it fails when two invite posts sit back to
 * back on /feed, apart from the one pair the owner allowed.
 *
 *   Run: pnpm wiki:check-numbers
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feedEntries } from './feed-numbers.js';
import { feedOrder, feedKey } from './feed-order.js';

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

// Order: each sheet's sequence of linked pages must be the feed's own sequence, restricted to the
// pages the sheet carries. The first page out of place is named, with the page it should follow.
const order = feedOrder(WIKI_ROOT).map(feedKey);
const rank = new Map(order.map((key, i) => [key, i]));
function checkOrder(sheet: string, text: string): void {
  const links = [...text.matchAll(new RegExp(`^Full post: ${ARTICLE_BASE.replace(/[.]/g, '\\.')}(\\S+)$`, 'gm'))]
    .map((m) => decodeURIComponent(m[1]))
    .filter((key) => rank.has(key));
  for (let i = 1; i < links.length; i++) {
    if (rank.get(links[i])! < rank.get(links[i - 1])!) {
      problems.push(`${sheet}: ${links[i]} sits below ${links[i - 1]}, but /feed shows it above. Order the sheet as /feed does.`);
      return;
    }
  }
}
checkOrder('QUORA_PASTE_SHEET.txt', list);
checkOrder('QUORA_PASTE_SHEET_FULL.txt', readFileSync(resolve(WIKI_ROOT, 'QUORA_PASTE_SHEET_FULL.txt'), 'utf8'));

// Invite posts are never back to back on /feed (owner directive, 2026-10-03): a reader scrolling
// past two invitations in a row reads the feed as a recruitment page. The one exception the owner
// made stands as the pair below; a new pair fails the check, and the fix is the merge order or the
// post date, never this list.
const ALLOWED_ADJACENT_INVITES = new Set(['wiki-site/an-invitation-to-brecht|wiki-site/an-invitation-to-eli']);
const feedPages = feedOrder(WIKI_ROOT);
for (let i = 1; i < feedPages.length; i++) {
  const [above, below] = [feedPages[i - 1], feedPages[i]];
  if (!/^An invitation to /.test(above.title) || !/^An invitation to /.test(below.title)) continue;
  const pair = `${feedKey(above)}|${feedKey(below)}`;
  if (!ALLOWED_ADJACENT_INVITES.has(pair)) problems.push(`/feed: invite posts back to back: ${feedKey(above)} above ${feedKey(below)}. Invites are never adjacent (owner directive, 2026-10-03).`);
}

const tts = readFileSync(resolve(WIKI_ROOT, 'TTS_PASTE_SHEET.txt'), 'utf8');
for (const entry of tts.split(/\n=+ \d{4}-\d{2}-\d{2}[^\n]*=+\n/).slice(1)) {
  const slug = entry.trim().split('\n')[0];
  const said = /^Full post, No\. (\d+), available on the blog\.$/m.exec(entry)?.[1];
  if (said && Number(said) !== bySlug.get(slug)) problems.push(`TTS_PASTE_SHEET.txt: ${slug} says No. ${said}; the feed shows No. ${bySlug.get(slug)}.`);
}

if (problems.length > 0) {
  console.error(`✗ ${problems.length} place(s) where the paste sheets differ from /feed:`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('Fix the number or the order to what /feed shows (pnpm wiki:paste-full and wiki:paste-tts regenerate the generated sheets).');
  process.exit(1);
}
console.log(`✓ Paste sheet numbers and order match /feed (${headers.length} Quora entries, ${feed.length} listed pages).`);

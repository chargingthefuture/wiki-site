#!/usr/bin/env node
/**
 * Writes artifacts/wiki/public/posts.json: every listed post with its /feed number, title, address
 * and full text in the same plain-text form as QUORA_PASTE_SHEET_FULL.txt. The app's admin Daily
 * Posts screen reads it to offer each post as one copy control, in a rotation that reaches every
 * post within 30 days and in theme groups (owner request, 2026-11-02). Readers of the blog see no
 * change: nothing links to the file.
 *
 * Scope: the posts collection and the Quora archive, listed and numbered. Archive entries are
 * unlisted while they are copy-edited and join the file the day they are listed, with no change
 * here. Invite posts are left out: the screen offers them nowhere. Product updates, guides,
 * Member of the Day and the Discourse archive are not posts the owner pastes, so they are left
 * out too.
 *
 * Build output like the feed: gitignored, written by both build scripts, never hand-edited. Run
 * wiki:sync first, since the numbers and the order come from the registry it writes.
 *
 * Usage:  pnpm wiki:posts-json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { toPasteable } from './paste-text.js';
import { feedOrder } from './feed-order.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '../..');
const CONTENT = join(WIKI_ROOT, 'content');
const OUT = join(WIKI_ROOT, 'artifacts/wiki/public/posts.json');
const SITE = 'https://chargingthefuture.github.io/chargingthefuture/article';
const COLLECTIONS = new Set(['posts', 'archive/quora']);
// The title is the contract for an invite post, the same test the TTS sheet uses.
const INVITE_TITLE = /^An invitation to /;

type PostEntry = {
  number: number;
  slug: string;
  title: string;
  date: string;
  collection: string;
  url: string;
  text: string;
};

function main() {
  const posts: PostEntry[] = feedOrder(WIKI_ROOT)
    .filter((page) => COLLECTIONS.has(page.collection ?? '') && typeof page.number === 'number')
    .filter((page) => !INVITE_TITLE.test(page.title))
    .map((page) => {
      if (!page.path) throw new Error(`registry entry ${page.slug} has no path; run pnpm wiki:sync`);
      const raw = readFileSync(join(CONTENT, page.path), 'utf8');
      const repo = page.repo.split('/')[1] ?? page.repo;
      return {
        number: page.number as number,
        slug: page.slug,
        title: page.title,
        date: page.date,
        collection: page.collection as string,
        url: `${SITE}/${repo}/${encodeURIComponent(page.slug)}`,
        text: toPasteable(raw),
      };
    })
    .sort((a, b) => a.number - b.number);

  writeFileSync(OUT, `${JSON.stringify({ generatedAt: new Date().toISOString(), posts }, null, 1)}\n`, 'utf8');
  console.log(`✓ Wrote ${posts.length} posts → ${OUT}`);
}

main();

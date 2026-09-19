/**
 * Generates artifacts/wiki/public/invites.json — one card per published invite post.
 *
 * Why this exists: an invite post is announced on Quora by tagging the person, and Quora erases
 * the account within hours or days. By the time the person taps the notification, the post is
 * gone and the only surviving address is the blog. So the blog, the app's signed-out pages and
 * the landing page all carry a row of invite cards, and this file is what every one of them
 * reads. One list, written at build time from the posts themselves, never hand-edited.
 *
 * What counts as an invite post: a listed post in content/posts whose title follows the shape
 * INVITE_QUEUE.md prescribes, "An invitation to <name>". The title is the contract, so no front
 * matter flag is needed and no published post is touched.
 *
 * Like feed.xml this is build output, gitignored, written by wiki:build and wiki:build:pages.
 * Consumers on other origins can read it because GitHub Pages answers every request with
 * Access-Control-Allow-Origin: *.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontMatter } from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const POSTS_DIR = resolve(BLOG_ROOT, 'content/posts');
const OUT = resolve(BLOG_ROOT, 'artifacts/wiki/public/invites.json');

const SITE = 'https://chargingthefuture.github.io/chargingthefuture';
const INVITE_TITLE = /^An invitation to\s+(.+?)\.?$/i;

/** The first words of the post, because that is what the Quora notification showed the person. */
const OPENING_WORDS = 28;

export type InviteCard = {
  /** The person's name as the title gives it. */
  name: string;
  title: string;
  slug: string;
  repo: string;
  /** Absolute address, for readers on another origin. */
  url: string;
  date: string;
  /** The post's opening sentence or so, cut at a word boundary. */
  opening: string;
  excerpt: string;
};

function plainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstParagraph(body: string): string {
  for (const block of body.split(/\n\s*\n/)) {
    const line = block.trim();
    if (!line) continue;
    if (/^(#|!|<|\||-|\d+\.|>)/.test(line)) continue;
    return plainText(line);
  }
  return '';
}

function opening(body: string): string {
  const words = firstParagraph(body).split(' ').filter(Boolean);
  if (words.length <= OPENING_WORDS) return words.join(' ');
  return `${words.slice(0, OPENING_WORDS).join(' ')}…`;
}

function collect(): InviteCard[] {
  const cards: InviteCard[] = [];
  for (const entry of readdirSync(POSTS_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) continue;
    const file = join(POSTS_DIR, entry.name);
    const { meta, body } = parseFrontMatter(readFileSync(file, 'utf8'));
    if (!meta || !meta.title || !meta.date) continue;
    if (meta.listed === false) continue;
    const match = INVITE_TITLE.exec(String(meta.title).trim());
    if (!match) continue;
    const slug = meta.slug ?? relative(POSTS_DIR, file).replace(/\\/g, '/').replace(/\.md$/i, '');
    const repo = meta.repo ?? 'chargingthefuture/wiki-site';
    const shortRepo = repo.split('/')[1] || repo;
    cards.push({
      name: match[1].trim(),
      title: String(meta.title).trim(),
      slug,
      repo,
      url: `${SITE}/article/${shortRepo}/${encodeURIComponent(slug)}`,
      date: String(meta.date),
      opening: opening(body),
      excerpt: String(meta.excerpt ?? '').trim(),
    });
  }
  return cards.sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug);
  });
}

function main() {
  const cards = collect();
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify({ site: SITE, count: cards.length, invites: cards }, null, 2)}\n`, 'utf8');
  console.log(`invites.json: ${cards.length} invite post(s) → ${relative(BLOG_ROOT, OUT)}`);
}

main();

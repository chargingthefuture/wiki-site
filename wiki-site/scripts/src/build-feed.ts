#!/usr/bin/env node
/**
 * Generates the RSS feed at artifacts/wiki/public/feed.xml.
 *
 * Why this exists. Quora erases the accounts this project posts from, and each
 * erasure destroys the connection to everybody who was following there — not
 * the writing, which is here, but the readers knowing where to look next. A
 * feed is a way to follow the blog that nobody can revoke: no account, no
 * address handed over, no company in the middle who can be complained to.
 *
 * Each item carries the post itself, not a teaser. A feed that carried only the
 * opening paragraph would send every subscriber to the site to read the rest,
 * which is the arrangement a reader exists to end.
 *
 * It is not expected to be how most readers follow. Feed readers went niche
 * after Google Reader closed in 2013 and a non-technical reader will not
 * install one. The feed earns its place two other ways: a reader who does have
 * one is a press away, and it is a machine-readable list of what has been
 * published, which is the input any later mailing step reads rather than
 * needing its own code.
 *
 * Scope: every collection, matching the site's own /feed page, filtered to the
 * listed ones and capped at the newest few dozen. Archive entries carry their
 * original posting date, so an import of old material sorts below current posts
 * and never floods somebody's reader.
 *
 * Generated, never hand-edited, and not committed: it is built as part of
 * `pnpm wiki:build` and `pnpm wiki:build:pages`, so it cannot drift from the
 * posts. Run it on its own with `pnpm wiki:feed`.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { parseFrontMatter } from './frontmatter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const CONTENT_ROOT = resolve(BLOG_ROOT, 'content');
const OUT = resolve(BLOG_ROOT, 'artifacts/wiki/public/feed.xml');

const SITE = 'https://chargingthefuture.github.io/chargingthefuture';
const FEED_URL = `${SITE}/feed.xml`;

const TITLE = 'Charging The Future';
const DESCRIPTION =
  'Writing on trafficking, being targeted, and building an economy survivors run themselves.';

// The same list sync-articles.ts walks, so the feed and the site agree on what
// a post is.
const COLLECTIONS = [
  'posts',
  'product-updates',
  'guides',
  'insights',
  'member-of-the-day',
  'archive/discourse',
  'archive/quora',
];

/**
 * How many items ship. A feed is re-fetched on a schedule by every subscriber,
 * so the entire catalog in one file would be megabytes pulled repeatedly for no
 * gain — a reader keeps what it has already seen. Fifty covers months of
 * publishing at the current rate.
 *
 * Fifty full posts is around half a megabyte, against fifty kilobytes when this
 * carried teasers. That is paid once per publish rather than once per poll: the
 * host answers an unchanged feed with a 304 and no body at all, so a reader
 * checking hourly transfers nothing between posts.
 */
const MAX_ITEMS = 50;

type Entry = {
  slug: string;
  repo: string;
  title: string;
  date: string;
  description: string;
  body: string;
  category: string;
};

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

function collect(): Entry[] {
  const entries: Entry[] = [];
  for (const collection of COLLECTIONS) {
    const dir = join(CONTENT_ROOT, collection);
    let files: string[] = [];
    try {
      files = listMarkdownFiles(dir);
    } catch {
      continue; // a collection directory that does not exist yet
    }
    for (const file of files) {
      const raw = readFileSync(file, 'utf8');
      const { meta, body } = parseFrontMatter(raw);
      if (!meta || !meta.date || !meta.title) continue;
      // `listed: false` keeps a page out of the article grid on purpose. It
      // stays reachable by address; it does not go out to subscribers.
      if (meta.listed === false) continue;
      const innerPath = relative(dir, file).replace(/\\/g, '/');
      entries.push({
        slug: meta.slug ?? innerPath.replace(/\.md$/i, ''),
        repo: meta.repo ?? 'chargingthefuture/wiki-site',
        title: String(meta.title),
        date: String(meta.date),
        // The teaser is the short standalone version — it says what the post
        // says, so a reader who never opens the link still got it. Posts
        // predating that field fall back to the excerpt, same as the site does.
        description: String(meta.teaser?.toString().trim() || meta.excerpt || '').trim(),
        body: String(body ?? ''),
        category: String(meta.category ?? ''),
      });
    }
  }

  return entries
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      // Slug as the tie-break rather than anything read from git, so the same
      // content always produces the same file — a feed that reshuffles on every
      // build shows subscribers items they have already read.
      return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug);
    })
    .slice(0, MAX_ITEMS);
}

/** The article's address, matching getArticleUrl in the generated registry. */
function articleUrl(repo: string, slug: string): string {
  const shortRepo = repo.split('/')[1] || repo;
  return `${SITE}/article/${shortRepo}/${encodeURIComponent(slug)}`;
}

/**
 * Minutes east of UTC for `America/New_York` at a given instant. Read from the
 * platform rather than hard-coded, so the switch in and out of daylight saving
 * is not four months of wrong timestamps.
 */
function easternOffsetMinutes(at: Date): number {
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'shortOffset',
  }).format(at);
  const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(formatted);
  if (!match) return -300; // Eastern standard time, the safe fallback
  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function rfc822(at: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    `${DAYS[at.getUTCDay()]}, ${p(at.getUTCDate())} ${MONTHS[at.getUTCMonth()]} ` +
    `${at.getUTCFullYear()} ${p(at.getUTCHours())}:${p(at.getUTCMinutes())}:${p(at.getUTCSeconds())} GMT`
  );
}

/**
 * A post's date carries no time — it is the day it was written where the owner
 * is, which is Eastern. Midday Eastern is used as the instant, far enough from
 * either edge that no conversion pushes a post onto the day before or after.
 */
function pubDate(date: string): string {
  const [y, m, d] = date.split('-').map((part) => Number.parseInt(part, 10));
  if (![y, m, d].every(Number.isFinite)) {
    throw new Error(`Feed: "${date}" is not a YYYY-MM-DD date, so no publish time can be written.`);
  }
  const noonGuess = new Date(Date.UTC(y, m - 1, d, 12));
  return rfc822(new Date(Date.UTC(y, m - 1, d, 12) - easternOffsetMinutes(noonGuess) * 60_000));
}

/**
 * Where a content image really lives. The site bundles `content/images/*` through
 * Vite, which hashes the filename, so the address a page uses is not one this
 * script can work out. The repository is public, so the file itself has a stable
 * address and that is what goes in the feed — a reader shows the picture instead
 * of a broken frame, and nothing has to be copied into the build to make it work.
 */
const IMAGE_BASE =
  'https://raw.githubusercontent.com/chargingthefuture/wiki-site/main/wiki-site/content/images/';

/**
 * The post itself, as HTML.
 *
 * Until this existed a subscriber got the teaser and nothing else, so following
 * the blog in a reader meant reading a paragraph and then opening the site
 * anyway — which is the arrangement the reader is supposed to end.
 *
 * Addresses are made absolute. A feed is read somewhere else, so a relative one
 * resolves against whatever that somewhere is and lands nowhere.
 */
function bodyHtml(markdown: string): string {
  const html = marked.parse(markdown, { async: false, gfm: true }) as string;
  return html
    .replace(/(<img\b[^>]*\bsrc=")\/?images\/([^"]+)(")/g, (_m, before, name, after) =>
      `${before}${IMAGE_BASE}${name}${after}`)
    .replace(/(<a\b[^>]*\bhref=")\/?images\/([^"]+)(")/g, (_m, before, name, after) =>
      `${before}${IMAGE_BASE}${name}${after}`);
}

/**
 * Wrap HTML so an XML parser leaves it alone. The only sequence that can end the
 * section is `]]>`, and splitting it across two sections is the standard way to
 * carry it — a post quoting that sequence would otherwise truncate the item and
 * every item after it.
 */
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

function xml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function main() {
  const entries = collect();

  const items = entries
    .map((entry) => {
      const url = articleUrl(entry.repo, entry.slug);
      return [
        '    <item>',
        `      <title>${xml(entry.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        // The address is the identity. It never changes for a given post, which
        // is what stops a reader showing something twice after an edit.
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        `      <pubDate>${pubDate(entry.date)}</pubDate>`,
        entry.category ? `      <category>${xml(entry.category)}</category>` : null,
        `      <description>${xml(entry.description)}</description>`,
        // The teaser stays in <description> for readers that show only that;
        // the post itself goes here, which is what every current reader shows.
        `      <content:encoded>${cdata(bodyHtml(entry.body))}</content:encoded>`,
        '    </item>',
      ]
        .filter((line): line is string => line !== null)
        .join('\n');
    })
    .join('\n');

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${xml(TITLE)}</title>`,
    `    <link>${xml(SITE)}/</link>`,
    `    <description>${xml(DESCRIPTION)}</description>`,
    '    <language>en-us</language>',
    `    <atom:link href="${xml(FEED_URL)}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${rfc822(new Date())}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, feed, 'utf8');
  console.log(`✓ Wrote ${entries.length} items → ${relative(BLOG_ROOT, OUT)}`);
}

main();

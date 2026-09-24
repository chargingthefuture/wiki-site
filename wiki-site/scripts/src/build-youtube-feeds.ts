#!/usr/bin/env node
/**
 * Generates one RSS feed per archived YouTube channel, at
 * artifacts/wiki/public/feeds/youtube/<slug>.xml.
 *
 * Why this exists. A YouTube channel's own feed carries only its newest handful
 * of uploads, so a reader subscribed to it receives exactly what is recent and
 * never what came before. Somebody who wants to watch a channel only up to a
 * date they trust cannot get there from that feed: the videos they want never
 * arrive at all, and no filter can reach what was never delivered.
 *
 * The archive under content/youtube/ is the list of a channel's uploads,
 * collected once and added to, so this can emit every one of them. A reader
 * subscribing here receives the catalog and filters it by date on its own side
 * (`pubdate:/2024-12-31` in FreshRSS), which is the arrangement that was wanted.
 *
 * On dates. Collected without a YouTube API key, an upload date comes from a
 * relative label on the channel page — "2 years ago" — so it is approximate and
 * an entry near a date boundary can fall on the wrong side of it. Each entry
 * records whether its date is approximate, and the generated feed says so in
 * the channel description rather than letting a reader assume otherwise.
 *
 * Generated, never hand-edited, and not committed: it is built as part of
 * `pnpm wiki:build` and `pnpm wiki:build:pages`. The archive it reads IS
 * committed, because it cannot be rebuilt on demand — it depends on a service
 * that refuses a data center address often enough to matter.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const ARCHIVE_DIR = resolve(BLOG_ROOT, 'content/youtube');
const OUT_DIR = resolve(BLOG_ROOT, 'artifacts/wiki/public/feeds/youtube');

const SITE = 'https://chargingthefuture.github.io/chargingthefuture';

type Video = {
  id: string;
  title: string;
  /** YYYY-MM-DD. Approximate when `approximateDate` is true. */
  date: string;
  approximateDate?: boolean;
  duration?: number | null;
};

type Archive = {
  slug: string;
  name: string;
  channelUrl: string;
  collectedAt?: string;
  videos: Video[];
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function rfc822(at: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    `${DAYS[at.getUTCDay()]}, ${p(at.getUTCDate())} ${MONTHS[at.getUTCMonth()]} ` +
    `${at.getUTCFullYear()} ${p(at.getUTCHours())}:${p(at.getUTCMinutes())}:${p(at.getUTCSeconds())} GMT`
  );
}

/** Midday, so no timezone conversion moves an entry onto the day before or after. */
function pubDate(date: string): string | null {
  const [y, m, d] = date.split('-').map((part) => Number.parseInt(part, 10));
  if (![y, m, d].every(Number.isFinite)) return null;
  return rfc822(new Date(Date.UTC(y, m - 1, d, 12)));
}

function xml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function readArchives(): Archive[] {
  if (!existsSync(ARCHIVE_DIR)) return [];
  const archives: Archive[] = [];
  for (const entry of readdirSync(ARCHIVE_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.json')) continue;
    const parsed = JSON.parse(readFileSync(join(ARCHIVE_DIR, entry.name), 'utf8')) as Archive;
    if (!parsed.slug || !Array.isArray(parsed.videos)) {
      throw new Error(`content/youtube/${entry.name} has no slug or no videos array.`);
    }
    archives.push(parsed);
  }
  return archives;
}

/**
 * Wrap HTML so an XML parser leaves it alone. `]]>` is the only sequence that can
 * end the section, and splitting it across two is the standard way to carry it.
 */
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

/**
 * What a reader shows for one video: the player, then the address under it.
 *
 * Without this an entry was a title and a date and nothing to press. The address
 * was on the item's link, so the title opened it, but a list of titles is not
 * what somebody subscribes to a channel for.
 *
 * FreshRSS's sanitizer allows an iframe with `src` and `allowfullscreen`, so the
 * player renders in place. The link underneath is what a reader that blocks
 * frames is left with, which is the same thing the item's link already carries.
 *
 * nocookie rather than the ordinary embed host: it is the same player from the
 * same company, without the tracking cookie set on arrival. Somebody who
 * self-hosts a reader to get away from being profiled did not ask for one here.
 *
 * rel=0 so that what the player offers when a video ends comes from the same
 * channel rather than from anywhere on the site. The page around a video —
 * recommendations, comments — is the part a reader subscribes here to be rid
 * of, and the end-of-video grid is the last piece of it the embed still shows.
 */
function videoHtml(id: string, title: string, date: string, approximate: boolean): string {
  const safeId = encodeURIComponent(id);
  const watch = `https://www.youtube.com/watch?v=${safeId}`;
  const when = `${date}${approximate ? ' (approximate)' : ''}`;
  return [
    `<p><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${safeId}?rel=0"`,
    ` title="${xml(title)}" frameborder="0" allowfullscreen></iframe></p>`,
    `<p><a href="${watch}">Watch on YouTube</a> — ${xml(when)}</p>`,
  ].join('');
}

function feedFor(archive: Archive): string {
  const anyApproximate = archive.videos.some((video) => video.approximateDate);
  const description =
    `Every upload collected from ${archive.name}, oldest kept alongside newest, so a reader can ` +
    `filter by date.` +
    (anyApproximate
      ? ' Dates are approximate: they were read from relative labels on the channel page, so an' +
        ' entry near a cutoff may fall on the wrong side of it.'
      : '');

  const items = archive.videos
    .slice()
    .sort((a, b) => (b.date.localeCompare(a.date) !== 0 ? b.date.localeCompare(a.date) : a.id.localeCompare(b.id)))
    .map((video) => {
      const url = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
      const when = pubDate(video.date);
      return [
        '    <item>',
        `      <title>${xml(video.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="false">yt:video:${xml(video.id)}</guid>`,
        when ? `      <pubDate>${when}</pubDate>` : null,
        // Plain text for a reader that shows only this, HTML for every reader
        // that prefers the richer one.
        `      <description>${xml(`${video.title} — ${video.date}${video.approximateDate ? ' (approximate)' : ''} — ${url}`)}</description>`,
        `      <content:encoded>${cdata(videoHtml(video.id, video.title, video.date, video.approximateDate === true))}</content:encoded>`,
      ]
        .filter((line): line is string => line !== null)
        .concat('    </item>')
        .join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${xml(archive.name)} (archive)</title>`,
    `    <link>${xml(archive.channelUrl)}</link>`,
    `    <description>${xml(description)}</description>`,
    '    <language>en-us</language>',
    `    <atom:link href="${xml(`${SITE}/feeds/youtube/${archive.slug}.xml`)}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${rfc822(new Date())}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

function main() {
  const archives = readArchives();
  if (archives.length === 0) {
    console.log('✓ No YouTube archives in content/youtube/; nothing to write.');
    return;
  }
  mkdirSync(OUT_DIR, { recursive: true });
  for (const archive of archives) {
    const out = join(OUT_DIR, `${archive.slug}.xml`);
    writeFileSync(out, feedFor(archive), 'utf8');
    console.log(`✓ ${archive.videos.length} videos → ${relative(BLOG_ROOT, out)}`);
  }
}

main();

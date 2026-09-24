#!/usr/bin/env node
/**
 * Collects a YouTube channel's upload list into content/youtube/<slug>.json.
 *
 * Why. A channel's own feed carries only its newest handful of uploads. Somebody
 * who wants to watch a channel only up to a date they trust cannot get there
 * from it: the videos they want never arrive, so no filter in a reader can reach
 * them. This reads the channel's list of uploads instead — all of it — and keeps
 * it in the repository, where `pnpm wiki:youtube` turns it into a feed.
 *
 * The archive is committed because it cannot be rebuilt on demand. YouTube
 * refuses a data center address often enough that a build depending on a live
 * fetch would fail on its own schedule; once a video is in the archive it stays,
 * whether or not the next collection works.
 *
 * Dates. Without an API key the upload date comes from a relative label on the
 * channel page — "2 years ago" — which yt-dlp converts approximately, so an
 * entry near a cutoff can land on the wrong side. Every entry collected that way
 * is marked, the feed says so, and an existing date is never overwritten by a
 * later approximate one — so a pass that has exact dates can only improve the
 * archive, never degrade it.
 *
 * Cutoff. A channel can carry a date, and the published feed then stops there:
 * videos dated on or after it are collected into the archive as always but never
 * written into the feed, so nothing after that date reaches a reader at all.
 * That is the arrangement the archive exists for — reading a channel only up to
 * a date you trust — done in the feed rather than left to a filter in a reader,
 * which can only hide what has already arrived. The date is kept on refresh; to
 * change it, run again with the channel and the new date (owner decision,
 * 2026-09-23: the collected channels are the owner's own reading, so the date is
 * theirs).
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run collect-youtube-archive -- --channel @SomeChannel
 *   pnpm --filter @workspace/scripts run collect-youtube-archive -- --channel @SomeChannel --cutoff 2024-12-31
 *   pnpm --filter @workspace/scripts run collect-youtube-archive          # refresh every archive
 *
 * Requires yt-dlp on PATH.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const ARCHIVE_DIR = resolve(BLOG_ROOT, 'content/youtube');

type Video = {
  id: string;
  title: string;
  date: string;
  approximateDate?: boolean;
  duration?: number | null;
};

type Archive = {
  slug: string;
  name: string;
  channelUrl: string;
  collectedAt?: string;
  /** YYYY-MM-DD. Videos dated on or after this are kept in the archive but left out of the feed. */
  cutoff?: string;
  videos: Video[];
};

/**
 * `@Handle`, a bare handle, or any channel address → the uploads page for it.
 *
 * An address copied from a phone carries things that do not name the channel: a
 * query on the end ("?ra=m") and the mobile host. Both are dropped, because both
 * otherwise end up in the file name and in what the feed says the channel is.
 */
function uploadsUrl(channel: string): string {
  const trimmed = channel.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    const url = new URL(trimmed);
    url.search = '';
    url.hash = '';
    if (/^(m|music)\.youtube\.com$/i.test(url.hostname)) url.hostname = 'www.youtube.com';
    const path = url.pathname.replace(/\/+$/, '').replace(/\/videos$/i, '');
    return `${url.origin}${path}/videos`;
  }
  const handle = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
  return `https://www.youtube.com/${handle}/videos`;
}

function slugFor(channelUrl: string): string {
  const tail = channelUrl.replace(/\/videos$/i, '').split('/').filter(Boolean).pop() ?? 'channel';
  return tail
    .replace(/^@/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** YYYYMMDD, as yt-dlp prints it, to YYYY-MM-DD. */
function isoDate(compact: string): string | null {
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(compact.trim());
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

type Collected = { name: string; videos: Video[] };

function collect(channelUrl: string): Collected {
  // Metadata only: --flat-playlist never touches a video. approximate_date is
  // what makes a date available at all in that mode.
  const raw = execFileSync(
    'yt-dlp',
    [
      '--flat-playlist',
      '--ignore-errors',
      '--no-warnings',
      '--extractor-args',
      'youtubetab:approximate_date',
      '--print',
      '%(id)s\t%(title)s\t%(upload_date)s\t%(duration)s\t%(channel)s',
      channelUrl,
    ],
    { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
  );

  const videos: Video[] = [];
  let name = '';
  for (const line of raw.split('\n')) {
    if (line.trim() === '') continue;
    const [id, title, uploadDate, duration, channelName] = line.split('\t');
    if (!id || id === 'NA') continue;
    if (!name && channelName && channelName !== 'NA') name = channelName;
    const date = isoDate(uploadDate ?? '');
    if (date === null) continue; // no date means nothing to filter on; skip rather than invent one
    const seconds = Number.parseInt(duration ?? '', 10);
    videos.push({
      id,
      title: title && title !== 'NA' ? title : id,
      date,
      approximateDate: true,
      duration: Number.isFinite(seconds) ? seconds : null,
    });
  }
  return { name, videos };
}

/** Existing entries win: a date already recorded is never replaced by an approximate one. */
function merge(existing: Video[], found: Video[]): { videos: Video[]; added: number } {
  const byId = new Map(existing.map((video) => [video.id, video]));
  let added = 0;
  for (const video of found) {
    if (byId.has(video.id)) continue;
    byId.set(video.id, video);
    added += 1;
  }
  const videos = [...byId.values()].sort((a, b) =>
    b.date.localeCompare(a.date) !== 0 ? b.date.localeCompare(a.date) : a.id.localeCompare(b.id),
  );
  return { videos, added };
}

function refresh(channelUrl: string, slug: string, existing: Archive | null, cutoff?: string): void {
  const found = collect(channelUrl);
  if (found.videos.length === 0) {
    throw new Error(
      `No uploads came back for ${channelUrl}. YouTube refuses a data center address from time to ` +
        `time; nothing was written, so the archive already in the repository is untouched.`,
    );
  }
  const { videos, added } = merge(existing?.videos ?? [], found.videos);
  const archive: Archive = {
    slug,
    name: existing?.name || found.name || slug,
    channelUrl: channelUrl.replace(/\/videos$/i, ''),
    collectedAt: new Date().toISOString().slice(0, 10),
    // A date given now wins; otherwise the one already recorded stays. Absent from the file when
    // there is none, rather than written as null.
    ...(cutoff ?? existing?.cutoff ? { cutoff: cutoff ?? existing?.cutoff } : {}),
    videos,
  };
  mkdirSync(ARCHIVE_DIR, { recursive: true });
  writeFileSync(join(ARCHIVE_DIR, `${slug}.json`), `${JSON.stringify(archive, null, 2)}\n`, 'utf8');
  console.log(`✓ ${archive.name}: ${videos.length} videos (${added} new) → content/youtube/${slug}.json`);
}

function readArchive(path: string): Archive {
  return JSON.parse(readFileSync(path, 'utf8')) as Archive;
}

function main(): void {
  const args = process.argv.slice(2);
  const index = args.indexOf('--channel');
  const channel = index >= 0 ? args[index + 1] : undefined;
  const cutoffIndex = args.indexOf('--cutoff');
  const cutoff = cutoffIndex >= 0 ? args[cutoffIndex + 1] : undefined;
  if (cutoff !== undefined) {
    if (channel === undefined || channel === '') {
      throw new Error('--cutoff names a date for one channel, so it needs --channel beside it.');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cutoff) || Number.isNaN(Date.parse(`${cutoff}T12:00:00Z`))) {
      throw new Error(`--cutoff must be a real date written YYYY-MM-DD, not "${cutoff}".`);
    }
  }

  if (channel !== undefined && channel !== '') {
    const channelUrl = uploadsUrl(channel);
    const slug = slugFor(channelUrl);
    const path = join(ARCHIVE_DIR, `${slug}.json`);
    refresh(channelUrl, slug, existsSync(path) ? readArchive(path) : null, cutoff);
    return;
  }

  if (!existsSync(ARCHIVE_DIR)) {
    console.log('No content/youtube/ yet, and no channel given. Nothing to do.');
    return;
  }
  const files = readdirSync(ARCHIVE_DIR).filter((name) => name.toLowerCase().endsWith('.json'));
  if (files.length === 0) {
    console.log('No archives in content/youtube/, and no channel given. Nothing to do.');
    return;
  }
  const failures: string[] = [];
  for (const file of files) {
    const archive = readArchive(join(ARCHIVE_DIR, file));
    try {
      refresh(uploadsUrl(archive.channelUrl), archive.slug, archive);
    } catch (error) {
      // One channel refusing must not stop the others, and must not pass silently.
      failures.push(`${archive.slug}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (failures.length > 0) {
    throw new Error(`Some channels could not be collected:\n- ${failures.join('\n- ')}`);
  }
}

main();

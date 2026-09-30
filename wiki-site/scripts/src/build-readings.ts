/**
 * Generates artifacts/wiki/public/readings.json — one entry per post that has a recorded reading.
 *
 * A post has a reading when content/audio (or, for a file uploaded to the wrong folder, anywhere
 * audio-files.ts looks) holds a file named after its slug (the last path
 * segment): content/audio/who-teaches-them.mp3 for content/posts/who-teaches-them.md. The post
 * page shows its "Listen to this post" player from the same files (the content-audio plugin in
 * artifacts/wiki/vite.config.ts), and the app's Chyme readings loop plays this list while nobody is
 * live. So uploading one file is the entire step: the post gets its player and Chyme gets the reading.
 *
 * Like invites.json this is build output, gitignored, written by wiki:build and wiki:build:pages.
 * Oldest post first, so the loop plays the posts in the order they were published.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFile } from 'music-metadata';
import { parseFrontMatter } from './frontmatter.js';
import { findAudioFiles } from './audio-files.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const CONTENT_DIR = resolve(BLOG_ROOT, 'content');
const OUT = resolve(BLOG_ROOT, 'artifacts/wiki/public/readings.json');

const SITE = 'https://chargingthefuture.github.io/chargingthefuture';

export type Reading = {
  slug: string;
  title: string;
  date: string;
  /** Absolute addresses, for readers on another origin. */
  postUrl: string;
  audioUrl: string;
  /**
   * Length of the recording in seconds, read from the file here. The app's player needs every
   * length before it starts, to place each listener at the same point in the loop; reading them in
   * the browser meant a network wait between the tap and the sound, and Safari refuses to start
   * audio after one.
   */
  durationSeconds: number;
};

function markdownFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...markdownFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md') && entry.name !== 'README.md') out.push(full);
  }
  return out;
}

function collectionOf(file: string): string {
  return relative(CONTENT_DIR, file).split(/[\\/]/)[0];
}

async function durationOf(file: string): Promise<number | null> {
  try {
    const { format } = await parseFile(file, { duration: true });
    return format.duration && format.duration > 0 ? Math.round(format.duration * 10) / 10 : null;
  } catch (error) {
    console.warn(`readings.json: could not read ${relative(BLOG_ROOT, file)}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

async function collect(): Promise<Reading[]> {
  const audioBySlug = findAudioFiles(BLOG_ROOT);
  const readings: Reading[] = [];
  for (const file of markdownFiles(CONTENT_DIR)) {
    const { meta } = parseFrontMatter(readFileSync(file, 'utf8'));
    if (!meta || !meta.title || !meta.date) continue;
    const collectionDir = join(CONTENT_DIR, collectionOf(file));
    const slug = meta.slug ?? relative(collectionDir, file).replace(/\\/g, '/').replace(/\.md$/i, '');
    const audio = audioBySlug.get(slug.split('/').pop() ?? '');
    if (!audio) continue;
    const durationSeconds = await durationOf(audio.path);
    // A file whose length cannot be read cannot be placed in the loop, so it is left out of the
    // list (the post's own player still shows it).
    if (durationSeconds === null) continue;
    const repo = meta.repo ?? 'chargingthefuture/wiki-site';
    const shortRepo = repo.split('/')[1] || repo;
    readings.push({
      slug,
      title: String(meta.title).trim(),
      date: String(meta.date),
      postUrl: `${SITE}/article/${shortRepo}/${slug.split('/').map(encodeURIComponent).join('/')}`,
      audioUrl: `${SITE}/audio/${audio.served}`,
      durationSeconds,
    });
  }
  return readings.sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
}

async function main() {
  const readings = await collect();
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify({ site: SITE, count: readings.length, readings }, null, 2)}\n`, 'utf8');
  console.log(`readings.json: ${readings.length} recorded post(s) → ${relative(BLOG_ROOT, OUT)}`);
}

await main();

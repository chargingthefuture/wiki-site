#!/usr/bin/env node
/**
 * Generates TTS_PASTE_SHEET.txt — each post as text to paste into a text-to-speech tool, so the
 * recording can be uploaded as content/audio/<slug>.mp3 (the post's "Listen to this post" player
 * and the app's Chyme readings loop both pick it up).
 *
 * What goes in (owner directive, 2026-09-29): the posts from 2026-08-16 on — the same start as the
 * full Quora sheet, the copy-edited writing — oldest first, except the invite posts. Text to
 * speech is paid per character, so it is spent on the posts that carry the argument.
 *
 * Each entry is the title on its own line, then the post. Nothing that only makes sense on a
 * screen: an address read aloud is noise, so
 *
 *   links         keep their words and lose their address
 *   addresses     a sentence built around one ("The board is at <address>.") is removed, and so
 *                 is a sentence ending in a colon that only introduced one; a bare site name or
 *                 an email address stays
 *   "Where to find it in the app"   is left out entirely (it is a list of links)
 *   the sign-up line                is left out (it is an address)
 *   images        become "Screenshot: <alt text>", because in credited posts the alt text
 *                 carries the quoted words
 *   table rows    are read as their cells joined by commas
 *   bullets       lose their "-" marker, which some voices read aloud as "dash"
 *   every line    ends in punctuation (a full stop is added to the title, headings, list items and
 *                 table rows that have none), because a voice pauses on punctuation, not on a
 *                 line break, and would otherwise run a heading into the next sentence
 *   paragraphs    are separated by a blank line
 *
 * Above each entry: a separator line with the post date, then the name to save the recording under
 * (no .mp3, which the voice tool adds), alone on its line so it can be copied by itself. Neither is pasted into the voice tool.
 *
 * Usage:  pnpm wiki:paste-tts
 */

import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontMatter } from './frontmatter.js';
import { toPasteable } from './paste-text.js';
import { load } from 'js-yaml';
import { parseFile } from 'music-metadata';
import { findAudioFiles, type AudioFile } from './audio-files.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '../..');
const POSTS_DIR = join(WIKI_ROOT, 'content/posts');
const OUT = join(WIKI_ROOT, 'TTS_PASTE_SHEET.txt');
const FROM = '2026-08-16';
const SKIPPED_FILE = join(WIKI_ROOT, 'content/audio/skipped.yaml');
// The title is the contract for an invite post (see build-invites.ts).
const INVITE_TITLE = /^An invitation to\s+/i;
const WHERE_TO_FIND = /^##\s+Where to find it in the app\s*$/im;
const SIGN_UP = /^>?\s*To sign up: https:\/\/chargingthefuture\.com\..*$/m;
// Any address: with https://, or written without it but with a path (app.chargingthefuture.com/apps/
// fireside). A bare site name (chargingthefuture.com) or an email address is not one: short, and the
// sentence needs it.
const ADDRESS = /https?:\/\/[^\s)\]]+|\b(?:[a-z0-9-]+\.)+[a-z]{2,}\/[^\s"')]*/gi;
const HAS_ADDRESS = /https?:\/\/[^\s)\]]+|\b(?:[a-z0-9-]+\.)+[a-z]{2,}\/[^\s"')]*/i;

// A sentence built around an address ("The board is at <address>.", "The guide walks through it:
// <address>") says nothing once the address is gone, so it goes. In a screenshot description the
// address is only quoted from the picture, so just the address goes.
function dropAddresses(line: string): string {
  if (!HAS_ADDRESS.test(line)) return line;
  if (line.startsWith('Screenshot:')) return line.replace(ADDRESS, '');
  return line
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !HAS_ADDRESS.test(sentence))
    .join(' ');
}

// Everything from the "Where to find it in the app" heading to the next heading or the end.
function dropWhereToFind(body: string): string {
  const match = WHERE_TO_FIND.exec(body);
  if (!match) return body;
  const rest = body.slice(match.index + match[0].length);
  const next = rest.search(/^#{1,6}\s/m);
  return body.slice(0, match.index) + (next === -1 ? '' : rest.slice(next));
}

function cleanLine(source: string): string {
  const cells = /^\s*\|/.test(source) ? source.split('|').map((c) => c.trim()).filter(Boolean).join(', ') : source;
  // Some voices read a leading "-" aloud as "dash"; the line break and the full stop carry the list.
  const line = cells.replace(/^\s*[-*+]\s+/, '');
  // "words (address)" is how a link reads in plain text: the words stay, the bracketed address goes.
  const withoutBracketed = line.replace(/\s*\(\s*https?:\/\/[^\s)]+\s*\)/g, '');
  return dropAddresses(withoutBracketed).replace(/[ \t]+([.,;:!?])/g, '$1').replace(/[ \t]{2,}/g, ' ').trimEnd();
}

function isEmptied(line: string): boolean {
  return /^\s*(?:[-*+]\s*)?(?:[A-Za-z ]{0,20}:)?\s*$/.test(line);
}

// Remove the last sentence of the closest line above when it ends with a colon.
function dropIntroduction(kept: string[]): void {
  let i = kept.length - 1;
  while (i >= 0 && kept[i].trim() === '') i -= 1;
  if (i < 0 || !kept[i].trimEnd().endsWith(':')) return;
  const sentences = kept[i].trim().split(/(?<=[.!?])\s+/);
  sentences.pop();
  kept[i] = sentences.join(' ');
}

// A voice pauses on punctuation, not on a line break, so a heading, list item or table row with no
// full stop runs straight into the next sentence. Every line that has words ends in punctuation.
export function endSentence(line: string): string {
  const trimmed = line.trimEnd();
  if (!/[A-Za-z0-9]/.test(trimmed)) return trimmed;
  if (/[.!?:;…]["'”’)\]]*$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

export function toSpeakable(markdown: string): string {
  let body = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  body = dropWhereToFind(body);
  body = body.replace(SIGN_UP, '');
  body = body.replace(/!\[([^\]]*)\]\([^)]*\)/g, (_m, alt: string) => (alt.trim() ? `Screenshot: ${alt.trim()}` : ''));
  body = body.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  const text = toPasteable(body);
  const kept: string[] = [];
  for (const source of text.split('\n')) {
    const line = cleanLine(source);
    // A line that was only an address, or only its label, says nothing once the address is gone,
    // and neither does the sentence before it that ended with a colon to introduce it.
    if (source.trim() !== '' && isEmptied(line)) {
      dropIntroduction(kept);
      continue;
    }
    kept.push(line);
  }
  return kept.map(endSentence).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// The tool this sheet feeds stopped partway through every post longer than about 5,500 characters:
// all 16 such recordings uploaded by 2026-09-30 run a minute or three for posts that take ten. So a
// recording far shorter than its text is reported as cut short rather than done, and an entry over
// the limit says so before it is pasted.
const TOOL_LIMIT_CHARS = 5500;
const CUT_SHORT_WORDS_PER_MINUTE = 200;
const SPEAKING_WORDS_PER_MINUTE = 140;

type Entry = { file: string; slug: string; date: string; title: string; text: string };
type Status = { kind: 'done' | 'cut-short' | 'skipped'; note: string };

function minutes(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`;
}

function readSkipped(): Set<string> {
  if (!existsSync(SKIPPED_FILE)) return new Set();
  const data = load(readFileSync(SKIPPED_FILE, 'utf8')) as { skipped?: unknown } | null;
  return new Set(Array.isArray(data?.skipped) ? data.skipped.map(String) : []);
}

async function statusOf(entry: Entry, audio: AudioFile | undefined, skipped: Set<string>): Promise<Status | null> {
  if (audio) {
    const { format } = await parseFile(audio.path, { duration: true });
    const seconds = format.duration ?? 0;
    const words = entry.text.split(/\s+/).filter(Boolean).length;
    const expected = (words / SPEAKING_WORDS_PER_MINUTE) * 60;
    if (seconds > 0 && words / (seconds / 60) > CUT_SHORT_WORDS_PER_MINUTE) {
      return { kind: 'cut-short', note: `${minutes(seconds)} of about ${minutes(expected)}` };
    }
    return { kind: 'done', note: minutes(seconds) };
  }
  if (skipped.has(entry.slug)) return { kind: 'skipped', note: '' };
  return null;
}

const STATUS_LABEL: Record<Status['kind'], string> = { done: 'Done', 'cut-short': 'Cut short', skipped: 'Skipped' };

async function main() {
  const entries: Entry[] = readdirSync(POSTS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .map((file) => ({ file, raw: readFileSync(join(POSTS_DIR, file), 'utf8') }))
    .map(({ file, raw }) => ({ file, raw, meta: parseFrontMatter(raw).meta }))
    .filter((e) => e.meta?.date && e.meta.title && String(e.meta.date) >= FROM)
    .filter((e) => !INVITE_TITLE.test(String(e.meta!.title).trim()))
    .sort((a, b) => String(a.meta!.date).localeCompare(String(b.meta!.date)) || a.file.localeCompare(b.file))
    .map((e) => ({
      file: e.file,
      slug: String(e.meta!.slug || e.file.replace(/\.md$/i, '')).split('/').pop() ?? '',
      date: String(e.meta!.date),
      title: String(e.meta!.title).trim(),
      text: toSpeakable(e.raw),
    }));

  const audio = findAudioFiles(WIKI_ROOT);
  const skipped = readSkipped();
  const tracked: { entry: Entry; status: Status }[] = [];
  const toRecord: Entry[] = [];
  for (const entry of entries) {
    const status = await statusOf(entry, audio.get(entry.slug), skipped);
    if (status) tracked.push({ entry, status });
    else toRecord.push(entry);
  }

  const count = (kind: Status['kind']) => tracked.filter((t) => t.status.kind === kind).length;
  const header = [
    'TEXT-TO-SPEECH PASTE SHEET',
    '',
    'Two parts. The tracker lists every post already recorded or deliberately skipped; they are',
    'never offered for pasting again. Below it, one entry per post still to record, oldest first,',
    'from 2026-08-16 (What stays up). Invite posts are left out.',
    '',
    'Each entry starts with a line of = signs and the post date, then the name to save the',
    'recording under, alone on its line so it copies by itself. It has no .mp3 on purpose: the',
    'voice tool adds that when it saves. Upload the file to wiki-site/content/audio/ (a file that',
    'lands in the wrong folder is still found). Neither line is for the voice: paste from the',
    'title down to the end of the entry.',
    '',
    'Links, web addresses, "Where to find it in the app" and the sign-up line are left out,',
    'because an address read aloud is noise. The post date is left out too. Every line ends in',
    'punctuation so the voice pauses.',
    '',
    `The voice tool stops partway through a text longer than about ${TOOL_LIMIT_CHARS.toLocaleString('en-US')} characters. An entry`,
    'over that says so on its = line.',
    '',
    'To skip a post for good, add its slug to wiki-site/content/audio/skipped.yaml.',
    '',
    'Generated by pnpm wiki:paste-tts. Do not hand-edit: edit the post and regenerate.',
    '',
  ].join('\n');

  const table = [
    `TRACKER: ${count('done')} done, ${count('cut-short')} cut short, ${count('skipped')} skipped.`,
    '',
    '| Date | Post | Audio | Length |',
    '|---|---|---|---|',
    ...tracked.map(({ entry, status }) => `| ${entry.date} | ${entry.slug} | ${STATUS_LABEL[status.kind]} | ${status.note} |`),
    '',
  ].join('\n');

  const blocks = toRecord.map((e) => {
    const size = e.text.length;
    const warning = size > TOOL_LIMIT_CHARS ? ` · ${size.toLocaleString('en-US')} characters, over the tool's limit` : '';
    // No .mp3: the text-to-speech tool adds it when the file is saved, and typing it again made
    // what-stays-up.mp3.mp3 (owner report, 2026-09-29).
    return [`${'='.repeat(20)} ${e.date}${warning} ${'='.repeat(20)}`, '', e.slug, '', endSentence(e.title), '', e.text, ''].join('\n');
  });

  const toRecordHeader = [`STILL TO RECORD: ${toRecord.length} posts.`, ''].join('\n');
  writeFileSync(OUT, `${header}\n${table}\n${toRecordHeader}\n${blocks.join('\n')}`, 'utf8');
  console.log(`✓ Wrote ${tracked.length} tracked and ${toRecord.length} to record → ${OUT}`);
}

await main();

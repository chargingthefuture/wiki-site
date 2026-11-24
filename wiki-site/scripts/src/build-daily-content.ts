/**
 * Generates artifacts/wiki/public/daily-content.json — the blurbs and live-stream topics the app's
 * Daily Posts screen offers each day (owner request, 2026-11-10).
 *
 * Source is content/daily-content.yaml, hand-written; its header has the rules for the copy. This
 * script checks the shape and fails on anything the screen could not use, so a broken entry stops
 * the build instead of reaching the screen. Build output like feed.xml: gitignored, written by
 * wiki:build and wiki:build:pages, never hand-edited.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '../..');
const SOURCE = join(WIKI_ROOT, 'content/daily-content.yaml');
const OUT = join(WIKI_ROOT, 'artifacts/wiki/public/daily-content.json');

const ID = /^[a-z0-9-]{1,60}$/;
const BLURB_MAX = 400;

type Line = { id: string; label: string };
type Blurb = { id: string; line: string; link: string; text: string };
type LiveTopic = { id: string; line: string; link: string; title: string; points: string[] };

function fail(message: string): never {
  throw new Error(`daily-content.yaml: ${message}`);
}

function str(entry: Record<string, unknown>, field: string, where: string): string {
  const value = entry[field];
  if (typeof value !== 'string' || value.trim() === '') fail(`${where} has no ${field}.`);
  return value.trim();
}

function link(entry: Record<string, unknown>, where: string): string {
  const value = str(entry, 'link', where);
  if (!/^https:\/\/\S+$/.test(value)) fail(`${where} link is not an https address: ${value}`);
  return value;
}

function list(doc: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = doc[key];
  if (!Array.isArray(value) || value.length === 0) fail(`"${key}" must be a non-empty list.`);
  return value as Record<string, unknown>[];
}

function main() {
  const doc = yaml.load(readFileSync(SOURCE, 'utf8')) as Record<string, unknown>;
  if (!doc || typeof doc !== 'object') fail('the file is empty.');

  const lines: Line[] = list(doc, 'lines').map((entry, index) => {
    const id = str(entry, 'id', `line ${index + 1}`);
    if (!ID.test(id)) fail(`line id "${id}" must be lowercase letters, digits and hyphens.`);
    return { id, label: str(entry, 'label', `line ${id}`) };
  });
  const lineIds = new Set(lines.map((line) => line.id));
  if (lineIds.size !== lines.length) fail('two lines share an id.');

  const seen = new Set<string>();
  const checkId = (kind: string, entry: Record<string, unknown>, index: number) => {
    const id = str(entry, 'id', `${kind} ${index + 1}`);
    if (!ID.test(id)) fail(`${kind} id "${id}" must be lowercase letters, digits and hyphens.`);
    if (seen.has(`${kind}:${id}`)) fail(`two ${kind} entries share the id "${id}".`);
    seen.add(`${kind}:${id}`);
    const line = str(entry, 'line', `${kind} ${id}`);
    if (!lineIds.has(line)) fail(`${kind} ${id} names line "${line}", which is not in "lines".`);
    return { id, line };
  };

  const blurbs: Blurb[] = list(doc, 'blurbs').map((entry, index) => {
    const { id, line } = checkId('blurb', entry, index);
    const text = str(entry, 'text', `blurb ${id}`).replace(/\s*\n\s*/g, ' ');
    if (text.length > BLURB_MAX) fail(`blurb ${id} is ${text.length} characters; a blurb is at most ${BLURB_MAX}.`);
    return { id, line, link: link(entry, `blurb ${id}`), text };
  });
  const texts = new Set<string>();
  for (const blurb of blurbs) {
    if (texts.has(blurb.text)) fail(`blurb ${blurb.id} repeats another blurb word for word.`);
    texts.add(blurb.text);
  }

  const live: LiveTopic[] = list(doc, 'live').map((entry, index) => {
    const { id, line } = checkId('live', entry, index);
    const points = entry.points;
    if (!Array.isArray(points) || points.length !== 3 || points.some((p) => typeof p !== 'string' || p.trim() === '')) {
      fail(`live topic ${id} needs exactly three talking points.`);
    }
    return { id, line, link: link(entry, `live topic ${id}`), title: str(entry, 'title', `live topic ${id}`), points: (points as string[]).map((p) => p.trim()) };
  });

  for (const line of lines) {
    if (!blurbs.some((blurb) => blurb.line === line.id)) fail(`line ${line.id} has no blurbs.`);
    if (!live.some((topic) => topic.line === line.id)) fail(`line ${line.id} has no live topics.`);
  }

  writeFileSync(OUT, `${JSON.stringify({ generatedAt: new Date().toISOString(), lines, blurbs, live }, null, 1)}\n`, 'utf8');
  console.log(`✓ Wrote ${lines.length} lines, ${blurbs.length} blurbs, ${live.length} live topics → ${OUT}`);
}

main();

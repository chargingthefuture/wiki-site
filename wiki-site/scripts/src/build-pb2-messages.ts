/**
 * Generates artifacts/wiki/public/pb2-messages.json — the ready-to-paste posts a Peace Battle 2
 * participant can copy.
 *
 * Why this exists: the protest asks people to post about the Skills Economy, and until now the
 * only written-out posts were the owner's own, which carry the owner's argument. A supporter who
 * does not agree with every line of it makes no post at all. These say what a part of the app
 * does and stop, so there is nothing in them to disagree with.
 *
 * Source is content/pb2-share-messages.yaml, hand-written. It is not generated from the in-app
 * guide: that text is written for somebody already inside the app, and it reads wrong pasted in
 * front of a stranger's audience.
 *
 * Like feed.xml and invites.json this is build output — gitignored, written by wiki:build and
 * wiki:build:pages, never hand-edited. Consumers on other origins can read it because GitHub
 * Pages answers every request with Access-Control-Allow-Origin: *.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const SOURCE = resolve(BLOG_ROOT, 'content/pb2-share-messages.yaml');
const OUT = resolve(BLOG_ROOT, 'artifacts/wiki/public/pb2-messages.json');

/**
 * The guide, not a screen inside the app. A deep link sends somebody with no account to a sign-in
 * page, which is the worst possible first thing to show a reader who just followed a link out of
 * curiosity. The guide reads with no account and describes the same feature.
 *
 * The guide alone is not enough, though (owner report, 2026-09-21): a reader opens it, reads the
 * section, and leaves, because nothing on that page tells them where to sign up and nobody scrolls
 * to the top of a stranger's guide looking for it. So every post also carries the blog's standing
 * sign-up line, verbatim — the same fixed block every post on this blog ends with, so it reads as
 * documentation rather than a pitch.
 */
const GUIDE_BASE = 'https://app.chargingthefuture.com/guide';
export const SIGN_UP_LINE =
  'To sign up: https://chargingthefuture.com. It is free, everyone is let in one at a time after a check, and you can use one part of it and ignore the rest.';

export type Pb2Message = {
  id: string;
  feature: string;
  title: string;
  /** The post itself: plain text, paragraphs separated by a blank line, the guide link and the sign-up line last. */
  body: string;
};

/**
 * A deliberately small YAML reader for the one shape this file has: a `messages:` list of entries
 * with `id`, `feature`, `title` and a block-literal `body`. Pulling a YAML parser in for this
 * would add a dependency to a build that has none, and a general parser would accept shapes this
 * file should reject anyway.
 */
function parseMessages(text: string): Pb2Message[] {
  const lines = text.split('\n');
  const out: Pb2Message[] = [];
  let current: Partial<Pb2Message> | null = null;
  let bodyLines: string[] | null = null;

  const finish = () => {
    if (!current) return;
    if (bodyLines) {
      // Block literals keep their blank lines between paragraphs and lose trailing ones.
      current.body = bodyLines.join('\n').replace(/\s+$/, '');
    }
    for (const field of ['id', 'feature', 'title', 'body'] as const) {
      const value = current[field];
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`pb2-share-messages.yaml: entry "${current.id ?? '(no id)'}" has no ${field}.`);
      }
    }
    out.push(current as Pb2Message);
    current = null;
    bodyLines = null;
  };

  for (const line of lines) {
    if (bodyLines) {
      // Inside a block literal: six spaces of indent, or a blank line between paragraphs.
      if (line.trim() === '') {
        bodyLines.push('');
        continue;
      }
      if (line.startsWith('      ')) {
        bodyLines.push(line.slice(6));
        continue;
      }
      // Dedented, so the literal is over. Fall through and read this line normally.
      current!.body = bodyLines.join('\n').replace(/\s+$/, '');
      bodyLines = null;
    }

    if (line.startsWith('#') || line.trim() === '' || line.trim() === 'messages:') continue;

    const entry = line.match(/^ {2}- id:\s*(\S+)\s*$/);
    if (entry) {
      finish();
      current = { id: entry[1] };
      continue;
    }

    const field = line.match(/^ {4}(feature|title|body):\s*(.*)$/);
    if (field && current) {
      const [, key, rest] = field;
      if (key === 'body') {
        if (rest.trim() !== '|-') {
          throw new Error(`pb2-share-messages.yaml: "${current.id}" must write body as a "|-" block.`);
        }
        bodyLines = [];
      } else {
        current[key as 'feature' | 'title'] = rest.trim();
      }
      continue;
    }

    throw new Error(`pb2-share-messages.yaml: cannot read line: ${line}`);
  }
  finish();
  return out;
}

function main(): void {
  const messages = parseMessages(readFileSync(SOURCE, 'utf8'));

  if (messages.length === 0) {
    throw new Error('pb2-share-messages.yaml: no messages, so the copy control would have nothing to offer.');
  }

  const seen = new Set<string>();
  for (const message of messages) {
    if (seen.has(message.id)) {
      throw new Error(`pb2-share-messages.yaml: two entries share the id "${message.id}".`);
    }
    seen.add(message.id);
  }

  // The two closing lines are appended here rather than written into every entry, so the labels
  // and the addresses cannot drift apart across twenty-seven hand-written messages.
  const withLinks = messages.map((message) => ({
    ...message,
    body: `${message.body}\n\nWhat it is: ${GUIDE_BASE}#${message.id}\n\n${SIGN_UP_LINE}`,
  }));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify({ messages: withLinks }, null, 2)}\n`, 'utf8');
  console.log(`✓ Wrote ${withLinks.length} share messages → ${relative(process.cwd(), OUT)}`);
}

main();

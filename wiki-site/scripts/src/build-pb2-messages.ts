/**
 * Generates artifacts/wiki/public/pb2-messages.json — the ready-to-paste posts a Peace Battle 2
 * participant can copy.
 *
 * Why this exists: the protest asks people to post about the Skills Economy, and until now the
 * only written-out posts were the owner's own, which carry the owner's argument. A supporter who
 * does not agree with every line of it makes no post at all. These say what a thing is and stop,
 * so there is nothing in them to disagree with.
 *
 * Only the ids in the YAML's `pool` are written, in that order; the other entries stay in the file
 * unoffered. Three topics for now — Peace Battle 2, One Percent, PeerProgramming (owner directive,
 * 2026-10-03); the YAML header says why. `invites` in the pool tells the page to add the published
 * invite posts, which it reads from invites.json itself.
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
 * section, and leaves, because nothing on that page tells them where to go next. So every post
 * also ends with the entry point. That used to be the blog's standing sign-up line; it is now the
 * Peace Battle 2 page (owner directive, 2026-10-03), because these posts are the protest's and a
 * reader who follows one should land on it.
 */
const GUIDE_BASE = 'https://app.chargingthefuture.com/guide';
export const ENTRY_POINT = 'https://chargingthefuture.github.io/chargingthefuture/peace-battle-2';
export const ENTRY_LINE = `To take part: ${ENTRY_POINT}`;

export type Pb2Message = {
  id: string;
  feature: string;
  title: string;
  /** Where the labeled link line points. Absent, the build points at the guide section for `id`. */
  link?: string;
  /** The post itself: plain text, paragraphs separated by a blank line, the link and the sign-up line last. */
  body: string;
};

/**
 * A deliberately small YAML reader for the one shape this file has: a `messages:` list of entries
 * with `id`, `feature`, `title`, an optional `link` and a block-literal `body`. Pulling a YAML parser in for this
 * would add a dependency to a build that has none, and a general parser would accept shapes this
 * file should reject anyway.
 */
function parseMessages(text: string): { pool: string[]; messages: Pb2Message[] } {
  const lines = text.split('\n');
  const out: Pb2Message[] = [];
  let pool: string[] | null = null;
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
    const poolLine = line.match(/^pool:\s*\[(.*)\]\s*$/);
    if (poolLine && !current) {
      pool = poolLine[1].split(',').map((id) => id.trim()).filter(Boolean);
      continue;
    }

    const entry = line.match(/^ {2}- id:\s*(\S+)\s*$/);
    if (entry) {
      finish();
      current = { id: entry[1] };
      continue;
    }

    const field = line.match(/^ {4}(feature|title|link|body):\s*(.*)$/);
    if (field && current) {
      const [, key, rest] = field;
      if (key === 'body') {
        if (rest.trim() !== '|-') {
          throw new Error(`pb2-share-messages.yaml: "${current.id}" must write body as a "|-" block.`);
        }
        bodyLines = [];
      } else {
        current[key as 'feature' | 'title' | 'link'] = rest.trim();
      }
      continue;
    }

    throw new Error(`pb2-share-messages.yaml: cannot read line: ${line}`);
  }
  finish();
  if (!pool || pool.length === 0) {
    throw new Error('pb2-share-messages.yaml: no pool, so the copy control would have nothing to offer.');
  }
  return { pool, messages: out };
}

function main(): void {
  const { pool, messages } = parseMessages(readFileSync(SOURCE, 'utf8'));

  const byId = new Map<string, Pb2Message>();
  for (const message of messages) {
    if (byId.has(message.id)) {
      throw new Error(`pb2-share-messages.yaml: two entries share the id "${message.id}".`);
    }
    byId.set(message.id, message);
  }

  const invites = pool.includes('invites');
  const offered = pool
    .filter((id) => id !== 'invites')
    .map((id) => {
      const message = byId.get(id);
      if (!message) throw new Error(`pb2-share-messages.yaml: pool names "${id}" and no entry has that id.`);
      return message;
    });
  if (offered.length === 0 && !invites) {
    throw new Error('pb2-share-messages.yaml: the pool is empty, so the copy control would have nothing to offer.');
  }

  // The closing lines are appended here rather than written into every entry, so the label and
  // the entry point cannot drift apart across the hand-written messages. An entry that already
  // points at the entry point gets it once.
  const withLinks = offered.map(({ link, ...message }) => {
    const own = link ?? `${GUIDE_BASE}#${message.id}`;
    const lines = own === ENTRY_POINT ? [ENTRY_LINE] : [`What it is: ${own}`, ENTRY_LINE];
    return { ...message, body: [message.body, ...lines].join('\n\n') };
  });

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify({ invites, messages: withLinks }, null, 2)}\n`, 'utf8');
  console.log(
    `✓ Wrote ${withLinks.length} share messages${invites ? ' plus invites' : ''} → ${relative(process.cwd(), OUT)}`,
  );
}

main();

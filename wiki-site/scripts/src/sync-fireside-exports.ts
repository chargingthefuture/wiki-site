#!/usr/bin/env node
/**
 * Copies the Fireside comments the app has cleared for publication into this repository, as
 * artifacts/wiki/src/lib/fireside-exports.ts, which the build bundles the same way it bundles the
 * posts themselves.
 *
 * Why a generated, committed file rather than a fetch at read time: a comment fetched into the page
 * after it loads is not in the published build, and so is not in what a web archive captures. The
 * whole reason two people have to agree before a comment gets here is that this build is captured
 * and cannot be recalled — by the Internet Archive, by anybody else, or by this project. A copy
 * that never actually reaches the build would be asking for that agreement and not honoring it.
 *
 * Committing it also means a person sees the exact text in a diff before it is published, which is
 * the last point at which anything can still be stopped.
 *
 * What may be copied is decided entirely by the app, in lib/fireside/visibility.ts (mayExportToBlog):
 * the author asked for it, an admin agreed, the comment is visible, and its author is approved.
 * This script has no opinion of its own and must never grow one — it reads the feed and writes what
 * the feed gave it.
 *
 * Usage:
 *   tsx sync-fireside-exports.ts            # write changes
 *   tsx sync-fireside-exports.ts --dry-run  # preview only, no writes
 *
 * The app it reads can be overridden with FIRESIDE_APP_URL, for a staging run.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const EXPORTS_TS = resolve(BLOG_ROOT, 'artifacts/wiki/src/lib/fireside-exports.ts');

const APP_URL = (process.env.FIRESIDE_APP_URL ?? 'https://app.chargingthefuture.com').replace(/\/$/, '');
const isDryRun = process.argv.includes('--dry-run');

// A ceiling on how many times the cursor is followed, so a feed that somehow never says it is done
// ends the run instead of looping forever. Far above any plausible corpus.
const MAX_READS = 500;

type ExportedComment = {
  commentId: string;
  parentCommentId: string | null;
  authorName: string;
  body: string;
  createdAt: string;
  postRepo: string;
  postSlug: string;
  postTitle: string;
};

type FeedPage = {
  ok?: boolean;
  comments?: ExportedComment[];
  scanned?: number;
  nextCursor?: string | null;
};

async function readPage(cursor: string | null): Promise<FeedPage> {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  const res = await fetch(`${APP_URL}/api/fireside/export${query}`);
  if (!res.ok) {
    throw new Error(
      `The export feed at ${APP_URL}/api/fireside/export answered ${res.status}. Nothing was written.`,
    );
  }
  return (await res.json()) as FeedPage;
}

/**
 * Every cleared comment, oldest first. Read by following the cursor rather than by counting: the
 * feed refuses some of what it scans, so a short page of comments does not mean the end.
 */
async function readFeed(): Promise<ExportedComment[]> {
  const comments: ExportedComment[] = [];
  let cursor: string | null = null;

  for (let read = 0; read < MAX_READS; read += 1) {
    const page: FeedPage = await readPage(cursor);
    comments.push(...(page.comments ?? []));
    cursor = page.nextCursor ?? null;
    if (!cursor) return comments;
  }

  throw new Error(
    `The export feed still had more to give after ${MAX_READS} reads, which should not happen. Nothing was written.`,
  );
}

/** Which post a comment belongs under, as the key the article page looks itself up by. */
function postKey(repo: string, slug: string): string {
  return `${repo}/${slug}`;
}

function groupByPost(comments: ExportedComment[]): Record<string, ExportedComment[]> {
  const byPost: Record<string, ExportedComment[]> = {};
  for (const comment of comments) {
    const key = postKey(comment.postRepo, comment.postSlug);
    (byPost[key] ??= []).push(comment);
  }
  return byPost;
}

function render(byPost: Record<string, ExportedComment[]>, total: number): string {
  const keys = Object.keys(byPost).sort();
  const entries = keys.map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(byPost[key], null, 2)
    .split('\n')
    .join('\n  ')}`);

  return `// AUTO-GENERATED — do not edit by hand.
// Regenerate with:
//   pnpm fireside:sync
//
// Fireside comments the app has cleared for publication: the author asked for each one, and an
// admin agreed. Both are required and neither is enough alone, and the app decides it — this file
// is a copy of what its export feed returned, never a judgment made here.
//
// Bundled into the build on purpose. A comment fetched into the page after it loads is not in the
// published build and so is not in what a web archive captures, and being captured is exactly what
// the author was asked to agree to. Anything in this file is permanent once it deploys.

export interface ExportedComment {
  commentId: string;
  parentCommentId: string | null;
  authorName: string;
  body: string;
  createdAt: string;
  postRepo: string;
  postSlug: string;
  postTitle: string;
}

/** Keyed by \`\${repo}/\${slug}\` — the same pair the article route carries. */
export const FIRESIDE_EXPORTS: Record<string, ExportedComment[]> = {${
    entries.length ? `\n${entries.join(',\n')}\n` : ''
  }};

export function exportedCommentsFor(repo: string, slug: string): ExportedComment[] {
  return FIRESIDE_EXPORTS[\`\${repo}/\${slug}\`] ?? [];
}

// ${total} comment${total === 1 ? '' : 's'} across ${keys.length} post${keys.length === 1 ? '' : 's'}.
`;
}

function reportDryRun(generated: string): void {
  let current = '';
  try {
    current = readFileSync(EXPORTS_TS, 'utf8');
  } catch {
    /* new file */
  }

  if (current === generated) {
    console.log('Dry run: fireside-exports.ts is already up-to-date. No changes needed.');
    return;
  }

  console.log('Dry run: fireside-exports.ts WILL BE UPDATED\n');
  const oldLines = current.split('\n');
  const newLines = generated.split('\n');
  let shown = 0;
  const maxLen = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLen && shown < 60; i++) {
    if (oldLines[i] !== newLines[i]) {
      if (oldLines[i] !== undefined) console.log(`\x1b[31m- ${oldLines[i]}\x1b[0m`);
      if (newLines[i] !== undefined) console.log(`\x1b[32m+ ${newLines[i]}\x1b[0m`);
      shown++;
    }
  }
  if (shown >= 60) console.log('  ... (more lines differ — run without --dry-run to apply)');
}

async function main(): Promise<void> {
  const comments = await readFeed();
  const byPost = groupByPost(comments);
  const generated = render(byPost, comments.length);

  if (isDryRun) {
    reportDryRun(generated);
    return;
  }

  writeFileSync(EXPORTS_TS, generated, 'utf8');
  console.log(
    `✓ Wrote ${comments.length} cleared comment(s) across ${Object.keys(byPost).length} post(s) → ${EXPORTS_TS}`,
  );
  console.log('  Read the diff before committing. Once this deploys it is captured and cannot be recalled.');
}

main().catch((error: unknown) => {
  // Loud rather than quiet, and deliberately not a fallback to the committed file. A run that
  // cannot reach the app has not decided that there is nothing to export; it has decided nothing.
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

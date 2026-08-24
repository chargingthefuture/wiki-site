#!/usr/bin/env node
/**
 * Submits published content to the Wayback Machine (web.archive.org/save).
 *
 * For each changed content file, one URL is submitted: the raw markdown on
 * GitHub, which is a full-text, third-party-timestamped copy.
 *
 * The rendered article page is deliberately not submitted. The blog assembles a
 * post in the browser rather than keeping one as a file on the server, so
 * archive.org's crawler asks for something that is not there and every attempt
 * comes back HTTP 523. Submitting it wasted half of every run's requests against
 * a rate limit that is the binding constraint on how fast a backfill can go.
 *
 * Best-effort by design: failures are logged and never exit non-zero, so a
 * deploy can never be blocked by archive.org rate limits.
 *
 * Pacing: archive.org refuses with HTTP 429 after roughly five saves in a
 * couple of minutes. A normal publish changes one file, so the spacing costs
 * nothing there; it exists so a backfill of several files actually finishes
 * instead of getting a handful in and then being turned away.
 *
 * Usage:
 *   tsx wayback-snapshot.ts <changed-file> [<changed-file> ...]
 *   (paths relative to the repo root, e.g. wiki-site/content/posts/foo.md)
 */

const SITE_BASE = 'https://chargingthefuture.github.io/chargingthefuture';
const RAW_BASE = 'https://raw.githubusercontent.com/chargingthefuture/wiki-site/main';
// Both are overridable so a manual backfill can take bigger, slower batches than
// a publish needs. A publish changes one file and never touches either.
const MAX_FILES = Number(process.env.WAYBACK_MAX_FILES ?? 5);
const SPACING_MS = Number(process.env.WAYBACK_SPACING_MS ?? 20_000);
const RETRY_WAIT_MS = Number(process.env.WAYBACK_RETRY_WAIT_MS ?? 60_000);
const MAX_RETRIES = Number(process.env.WAYBACK_MAX_RETRIES ?? 2);
// The front page is worth a snapshot on every publish. During a long backfill it
// is not — it would spend one of a scarce number of requests on the same URL in
// every run — so the backfill workflow turns it off.
const SKIP_HOME = process.env.WAYBACK_SKIP_HOME === '1';

async function attempt(url: string): Promise<number | null> {
  try {
    const res = await fetch(`https://web.archive.org/save/${url}`, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(60_000),
    });
    return res.status;
  } catch {
    return null;
  }
}

function isTemporary(status: number | null): boolean {
  // null is a network-level failure — a refused or dropped connection. Measured
  // against archive.org that is what being throttled looks like most of the time;
  // an explicit 429 is the minority case. 523 is the crawler failing to reach the
  // origin, which for this site is permanent, so it is not retried.
  return status === null || status === 429 || status === 503;
}

async function save(url: string): Promise<boolean> {
  let status = await attempt(url);
  for (let retry = 1; retry <= MAX_RETRIES && isTemporary(status); retry += 1) {
    console.log(`  … turned away, waiting ${RETRY_WAIT_MS / 1000}s (retry ${retry} of ${MAX_RETRIES})`);
    await new Promise((r) => setTimeout(r, RETRY_WAIT_MS));
    status = await attempt(url);
  }
  if (status === null) {
    console.log(`  ⚠ ${url} — gave up after ${MAX_RETRIES} retries`);
    return false;
  }
  const ok = status >= 200 && status < 300;
  console.log(`  ${ok ? '✓' : `⚠ (HTTP ${status})`} ${url}`);
  return ok;
}

async function main() {
  const changed = process.argv
    .slice(2)
    .filter((p) => p.startsWith('wiki-site/content/') && p.toLowerCase().endsWith('.md'))
    .filter((p) => !p.toLowerCase().endsWith('/readme.md'));

  const batch = changed.slice(0, MAX_FILES);
  if (changed.length > batch.length) {
    console.log(`Snapshotting first ${batch.length} of ${changed.length} changed files (rate-limit cap).`);
  }

  console.log(`Submitting ${batch.length} file(s) to the Wayback Machine:`);
  let saved = 0;
  if (!SKIP_HOME) {
    await save(`${SITE_BASE}/`);
    if (batch.length) await new Promise((r) => setTimeout(r, SPACING_MS));
  }
  for (const [i, file] of batch.entries()) {
    const rawUrl = `${RAW_BASE}/${file.split('/').map(encodeURIComponent).join('/')}`;
    if (await save(rawUrl)) saved += 1;
    if (i < batch.length - 1) await new Promise((r) => setTimeout(r, SPACING_MS));
  }
  console.log(`Done (best-effort): ${saved} of ${batch.length} saved.`);
}

main();

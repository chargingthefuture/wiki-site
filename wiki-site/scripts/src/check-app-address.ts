/**
 * Fails when the blog's own writing links the app or the landing page at chargingthefuture.com.
 *
 * Why this exists: the app moved to app.lagatos.com and the landing page to lagatos.com, and the
 * owner declined a redirect (2026-11-03), because the 3.0 design still runs at the old address
 * alongside 3.1. A link to the old address therefore lands a reader in the old design rather than
 * failing, so nothing else in the pipeline notices. Every "Where to find it in the app" list and
 * the sign-up line use lagatos.com.
 *
 * What it reads: tracked files under content/, the site source (artifacts/wiki/src), and the
 * hand-written QUORA_PASTE_SHEET.txt.
 *
 * What it skips, and why:
 * - content/archive/ and the manifesto: frozen records, kept as written.
 * - articles.ts and the generated paste sheets: copies of the posts, checked at their source.
 * - Other hosts under chargingthefuture.com (counter.), which did not move.
 *
 *   Run: pnpm wiki:app-address
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');

const INCLUDE_PREFIXES = ['wiki-site/content/', 'wiki-site/artifacts/wiki/src/'];
const INCLUDE_FILES = new Set(['wiki-site/QUORA_PASTE_SHEET.txt']);

const EXEMPT_PREFIXES = ['wiki-site/content/archive/', 'wiki-site/content/youtube/'];
const EXEMPT_FILES = new Set([
  'wiki-site/content/posts/The-Answer:-EXIT-THEIR-ECONOMY,-EXIT-THE-PSYOP.md',
  'wiki-site/artifacts/wiki/src/lib/articles.ts',
  'wiki-site/artifacts/wiki/src/lib/fireside-exports.ts',
]);

// The app (with or without its accounts host), the RSS reader, www., or the bare landing domain.
const OLD_ADDRESS = /(?<![\w.-])(?:(?:accounts\.)?app\.|www\.|rss\.)?chargingthefuture\.com/g;

function inScope(path: string): boolean {
  if (EXEMPT_FILES.has(path)) return false;
  if (EXEMPT_PREFIXES.some((p) => path.startsWith(p))) return false;
  if (path.split('/').includes('node_modules')) return false;
  return INCLUDE_FILES.has(path) || INCLUDE_PREFIXES.some((p) => path.startsWith(p));
}

const tracked = execFileSync('git', ['ls-files', '-z'], {
  cwd: REPO_ROOT,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
})
  .split('\0')
  .filter(Boolean)
  .filter(inScope);

const findings: string[] = [];
for (const repoPath of tracked) {
  let contents: string;
  try {
    contents = readFileSync(join(REPO_ROOT, repoPath), 'utf8');
  } catch {
    continue;
  }
  contents.split('\n').forEach((line, index) => {
    for (const match of line.matchAll(OLD_ADDRESS)) {
      findings.push(`  ${repoPath}:${index + 1}  ${match[0]}`);
    }
  });
}

if (findings.length === 0) {
  console.log(`check-app-address: no chargingthefuture.com app or landing links (${tracked.length} files).`);
  process.exit(0);
}

console.error(`check-app-address: found ${findings.length} link(s) to the old address.\n`);
console.error(findings.join('\n'));
console.error('\nUse app.lagatos.com for the app and lagatos.com for the landing page.');
process.exit(1);

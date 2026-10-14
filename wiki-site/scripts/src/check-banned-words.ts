/**
 * Fails when "whole" or "stale" appears in the blog's own writing.
 *
 * Why this exists: both words are on the owner's banned list (CLAUDE.md, Excluded Vocabulary).
 * "Whole" kept arriving in the sentence that tells a reader which fact mattered, and banning one
 * phrasing at a time only moved it one frame over, so the word itself is out. "Stale" was being
 * used to mean several different things; the writer is asked to name the specific one instead.
 * Front matter validation and the build both pass on either word, so without this check nothing
 * in the pipeline notices.
 *
 * What it reads: tracked files under content/, the site source (artifacts/wiki/src), scripts/,
 * and the hand-written QUORA_PASTE_SHEET.txt.
 *
 * What it skips, and why:
 * - content/archive/ and the manifesto: frozen records, kept as written.
 * - content/youtube/: collected titles, other people's words.
 * - articles.ts, fireside-exports.ts, and the generated paste sheets: copies of text checked
 *   at its source (the posts), or comments the app cleared for publication.
 * - "Whole Foods" (a company's name), "stale-while-revalidate" (an HTTP header value), and
 *   anything inside a URL or a markdown link target.
 * - A `banned-words:disable` / `banned-words:enable` region, for verbatim quotes of other people
 *   and the app's own labels. The disable line says why. A file that disables and never
 *   re-enables is itself a finding, so a region cannot swallow the rest of a file.
 *
 *   Run: pnpm wiki:banned-words
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');

const INCLUDE_PREFIXES = [
  'wiki-site/content/',
  'wiki-site/artifacts/wiki/src/',
  'wiki-site/scripts/',
];
const INCLUDE_FILES = new Set(['wiki-site/QUORA_PASTE_SHEET.txt']);

const EXEMPT_PREFIXES = ['wiki-site/content/archive/', 'wiki-site/content/youtube/'];
const EXEMPT_FILES = new Set([
  'wiki-site/content/posts/The-Answer:-EXIT-THEIR-ECONOMY,-EXIT-THE-PSYOP.md',
  'wiki-site/scripts/src/check-banned-words.ts',
  'wiki-site/artifacts/wiki/src/lib/articles.ts',
  'wiki-site/artifacts/wiki/src/lib/fireside-exports.ts',
]);

const CHECK_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.css', '.md', '.mdc', '.yaml', '.yml', '.json', '.txt', '.sh', '.html',
]);
const SKIP_SEGMENTS = new Set(['node_modules', 'dist', 'build', 'coverage']);

const BANNED = /\b(whole|stale)\b/gi;

function inScope(path: string): boolean {
  if (EXEMPT_FILES.has(path)) return false;
  if (EXEMPT_PREFIXES.some((p) => path.startsWith(p))) return false;
  if (path.split('/').some((segment) => SKIP_SEGMENTS.has(segment))) return false;
  const dot = path.lastIndexOf('.');
  if (dot === -1 || !CHECK_EXTENSIONS.has(path.slice(dot))) return false;
  return INCLUDE_FILES.has(path) || INCLUDE_PREFIXES.some((p) => path.startsWith(p));
}

// Committed files only, so local scratch files and build output stay out.
const tracked = execFileSync('git', ['ls-files', '-z'], {
  cwd: REPO_ROOT,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
})
  .split('\0')
  .filter(Boolean)
  .filter(inScope);

interface Finding {
  file: string;
  line: number;
  found: string;
  text: string;
}
const findings: Finding[] = [];

for (const repoPath of tracked) {
  let contents: string;
  try {
    contents = readFileSync(join(REPO_ROOT, repoPath), 'utf8');
  } catch {
    continue;
  }

  let disabled = false;
  let disabledAtLine = 0;
  contents.split('\n').forEach((line, index) => {
    if (line.includes('banned-words:disable')) {
      disabled = true;
      disabledAtLine = index + 1;
      return;
    }
    if (line.includes('banned-words:enable')) {
      disabled = false;
      return;
    }
    if (disabled) return;
    const prose = line
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/\]\([^)]*\)/g, ']()')
      .replace(/\bWhole Foods\b/g, ' ')
      .replace(/\bstale-while-revalidate\b/gi, ' ');
    for (const match of prose.matchAll(BANNED)) {
      findings.push({
        file: repoPath,
        line: index + 1,
        found: match[0],
        text: line.trim().slice(0, 140),
      });
    }
  });
  if (disabled) {
    findings.push({
      file: repoPath,
      line: disabledAtLine,
      found: 'banned-words:disable',
      text: 'region never re-enabled — the rest of the file is unchecked',
    });
  }
}

if (findings.length === 0) {
  console.log(`check-banned-words: no banned words found (${tracked.length} files).`);
  process.exit(0);
}

console.error(`check-banned-words: found ${findings.length} banned word(s).\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  "${f.found}"`);
  console.error(`    ${f.text}`);
}
console.error(
  '\n"whole": use entire, all of, end to end, or drop it. "stale": drop it, or name what you mean',
);
console.error('(out-of-date, superseded, no longer current). If a hit is a verbatim quote of somebody');
console.error('else, wrap it in banned-words:disable / banned-words:enable with the reason.');
process.exit(1);

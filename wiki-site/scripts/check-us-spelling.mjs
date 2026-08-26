#!/usr/bin/env node
// Fails when a British spelling appears in this repository's current copy.
//
// Why this exists: British spellings kept arriving in the blog's own writing — "organised" in a
// draft post, then seven more ("centre", "recognise", "programme", "sensitising", "popularised")
// in a single afternoon of paste sheet corrections. Each was introduced while paraphrasing, and
// nothing in the pipeline knew the difference: front matter validation and the build both pass on
// a correctly spelled word from the wrong dialect. The blog writes US English, so a British
// spelling is a defect, and checking for it is the only reliable way to keep it out.
//
// This is a port of ctf/scripts/check-us-spelling.mjs from the product repository, which skips
// wiki-site precisely because wiki-site is its own repository. The word list is copied verbatim so
// the two repositories reject the same words; if the product's list changes, copy it across again.
//
// The archive is checked too. A British spelling in an archived post is a typo, and typos get
// fixed here — the copy-edit passes over content/archive/ have been doing exactly that.
//
// What is never rewritten is an address. A URL, a markdown link target, and a migrated post's
// `slug:` are how a page is reached, and several were minted before anyone was watching the
// dialect; respelling one breaks every link that ever pointed at it. Matches inside those are
// skipped — a displayed title gets corrected while the address it lives at stays put.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { RULES, PATTERNS } from './lib/us-spelling.mjs';

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

const EXEMPT_FILES = new Set([
  // The word list, which necessarily spells out every British word this gate looks for.
  'wiki-site/scripts/lib/us-spelling.mjs',
  // This file, which names the words in its own explanation.
  'wiki-site/scripts/check-us-spelling.mjs',
  // The agent instructions, which explain this gate and therefore have to name both the disable
  // marker and the words being rejected. The product repository exempts its own CLAUDE.md for the
  // same reason.
  'CLAUDE.md',
  // A table of content filenames with a review verdict against each. The entries are file paths,
  // not prose, and an archived post's filename is not ours to respell — doing so would make the
  // reference point at nothing.
  'wiki-site/COPY_EDIT_REVIEW.md',
]);

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  // Generated from content/ by wiki:sync. Its text comes from files this gate already checks, so
  // checking it too would report every finding twice and fail on a file nobody edits by hand.
  'artifacts',
]);

const CHECK_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.css', '.md', '.mdc', '.yaml', '.yml', '.json', '.txt', '.sh',
]);

// Committed files only. Asking git rather than walking the disk keeps local scratch directories and
// build output out, and means the gate looks at exactly what a reader of the repository would see.
function trackedFiles() {
  const listing = execFileSync('git', ['ls-files', '-z'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return listing
    .split('\0')
    .filter(Boolean)
    .filter((path) => !path.split('/').some((segment) => SKIP_DIRS.has(segment)));
}

function hasCheckedExtension(path) {
  const dot = path.lastIndexOf('.');
  if (dot === -1) return false;
  return CHECK_EXTENSIONS.has(path.slice(dot));
}

function isExempt(path) {
  return EXEMPT_FILES.has(path);
}

const findings = [];

for (const repoPath of trackedFiles()) {
  if (!hasCheckedExtension(repoPath)) continue;
  if (isExempt(repoPath)) continue;

  let contents;
  try {
    contents = readFileSync(join(REPO_ROOT, repoPath), 'utf8');
  } catch {
    continue;
  }

  // A `spelling:disable` / `spelling:enable` pair marks a region the gate skips, for the one case
  // that legitimately needs it: current copy quoting an archived title verbatim, where respelling
  // the quote would misquote it. The disable line must say why. A file that disables and never
  // re-enables is itself a finding, so a region cannot silently swallow the rest of a file.
  let disabled = false;
  let disabledAtLine = 0;
  const lines = contents.split('\n');
  for (const [index, line] of lines.entries()) {
    if (line.includes('spelling:disable')) {
      disabled = true;
      disabledAtLine = index + 1;
      continue;
    }
    if (line.includes('spelling:enable')) {
      disabled = false;
      continue;
    }
    if (disabled) continue;
    // An address is not prose. Blank out URLs and the value of a frozen `slug:` before matching,
    // so a link minted with a British spelling is left working rather than quietly broken.
    //
    // `question:` is blanked for a different reason: it holds somebody else's question title,
    // copied verbatim from a platform export, and respelling it would misquote the person who
    // wrote it. The entry's own title and body are current copy and are still checked.
    const prose = line
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/\]\([^)]*\)/g, ']()')
      .replace(/^(\s*slug:).*$/, '$1')
      .replace(/^(\s*question:).*$/, '$1');
    for (const { rule, pattern } of PATTERNS) {
      pattern.lastIndex = 0;
      const match = pattern.exec(prose);
      if (!match) continue;
      findings.push({
        file: repoPath,
        line: index + 1,
        found: match[0],
        expected: rule.us,
        text: line.trim().slice(0, 140),
      });
    }
  }
  if (disabled) {
    findings.push({
      file: repoPath,
      line: disabledAtLine,
      found: 'spelling:disable',
      expected: 'a matching spelling:enable before end of file',
      text: 'region never re-enabled — the rest of the file is unchecked',
    });
  }
}

if (findings.length === 0) {
  console.log(`check-us-spelling: no British spellings found (${RULES.length} rules).`);
  process.exit(0);
}

console.error(
  `check-us-spelling: found ${findings.length} British spelling(s). This blog writes US English.\n`,
);
for (const finding of findings) {
  console.error(`  ${finding.file}:${finding.line}  "${finding.found}" -> "${finding.expected}"`);
  console.error(`    ${finding.text}`);
}
console.error(
  '\nFix each one. If a hit is genuinely a quoted record, wrap it in spelling:disable /',
);
console.error('spelling:enable with the reason, or add the file to EXEMPT_FILES.');
process.exit(1);

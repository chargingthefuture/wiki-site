#!/usr/bin/env node
/**
 * Converts Quora data-export HTML to GitHub Wiki markdown.
 *
 * Handles two input layouts:
 *   A) A directory of individual saved `.html` files (one file per answer/page).
 *   B) A single combined HTML file (Quora's "answers.html" export), which is
 *      detected automatically and split into one file per answer.
 *
 * Usage:
 *   tsx convert-quora.ts <input-path> <output-dir> [options]
 *
 * Options:
 *   --category=<cat>   Category for manifest entries (default: Stories)
 *   --repo=<repo>      Target repo slug (default: chargingthefuture/chargingthefuture)
 *
 * Outputs:
 *   <output-dir>/<slug>.md      — one markdown file per answer
 *   <output-dir>/_manifest.yaml — ready-to-paste entries for content-index.yaml
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
  statSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, extname } from 'node:path';
import { parse as parseHtml } from 'node-html-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { dump as yamlDump } from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------- CLI args ----------
const args = process.argv.slice(2);
const positional = args.filter(a => !a.startsWith('--'));
const inputPath = positional[0];
const outputDir = positional[1];
const categoryArg = args.find(a => a.startsWith('--category='))?.split('=')[1] ?? 'Stories';
const repoArg =
  args.find(a => a.startsWith('--repo='))?.split('=')[1] ?? 'chargingthefuture/chargingthefuture';

if (!inputPath || !outputDir) {
  console.error(
    'Usage: tsx convert-quora.ts <input-path> <output-dir> [--category=Stories] [--repo=chargingthefuture/chargingthefuture]'
  );
  process.exit(1);
}

// ---------- Turndown ----------
const td = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
});
td.use(gfm);

// Remove Quora chrome that adds no value in markdown
td.remove([
  'script', 'style', 'nav', 'header', 'footer',
  '.q-sidebar', '.SidebarSection', '.NotionalContentWrapper',
  '.FollowButton', '.Ads', '.signup_wall', '.MobileButtons',
  '.RelatedQuestions', '.related-questions', '.NavigationBar',
  '[data-functional-selector="answer-menu"]',
  '.modal', '[role="dialog"]',
]);

// ---------- Helpers ----------

function slugify(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function extractTitle(root: ReturnType<typeof parseHtml>, fallback: string): string {
  const candidates = [
    root.querySelector('.q-title, .question-title, [data-page-id] h1')?.text,
    root.querySelector('h1')?.text,
    root
      .querySelector('title')
      ?.text?.replace(/\s*[\|–-]\s*Quora.*$/i, '')
      .replace(/\s*Answer by.*$/i, '')
      .trim(),
  ];
  for (const c of candidates) {
    const t = c?.trim().replace(/\s+/g, ' ');
    if (t && t.length > 2) return t;
  }
  return fallback.replace(/-/g, ' ');
}

function extractDate(root: ReturnType<typeof parseHtml>): string {
  const candidates = [
    root.querySelector('time[datetime]')?.getAttribute('datetime'),
    root.querySelector('time')?.text,
    root
      .querySelector('meta[property="article:published_time"]')
      ?.getAttribute('content'),
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function extractContent(root: ReturnType<typeof parseHtml>): string {
  // Quora answer body selectors (across Quora versions / export formats)
  const body = root.querySelector(
    '.q-text.qu-truncateLines--20, .q-text, .qtext_para, .ui_qtext_rendered_qtext, .answer_content'
  );
  if (body) return body.innerHTML;
  const generic = root.querySelector('article, main, .content, #content, .post-body');
  if (generic) return generic.innerHTML;
  return root.querySelector('body')?.innerHTML ?? '';
}

function excerptFrom(md: string, maxLen = 160): string {
  const line = md
    .split('\n')
    .map(l => l.trim())
    .find(l => l.length > 20 && !l.startsWith('#') && !l.startsWith('!') && !l.startsWith('|'));
  if (!line) return '';
  return line.length > maxLen ? line.slice(0, maxLen - 1) + '…' : line;
}

// ---------- Combined-export detection & splitting ----------

/**
 * Returns true if the HTML file looks like Quora's combined data-export format
 * (multiple answers concatenated in a single file).
 */
function isCombinedExport(html: string): boolean {
  const markers = (
    html.match(/class="pagedlist_item"|class="answer_content"|class="AnswerBase"/g) ?? []
  ).length;
  return markers > 2;
}

function splitCombinedExport(html: string): Array<{ html: string; fallback: string }> {
  const root = parseHtml(html);
  const items = root.querySelectorAll('.pagedlist_item, .AnswerBase, .answer_content');
  if (items.length < 2) {
    // Could not split; treat as single page
    return [{ html, fallback: 'quora-answer' }];
  }
  return items.map((el, i) => ({
    html: `<html><body>${el.outerHTML}</body></html>`,
    fallback: `quora-answer-${String(i + 1).padStart(3, '0')}`,
  }));
}

// ---------- Single-page conversion ----------

interface Converted {
  slug: string;
  title: string;
  date: string;
  md: string;
  excerpt: string;
}

function convertPage(html: string, fallbackSlug: string): Converted {
  const root = parseHtml(html);
  const title = extractTitle(root, fallbackSlug);
  const date = extractDate(root);
  const md = td.turndown(extractContent(root));
  const slug = slugify(title) || fallbackSlug;
  return { slug, title, date, md, excerpt: excerptFrom(md) };
}

// ---------- Main ----------

function main() {
  if (!existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    process.exit(1);
  }
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  // Build a list of (html string, fallback slug) pairs to convert
  const items: Array<{ html: string; fallback: string }> = [];

  const stat = statSync(inputPath);
  if (stat.isDirectory()) {
    const files = readdirSync(inputPath)
      .filter(f => f.toLowerCase().endsWith('.html') && !f.startsWith('_'))
      .sort();
    for (const f of files) {
      const html = readFileSync(join(inputPath, f), 'utf8');
      if (isCombinedExport(html)) {
        items.push(...splitCombinedExport(html));
      } else {
        items.push({ html, fallback: basename(f, extname(f)) });
      }
    }
  } else {
    // Single file
    const html = readFileSync(inputPath, 'utf8');
    if (isCombinedExport(html)) {
      items.push(...splitCombinedExport(html));
    } else {
      items.push({ html, fallback: basename(inputPath, extname(inputPath)) });
    }
  }

  if (items.length === 0) {
    console.error('No HTML content found to convert.');
    process.exit(1);
  }

  console.log(`Converting ${items.length} Quora answer(s)…\n`);

  const manifestEntries: unknown[] = [];
  const slugsSeen = new Set<string>();
  let ok = 0;
  let failed = 0;

  for (const { html, fallback } of items) {
    try {
      let entry = convertPage(html, fallback);

      // Guarantee unique slug
      let slug = entry.slug;
      if (slugsSeen.has(slug)) {
        let n = 2;
        while (slugsSeen.has(`${slug}-${n}`)) n++;
        slug = `${slug}-${n}`;
      }
      slugsSeen.add(slug);

      const outPath = join(outputDir, `${slug}.md`);
      writeFileSync(outPath, `# ${entry.title}\n\n${entry.md}\n`, 'utf8');

      manifestEntries.push({
        slug,
        title: entry.title,
        repo: repoArg,
        date: entry.date,
        excerpt: entry.excerpt || `(add excerpt for "${entry.title}")`,
        category: categoryArg,
      });

      console.log(`  ✓  ${slug}.md`);
      ok++;
    } catch (e) {
      console.error(`  ✗  ${fallback}: ${e}`);
      failed++;
    }
  }

  const manifestPath = join(outputDir, '_manifest.yaml');
  const header =
    '# Review the .md files, push them to GitHub Wiki, then paste these entries\n' +
    '# into content-index.yaml and run validate + sync-articles.\n\n';
  writeFileSync(manifestPath, header + yamlDump({ articles: manifestEntries }, { lineWidth: 120 }), 'utf8');

  console.log(`\nDone: ${ok} converted, ${failed} failed.`);
  console.log(`Manifest → ${manifestPath}\n`);
  console.log('Next steps:');
  console.log('  1. Review .md files; fix slugs, dates, and formatting as needed.');
  console.log('  2. Push .md files to your GitHub Wiki (see PUBLISHING.md).');
  console.log('  3. Paste _manifest.yaml entries into content-index.yaml.');
  console.log('  4. pnpm --filter @workspace/scripts run validate');
  console.log('  5. pnpm --filter @workspace/scripts run sync-articles');
}

main();

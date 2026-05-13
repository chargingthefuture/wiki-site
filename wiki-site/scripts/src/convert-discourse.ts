#!/usr/bin/env node
/**
 * Converts a directory of Discourse-saved HTML pages into GitHub Wiki markdown.
 *
 * Usage:
 *   tsx convert-discourse.ts <input-dir> <output-dir> [options]
 *
 * Options:
 *   --category=<cat>   Category for manifest entries (default: Community)
 *   --repo=<repo>      Target repo slug (default: chargingthefuture/chargingthefuture)
 *
 * Outputs:
 *   <output-dir>/<slug>.md     — one clean markdown file per HTML input
 *   <output-dir>/_manifest.yaml — ready-to-paste entries for content-index.yaml
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, extname } from 'node:path';
import { parse as parseHtml } from 'node-html-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { dump as yamlDump } from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------- CLI args ----------
const args = process.argv.slice(2);
const inputDir = args.find(a => !a.startsWith('--'));
const outputDir = args.filter(a => !a.startsWith('--'))[1];
const categoryArg = args.find(a => a.startsWith('--category='))?.split('=')[1] ?? 'Community';
const repoArg = args.find(a => a.startsWith('--repo='))?.split('=')[1] ?? 'chargingthefuture/chargingthefuture';

if (!inputDir || !outputDir) {
  console.error(
    'Usage: tsx convert-discourse.ts <input-dir> <output-dir> [--category=Community] [--repo=chargingthefuture/chargingthefuture]'
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

// Strip Discourse navigation/chrome that we never want in markdown output
const DISCOURSE_NOISE_SELECTORS = [
  'script', 'style', 'nav', 'header', 'footer',
  '.d-header', '.d-footer', '.sidebar', '.topic-map',
  '.post-menu-area', '.topic-meta-data', '.suggested-topics',
  '.timeline-container', '.alert', '.modal', '.login-required',
  '.discourse-footer', '[data-action="dismiss"]',
];
td.remove(DISCOURSE_NOISE_SELECTORS);

// ---------- Helpers ----------

function toSlug(filename: string): string {
  return basename(filename, extname(filename))
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

function extractTitle(root: ReturnType<typeof parseHtml>): string {
  const candidates = [
    root.querySelector('.fancy-title')?.text,
    root.querySelector('h1')?.text,
    root.querySelector('title')?.text?.replace(/\s*[|–\-].*$/, '').trim(),
  ];
  for (const c of candidates) {
    const t = c?.trim().replace(/\s+/g, ' ');
    if (t && t.length > 1) return t;
  }
  return 'Untitled';
}

function extractDate(root: ReturnType<typeof parseHtml>): string {
  const raw =
    root.querySelector('time[datetime]')?.getAttribute('datetime') ??
    root.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ??
    root.querySelector('meta[name="date"]')?.getAttribute('content');
  if (raw) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function extractContent(root: ReturnType<typeof parseHtml>): string {
  // Discourse stores the rendered post HTML in .cooked
  const cooked = root.querySelector('.cooked');
  if (cooked) return cooked.innerHTML;
  // Generic fallback: first large content region
  const region = root.querySelector('#main-outlet, main, article, .content-body, .post-body, .topic-body');
  if (region) return region.innerHTML;
  return root.querySelector('body')?.innerHTML ?? root.innerHTML;
}

function excerptFrom(md: string, maxLen = 160): string {
  const line = md
    .split('\n')
    .map(l => l.trim())
    .find(l => l.length > 20 && !l.startsWith('#') && !l.startsWith('!') && !l.startsWith('|'));
  if (!line) return '';
  return line.length > maxLen ? line.slice(0, maxLen - 1) + '…' : line;
}

// ---------- Main ----------

function main() {
  if (!existsSync(inputDir!)) {
    console.error(`Input directory not found: ${inputDir}`);
    process.exit(1);
  }
  if (!existsSync(outputDir!)) mkdirSync(outputDir!, { recursive: true });

  const files = readdirSync(inputDir!)
    .filter(f => f.toLowerCase().endsWith('.html') && !f.startsWith('_'))
    .sort();

  if (files.length === 0) {
    console.error(`No .html files found in ${inputDir}`);
    process.exit(1);
  }

  console.log(`Converting ${files.length} Discourse HTML file(s)…\n`);

  const manifestEntries: unknown[] = [];
  let ok = 0;
  let failed = 0;

  for (const file of files) {
    const inputPath = join(inputDir!, file);
    const slug = toSlug(file);
    const outputPath = join(outputDir!, `${slug}.md`);

    try {
      const html = readFileSync(inputPath, 'utf8');
      const root = parseHtml(html);

      const title = extractTitle(root);
      const date = extractDate(root);
      const contentHtml = extractContent(root);
      const md = td.turndown(contentHtml);
      const excerpt = excerptFrom(md);

      writeFileSync(outputPath, `# ${title}\n\n${md}\n`, 'utf8');

      manifestEntries.push({
        slug,
        title,
        repo: repoArg,
        date,
        excerpt: excerpt || `(add excerpt for "${title}")`,
        category: categoryArg,
      });

      console.log(`  ✓  ${file}  →  ${slug}.md`);
      ok++;
    } catch (e) {
      console.error(`  ✗  ${file}: ${e}`);
      failed++;
    }
  }

  const manifestPath = join(outputDir!, '_manifest.yaml');
  const manifestHeader =
    '# Review the .md files, fix any formatting, push them to your GitHub Wiki,\n' +
    '# then paste the entries below into content-index.yaml and run:\n' +
    '#   pnpm --filter @workspace/scripts run validate\n' +
    '#   pnpm --filter @workspace/scripts run sync-articles\n\n';
  writeFileSync(manifestPath, manifestHeader + yamlDump({ articles: manifestEntries }, { lineWidth: 120 }), 'utf8');

  console.log(`\nDone: ${ok} converted, ${failed} failed.`);
  console.log(`Manifest → ${manifestPath}\n`);
  console.log('Next steps:');
  console.log('  1. Review .md files in the output directory and fix any issues.');
  console.log('  2. Push .md files to your GitHub Wiki (see PUBLISHING.md).');
  console.log('  3. Paste _manifest.yaml entries into content-index.yaml.');
  console.log('  4. pnpm --filter @workspace/scripts run validate');
  console.log('  5. pnpm --filter @workspace/scripts run sync-articles');
}

main();

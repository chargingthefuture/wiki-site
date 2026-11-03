/**
 * Link previews that show the page's own address (owner directive, 2026-11-03).
 *
 * A link preview (Quora's card, a chat app's card) reads the page's <title> and its og: tags.
 * Every name it can read is set to the page's own address, so a shared link shows exactly where
 * it goes, with no other name standing in front of it.
 *
 * The site is one page that the browser fills in, and GitHub Pages answered every post address
 * with 404.html, a copy of that page carrying one title for all of them. So after the Pages build
 * this writes one copy per address: `<route>.html` for each page and
 * `article/<repo>/<slug>.html` for each post, which Pages serves at the address without the
 * `.html`, the same way it serves `/feed` from `feed.html`. Each copy is the built page with its
 * own address in the title and tags; the page behaves exactly as before once it loads.
 *
 * Runs at the end of `wiki:build:pages` only: the addresses are the published ones under
 * https://chargingthefuture.github.io/chargingthefuture/. Build output, never committed.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = resolve(__dirname, '../..');
const DIST = resolve(BLOG_ROOT, 'artifacts/wiki/dist/public');
const REGISTRY = resolve(BLOG_ROOT, 'artifacts/wiki/src/lib/articles.ts');

const SITE = 'https://chargingthefuture.github.io/chargingthefuture';

/** The site's own pages besides posts, matching the routes in artifacts/wiki/src/App.tsx. */
const PAGES = ['feed', 'record', 'streams', 'peace-battle-2'];

type Article = { slug: string; repo: string };

function readArticles(): Article[] {
  const source = readFileSync(REGISTRY, 'utf8');
  const start = source.indexOf('export const ARTICLES: ArticleMeta[] = ');
  const open = source.indexOf('= [', start) + 2;
  const close = source.indexOf('\n];', open);
  if (start === -1 || open === 1 || close === -1) {
    throw new Error(`${REGISTRY}: ARTICLES array not found; run pnpm wiki:sync`);
  }
  // The generated array ends with a trailing comma, which JSON does not allow.
  return JSON.parse(source.slice(open, close + 2).replace(/,\s*\]$/, ']')) as Article[];
}

function attr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function withAddress(template: string, url: string): string {
  const tags = [
    `<title>${attr(url)}</title>`,
    `<meta property="og:title" content="${attr(url)}" />`,
    `<meta property="og:site_name" content="${attr(url)}" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:title" content="${attr(url)}" />`,
  ].join('\n    ');
  const out = template.replace(/<title>[^<]*<\/title>/, tags);
  if (out === template) throw new Error(`${DIST}/index.html: no <title> to replace`);
  return out;
}

function write(relativePath: string, html: string): void {
  const file = join(DIST, relativePath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
}

function main(): void {
  const template = readFileSync(join(DIST, 'index.html'), 'utf8');

  write('index.html', withAddress(template, `${SITE}/`));
  for (const page of PAGES) write(`${page}.html`, withAddress(template, `${SITE}/${page}`));

  const articles = readArticles();
  for (const { repo, slug } of articles) {
    const shortRepo = repo.split('/')[1] || repo;
    // Same address as getArticleUrl in the registry. The file sits at the decoded slug, which is
    // the path Pages looks up for that address.
    write(
      `article/${shortRepo}/${slug}.html`,
      withAddress(template, `${SITE}/article/${shortRepo}/${encodeURIComponent(slug)}`),
    );
  }

  console.log(`✓ Link previews: ${PAGES.length + 1} pages and ${articles.length} posts carry their own address`);
}

main();

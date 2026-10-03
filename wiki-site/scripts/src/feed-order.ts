/**
 * The listed pages in the order /feed shows them, newest first, read from the generated registry
 * (artifacts/wiki/src/lib/articles.ts, written by wiki:sync). The feed page renders the registry's
 * order as it stands, so this is the one place the order lives; both paste sheets follow it so a
 * reader moving between the blog and a sheet finds the same sequence (owner directive, 2026-10-03).
 *
 * Run wiki:sync first: a registry that is behind the posts gives an order that is behind them too.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type FeedPage = {
  slug: string;
  title: string;
  repo: string;
  date: string;
  collection?: string;
  path?: string;
  number?: number;
  listed?: boolean;
};

export function feedOrder(wikiRoot: string): FeedPage[] {
  const source = readFileSync(resolve(wikiRoot, 'artifacts/wiki/src/lib/articles.ts'), 'utf8');
  const start = source.indexOf('export const ARTICLES: ArticleMeta[] = ');
  const open = source.indexOf('= [', start) + 2;
  const close = source.indexOf('\n];', open);
  if (start === -1 || open === 1 || close === -1) throw new Error('articles.ts: ARTICLES array not found; run pnpm wiki:sync');
  // The generated array ends with a trailing comma, which JSON does not allow.
  const all = JSON.parse(source.slice(open, close + 2).replace(/,\s*\]$/, ']')) as FeedPage[];
  return all.filter((a) => a.listed !== false);
}

/** "<repo short name>/<slug>", the key feed-numbers.json and the paste sheet links use. */
export function feedKey(page: { repo: string; slug: string }): string {
  return `${page.repo.split('/')[1] ?? page.repo}/${page.slug}`;
}

/**
 * Each listed page's permanent number on the blog feed (/feed), oldest is No. 1, from
 * content/feed-numbers.json (written by wiki:sync, never changed once given). The paste sheets and
 * the teaser readings print and speak these numbers, so they read the same file the feed does.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type FeedEntry = { slug: string; repo: string; number: number };

/** Keyed "<repo short name>/<slug>", e.g. "wiki-site/what-stays-up". */
export function feedEntries(wikiRoot: string): FeedEntry[] {
  const numbers = JSON.parse(readFileSync(resolve(wikiRoot, 'content/feed-numbers.json'), 'utf8')) as Record<string, number>;
  return Object.entries(numbers).map(([key, number]) => {
    const [repoShort, ...rest] = key.split('/');
    return { slug: rest.join('/'), repo: `chargingthefuture/${repoShort}`, number };
  });
}

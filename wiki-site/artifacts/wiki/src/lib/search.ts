/**
 * Keyword search over the article registry.
 *
 * The registry is already in the browser, so this is a plain client-side
 * filter: no index to build, no request to make, and it works on the Record
 * and the Feed alike.
 *
 * What it searches is everything the registry actually holds — title, excerpt,
 * teaser, and for archive entries the question it was written under, the space
 * it was written into and the account that wrote it. It does NOT search post
 * bodies: those are loaded one at a time, so a body search would mean fetching
 * every entry. A reader looking for a phrase they wrote will usually find it in
 * the title or excerpt, and the excerpt is drawn from the opening of the body.
 */
import type { ArticleMeta } from './articles';

/** Lowercase, strip accents and punctuation, collapse whitespace. */
function normalize(s: string): string {
  return s
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The searchable text of one article, normalized once per call site. */
export function haystack(a: ArticleMeta): string {
  return normalize(
    [
      a.title,
      a.excerpt,
      a.teaser ?? '',
      a.archive?.question ?? '',
      a.archive?.space ?? '',
      a.archive?.account ?? '',
      ...(a.archive?.sharedTo ?? []),
      ...(a.topics ?? []),
    ].join(' '),
  );
}

/**
 * Split a query into terms. A quoted "exact phrase" stays one term, so a
 * reader can pin a wording rather than matching its words separately.
 */
export function parseQuery(query: string): string[] {
  const terms: string[] = [];
  const re = /"([^"]+)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(query))) {
    const t = normalize(m[1] ?? m[2] ?? '');
    if (t) terms.push(t);
  }
  return terms;
}

/**
 * Every term must appear, so adding a word narrows rather than widens — which
 * is what someone hunting one post out of 1,300 expects.
 */
export function matches(hay: string, terms: string[]): boolean {
  return terms.every((t) => hay.includes(t));
}

/** Filter a list of articles by a raw query string. Empty query: unchanged. */
export function filterByQuery<T extends { article: ArticleMeta }>(
  rows: T[],
  query: string,
): T[] {
  const terms = parseQuery(query);
  if (!terms.length) return rows;
  return rows.filter((r) => matches(haystack(r.article), terms));
}

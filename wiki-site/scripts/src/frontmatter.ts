/**
 * Shared front-matter helpers for the content pipeline.
 *
 * Content files under wiki-site/content/ carry a YAML front-matter block.
 * This module parses and serializes that block and infers metadata from
 * legacy wiki markdown (Discourse-import comment headers, first heading,
 * first paragraph) for files that predate front matter.
 */

import { dump, load } from 'js-yaml';

export interface ArchiveMeta {
  source: string; // "discourse" | "quora"
  account?: string;
  original_url?: string;
  original_date?: string;
  status?: string; // "erased" | "closed"
  kind?: string; // what it was on the platform, e.g. "answer-comment"
  space?: string; // the space it was written in, when it was not the author's own
  question?: string; // the question title it was written under
  removed?: boolean; // taken down by the platform while the account was still live
  shared_to?: string[]; // other spaces the same piece was carried into
  screenshot?: string; // "images/<file>" — a picture of the original page
  screenshot_alt?: string; // the pictured words, kept readable when the image cannot be seen
  screenshot_credit?: string; // visible credit: name in plain text, address written out
  snapshot_url?: string; // a saved copy of the original page, where one exists
}

export interface ContentMeta {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  slug?: string;
  repo?: string;
  featured?: boolean;
  listed?: boolean;
  teaser?: string;
  topics?: string[];
  archive?: ArchiveMeta;
}

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontMatter(markdown: string): { meta: ContentMeta | null; body: string } {
  const match = markdown.match(FRONT_MATTER_RE);
  if (!match) return { meta: null, body: markdown };
  const meta = load(match[1]) as ContentMeta;
  // YAML parses an unquoted 2026-08-17 as a Date object; normalize back to
  // the plain YYYY-MM-DD string the pipeline expects.
  if (meta) {
    const asDateString = (v: unknown): string | undefined =>
      v instanceof Date ? v.toISOString().slice(0, 10) : undefined;
    meta.date = asDateString(meta.date) ?? meta.date;
    if (meta.archive) {
      meta.archive.original_date = asDateString(meta.archive.original_date) ?? meta.archive.original_date;
    }
  }
  return { meta, body: markdown.slice(match[0].length) };
}

export function serializeFrontMatter(meta: ContentMeta, body: string): string {
  const yaml = dump(meta, { lineWidth: -1, quotingType: '"' });
  return `---\n${yaml}---\n\n${body.replace(/^\n+/, '')}`;
}

export function cleanExcerptLine(line: string): string {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_>#|]/g, ' ')
    .replace(/&hellip;/gi, '...')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function toIsoDate(raw?: string): string | undefined {
  if (!raw) return undefined;
  const d = new Date(raw.trim());
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

export interface InferredMeta {
  title: string;
  date?: string;
  excerpt: string;
  created?: string;
}

/**
 * Infers title/date/excerpt from legacy wiki markdown. Discourse imports carry
 * an HTML comment header (Title:/Created:/Updated:/Excerpt:); other pages fall
 * back to the first heading and first substantial paragraph.
 */
export function inferMetaFromMarkdown(markdown: string, slug: string, fallbackCategory: string): InferredMeta {
  const comment = markdown.match(/<!--([\s\S]*?)-->/)?.[1] ?? '';
  const titleFromMeta = comment.match(/^\s*Title:\s*(.+)$/im)?.[1]?.trim();
  const created = comment.match(/^\s*Created:\s*(.+)$/im)?.[1]?.trim();
  const updated = comment.match(/^\s*Updated:\s*(.+)$/im)?.[1]?.trim();
  const excerptFromMeta = comment.match(/^\s*Excerpt:\s*(.+)$/im)?.[1]?.trim();
  const titleFromHeading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();

  const title = titleFromMeta || titleFromHeading || slug.split('/').pop()?.replace(/-/g, ' ') || slug;
  const date = toIsoDate(created) || toIsoDate(updated);

  let excerpt = excerptFromMeta ? cleanExcerptLine(excerptFromMeta) : '';
  if (!excerpt) {
    for (const line of markdown.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#') || t.startsWith('<!--') || t.startsWith('>')) continue;
      const cleaned = cleanExcerptLine(t);
      if (cleaned.length >= 24) {
        excerpt = cleaned;
        break;
      }
    }
  }
  if (!excerpt) excerpt = `${fallbackCategory} post from Charging The Future.`;
  if (excerpt.length > 160) excerpt = `${excerpt.slice(0, 159)}...`;

  return { title, date, excerpt, created: toIsoDate(created) };
}

/** True when the markdown looks like a Discourse export (comment header with a Slug: line). */
export function isDiscourseImport(markdown: string): boolean {
  const comment = markdown.match(/<!--([\s\S]*?)-->/)?.[1] ?? '';
  return /^\s*Slug:\s*.+$/im.test(comment);
}

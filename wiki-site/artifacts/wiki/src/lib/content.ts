/**
 * Loads article markdown and images bundled from the repo's content/
 * directory (wiki-site/content). This is the canonical content source; the
 * live GitHub-wiki fetch in use-article.ts remains only as a fallback for
 * any registry entry without a bundled path.
 */

import { ARTICLES, type ArticleMeta } from './articles';

const CONTENT_PREFIX = '../../../../content/';

const markdownModules = import.meta.glob('../../../../content/**/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

const imageModules = import.meta.glob('../../../../content/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const FRONT_MATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

export function stripFrontMatter(markdown: string): string {
  return markdown.replace(FRONT_MATTER_RE, '');
}

// Slugs that changed after a link was already shared in public. The old URL
// keeps resolving to the renamed article so nothing published elsewhere dies.
const LEGACY_SLUGS: Record<string, string> = {
  'honoring-the-first-supporters': 'honoring-the-earliest-supporters',
};

export function findArticle(slug: string): ArticleMeta | undefined {
  const exact = ARTICLES.find((a) => a.slug === slug);
  if (exact) return exact;
  const renamed = LEGACY_SLUGS[slug];
  if (renamed) {
    const target = ARTICLES.find((a) => a.slug === renamed);
    if (target) return target;
  }
  // Alias fallback: links in the wild sometimes carry a wrong or outdated
  // folder prefix (e.g. discourse-migrate/v2k-for-decades when the real slug
  // is v2k-for-decades). Resolve by the final path segment when exactly one
  // article matches it, so an old shared link lands on the article instead
  // of a dead page.
  const base = slug.split('/').pop();
  if (!base) return undefined;
  const matches = ARTICLES.filter((a) => a.slug.split('/').pop() === base);
  return matches.length === 1 ? matches[0] : undefined;
}

export async function loadArticleContent(path: string): Promise<string> {
  const loader = markdownModules[CONTENT_PREFIX + path];
  if (!loader) {
    throw new Error(`Content file not bundled: content/${path}`);
  }
  const raw = await loader();
  return stripFrontMatter(raw);
}

/**
 * Resolves an image reference from article markdown (e.g. "images/foo.png"
 * or "/images/foo.png") to the bundled asset URL, if the file exists in
 * content/images/.
 */
export function contentImageUrl(ref: string): string | undefined {
  const name = ref.replace(/^\.?\/?images\//, '');
  if (name === ref) return undefined; // not an images/ reference
  return imageModules[`${CONTENT_PREFIX}images/${name}`];
}

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

export function findArticle(slug: string): ArticleMeta | undefined {
  return ARTICLES.find((a) => a.slug === slug);
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

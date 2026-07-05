/**
 * Render-time cleanup for Discourse-imported wiki pages (discourse-migrate/*).
 *
 * The wiki source pages are a historical archive and are never modified;
 * everything here runs in the browser on the fetched markdown/HTML so the
 * deployed article reads as clean prose instead of raw HTML tags.
 */

// Minimal structural type for hast nodes (avoids a direct dependency on the
// 'hast' type package; react-markdown supplies the real tree at runtime).
export interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

/** Marker left by the Discourse import: an HTML comment metadata block. */
const DISCOURSE_META_COMMENT = /<!--\s*\n?Title:[\s\S]*?-->\s*/;

/**
 * Detects a Discourse-imported page and strips the artifacts that duplicate
 * what the article header already shows:
 *   - the metadata HTML comment (Title / Slug / Created / Excerpt)
 *   - the leading `# Title` heading (header renders the title)
 *   - the leading `> excerpt…` blockquote (header renders the excerpt)
 * Non-imported pages are returned unchanged.
 */
export function stripDiscourseImportArtifacts(markdown: string): string {
  if (!DISCOURSE_META_COMMENT.test(markdown)) return markdown;
  return markdown
    .replace(DISCOURSE_META_COMMENT, '')
    .replace(/^\s*# [^\n]*\n+/, '')
    .replace(/^\s*(?:>[^\n]*\n?)+\n*/, '');
}

function classList(node: HastNode): string[] {
  const cls = node.properties?.className;
  return Array.isArray(cls) ? cls.map(String) : [];
}

function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}

function findFirst(node: HastNode, pred: (n: HastNode) => boolean): HastNode | undefined {
  for (const child of node.children ?? []) {
    if (child.type === 'element' && pred(child)) return child;
    const found = findFirst(child, pred);
    if (found) return found;
  }
  return undefined;
}

function isExternalLink(n: HastNode): boolean {
  return n.tagName === 'a' && typeof n.properties?.href === 'string' && /^https?:\/\//.test(n.properties.href as string);
}

function element(tagName: string, properties: Record<string, unknown>, children: HastNode[]): HastNode {
  return { type: 'element', tagName, properties, children };
}

function text(value: string): HastNode {
  return { type: 'text', value };
}

/**
 * Replaces a Discourse "onebox" embed (link preview with icons, avatars and
 * duplicated body text) with a single plain paragraph link.
 */
function simplifyOnebox(aside: HastNode): HastNode | null {
  const src = typeof aside.properties?.dataOneboxSrc === 'string' ? (aside.properties.dataOneboxSrc as string) : undefined;
  const heading = findFirst(aside, n => n.tagName === 'h3');
  const headingLink = heading ? findFirst(heading, isExternalLink) : undefined;
  const anyLink = headingLink ?? findFirst(aside, isExternalLink);
  const href = src ?? (anyLink?.properties?.href as string | undefined);
  if (!href) return null; // nothing linkable — drop the embed entirely
  const label = (headingLink && textOf(headingLink).trim()) || href;
  return element('p', {}, [element('a', { href }, [text(label)])]);
}

/**
 * Replaces a Discourse quote aside (avatar, category badges, controls) with a
 * plain blockquote: source link first, then the quoted text.
 */
function simplifyQuote(aside: HastNode): HastNode {
  const sourceLink = findFirst(aside, isExternalLink);
  const inner = findFirst(aside, n => n.tagName === 'blockquote');
  const children: HastNode[] = [];
  if (sourceLink) {
    children.push(
      element('p', {}, [element('a', { href: sourceLink.properties?.href }, [text(textOf(sourceLink).trim())])])
    );
  }
  children.push(...(inner?.children ?? []));
  return element('blockquote', {}, children);
}

/**
 * Rehype plugin: walks the HTML tree produced by rehype-raw and rewrites
 * Discourse chrome into plain readable elements. Runs before sanitization.
 */
export function rehypeDiscourseCleanup() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (!node.children) return;
      const next: HastNode[] = [];
      for (const child of node.children) {
        if (child.type === 'element' && child.tagName === 'aside') {
          const cls = classList(child);
          if (cls.includes('onebox')) {
            const replacement = simplifyOnebox(child);
            if (replacement) next.push(replacement);
            continue;
          }
          if (cls.includes('quote')) {
            const replacement = simplifyQuote(child);
            walk(replacement);
            next.push(replacement);
            continue;
          }
        }
        walk(child);
        next.push(child);
      }
      node.children = next;
    };
    walk(tree);
  };
}

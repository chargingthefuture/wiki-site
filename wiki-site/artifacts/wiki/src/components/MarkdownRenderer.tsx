import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/lib/utils';
import { contentImageUrl } from '@/lib/content';
import { rehypeDiscourseCleanup, stripDiscourseImportArtifacts } from '@/lib/discourse-html';

/**
 * A markdown table wider than the viewport scrolls sideways in its own
 * container rather than having its columns crushed — on a phone the browser
 * will otherwise shrink a column to one character per line. When the table
 * does overflow, the container becomes a focusable region so a keyboard user
 * can scroll it, and a line below says the rest of the table is there, since
 * a cut-off column looks like the end of the table.
 */
function ScrollableTable(props: React.HTMLAttributes<HTMLTableElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScrollable(el.scrollWidth > el.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="table-block">
      <div
        ref={ref}
        className="table-scroll"
        tabIndex={scrollable ? 0 : undefined}
        role={scrollable ? 'region' : undefined}
        aria-label={scrollable ? 'Table — scroll sideways for the remaining columns' : undefined}
      >
        <table {...props} />
      </div>
      {scrollable && (
        <p className="table-scroll-hint" aria-hidden="true">
          Scroll sideways for the rest of the table →
        </p>
      )}
    </div>
  );
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
  repo?: string;
}

export function MarkdownRenderer({ content, className, repo }: MarkdownRendererProps) {
  /**
   * Converts relative wiki image paths to absolute GitHub raw content URLs.
   * Examples:
   *   /uploads/xxx/image.png → https://raw.githubusercontent.com/wiki/chargingthefuture/chargingthefuture/uploads/xxx/image.png
   *   Already absolute URLs are returned as-is
   */
  function resolveImageUrl(url: string): string {
    if (!url) return url;

    // If already absolute, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Canonical source: images bundled from the repo's content/images/.
    const bundled = contentImageUrl(url);
    if (bundled) return bundled;

    // Determine the full repo path
    const fullRepo = repo === 'mono' ? 'chargingthefuture/mono' : 'chargingthefuture/chargingthefuture';

    // If relative path (starts with /), convert to GitHub wiki raw content URL
    if (url.startsWith('/')) {
      return `https://raw.githubusercontent.com/wiki/${fullRepo}${url}`;
    }

    return url;
  }

  // Pre-process markdown to fix common wiki artifacts if necessary
  const processedContent = stripDiscourseImportArtifacts(
    content
      // Remove the generic wiki "Jump to bottom" or "Skip to content" stuff
      .replace(/\[Skip to content\]\(.*?\)/g, '')
      .replace(/\[Jump to bottom\]\(.*?\)/g, '')
      .replace(/You signed in with another tab or window.*?Dismiss alert/g, '')
  );

  return (
    <div className={cn("prose prose-invert max-w-4xl mx-auto", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // Discourse-imported pages embed raw HTML. rehype-raw parses it so it
        // renders as content instead of literal tags; the cleanup plugin
        // rewrites Discourse chrome (oneboxes, quote headers) into plain
        // links/blockquotes; rehype-sanitize strips anything unsafe.
        rehypePlugins={[rehypeRaw, rehypeDiscourseCleanup, rehypeSanitize]}
        components={{
          // Customizing components to ensure they fit the aesthetic and don't break
          img: ({ node, ...props }) => {
            const resolvedSrc = resolveImageUrl(props.src || '');
            return (
              <span className="block relative my-12 bg-black border-4 border-black comic-shadow-primary overflow-hidden p-2 group">
                <span className="absolute inset-0 bg-halftone opacity-20 group-hover:opacity-0 transition-opacity z-10 pointer-events-none"></span>
                <img 
                  {...props}
                  src={resolvedSrc}
                  className="w-full h-auto relative z-20 grayscale-[20%] contrast-125 hover:grayscale-0 transition-all duration-500" 
                  loading="lazy"
                  onError={(e) => {
                    // Fallback for broken GitHub private images
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement?.classList.add('broken-image-fallback');
                  }}
                />
              </span>
            );
          },
          table: ({ node, ...props }) => <ScrollableTable {...props} />,
          a: ({ node, ...props }) => {
            // Check if link is internal wiki link to rewrite it
            const href = props.href || '';
            if (href.includes('/wiki/')) {
              // Try to map to our internal route structure
              const parts = href.split('/wiki/');
              if (parts.length === 2) {
                const afterWiki = parts[1].split('#')[0]; // drop hash
                // Just let normal external link handling apply if complex,
                // but we can try to intercept known formats.
              }
            }
            return <a {...props} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" />;
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

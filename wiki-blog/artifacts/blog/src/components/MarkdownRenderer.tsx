import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Pre-process markdown to fix common wiki artifacts if necessary
  const processedContent = content
    // Remove the generic wiki "Jump to bottom" or "Skip to content" stuff
    .replace(/\[Skip to content\]\(.*?\)/g, '')
    .replace(/\[Jump to bottom\]\(.*?\)/g, '')
    .replace(/You signed in with another tab or window.*?Dismiss alert/g, '');

  return (
    <div className={cn("prose prose-invert max-w-4xl mx-auto", className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Customizing components to ensure they fit the aesthetic and don't break
          img: ({ node, ...props }) => (
            <span className="block relative my-12 bg-black border-4 border-black comic-shadow-primary overflow-hidden p-2 group">
              <span className="absolute inset-0 bg-halftone opacity-20 group-hover:opacity-0 transition-opacity z-10 pointer-events-none"></span>
              <img 
                {...props} 
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
          ),
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

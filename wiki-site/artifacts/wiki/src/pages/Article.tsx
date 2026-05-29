import { useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useArticle } from "@/hooks/use-article";
import { ARTICLES } from "@/lib/articles";
import { estimateReadTime } from "@/lib/utils";

export default function Article() {
  const params = useParams();
  // Safe decode in case of URL encoding
  const repo = params.repo ? decodeURIComponent(params.repo) : "";
  const slug = params.slug ? decodeURIComponent(params.slug) : "";

  const { data: content, isLoading, isError } = useArticle(repo, slug);

  // Find meta data if it exists in our list
  const meta = ARTICLES.find(a => a.slug === slug);
  const readTime = content ? estimateReadTime(content.length) : meta ? estimateReadTime(meta.excerpt.length * 20) : 5;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold text-lg uppercase text-gray-400 hover:text-white transition-colors mb-10 group bg-black border-2 border-gray-800 px-4 py-2 hover:border-white">
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Terminal
        </Link>

        {isLoading ? (
          <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
            <div className="h-8 bg-gray-800 w-32 mb-6 border-2 border-black"></div>
            <div className="h-16 md:h-24 bg-gray-800 w-full mb-8 border-4 border-black comic-shadow"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 w-full"></div>
              <div className="h-4 bg-gray-800 w-5/6"></div>
              <div className="h-4 bg-gray-800 w-4/6"></div>
            </div>
            <div className="h-64 bg-gray-800 w-full my-8 border-4 border-black comic-shadow-primary"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 w-full"></div>
              <div className="h-4 bg-gray-800 w-5/6"></div>
            </div>
          </div>
        ) : isError ? (
          <div className="max-w-3xl mx-auto text-center py-20 bg-card border-4 border-primary comic-shadow-primary">
            <AlertTriangle className="mx-auto text-primary mb-6" size={64} />
            <h1 className="font-display text-5xl text-white mb-4 uppercase">Transmission Failed</h1>
            <p className="font-sans text-xl text-gray-400 mb-8">
              The document you are looking for has been moved, redacted, or does not exist.
            </p>
            <Link href="/" className="inline-block bg-primary text-white font-heading font-bold uppercase text-xl px-8 py-4 border-4 border-black comic-shadow-sm hover:shadow-none hover:translate-y-1 transition-all">
              Return to Base
            </Link>
          </div>
        ) : (
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <header className="mb-12 border-b-8 border-black pb-12 relative">
              <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none -z-10"></div>
              
              {meta && (
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 bg-accent text-black font-heading font-bold text-sm uppercase tracking-wider border-2 border-black comic-shadow-sm">
                    {meta.category}
                  </span>
                  <div className="flex items-center text-gray-400 font-mono text-sm gap-4 bg-black px-4 py-1.5 border-2 border-gray-800">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-primary" />
                      {new Date(meta.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} className="text-primary" />
                      {readTime} min read
                    </span>
                  </div>
                </div>
              )}

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white uppercase leading-[1.1] mb-6" style={{WebkitTextStroke: '1px black', textShadow: '2px 2px 0 #000'}}>
                {meta ? meta.title : slug.replace(/-/g, ' ')}
              </h1>
              
              {meta && (
                <p className="font-sans text-xl md:text-2xl text-gray-300 border-l-4 border-primary pl-6 bg-secondary/30 p-4">
                  {meta.excerpt}
                </p>
              )}
            </header>

            <div className="bg-card border-4 border-black comic-shadow p-6 md:p-10 relative overflow-hidden">
               {/* Very faint background noise/texture for the reading area */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMWExYTFhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlPSIjMjIyMjIyIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20 pointer-events-none"></div>
              
              <div className="relative z-10">
                <MarkdownRenderer content={content || ""} repo={repo} />
              </div>
            </div>

            {/* Author / End block */}
            <div className="mt-16 flex items-center justify-between border-t-4 border-dashed border-gray-800 pt-8">
              <div className="flex items-center gap-4">
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full border-4 border-primary comic-shadow-sm bg-black"
                />
                <div>
                  <div className="font-heading font-bold text-xl text-white uppercase">Charging The Future</div>
                  <div className="font-mono text-primary text-sm">System Architect</div>
                </div>
              </div>
              
              <div className="hidden sm:block text-right">
                <div className="font-display text-3xl text-gray-700 tracking-widest">END OF FILE</div>
              </div>
            </div>
          </motion.article>
        )}
      </div>
    </Layout>
  );
}

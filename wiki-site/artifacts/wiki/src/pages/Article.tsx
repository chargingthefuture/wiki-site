import { useParams, useSearch, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, AlertTriangle, Archive } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ShareLink } from "@/components/ShareLink";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { AppLoading } from "@/components/AppLoading";
import { useArticle } from "@/hooks/use-article";
import { findArticle } from "@/lib/content";
import { estimateReadTime } from "@/lib/utils";
import { formatArticleDate } from "@/lib/dates";
import { KIND_LABELS } from "@/lib/archive-kinds";

export default function Article() {
  const params = useParams();
  // Safe decode in case of URL encoding
  const repo = params.repo ? decodeURIComponent(params.repo) : "";
  // The route is /article/:repo/* so a folder slug (e.g.
  // "discourse-migrate/collecting-vitals-24-7") matches whether the link
  // carries real slashes or an encoded %2F. Decode per segment.
  const rawSlug = (params as Record<string, string | undefined>)["*"] ?? "";
  const slug = rawSlug
    .split("/")
    .map((segment) => decodeURIComponent(segment))
    .join("/");

  const { data: content, isLoading, isError } = useArticle(repo, slug);

  // Find meta data if it exists in our list
  const meta = findArticle(slug);

  const from = new URLSearchParams(useSearch()).get("from") ?? "";
  const backTo = from.startsWith("/record")
    ? { href: from, label: "Back to The Record" }
    : from.startsWith("/feed")
      ? { href: from, label: "Back to The Feed" }
      : null;
  const readTime = content ? estimateReadTime(content.length) : meta ? estimateReadTime(meta.excerpt.length * 20) : 5;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Back buttons. The second one appears when the reader arrived from a
            list surface: its link carried the list's full address in ?from=,
            page number and filters included, so back returns them to the exact
            place in the list they left. Only the two list surfaces are honored,
            so a crafted address cannot point the button anywhere else. */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold text-lg uppercase text-gray-400 hover:text-white transition-colors group bg-black border-2 border-gray-800 px-4 py-2 hover:border-white">
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Terminal
          </Link>
          {backTo && (
            <Link href={backTo.href} className="inline-flex items-center gap-2 font-heading font-bold text-lg uppercase text-gray-400 hover:text-white transition-colors group bg-black border-2 border-gray-800 px-4 py-2 hover:border-white">
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
              {backTo.label}
            </Link>
          )}
        </div>

        {isLoading ? (
          <AppLoading />
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
                      {formatArticleDate(meta.date, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} className="text-primary" />
                      {readTime} min read
                    </span>
                  </div>
                  <ShareLink url={typeof window !== "undefined" ? window.location.href : ""} />
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

              {meta?.archive && (
                <div className="mt-6 flex items-start gap-3 bg-black border-2 border-gray-800 p-4 font-mono text-sm text-gray-400">
                  <Archive size={18} className="text-accent shrink-0 mt-0.5" />
                  <span>
                    Historical record.{" "}
                    {meta.archive.kind ? <>{KIND_LABELS[meta.archive.kind] ?? meta.archive.kind}, posted</> : <>Originally posted</>}
                    {" on "}{meta.archive.source === "quora" ? "Quora" : "the Discourse forum"}
                    {meta.archive.account ? <> ({meta.archive.account})</> : null}
                    {meta.archive.originalDate ? <> on {formatArticleDate(meta.archive.originalDate, { month: 'long', day: 'numeric', year: 'numeric' })}</> : null}
                    {". "}
                    {meta.archive.question && meta.archive.question !== meta.title ? <>Written under: {meta.archive.question}. </> : null}
                    {meta.archive.space ? <>In the space: {meta.archive.space}. </> : null}
                    {meta.archive.sharedTo?.length ? <>Also carried into: {meta.archive.sharedTo.join(", ")}. </> : null}
                    {meta.archive.removed ? <>Taken down by the platform while the account was still live. </> : null}
                    {meta.archive.status === "erased" && "That account was erased by the platform; this page is the canonical copy."}
                    {meta.archive.status === "closed" && "That platform surface is closed; this page is the canonical copy."}
                    {meta.archive.originalUrl ? (
                      // Plain text on purpose: the writing behind this address
                      // was deleted, and a link that 404s spends a reader's
                      // click to tell them nothing. The address is the
                      // evidence of where this lived, not a destination.
                      <> Deleted from: <span className="font-mono text-xs break-all">{meta.archive.originalUrl}</span></>
                    ) : null}
                  </span>
                </div>
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

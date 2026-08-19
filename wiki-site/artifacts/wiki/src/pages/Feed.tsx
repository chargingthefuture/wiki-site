import { useMemo } from "react";
import { Link } from "wouter";
import { Radio } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ARTICLES, getArticleUrl, type ArticleMeta } from "@/lib/articles";
import { formatArticleDate } from "@/lib/dates";

/**
 * The feed is the catch-up surface. Platform accounts are disposable and get
 * erased every few months, so a new reader arriving from any platform post
 * lands here and can absorb the whole run of posts in minutes instead of
 * following an account for months.
 *
 * Each entry shows the post's teaser — the short standalone version that
 * carries the post's whole point — falling back to the excerpt for posts
 * that predate the teaser field. Entries are numbered by publish order
 * (oldest is No. 1) so a reader can see how deep the catalog goes.
 *
 * Scope: every collection — posts, product updates, guides, insights,
 * member of the day, and the archives. Catching up means catching up on all
 * of it; each entry carries its category so the kind of page is obvious.
 */

interface FeedEntry {
  article: ArticleMeta;
  number: number;
}

export default function Feed() {
  const entries = useMemo<FeedEntry[]>(() => {
    const posts = ARTICLES.filter((a) => a.listed !== false);
    // ARTICLES is newest-first; number by publish order so the oldest is No. 1.
    const total = posts.length;
    return posts.map((article, i) => ({ article, number: total - i }));
  }, []);

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-heading font-bold uppercase tracking-widest border-2 border-black mb-6 comic-shadow-sm transform -rotate-1">
            <Radio size={18} />
            <span>The Feed</span>
          </div>
          <h1
            className="font-display text-5xl sm:text-6xl text-white uppercase leading-[0.9] mb-4"
            style={{ WebkitTextStroke: "2px black", textShadow: "4px 4px 0 #000" }}
          >
            Every post, in minutes
          </h1>
          <p className="font-sans text-lg text-gray-300 border-l-4 border-accent pl-4">
            The short version of every post, newest first. Each one stands on
            its own. "Read the full post" goes to the whole argument.
          </p>
        </div>

        <ol className="space-y-8" reversed>
          {entries.map(({ article, number }) => (
            <li key={article.slug}>
              <article className="comic-panel bg-card relative overflow-hidden">
                <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none mix-blend-overlay"></div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="font-mono text-sm text-gray-400">
                      No. {number} · {formatArticleDate(article.date, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="px-2 py-0.5 bg-accent text-black font-heading font-bold text-xs uppercase tracking-wider border-2 border-black shrink-0">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase leading-tight mb-3">
                    {article.title}
                  </h2>
                  <p className="text-gray-200 font-sans text-lg leading-relaxed mb-4">
                    {article.teaser ?? article.excerpt}
                  </p>
                  <Link
                    href={getArticleUrl(article.repo, article.slug)}
                    className="font-heading text-lg text-primary uppercase font-bold hover:underline decoration-4 underline-offset-4"
                  >
                    Read the full post →
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </Layout>
  );
}

import { useMemo } from "react";
import { Link, useSearch } from "wouter";
import { History, Link2Off, Camera } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ARTICLES, getArticleUrl, type ArticleMeta } from "@/lib/articles";
import { contentImageUrl } from "@/lib/content";
import { formatArticleDate } from "@/lib/dates";

/**
 * The timeline is the archive read forwards.
 *
 * The feed answers "what is this person saying now" — newest first, blog posts,
 * short teasers. This page answers a different question: how long has this been
 * going on, and how much of it is there. So it runs oldest to newest, it carries
 * only the archive collections, and it shows the platform each entry was written
 * on and what became of it.
 *
 * Every entry here is a page whose original address no longer resolves: the
 * Quora accounts were erased and the Discourse forum was closed. The original
 * address is still printed, as plain text rather than a link, because a link
 * that 404s wastes a reader's click while the address itself is the evidence of
 * where the writing lived. Where a screenshot of the original exists it is
 * shown, which is the only way the original page can still be looked at.
 *
 * Paged, never an endless scroll (owner directive, 2026-08-19). Page number and
 * filters both live in the URL so any view can be linked and the back button
 * works.
 */

const PER_PAGE = 25;

interface TimelineEntry {
  article: ArticleMeta;
  number: number;
}

/** Plain-language label for what an entry was on its original platform. */
const KIND_LABELS: Record<string, string> = {
  answer: "Answer",
  "answer-comment": "Comment on an answer",
  "answer-draft": "Unpublished draft",
  post: "Post",
  "post-comment": "Comment on a post",
  question: "Question",
  "question-comment": "Comment on a question",
  "space-post": "Space post",
  "forum-topic": "Forum topic",
};

const SOURCE_LABELS: Record<string, string> = {
  quora: "Quora",
  discourse: "Discourse",
};

/** What happened to the place this was written. */
const STATUS_NOTES: Record<string, string> = {
  erased: "Account erased — this address no longer resolves",
  closed: "Forum closed — this address no longer resolves",
  live: "Original still online",
};

function entryKind(article: ArticleMeta): string {
  return article.archive?.kind ?? "";
}

function entrySource(article: ArticleMeta): string {
  return article.archive?.source ?? "";
}

function monthLabel(date: string): string {
  return formatArticleDate(date, { month: "long", year: "numeric" }).replace(/ ET$/, "");
}

export default function Timeline() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sourceFilter = params.get("source") ?? "";
  const kindFilter = params.get("kind") ?? "";

  const archive = useMemo(
    () =>
      ARTICLES.filter((a) => a.collection.startsWith("archive/") && a.listed !== false)
        // ARTICLES is newest-first; the timeline runs the other way.
        .slice()
        .reverse(),
    [],
  );

  const sources = useMemo(
    () => [...new Set(archive.map(entrySource).filter(Boolean))].sort(),
    [archive],
  );
  const kinds = useMemo(
    () => [...new Set(archive.map(entryKind).filter(Boolean))].sort(),
    [archive],
  );

  const entries = useMemo<TimelineEntry[]>(() => {
    const kept = archive.filter(
      (a) =>
        (!sourceFilter || entrySource(a) === sourceFilter) &&
        (!kindFilter || entryKind(a) === kindFilter),
    );
    // No. 1 is the oldest, matching the feed's numbering direction so the two
    // surfaces never disagree about which entry is the first one.
    return kept.map((article, i) => ({ article, number: i + 1 }));
  }, [archive, sourceFilter, kindFilter]);

  const pageCount = Math.max(1, Math.ceil(entries.length / PER_PAGE));
  const requested = Number(params.get("page") ?? "1");
  const page = Number.isFinite(requested)
    ? Math.min(Math.max(Math.trunc(requested), 1), pageCount)
    : 1;
  const start = (page - 1) * PER_PAGE;
  const pageEntries = entries.slice(start, start + PER_PAGE);
  const firstShown = entries.length ? start + 1 : 0;
  const lastShown = start + pageEntries.length;

  /** Build a URL that keeps the other filters and drops the page number. */
  const filterHref = (next: { source?: string; kind?: string }) => {
    const q = new URLSearchParams();
    const source = next.source ?? sourceFilter;
    const kind = next.kind ?? kindFilter;
    if (source) q.set("source", source);
    if (kind) q.set("kind", kind);
    const s = q.toString();
    return s ? `/timeline?${s}` : "/timeline";
  };

  const pageHref = (n: number) => {
    const q = new URLSearchParams();
    if (sourceFilter) q.set("source", sourceFilter);
    if (kindFilter) q.set("kind", kindFilter);
    if (n > 1) q.set("page", String(n));
    const s = q.toString();
    return s ? `/timeline?${s}` : "/timeline";
  };

  const chipClass = (active: boolean) =>
    [
      "font-heading text-sm uppercase font-bold px-3 py-1 border-2 border-black",
      active ? "bg-accent text-black" : "bg-card text-gray-300 hover:text-white",
    ].join(" ");

  let lastMonth = "";

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-heading font-bold uppercase tracking-widest border-2 border-black mb-6 comic-shadow-sm transform -rotate-1">
            <History size={18} />
            <span>The Timeline</span>
          </div>
          <h1
            className="font-display text-5xl sm:text-6xl text-white uppercase leading-[0.9] mb-4"
            style={{ WebkitTextStroke: "2px black", textShadow: "4px 4px 0 #000" }}
          >
            The archive, oldest first
          </h1>
          <p className="font-sans text-lg text-gray-300 border-l-4 border-accent pl-4">
            Every answer, post and comment written on a platform that has since
            erased it or closed, in the order it was written. The addresses are
            printed as they were. They no longer resolve, which is the point of
            keeping the writing here instead.
          </p>
          <p className="font-sans text-base text-gray-400 mt-4">
            Current writing lives on{" "}
            <Link href="/feed" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              The Feed
            </Link>
            , newest first.
          </p>
        </div>

        <div className="mb-8 space-y-3" aria-label="Timeline filters">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 w-16">
              Where
            </span>
            <Link href={filterHref({ source: "" })} className={chipClass(!sourceFilter)}>
              All
            </Link>
            {sources.map((s) => (
              <Link key={s} href={filterHref({ source: s })} className={chipClass(sourceFilter === s)}>
                {SOURCE_LABELS[s] ?? s}
              </Link>
            ))}
          </div>
          {kinds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 w-16">
                What
              </span>
              <Link href={filterHref({ kind: "" })} className={chipClass(!kindFilter)}>
                All
              </Link>
              {kinds.map((k) => (
                <Link key={k} href={filterHref({ kind: k })} className={chipClass(kindFilter === k)}>
                  {KIND_LABELS[k] ?? k}
                </Link>
              ))}
            </div>
          )}
        </div>

        <p className="font-mono text-sm text-gray-400 mb-8">
          Showing {firstShown}–{lastShown} of {entries.length} · page {page} of {pageCount}
        </p>

        {entries.length === 0 ? (
          <p className="font-sans text-lg text-gray-300 comic-panel bg-card p-6">
            Nothing in the archive matches that filter yet.{" "}
            <Link href="/timeline" className="text-primary font-bold hover:underline">
              Show everything
            </Link>
            .
          </p>
        ) : (
          <ol className="relative border-l-4 border-gray-800 ml-3 space-y-10">
            {pageEntries.map(({ article, number }) => {
              const archiveMeta = article.archive;
              const kind = entryKind(article);
              const source = entrySource(article);
              const shot = archiveMeta?.screenshot
                ? contentImageUrl(archiveMeta.screenshot)
                : undefined;
              const month = monthLabel(article.date);
              const showMonth = month !== lastMonth;
              lastMonth = month;

              return (
                <li key={`${article.repo}/${article.slug}`} className="relative pl-6 sm:pl-8">
                  <span
                    className="absolute -left-[13px] top-2 w-5 h-5 bg-primary border-2 border-black rounded-full"
                    aria-hidden="true"
                  />
                  {showMonth && (
                    <h2 className="font-heading text-sm uppercase tracking-widest text-accent font-bold mb-3">
                      {month}
                    </h2>
                  )}
                  <article className="comic-panel bg-card relative overflow-hidden">
                    <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none mix-blend-overlay"></div>
                    <div className="p-6 relative z-10">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-sm text-gray-400">
                          No. {number} ·{" "}
                          {formatArticleDate(article.date, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex flex-wrap items-center gap-2">
                          {kind && (
                            <span className="px-2 py-0.5 bg-accent text-black font-heading font-bold text-xs uppercase tracking-wider border-2 border-black">
                              {KIND_LABELS[kind] ?? kind}
                            </span>
                          )}
                          {source && (
                            <span className="px-2 py-0.5 bg-card text-gray-300 font-heading font-bold text-xs uppercase tracking-wider border-2 border-gray-700">
                              {SOURCE_LABELS[source] ?? source}
                            </span>
                          )}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase leading-tight mb-3">
                        {article.title}
                      </h3>
                      <p className="text-gray-200 font-sans text-lg leading-relaxed mb-4">
                        {article.excerpt}
                      </p>

                      {shot && (
                        <figure className="mb-4">
                          <img
                            src={shot}
                            alt={`Screenshot of the original page: ${article.title}`}
                            className="w-full border-2 border-black"
                            loading="lazy"
                          />
                          <figcaption className="font-mono text-xs text-gray-500 mt-2 flex items-center gap-2">
                            <Camera size={14} aria-hidden="true" />
                            Captured before the page came down
                          </figcaption>
                        </figure>
                      )}

                      <Link
                        href={getArticleUrl(article.repo, article.slug)}
                        className="font-heading text-lg text-primary uppercase font-bold hover:underline decoration-4 underline-offset-4"
                      >
                        Read it here →
                      </Link>

                      {archiveMeta?.originalUrl && (
                        <p className="font-mono text-xs text-gray-500 mt-4 flex items-start gap-2">
                          <Link2Off size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="min-w-0">
                            {archiveMeta.status
                              ? (STATUS_NOTES[archiveMeta.status] ?? archiveMeta.status)
                              : "Original address"}
                            : <span className="break-all">{archiveMeta.originalUrl}</span>
                            {archiveMeta.snapshotUrl && (
                              <>
                                {" · "}
                                <a
                                  href={archiveMeta.snapshotUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  Saved copy
                                </a>
                              </>
                            )}
                          </span>
                        </p>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}

        <nav
          className="mt-12 flex flex-wrap items-center justify-between gap-4"
          aria-label="Timeline pages"
        >
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="font-heading text-lg uppercase font-bold px-4 py-2 bg-card border-2 border-gray-800 text-white hover:border-white"
            >
              ← Earlier
            </Link>
          ) : (
            <span />
          )}

          <span className="font-mono text-sm text-gray-400">
            Page {page} of {pageCount}
          </span>

          {page < pageCount ? (
            <Link
              href={pageHref(page + 1)}
              className="font-heading text-lg uppercase font-bold px-4 py-2 bg-card border-2 border-gray-800 text-white hover:border-white"
            >
              Later →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </section>
    </Layout>
  );
}

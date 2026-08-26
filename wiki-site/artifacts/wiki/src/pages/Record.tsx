import { useMemo } from "react";
import { Link, useSearch } from "wouter";
import { Link2Off, ShieldOff, Camera, Share2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ARTICLES, getArticleUrl, type ArticleMeta } from "@/lib/articles";
import { RECORD_MARKERS } from "@/lib/record-markers";
import { KIND_LABELS } from "@/lib/archive-kinds";
import { contentImageUrl } from "@/lib/content";
import { formatArticleDate } from "@/lib/dates";

/**
 * The Record is the Quora writing, read forwards.
 *
 * The feed answers what is being said now. This page answers something the
 * feed cannot while it runs newest-first: how long this went on, how much of
 * it there was, and how many places it was spread across before the accounts
 * holding it were deleted. So it runs oldest to newest, it carries only the
 * writing that lived on other people's pages, and it draws each account's
 * erasure across the timeline at the date it happened — the entries continue
 * past every one of them.
 *
 * Posts to the author's own space are not here. Those are the blog's own
 * archive material and they read as whole pieces; The Record is the writing
 * that was scattered under other people's questions, answers and posts, and
 * that only reads as a body of work once it is put back in order.
 *
 * Original addresses print as plain text, never as links. Every one of them is
 * dead, and a link that 404s spends a reader's click to tell them nothing; the
 * address itself is what there is to show.
 *
 * Paged, never an endless scroll (owner directive, 2026-08-19). Page number and
 * both filters live in the URL, so any view can be linked and the back button
 * works.
 */

const PER_PAGE = 25;

const ACCOUNT_LABELS: Record<string, string> = {
  "farah-brunache": "farah-brunache",
  pedigree101: "pedigree101",
};

interface RecordEntry {
  article: ArticleMeta;
  number: number;
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** Small counts read as words in a sentence and as digits in a stat tile. */
function spell(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

function monthKey(date: string): string {
  return date.slice(0, 7);
}

function monthLabel(date: string): string {
  return formatArticleDate(date, { month: "long", year: "numeric" }).replace(/ ET$/, "");
}

/** One account takedown, drawn where it happened. */
function Erasure({ marker, onSpine }: { marker: (typeof RECORD_MARKERS)[number]; onSpine?: boolean }) {
  return (
    <div className="relative border-2 border-primary bg-black/60 px-4 py-3">
      {onSpine && (
        <span
          className="absolute -left-[38px] sm:-left-[46px] top-4 w-5 h-5 bg-black border-2 border-primary rotate-45"
          aria-hidden="true"
        />
      )}
      <p className="font-heading text-sm uppercase tracking-widest text-primary font-bold">
        {formatArticleDate(marker.date, { month: "short", day: "numeric", year: "numeric" })} ·{" "}
        {marker.handle} erased
      </p>
      <p className="font-sans text-base text-gray-300 mt-1">{marker.what}</p>
      {marker.note && <p className="font-mono text-xs text-gray-500 mt-1">{marker.note}</p>}
    </div>
  );
}

export default function Record() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const accountFilter = params.get("account") ?? "";
  const kindFilter = params.get("kind") ?? "";

  // ARTICLES is newest-first; the Record runs the other way.
  const all = useMemo(
    () =>
      ARTICLES.filter((a) => a.archive?.source === "quora" && a.archive.kind).slice().reverse(),
    [],
  );

  const accounts = useMemo(
    () => [...new Set(all.map((a) => a.archive?.account).filter(Boolean) as string[])].sort(),
    [all],
  );
  const kinds = useMemo(
    () => [...new Set(all.map((a) => a.archive?.kind).filter(Boolean) as string[])].sort(),
    [all],
  );

  const entries = useMemo<RecordEntry[]>(() => {
    const kept = all.filter(
      (a) =>
        (!accountFilter || a.archive?.account === accountFilter) &&
        (!kindFilter || a.archive?.kind === kindFilter),
    );
    return kept.map((article, i) => ({ article, number: i + 1 }));
  }, [all, accountFilter, kindFilter]);

  /**
   * Breadth, counted rather than claimed: the questions written under, the
   * spaces written into. This is what the deletions removed, and a list of
   * cards on its own does not show it.
   */
  const reach = useMemo(() => {
    const questions = new Set<string>();
    const spaces = new Set<string>();
    for (const a of all) {
      if (a.archive?.question) questions.add(a.archive.question);
      if (a.archive?.space) spaces.add(a.archive.space);
      for (const s of a.archive?.sharedTo ?? []) spaces.add(s);
      const host = a.archive?.originalUrl?.match(/^https?:\/\/([^./]+)\.quora\.com/)?.[1];
      if (host && host !== "www") spaces.add(host);
    }
    return { questions: questions.size, spaces: spaces.size };
  }, [all]);

  /** Entries per month across the whole Record, for the volume marks. */
  const monthly = useMemo(() => {
    const counts = new Map<string, number>();
    for (const { article } of entries) {
      const k = monthKey(article.date);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const busiest = Math.max(1, ...counts.values());
    return { counts, busiest };
  }, [entries]);

  /**
   * How long the writing ran. A count of erased accounts was here and had to go:
   * Quora keeps deleting them, so any number printed on this page is wrong by the
   * next ban. Old links, new links is the one page that tracks that, and it is
   * linked above. The span is a fact about the writing and does not move.
   */
  const months = useMemo(() => {
    if (!all.length) return 0;
    const first = new Date(`${all[0].date}T12:00:00Z`);
    const last = new Date(`${all[all.length - 1].date}T12:00:00Z`);
    return Math.max(
      1,
      Math.round((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24 * 30.44)),
    );
  }, [all]);

  const pageCount = Math.max(1, Math.ceil(entries.length / PER_PAGE));
  const requested = Number(params.get("page") ?? "1");
  const page = Number.isFinite(requested)
    ? Math.min(Math.max(Math.trunc(requested), 1), pageCount)
    : 1;
  const start = (page - 1) * PER_PAGE;
  const pageEntries = entries.slice(start, start + PER_PAGE);
  const firstShown = entries.length ? start + 1 : 0;
  const lastShown = start + pageEntries.length;

  /**
   * Lays the erasures into the page's run of entries at the point in time they
   * happened. An erasure is claimed by the first page whose entries reach its
   * date, so one that falls in the gap between the last entry of one page and
   * the first of the next still shows rather than disappearing into the seam.
   * Whatever is left over trails the list — on the final page that is the
   * accounts deleted after there was nothing left to delete.
   */
  const { rows, trailingMarkers } = useMemo(() => {
    const lastDate = pageEntries[pageEntries.length - 1]?.article.date ?? "";
    const previousDate = start > 0 ? entries[start - 1].article.date : null;
    const pending = RECORD_MARKERS.filter(
      (m) =>
        (previousDate === null || m.date > previousDate) &&
        (page === pageCount || m.date <= lastDate),
    );

    const laid: Array<
      { type: "marker"; marker: (typeof RECORD_MARKERS)[number] } | { type: "entry"; entry: RecordEntry }
    > = [];
    let next = 0;
    for (const entry of pageEntries) {
      while (next < pending.length && pending[next].date <= entry.article.date) {
        laid.push({ type: "marker", marker: pending[next] });
        next += 1;
      }
      laid.push({ type: "entry", entry });
    }
    return { rows: laid, trailingMarkers: pending.slice(next) };
  }, [pageEntries, entries, start, page, pageCount]);

  const href = (next: { account?: string; kind?: string; page?: number }) => {
    const q = new URLSearchParams();
    const account = next.account ?? accountFilter;
    const kind = next.kind ?? kindFilter;
    if (account) q.set("account", account);
    if (kind) q.set("kind", kind);
    if (next.page && next.page > 1) q.set("page", String(next.page));
    const s = q.toString();
    return s ? `/record?${s}` : "/record";
  };

  const chip = (active: boolean) =>
    [
      "font-heading text-sm uppercase font-bold px-3 py-1 border-2 border-black",
      active ? "bg-accent text-black" : "bg-card text-gray-300 hover:text-white",
    ].join(" ");

  let lastMonth = "";

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-heading font-bold uppercase tracking-widest border-2 border-black mb-6 comic-shadow-sm transform -rotate-1">
            <ShieldOff size={18} />
            <span>The Record</span>
          </div>
          <h1
            className="font-display text-5xl sm:text-6xl text-white uppercase leading-[0.9] mb-6"
            style={{ WebkitTextStroke: "2px black", textShadow: "4px 4px 0 #000" }}
          >
            Every word they deleted
          </h1>
          <div className="border-l-4 border-accent pl-4 space-y-4">
            <p className="font-sans text-lg text-gray-200">
              Every answer, comment and reply here was deleted with the{" "}
              {spell(accounts.length)} accounts that held it, along with every
              link anyone had ever saved pointing at any of it.
            </p>
            <p className="font-sans text-lg text-gray-200">
              This is that writing, in the order it was written, at an address
              nobody else can empty. Scattered across other people's questions
              and spaces while it lived. Put back in order here.
            </p>
          </div>
          <p className="font-sans text-base text-gray-400 mt-4">
            Current writing lives on{" "}
            <Link href="/feed" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              The Feed
            </Link>
            , newest first. The accounts erased since, and which handles are
            current, are kept on{" "}
            <Link
              href={getArticleUrl("chargingthefuture/wiki-site", "old-links-new-links")}
              className="text-primary font-bold hover:underline decoration-2 underline-offset-4"
            >
              Old links, new links
            </Link>
            .
          </p>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Entries", value: all.length.toLocaleString() },
            { label: "Questions written under", value: reach.questions.toLocaleString() },
            { label: "Spaces written into", value: reach.spaces.toLocaleString() },
            { label: "Months of it", value: String(months) },
          ].map((stat) => (
            <div key={stat.label} className="comic-panel bg-card p-4">
              <dt className="font-mono text-xs uppercase tracking-widest text-gray-500">{stat.label}</dt>
              <dd className="font-display text-3xl text-white mt-1">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mb-8 space-y-3" aria-label="Record filters">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 w-14 shrink-0">Who</span>
            <Link href={href({ account: "" })} className={chip(!accountFilter)}>
              All
            </Link>
            {accounts.map((a) => (
              <Link key={a} href={href({ account: a })} className={chip(accountFilter === a)}>
                {ACCOUNT_LABELS[a] ?? a}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 w-14 shrink-0">What</span>
            <Link href={href({ kind: "" })} className={chip(!kindFilter)}>
              All
            </Link>
            {kinds.map((k) => (
              <Link key={k} href={href({ kind: k })} className={chip(kindFilter === k)}>
                {KIND_LABELS[k] ?? k}
              </Link>
            ))}
          </div>
        </div>

        <p className="font-mono text-sm text-gray-400 mb-8">
          Showing {firstShown}–{lastShown} of {entries.length} · page {page} of {pageCount}
        </p>

        {entries.length === 0 ? (
          <p className="font-sans text-lg text-gray-300 comic-panel bg-card p-6">
            Nothing in the Record matches that filter.{" "}
            <Link href="/record" className="text-primary font-bold hover:underline">
              Show everything
            </Link>
            .
          </p>
        ) : (
          <ol className="relative border-l-4 border-gray-800 ml-3 space-y-10">
            {rows.map((row) => {
              if (row.type === "marker") {
                return (
                  <li key={`marker-${row.marker.handle}`} className="relative pl-6 sm:pl-8 list-none">
                    <Erasure marker={row.marker} onSpine />
                  </li>
                );
              }
              const { article, number } = row.entry;
              const meta = article.archive;
              const kind = meta?.kind ?? "";
              const month = monthLabel(article.date);
              const showMonth = month !== lastMonth;
              lastMonth = month;
              const count = monthly.counts.get(monthKey(article.date)) ?? 0;
              const width = Math.round((count / monthly.busiest) * 100);
              const shot = meta?.screenshot ? contentImageUrl(meta.screenshot) : undefined;

              return (
                <li key={`${article.repo}/${article.slug}`} className="relative pl-6 sm:pl-8">
                  <span
                    className="absolute -left-[13px] top-2 w-5 h-5 bg-primary border-2 border-black rounded-full"
                    aria-hidden="true"
                  />

                  {showMonth && (
                    <div className="mb-3">
                      <h2 className="font-heading text-sm uppercase tracking-widest text-accent font-bold">
                        {month}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="h-1.5 bg-accent/60 max-w-full"
                          style={{ width: `${Math.max(width, 2)}%` }}
                          aria-hidden="true"
                        />
                        <span className="font-mono text-xs text-gray-500 shrink-0">
                          {count} {count === 1 ? "entry" : "entries"}
                        </span>
                      </div>
                    </div>
                  )}

                  <article className="comic-panel bg-card relative overflow-hidden">
                    <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none mix-blend-overlay"></div>
                    <div className="p-6 relative z-10">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-sm text-gray-400">
                          No. {number} ·{" "}
                          {formatArticleDate(article.date, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="flex flex-wrap items-center gap-2">
                          {kind && (
                            <span className="px-2 py-0.5 bg-accent text-black font-heading font-bold text-xs uppercase tracking-wider border-2 border-black">
                              {KIND_LABELS[kind] ?? kind}
                            </span>
                          )}
                          {meta?.account && (
                            <span className="px-2 py-0.5 bg-card text-gray-300 font-mono text-xs border-2 border-gray-700">
                              {meta.account}
                            </span>
                          )}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase leading-tight mb-3">
                        {article.title}
                      </h3>

                      {meta?.question && meta.question !== article.title && (
                        <p className="font-sans text-sm text-gray-400 mb-3">
                          Written under: {meta.question}
                        </p>
                      )}
                      {meta?.space && (
                        <p className="font-sans text-sm text-gray-400 mb-3">In: {meta.space}</p>
                      )}

                      {/*
                        A question the author asked is its own title, so the
                        excerpt repeats it word for word. Printing the sentence
                        twice reads as a rendering fault rather than emphasis.
                      */}
                      {!article.excerpt
                        .toLowerCase()
                        .startsWith(article.title.replace(/…$/, "").toLowerCase().slice(0, 40)) && (
                        <p className="text-gray-200 font-sans text-lg leading-relaxed mb-4">
                          {article.excerpt}
                        </p>
                      )}

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

                      {meta?.sharedTo?.length ? (
                        <p className="font-mono text-xs text-gray-500 mt-4 flex items-start gap-2">
                          <Share2 size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
                          <span>Also carried into: {meta.sharedTo.join(", ")}</span>
                        </p>
                      ) : null}

                      {meta?.removed && (
                        <p className="font-mono text-xs text-primary mt-2 flex items-start gap-2">
                          <ShieldOff size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
                          <span>Taken down by the platform while the account was still live.</span>
                        </p>
                      )}

                      {meta?.originalUrl && (
                        <p className="font-mono text-xs text-gray-500 mt-2 flex items-start gap-2">
                          <Link2Off size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="min-w-0">
                            Deleted from:{" "}
                            <span className="break-all">{meta.originalUrl}</span>
                            {meta.snapshotUrl && (
                              <>
                                {" · "}
                                <a
                                  href={meta.snapshotUrl}
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

        {trailingMarkers.length > 0 && (
          <div className="mt-10 ml-3 border-l-4 border-gray-800 pl-6 sm:pl-8 space-y-4">
            {trailingMarkers.map((m) => (
              <Erasure key={m.handle} marker={m} />
            ))}
          </div>
        )}

        <nav className="mt-12 flex flex-wrap items-center justify-between gap-4" aria-label="Record pages">
          {page > 1 ? (
            <Link
              href={href({ page: page - 1 })}
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
              href={href({ page: page + 1 })}
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

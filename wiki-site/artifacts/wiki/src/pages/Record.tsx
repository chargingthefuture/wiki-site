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
 * The feed answers what is being said now. This page answers how long this
 * went on, how much of it there was, and how many places it was spread across
 * before the accounts holding it were deleted. It carries only the writing that
 * lived on other people's pages, and it draws each account's erasure across the
 * timeline at the date it happened — the entries continue past every one of
 * them. It runs newest to oldest, like the feed (owner directive, 2026-10-14;
 * it ran oldest first before). Entry numbers stay chronological, No. 1 the
 * oldest, so a number means the same entry whichever way the page runs.
 *
 * Posts to the author's own space are not here. Those are the blog's own
 * archive material and they read as complete pieces; The Record is the writing
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
    <div className="relative border border-primary bg-black/60 px-4 py-3">
      {onSpine && (
        <span
          className="absolute -left-[38px] sm:-left-[46px] top-4 w-5 h-5 bg-black border border-primary rotate-45"
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

  // ARTICLES is newest-first. `all` is kept oldest first so entry numbers are
  // chronological and the span below reads first to last; the page shows it reversed.
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
    return kept.map((article, i) => ({ article, number: i + 1 })).reverse();
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

  /** Entries per month across the entire Record, for the volume marks. */
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
   * happened, newest first: an erasure sits right after the last entry written
   * on or after its date, so the writing it deleted runs on below it. Erasures
   * newer than every entry lead the first page — the accounts deleted after
   * there was nothing left to delete. Each erasure belongs to the page holding
   * the entry it follows, so none falls into the seam between two pages.
   */
  const { rows, leadingMarkers } = useMemo(() => {
    const newestFirst = [...RECORD_MARKERS].sort((a, b) => b.date.localeCompare(a.date));
    const newestEntry = entries[0]?.article.date ?? "";
    const leading = page === 1 ? newestFirst.filter((m) => m.date > newestEntry) : [];

    const laid: Array<
      { type: "marker"; marker: (typeof RECORD_MARKERS)[number] } | { type: "entry"; entry: RecordEntry }
    > = [];
    pageEntries.forEach((entry, i) => {
      laid.push({ type: "entry", entry });
      const olderDate = entries[start + i + 1]?.article.date ?? "";
      for (const m of newestFirst) {
        if (m.date <= entry.article.date && m.date > olderDate) laid.push({ type: "marker", marker: m });
      }
    });
    return { rows: laid, leadingMarkers: leading };
  }, [pageEntries, entries, start, page]);

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
      "font-heading text-sm uppercase font-bold px-3 py-1 border border-border",
      active ? "bg-accent text-black" : "bg-card text-gray-300 hover:text-white",
    ].join(" ");

  let lastMonth = "";

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 font-heading font-semibold text-xs uppercase tracking-[0.16em] text-primary mb-6">
            <ShieldOff size={18} />
            <span>The Record</span>
          </div>
          <h1
            className="font-display text-5xl sm:text-6xl text-white leading-[0.9] mb-6 font-medium"
          >
            Every word they deleted
          </h1>
          <div className="border-l-2 border-accent pl-4 space-y-4">
            <p className="font-sans text-lg text-gray-200">
              Every answer, comment and reply here was deleted with the{" "}
              {spell(accounts.length)} accounts that held it, along with every
              link anyone had ever saved pointing at any of it.
            </p>
            <p className="font-sans text-lg text-gray-200">
              This is that writing, newest first, at an address
              nobody else can empty. Scattered across other people's questions
              and spaces while it lived. Put back in order here.
            </p>
          </div>
          <p className="font-sans text-base text-gray-400 mt-4">
            Current writing lives on{" "}
            <Link href="/feed" className="text-primary font-bold hover:underline decoration-1 underline-offset-4">
              The Feed
            </Link>
            , newest first. The accounts erased since, and which handles are
            current, are kept on{" "}
            <Link
              href={getArticleUrl("chargingthefuture/wiki-site", "old-links-new-links")}
              className="text-primary font-bold hover:underline decoration-1 underline-offset-4"
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
            <div key={stat.label} className="panel bg-card p-4">
              <dt className="font-mono text-xs uppercase tracking-widest text-gray-500">{stat.label}</dt>
              <dd className="font-display text-3xl text-white mt-1 font-medium">{stat.value}</dd>
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

        {leadingMarkers.length > 0 && (
          <div className="mb-10 ml-3 border-l-2 border-border pl-6 sm:pl-8 space-y-4">
            {leadingMarkers.map((m) => (
              <Erasure key={m.handle} marker={m} />
            ))}
          </div>
        )}

        {entries.length === 0 ? (
          <p className="font-sans text-lg text-gray-300 panel bg-card p-6">
            Nothing in the Record matches that filter.{" "}
            <Link href="/record" className="text-primary font-bold hover:underline">
              Show everything
            </Link>
            .
          </p>
        ) : (
          <ol className="relative border-l-2 border-border ml-3 space-y-10">
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
                    className="absolute -left-[13px] top-2 w-5 h-5 bg-primary border border-border rounded-full"
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

                  <article className="panel bg-card relative overflow-hidden">
                    <div className="p-6 relative z-10">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-sm text-gray-400">
                          No. {number} ·{" "}
                          {formatArticleDate(article.date, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="flex flex-wrap items-center gap-2">
                          {kind && (
                            <span className="px-2 py-0.5 bg-accent text-black font-heading font-bold text-xs uppercase tracking-wider border border-border">
                              {KIND_LABELS[kind] ?? kind}
                            </span>
                          )}
                          {meta?.account && (
                            <span className="px-2 py-0.5 bg-card text-gray-300 font-mono text-xs border border-border">
                              {meta.account}
                            </span>
                          )}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-display text-white leading-tight mb-3 font-medium">
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
                            alt={meta?.screenshotAlt ?? `Screenshot of the original page: ${article.title}`}
                            className="w-full border border-border"
                            loading="lazy"
                          />
                          <figcaption className="font-mono text-xs text-gray-500 mt-2 flex items-start gap-2">
                            <Camera size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
                            <span>
                              {meta?.screenshotCredit && <>Pictured: {meta.screenshotCredit}. </>}
                              Captured before the page came down
                            </span>
                          </figcaption>
                        </figure>
                      )}

                      <Link
                        href={`${getArticleUrl(article.repo, article.slug)}?from=${encodeURIComponent(search ? `/record?${search}` : "/record")}`}
                        className="font-heading text-lg text-primary uppercase font-bold hover:underline decoration-1 underline-offset-4"
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

        <nav className="mt-12 flex flex-wrap items-center justify-between gap-4" aria-label="Record pages">
          {page > 1 ? (
            <Link
              href={href({ page: page - 1 })}
              className="font-heading text-lg uppercase font-bold px-4 py-2 bg-card border border-border text-white hover:border-white"
            >
              ← Newer
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
              className="font-heading text-lg uppercase font-bold px-4 py-2 bg-card border border-border text-white hover:border-white"
            >
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </section>
    </Layout>
  );
}

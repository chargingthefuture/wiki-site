import { Link, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Video } from "lucide-react";
import { Layout } from "@/components/Layout";

/**
 * Every live broadcast from the app, recorded, newest first: a standing
 * record of the streams, and a player for each one that works with no
 * account.
 *
 * The list is read from the app in the browser, like the Fireside
 * conversation, rather than built into the site. A replay appears here the
 * moment its recording is ready instead of waiting for the blog's next
 * deploy. The podcast feed linked at the top is served by the app for the
 * same reason, and lists the same recordings.
 *
 * Each player points at the app's recording address, not at the file. The
 * file address is signed and can expire; the app's address asks for a
 * current one on every play.
 *
 * Paged, never an endless scroll (owner directive, 2026-08-19). The page
 * number lives in the URL, and the app clamps an out-of-range page to the
 * last one, so the page shown is the page the app answered with.
 */

const APP_URL = "https://app.chargingthefuture.com";
const FEED_URL = `${APP_URL}/api/beacon/replays/feed`;
const WATCH_URL = `${APP_URL}/apps/beacon`;

interface Replay {
  id: string;
  title: string;
  description: string;
  startedAtIso: string | null;
  endedAtIso: string | null;
  mediaUrl: string;
  watchUrl: string;
}

interface ReplayPage {
  ok: true;
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  replays: Replay[];
}

async function fetchReplays(page: number): Promise<ReplayPage> {
  const response = await fetch(`${APP_URL}/api/beacon/replays?page=${page}`);
  if (!response.ok) {
    throw new Error(`The app answered ${response.status}.`);
  }
  return (await response.json()) as ReplayPage;
}

function formatWhen(iso: string | null): string {
  if (!iso) return "Date not recorded";
  return new Date(iso).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatLength(replay: Replay): string | null {
  if (!replay.startedAtIso || !replay.endedAtIso) return null;
  const minutes = Math.round(
    (Date.parse(replay.endedAtIso) - Date.parse(replay.startedAtIso)) / 60000,
  );
  if (!Number.isFinite(minutes) || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} hr ${rest} min` : `${minutes} min`;
}

export default function Streams() {
  const search = useSearch();
  const requested = Number(new URLSearchParams(search).get("page") ?? "1");
  const requestedPage = Number.isFinite(requested) ? Math.max(Math.trunc(requested), 1) : 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["beacon-replays", requestedPage],
    queryFn: () => fetchReplays(requestedPage),
  });

  const page = data?.page ?? requestedPage;
  const pageCount = data?.pageCount ?? 1;
  const firstShown = data && data.total > 0 ? (page - 1) * data.pageSize + 1 : 0;
  const lastShown = data ? firstShown + data.replays.length - (data.total > 0 ? 1 : 0) : 0;

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-heading font-bold uppercase tracking-widest border-2 border-black mb-6 comic-shadow-sm transform -rotate-1">
            <Video size={18} />
            <span>The Streams</span>
          </div>
          <h1
            className="font-display text-5xl sm:text-6xl text-white uppercase leading-[0.9] mb-4"
            style={{ WebkitTextStroke: "2px var(--color-black)", textShadow: "4px 4px 0 var(--color-black)" }}
          >
            Every broadcast, recorded
          </h1>
          <p className="font-sans text-lg text-gray-300 border-l-4 border-accent pl-4">
            Every live broadcast from the app, newest first. Each one plays
            here with no account. Live broadcasts are at{" "}
            <a href={WATCH_URL} className="text-primary hover:underline">
              app.chargingthefuture.com/apps/beacon
            </a>
            , and each replay is also posted in Commons.
          </p>
          <p className="font-sans text-base text-gray-300 mt-4">
            To follow in a feed reader or podcast app, add{" "}
            <a href={FEED_URL} className="text-primary hover:underline break-all">
              {FEED_URL}
            </a>
            .
          </p>
          {data && data.total > 0 && (
            <p className="font-mono text-sm text-gray-400 mt-4">
              Showing {firstShown}–{lastShown} of {data.total} · page {page} of {pageCount}
            </p>
          )}
        </div>

        {isLoading && <p className="font-sans text-gray-300">Loading the broadcasts…</p>}

        {isError && (
          <p className="font-sans text-gray-300">
            The list of broadcasts could not be read from the app just now. The
            podcast feed above lists the same recordings.
          </p>
        )}

        {data && data.total === 0 && (
          <p className="font-sans text-gray-300">
            No broadcast has been recorded yet. Each one is listed here once its
            recording is ready.
          </p>
        )}

        {data && data.replays.length > 0 && (
          <ol className="space-y-8">
            {data.replays.map((replay) => {
              const length = formatLength(replay);
              return (
                <li key={replay.id} id={replay.id}>
                  <article className="comic-panel bg-card relative overflow-hidden">
                    <div className="p-6 relative z-10">
                      <p className="font-mono text-sm text-gray-400 mb-3">
                        {formatWhen(replay.startedAtIso ?? replay.endedAtIso)}
                        {length ? ` · ${length}` : ""}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase leading-tight mb-3">
                        {replay.title}
                      </h2>
                      {replay.description.trim().length > 0 && (
                        <p className="text-gray-200 font-sans text-lg leading-relaxed mb-4">
                          {replay.description}
                        </p>
                      )}
                      {/* preload="none": a page of twenty players must not start
                          twenty downloads before anybody presses play. */}
                      <video
                        controls
                        preload="none"
                        playsInline
                        src={replay.mediaUrl}
                        className="w-full bg-black border-2 border-black"
                      >
                        <a href={replay.mediaUrl}>Open the recording</a>
                      </video>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}

        {data && pageCount > 1 && (
          <nav
            className="mt-12 flex flex-wrap items-center justify-between gap-4"
            aria-label="Broadcast pages"
          >
            {page > 1 ? (
              <Link
                href={page - 1 === 1 ? "/streams" : `/streams?page=${page - 1}`}
                className="font-heading text-lg uppercase font-bold px-4 py-2 bg-card border-2 border-gray-800 text-white hover:border-white"
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
                href={`/streams?page=${page + 1}`}
                className="font-heading text-lg uppercase font-bold px-4 py-2 bg-card border-2 border-gray-800 text-white hover:border-white"
              >
                Older →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </Layout>
  );
}

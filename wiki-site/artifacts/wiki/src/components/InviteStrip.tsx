import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatArticleDate } from "@/lib/dates";

// A row of the newest invitations to people listed in the Directory, one card
// each, newest first, then a card that leads to every invitation in the app.
//
// The cards come from the app's public feed, read in the browser when the page
// loads, so a new invitation appears here without a rebuild. Invitations are
// written in the app now, not as blog posts (owner decision, 2026-10-15); the
// feed carries the newest ten, and every card links into the app, where reading
// one needs a sign-in. The feed also says how many people the Directory lists,
// which the last card shows.
//
// The feed is additive. Until it answers there is no row, and if it fails the
// row is the sign-in card alone, never an error on screen.
//
// Nothing moves on its own. The row scrolls by touch, by the two buttons, or by
// keyboard, and every card is in the page for a screen reader. An auto-advancing
// strip takes away the reader's position, which is what the pagination rule in
// CLAUDE.md exists to prevent.

const APP_URL = "https://app.chargingthefuture.com";
const FEED_URL = `${APP_URL}/api/directory/invites/public`;
const DIRECTORY_URL = `${APP_URL}/apps/directory`;
const MAX_CARDS = 10;

type InviteCard = {
  name: string;
  opening: string;
  date: string;
  url: string;
};

type FeedState = { status: "loading" } | { status: "ready"; invites: InviteCard[]; listed: number | null };

/** Keeps only well-formed cards whose link goes into the app, so a bad row cannot become a bad link. */
function readInvites(value: unknown): InviteCard[] {
  if (!Array.isArray(value)) return [];
  const cards: InviteCard[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const { name, opening, date, url } = row as Record<string, unknown>;
    if (typeof name !== "string" || !name.trim()) continue;
    if (typeof url !== "string" || !url.startsWith(`${APP_URL}/`)) continue;
    cards.push({
      name: name.trim(),
      opening: typeof opening === "string" ? opening.trim() : "",
      date: typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "",
      url,
    });
  }
  return cards.slice(0, MAX_CARDS);
}

export function InviteStrip() {
  const [feed, setFeed] = useState<FeedState>({ status: "loading" });
  const rowRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let canceled = false;
    fetch(FEED_URL, { headers: { accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: { invites?: unknown; listed?: unknown }) => {
        if (canceled) return;
        const listed =
          typeof data.listed === "number" && Number.isFinite(data.listed) && data.listed > 0
            ? Math.floor(data.listed)
            : null;
        setFeed({ status: "ready", invites: readInvites(data.invites), listed });
      })
      .catch(() => {
        if (!canceled) setFeed({ status: "ready", invites: [], listed: null });
      });
    return () => {
      canceled = true;
    };
  }, []);

  if (feed.status === "loading") return null;
  const { invites, listed } = feed;
  const listedText = listed ? listed.toLocaleString("en-US") : "300+";

  function scrollByCard(direction: -1 | 1) {
    const row = rowRef.current;
    if (!row) return;
    const card = row.querySelector<HTMLElement>("li");
    const step = card ? card.getBoundingClientRect().width + 16 : row.clientWidth * 0.9;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section
      aria-labelledby="invite-strip-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10"
    >
      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="max-w-2xl">
          <h2
            id="invite-strip-heading"
            className="font-display text-2xl sm:text-3xl text-white leading-tight font-medium"
          >
            People already on the list
          </h2>
          <p className="font-sans text-gray-300 mt-1">
            Each card is an invitation to somebody listed in the Directory, so they can
            decide in their own time. The newest are here, and every one is in the app.
          </p>
        </div>
        {invites.length > 0 ? (
          <div className="hidden sm:flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              className="w-11 h-11 flex items-center justify-center bg-card border border-border text-white hover:bg-primary hover:text-primary-foreground focus-visible:outline-4 focus-visible:outline-accent"
              aria-label="Show the previous invitations"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              className="w-11 h-11 flex items-center justify-center bg-card border border-border text-white hover:bg-primary hover:text-primary-foreground focus-visible:outline-4 focus-visible:outline-accent"
              aria-label="Show the next invitations"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        ) : null}
      </div>

      <ul
        ref={rowRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth motion-reduce:scroll-auto"
        aria-label={
          invites.length > 0
            ? `${invites.length} newest invitations, newest first, then a link to every invitation`
            : "A link to every invitation"
        }
      >
        {invites.map((invite) => (
          <li key={invite.url} className="snap-start shrink-0 w-[85vw] max-w-xs sm:w-80">
            <article className="panel bg-card h-full flex flex-col p-5">
              {invite.date ? (
                <span className="font-mono text-xs text-gray-400 mb-2">
                  {formatArticleDate(invite.date, { month: "short", day: "numeric", year: "numeric" })}
                </span>
              ) : null}
              <h3 className="font-display text-xl text-white leading-tight mb-3 font-medium">
                An invitation to {invite.name}
              </h3>
              <p className="font-sans text-gray-200 leading-relaxed flex-grow">{invite.opening}</p>
              <a
                href={invite.url}
                className="mt-4 font-heading text-primary uppercase font-bold hover:underline decoration-1 underline-offset-4"
              >
                Read the invitation →
              </a>
            </article>
          </li>
        ))}
        <li className="snap-start shrink-0 w-[85vw] max-w-xs sm:w-80">
          <article className="panel bg-card h-full flex flex-col p-5">
            <h3 className="font-display text-xl text-white leading-tight mb-3 font-medium">
              Sign in to see every invitation
            </h3>
            <p className="font-sans text-gray-200 leading-relaxed flex-grow">
              The free directory of {listedText} self-identified Targeted Individuals.
            </p>
            <a
              href={DIRECTORY_URL}
              className="mt-4 font-heading text-primary uppercase font-bold hover:underline decoration-1 underline-offset-4"
            >
              Open the Directory →
            </a>
          </article>
        </li>
      </ul>
    </section>
  );
}

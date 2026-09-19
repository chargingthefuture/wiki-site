import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getArticleUrl } from "@/lib/articles";
import { formatArticleDate } from "@/lib/dates";

// A row of the published invite posts, one card each, newest first. It reads
// invites.json, which the build writes from the posts themselves.
//
// Why it is here: an invite is announced on Quora by tagging the person, and
// Quora erases the account before most of them tap the notification. The
// address that survives is this blog, and chargingthefuture.com/feed lands on
// the feed page, so the row sits at the top of that page and of the home page.
// The card leads with the post's opening words, because those are the words
// the notification showed them.
//
// Nothing moves on its own. The row scrolls by touch, by the two buttons, or by
// keyboard, and every card is in the page for a screen reader. An auto-advancing
// strip takes away the reader's position, which is what the pagination rule in
// CLAUDE.md exists to prevent.

type InviteCard = {
  name: string;
  title: string;
  slug: string;
  repo: string;
  url: string;
  date: string;
  opening: string;
  excerpt: string;
};

export function InviteStrip({ from }: { from: string }) {
  const [invites, setInvites] = useState<InviteCard[]>([]);
  const rowRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let canceled = false;
    fetch(`${import.meta.env.BASE_URL}invites.json`, { headers: { accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : { invites: [] }))
      .then((data: { invites?: InviteCard[] }) => {
        if (canceled) return;
        setInvites(Array.isArray(data.invites) ? data.invites : []);
      })
      .catch(() => {
        /* the row is additive; a missing file means no row, not an error */
      });
    return () => {
      canceled = true;
    };
  }, []);

  if (invites.length === 0) return null;

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
            className="font-heading font-bold text-2xl sm:text-3xl text-white uppercase leading-tight"
          >
            People already on the list
          </h2>
          <p className="font-sans text-gray-300 mt-1">
            Each card is an open invitation to somebody listed in the Directory,
            written in public so they can decide in their own time.
          </p>
        </div>
        {invites.length > 1 ? (
          <div className="hidden sm:flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              className="w-11 h-11 flex items-center justify-center bg-card border-4 border-black text-white comic-shadow-sm hover:bg-primary focus-visible:outline-4 focus-visible:outline-accent"
              aria-label="Show the previous invitations"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              className="w-11 h-11 flex items-center justify-center bg-card border-4 border-black text-white comic-shadow-sm hover:bg-primary focus-visible:outline-4 focus-visible:outline-accent"
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
        aria-label={`${invites.length} invitations, newest first`}
      >
        {invites.map((invite) => (
          <li key={invite.slug} className="snap-start shrink-0 w-[85vw] max-w-xs sm:w-80">
            <article className="comic-panel bg-card h-full flex flex-col p-5">
              <span className="font-mono text-xs text-gray-400 mb-2">
                {formatArticleDate(invite.date, { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <h3 className="font-heading font-bold text-xl text-white uppercase leading-tight mb-3">
                {invite.title}
              </h3>
              <p className="font-sans text-gray-200 leading-relaxed flex-grow">{invite.opening}</p>
              <Link
                href={`${getArticleUrl(invite.repo, invite.slug)}?from=${encodeURIComponent(from)}`}
                className="mt-4 font-heading text-primary uppercase font-bold hover:underline decoration-4 underline-offset-4"
              >
                Read the invitation →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

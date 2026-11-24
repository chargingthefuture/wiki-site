import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Mic, ArrowRight, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

// The call for talks for the Peace Battle 2 conference, which is hosted on this blog.
//
// It opens once on a reader's first visit to the Peace Battle 2 page, and after that only when they
// press the button, so a returning reader is not stopped by it every time. The button sits on the
// page for as long as talks are being collected, so closing the pop-up never loses the invitation.
//
// Talks are sent through Discord, WhatsApp or Signal. The page links the owner's bio page, which
// lists all three, rather than writing an address here: a handle copied into the blog goes dead
// the day the account is replaced, and the bio page is the one address kept current.
//
// The "seen" mark is kept in the reader's own browser and never leaves it. Where storage is
// refused, the pop-up opens on every visit, which is the lesser failure: the invitation is shown.

const CONTACT = "https://sleek.bio/farah";
const SEEN_KEY = "pb2-conference-invite-seen";

const THEME =
  "From ruin to resilience: a free digital community, built together, one generation at a time.";

function hasSeen(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage refused: nothing to keep, and the pop-up opens again next visit.
  }
}

function InviteBody() {
  return (
    <div className="font-sans text-sm sm:text-base text-gray-300 space-y-3">
      <p>
        An online conference about how people begin rebuilding their lives through small acts of
        agency, mutual support and belonging. It draws on Estonia's restoration as one example of
        what collective action can rebuild over time, not as a comparison that minimizes anybody
        else's trauma. You don't have to rebuild everything at once, or alone.
      </p>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>A prerecorded talk of 15 minutes or more, as video with audio or audio only.</li>
        <li>
          The talks are published together on this blog as one conference, free to watch at any
          time.
        </li>
        <li>
          Go by your first name or handle, and leave out anything that shows where you live. Please
          don't say a phone number or email in the talk; social media handles are fine.
        </li>
        <li>If you later want your talk taken down, it comes down.</li>
      </ul>
      <p>
        To offer a talk or send one in, reach me on Discord, WhatsApp or Signal. All three are
        listed on my bio page.
      </p>
    </div>
  );
}

// The text scrolls inside the pop-up while the title, the close control and the two actions stay
// in place. Some phone browsers hide scroll bars, so while text remains below, the bottom edge
// fades and a "More below" line shows; both go once the end is reached.
function ScrollArea({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
  }, []);

  useEffect(() => {
    check();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [check]);

  return (
    <div className="relative min-h-0 flex-1 flex flex-col">
      <div
        ref={ref}
        onScroll={check}
        tabIndex={0}
        role="region"
        aria-label="Conference details"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        {children}
      </div>
      {more && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center pb-1.5"
        >
          <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-primary">
            More below <ChevronDown size={14} />
          </span>
        </div>
      )}
    </div>
  );
}

export function Pb2ConferenceInvite() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasSeen()) return;
    // A short wait so the page is on screen before anything covers it.
    const id = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) markSeen();
  }

  return (
    <>
      <div className="bg-card border border-primary p-6 sm:p-8 mb-12">
        <div className="inline-flex items-center gap-2 font-heading font-semibold text-xs uppercase tracking-[0.16em] text-primary mb-3">
          <Mic size={14} aria-hidden="true" />
          <span>Call for talks</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-3 font-medium">
          The Peace Battle 2 conference
        </h2>
        <p className="font-display italic text-lg text-gray-300 mb-5">{THEME}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-heading font-bold uppercase text-sm bg-primary text-primary-foreground px-5 py-3 inline-flex items-center gap-2 hover:opacity-90"
        >
          Give a talk <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col gap-0 p-0 max-h-[75vh] sm:max-h-[80vh] max-w-md w-[calc(100%-2rem)] border-primary overflow-hidden">
          <div className="px-5 pt-5 pb-3 pr-12 border-b border-border">
            <DialogTitle className="font-display text-xl text-white font-medium">
              Give a talk at the Peace Battle 2 conference
            </DialogTitle>
          </div>
          <ScrollArea>
            <DialogDescription className="font-display italic text-base text-gray-300 mb-3">
              {THEME}
            </DialogDescription>
            <InviteBody />
          </ScrollArea>
          <div className="flex flex-col sm:flex-row gap-2 px-5 py-4 border-t border-border">
            <a
              href={CONTACT}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpenChange(false)}
              className="font-heading font-bold uppercase text-sm bg-primary text-primary-foreground px-4 py-2.5 inline-flex items-center justify-center gap-2 hover:opacity-90"
            >
              Discord, WhatsApp or Signal <ArrowRight size={16} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="font-heading font-bold uppercase text-sm border border-border text-gray-400 px-4 py-2.5 hover:text-white"
            >
              Not now
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

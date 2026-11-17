import { useEffect, useState } from "react";
import { Mic, ArrowRight } from "lucide-react";
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
    <div className="font-sans text-base text-gray-300 space-y-4">
      <p>
        An online conference about how people begin rebuilding their lives through small acts of
        agency, mutual support and belonging. It draws on Estonia's restoration as one example of
        what collective action can rebuild over time, not as a comparison that minimizes anybody
        else's trauma. You don't have to rebuild everything at once, or alone.
      </p>
      <ul className="list-disc pl-5 space-y-2">
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
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)] border-primary">
          <DialogTitle className="font-display text-2xl text-white font-medium pr-6">
            Give a talk at the Peace Battle 2 conference
          </DialogTitle>
          <DialogDescription className="font-display italic text-base text-gray-300">
            {THEME}
          </DialogDescription>
          <InviteBody />
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={CONTACT}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpenChange(false)}
              className="font-heading font-bold uppercase text-sm bg-primary text-primary-foreground px-5 py-3 inline-flex items-center justify-center gap-2 hover:opacity-90"
            >
              Discord, WhatsApp or Signal <ArrowRight size={16} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="font-heading font-bold uppercase text-sm border border-border text-gray-400 px-5 py-3 hover:text-white"
            >
              Not now
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

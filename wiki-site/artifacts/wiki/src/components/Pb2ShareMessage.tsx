import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

// One ready-to-paste post a day, with a button that copies it.
//
// Why it exists: Peace Battle 2 asks people to post about the Skills Economy, and the only
// written-out posts were the owner's own. Those carry an argument, and a supporter who does not
// agree with every line of it posts nothing at all. These describe a feature, or point at an
// invitation, and stop — so there is nothing in them to disagree with and nobody is asked to
// endorse an opinion to take part.
//
// Two sources, both written by the build:
//   pb2-messages.json — one post per member-facing part of the app, from content/pb2-share-messages.yaml.
//   invites.json      — the published invite posts, which the invite row on /feed also reads.
// A new invite post therefore joins the pool with no edit here.
//
// One a day, and a different one per reader. Both halves are there to keep participants out of
// trouble. If everybody who arrives on a given day sees the same text, Quora sees a row of
// identical posts, which is the shape spam detection looks for — so the order is per reader. And
// if a reader can walk the pool, one person can post thirty-five times in an afternoon, which is
// the same shape from the other direction — so there is no control that advances it. The post
// changes when the day does.
//
// The reader is identified by a random value kept in their own browser. It never leaves it, it is
// not read by anything else, and it exists only to keep two readers on different orders. Where
// storage is refused, everybody falls back to one shared order: that repeats text across readers,
// which is the lesser of the two failures, because the other one hands a single person the pool.

type Pb2Message = {
  id: string;
  feature: string;
  title: string;
  body: string;
};

type InviteCard = {
  name: string;
  title: string;
  slug: string;
  url: string;
};

const READER_KEY = "pb2-reader";

// The blog's standing sign-up line, verbatim — the same fixed block every post ends with. The
// feature posts get it from the build; an invite post is assembled here, so it is added here too.
// Kept identical to SIGN_UP_LINE in scripts/src/build-pb2-messages.ts.
const SIGN_UP_LINE =
  "To sign up: https://chargingthefuture.com. It is free, everyone is let in one at a time after a check, and you can use one part of it and ignore the rest.";

/**
 * An invite post turned into something a participant can paste.
 *
 * The post's own opening words are not used. An invite is written to the person in the owner's
 * first person, so pasting it verbatim would have a participant writing as somebody else. This
 * says what the post is and hands over the address.
 */
function fromInvite(card: InviteCard): Pb2Message {
  return {
    id: `invite-${card.slug}`,
    feature: "An invitation",
    title: card.title,
    body: [
      "The TI Skills Economy invites people one at a time, in public. Not a form letter — a post written to the person by name, saying why they were asked.",
      `This is the one written to ${card.name}. Reading it needs no account.`,
      card.url,
      SIGN_UP_LINE,
    ].join("\n\n"),
  };
}

/**
 * A value that stays with this browser, so the same reader keeps the same order day after day and
 * walks the pool rather than seeing the same post twice in a week. Storage can be refused or
 * cleared; the caller handles the empty string by falling back to the shared order.
 */
function readerSeed(): string {
  try {
    const existing = window.localStorage.getItem(READER_KEY);
    if (existing) return existing;
    const minted = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(READER_KEY, minted);
    return minted;
  } catch {
    return "";
  }
}

/** Whole days since the epoch in the reader's own timezone, so the post turns over at midnight. */
function dayNumber(): number {
  const now = new Date();
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
}

function hash(text: string): number {
  let value = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

/** mulberry32: small, seeded, and enough to shuffle a list of thirty-five. */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A fixed order for this reader: same every day, so the day number alone picks the post. */
function orderFor(seed: string, length: number): number[] {
  const next = random(hash(seed || "shared"));
  const order = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** What lands in the clipboard: the first line, a blank line, then the post. */
function asPost(message: Pb2Message): string {
  return `${message.title}\n\n${message.body}`;
}

async function loadJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}${file}`, {
      headers: { accept: "application/json" },
    });
    return res.ok ? ((await res.json()) as T) : fallback;
  } catch {
    // The block is additive. A file that is missing means a smaller pool, not an error on screen.
    return fallback;
  }
}

export function Pb2ShareMessage() {
  const [messages, setMessages] = useState<Pb2Message[]>([]);
  const [seed, setSeed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  useEffect(() => {
    let canceled = false;
    setSeed(readerSeed());
    Promise.all([
      loadJson<{ messages?: Pb2Message[] }>("pb2-messages.json", {}),
      loadJson<{ invites?: InviteCard[] }>("invites.json", {}),
    ]).then(([features, invites]) => {
      if (canceled) return;
      setMessages([
        ...(Array.isArray(features.messages) ? features.messages : []),
        ...(Array.isArray(invites.invites) ? invites.invites.map(fromInvite) : []),
      ]);
    });
    return () => {
      canceled = true;
    };
  }, []);

  const order = useMemo(() => orderFor(seed ?? "", messages.length), [seed, messages.length]);

  useEffect(
    () => () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    },
    [],
  );

  if (messages.length === 0 || seed === null) return null;

  const message = messages[order[dayNumber() % order.length]];

  async function copy() {
    try {
      await navigator.clipboard.writeText(asPost(message));
    } catch {
      // Clipboard access is refused in some browsers and over plain http. Fall back to selecting
      // the text so the reader can copy it themselves rather than being told nothing happened.
      const box = document.getElementById(`pb2-message-${message.id}`);
      if (box) {
        const range = document.createRange();
        range.selectNodeContents(box);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      return;
    }
    setCopied(true);
    if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mb-12">
      <p className="font-sans text-lg text-gray-300 mb-2">
        Copy it, paste it, post it. Each one says what a part of the app does, or points at an
        invitation written to somebody by name. There is no opinion in them to agree with, and none
        of them speak for you.
      </p>
      <p className="font-sans text-gray-400 mb-6">
        One a day, and yours is not the one the next person sees. Come back tomorrow for the next.
      </p>

      <div className="bg-card border-4 border-black comic-shadow-sm p-6">
        <p className="font-heading text-xs uppercase tracking-widest text-primary mb-3">
          {message.feature}
        </p>
        <div
          id={`pb2-message-${message.id}`}
          className="font-sans text-gray-300 whitespace-pre-wrap break-words leading-relaxed"
        >
          {asPost(message)}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-wider border-4 border-black comic-shadow-sm px-5 py-3 hover:-translate-y-0.5 hover:-translate-x-0.5 transition-transform"
          >
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            {copied ? "Copied" : "Copy this post"}
          </button>
        </div>
        {/* Announced rather than only shown, so the confirmation reaches a screen reader too. */}
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? "Post copied to the clipboard." : ""}
        </span>
      </div>
    </div>
  );
}

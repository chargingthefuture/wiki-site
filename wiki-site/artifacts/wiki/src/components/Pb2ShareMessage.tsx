import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check, Shuffle } from "lucide-react";

// A ready-to-paste post, with a button that copies it.
//
// Why it exists: Peace Battle 2 asks people to post about the Skills Economy, and the only
// written-out posts were the owner's own. Those carry an argument, and a supporter who does not
// agree with every line of it posts nothing at all. These describe a feature, or point at an
// invitation, and stop — so there is nothing in them to disagree with and nobody is asked to
// endorse an opinion to take part. Other posts on this blog are deliberately not in the pool for
// the same reason.
//
// Two sources, both written by the build:
//   pb2-messages.json — one post per member-facing feature, from content/pb2-share-messages.yaml.
//   invites.json      — the published invite posts, which the invite row on /feed also reads.
// A new invite post therefore joins the pool with no edit here.
//
// Why each visitor gets a different one rather than a message of the day. The owner's rotation is
// one message per day because a new account has no followers, so a menu would be pointless. Here
// the opposite holds: participants have their own audiences and post on their own schedule. If
// everybody who arrives on the same day copies the same text, Quora sees a row of identical posts,
// which is exactly the shape spam detection looks for — and the people it would catch are the ones
// helping. So the order is shuffled per visit, and the button walks the pool without repeating.
//
// Nothing moves on its own. The message changes only when the reader presses the button, which is
// the same rule the invite row follows.

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
    ].join("\n\n"),
  };
}

/** Fisher-Yates, so every message appears before any repeats and no two visits start the same. */
function shuffled(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
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
  const [position, setPosition] = useState(0);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  useEffect(() => {
    let canceled = false;
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

  // Fixed for the life of the visit, so pressing the button walks a stable order rather than
  // reshuffling and possibly handing back what was just shown.
  const order = useMemo(() => shuffled(messages.length), [messages.length]);

  useEffect(
    () => () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    },
    [],
  );

  if (messages.length === 0) return null;

  const message = messages[order[position % order.length]];

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

  function another() {
    setCopied(false);
    setPosition((at) => at + 1);
  }

  return (
    <div className="mb-12">
      <p className="font-sans text-lg text-gray-300 mb-2">
        Copy it, paste it, post it. Each one says what a part of the app does, or points at an
        invitation written to somebody by name. There is no opinion in them to agree with, and none
        of them speak for you.
      </p>
      <p className="font-sans text-gray-400 mb-6">
        Everyone who opens this page gets a different one, so two people posting on the same day do
        not post the same text. The button walks through the rest.
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
          <button
            type="button"
            onClick={another}
            className="inline-flex items-center gap-2 border-4 border-black bg-black text-gray-200 font-heading font-bold uppercase tracking-wider comic-shadow-sm px-5 py-3 hover:text-primary"
          >
            <Shuffle size={18} aria-hidden="true" />
            Show me another
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

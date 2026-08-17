import { useEffect, useRef, useState } from "react";
import { Share2, Copy, Check, ExternalLink, X } from "lucide-react";

/**
 * Share control for the blog, following the product's link-sharing rule
 * (rule 130): never a bare copy icon that silently writes to the clipboard.
 * The trigger opens a labeled dialog that shows the full absolute URL as
 * selectable text, offers Open in new tab, and offers Copy link with visible
 * "Copied!" feedback announced to screen readers. If the async clipboard API
 * is unavailable (older browsers, non-secure contexts), copying falls back
 * to a hidden textarea + execCommand so it still works.
 *
 * The product's ShareLink component lives in the product repo and cannot be
 * imported across repos; this is the blog's implementation of the same
 * contract, restyled to the comic aesthetic.
 */
export function ShareLink({ url, label = "Share" }: { url: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const urlFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setCopied(false);
    urlFieldRef.current?.focus();
    urlFieldRef.current?.select();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white font-heading font-bold text-sm uppercase tracking-wider border-2 border-gray-800 hover:border-white hover:text-primary transition-colors"
      >
        <Share2 size={16} />
        {label}
      </button>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-label="Share this page"
          className="absolute left-0 top-full mt-2 z-50 w-[min(92vw,28rem)] bg-card border-4 border-black comic-shadow p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading font-bold text-sm uppercase tracking-wider text-white">
              Share this page
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          <input
            ref={urlFieldRef}
            type="text"
            readOnly
            value={url}
            aria-label="Link to this page"
            onFocus={(e) => e.currentTarget.select()}
            className="w-full bg-black text-gray-200 font-mono text-xs p-3 border-2 border-gray-800 mb-3 select-all"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-heading font-bold text-sm uppercase border-2 border-black comic-shadow-sm hover:shadow-none hover:translate-y-0.5 transition-all"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-heading font-bold text-sm uppercase border-2 border-gray-800 hover:border-white transition-colors"
            >
              <ExternalLink size={16} />
              Open in new tab
            </a>
          </div>

          <span aria-live="polite" className="sr-only">
            {copied ? "Link copied to clipboard" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

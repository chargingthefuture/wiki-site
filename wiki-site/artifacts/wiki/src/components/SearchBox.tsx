import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Search, X } from "lucide-react";

/**
 * Keyword box for the Record and the Feed.
 *
 * The query lives in the address (`?q=`), not in component state alone, so a
 * search can be linked, bookmarked and returned to by the back button — the
 * same reason the Record already carries its filters there. Typing is held in
 * local state so the field stays responsive, and written to the address after
 * a short pause, which keeps one history entry per search rather than one per
 * keystroke.
 */
export function SearchBox({
  value,
  buildHref,
  placeholder,
  resultLabel,
}: {
  /** The query currently in the address. */
  value: string;
  /** Page-specific address for a given query, preserving that page's filters. */
  buildHref: (query: string) => string;
  placeholder: string;
  /** e.g. "12 of 1,378" — shown only while a search is active. */
  resultLabel?: string;
}) {
  const [, navigate] = useLocation();
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the field in step when the address changes from elsewhere: a cleared
  // filter, the back button, a shared link opened fresh.
  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (draft === value) return;
    const t = setTimeout(() => navigate(buildHref(draft), { replace: true }), 250);
    return () => clearTimeout(t);
  }, [draft, value, buildHref, navigate]);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 bg-card border border-border px-3 py-2 focus-within:border-white">
        <Search size={18} className="shrink-0 text-gray-500" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraft("");
              navigate(buildHref(""), { replace: true });
            }
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full bg-transparent font-sans text-base text-white placeholder:text-gray-500 outline-none"
        />
        {draft && (
          <button
            type="button"
            onClick={() => {
              setDraft("");
              navigate(buildHref(""), { replace: true });
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="shrink-0 text-gray-500 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {value && resultLabel && (
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mt-2">
          {resultLabel}
        </p>
      )}
    </div>
  );
}

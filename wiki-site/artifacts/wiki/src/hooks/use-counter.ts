import { useEffect, type RefObject } from "react";
import { useLocation } from "wouter";

import { alreadyCounted, countEvent, counterEnabled } from "@/lib/counter";
import { estimateReadTime } from "@/lib/utils";

/**
 * The two things the counter distinguishes.
 *
 * A view is a page that was opened and stayed on screen. A read is an article
 * whose end was reached by someone who stayed long enough to have read it.
 * Keeping them apart is the point of the whole exercise: opened and read are
 * different facts, and a single number that blurs them says less than either.
 *
 * Both are decided here, on the reader's device, from things the page already
 * knows. Nothing about the reader is measured or sent to make the decision.
 */

/** A page must be on screen this long, or be interacted with, to count as viewed. */
const VIEW_QUALIFY_SECONDS = 3;

/** How far down the article body the reader must have reached. */
const READ_REACH_FRACTION = 0.8;

/** Dwell needed to count a read, as a fraction of the article's own read time. */
const READ_DWELL_FRACTION = 0.5;
const READ_DWELL_MIN_SECONDS = 20;
const READ_DWELL_MAX_SECONDS = 120;

const TICK_MS = 1000;

/**
 * Time only accumulates while the tab is visible and focused, so an article left
 * open in a background tab overnight never becomes a read.
 */
function isActive(): boolean {
  return document.visibilityState === "visible" && document.hasFocus();
}

export function useViewCounter(): void {
  const [location] = useLocation();

  useEffect(() => {
    if (!counterEnabled()) return;

    const path = location || "/";
    if (alreadyCounted(path, "view")) return;

    let visibleSeconds = 0;
    let finished = false;

    const fire = () => {
      if (finished) return;
      finished = true;
      stop();
      countEvent(path, "view");
    };

    const tick = () => {
      if (!isActive()) return;
      visibleSeconds += 1;
      if (visibleSeconds >= VIEW_QUALIFY_SECONDS) fire();
    };

    // An interaction is proof a person is here, which three seconds of elapsed
    // time only suggests. Either one qualifies; together they keep out crawlers
    // that execute JavaScript but never touch anything.
    const interactions = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    const timer = window.setInterval(tick, TICK_MS);

    function stop() {
      window.clearInterval(timer);
      for (const event of interactions) {
        window.removeEventListener(event, fire);
      }
    }

    for (const event of interactions) {
      window.addEventListener(event, fire, { passive: true, once: true });
    }

    return stop;
  }, [location]);
}

export interface ReadCounterOptions {
  /** The article body, used to tell how far down the reader got. */
  containerRef: RefObject<HTMLElement | null>;
  /** Character count of the loaded markdown; 0 while it is still loading. */
  contentLength: number;
  /** False until the article body has actually rendered. */
  ready: boolean;
}

export function useReadCounter({
  containerRef,
  contentLength,
  ready,
}: ReadCounterOptions): void {
  const [location] = useLocation();

  useEffect(() => {
    if (!ready || contentLength <= 0) return;
    if (!counterEnabled()) return;

    const path = location || "/";
    if (alreadyCounted(path, "read")) return;

    // Scaled to this article rather than a flat number: half the time the page
    // itself tells the reader it will take, floored and capped so a one-line
    // note and a very long piece both land somewhere defensible.
    const estimatedSeconds = estimateReadTime(contentLength) * 60;
    const dwellTarget = Math.max(
      READ_DWELL_MIN_SECONDS,
      Math.min(estimatedSeconds * READ_DWELL_FRACTION, READ_DWELL_MAX_SECONDS),
    );

    let activeSeconds = 0;
    let reachedEnd = false;
    let finished = false;

    const checkReach = () => {
      if (reachedEnd) return;
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;

      // An article shorter than the window has no "further down" to reach.
      if (rect.height <= viewport) {
        reachedEnd = true;
        return;
      }

      const seenFromTop = viewport - rect.top;
      if (seenFromTop >= rect.height * READ_REACH_FRACTION) reachedEnd = true;
    };

    const tick = () => {
      if (!isActive()) return;

      activeSeconds += 1;
      checkReach();

      if (finished || !reachedEnd || activeSeconds < dwellTarget) return;
      // A read is never recorded for a page that was not first recorded as
      // viewed, so the two can always be compared as a rate.
      if (!alreadyCounted(path, "view")) return;

      finished = true;
      window.clearInterval(timer);
      countEvent(path, "read");
    };

    const timer = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(timer);
  }, [location, contentLength, ready, containerRef]);
}

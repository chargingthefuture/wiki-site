/**
 * The blog's view/read counter, reader side.
 *
 * What leaves the browser is two fields — a path and whether the event was a
 * view or a read — to an endpoint the owner runs. No identifier is generated,
 * sent, or stored anywhere but this tab's own sessionStorage, which exists only
 * to avoid counting the same page twice in one visit and never leaves the
 * device. The server keeps four columns and no way to tell one reader from
 * another.
 *
 * Three properties are deliberate and should survive any edit here:
 *
 * 1. It is blockable, and blocking it must cost the reader nothing. Every call
 *    is wrapped; a refused, failed, or blocked request is a no-op, never an
 *    error the page can notice. The endpoint is named plainly rather than
 *    disguised to slip past filter lists.
 * 2. It honors Global Privacy Control and Do Not Track by sending nothing at
 *    all — not an anonymized ping, nothing.
 * 3. It sends nothing when unconfigured. With VITE_COUNTER_ENDPOINT unset, as
 *    in local development and in any fork, the whole module is inert.
 */

export type CountEvent = "view" | "read";

const ENDPOINT = import.meta.env.VITE_COUNTER_ENDPOINT;

/**
 * Falls back to a module-level set when sessionStorage throws, which it does in
 * some privacy modes. Losing the guard across a reload is fine; throwing at a
 * reader because they locked their browser down is not.
 */
const sentInThisPageLoad = new Set<string>();

function markSent(key: string): boolean {
  if (sentInThisPageLoad.has(key)) return false;
  sentInThisPageLoad.add(key);

  try {
    const storageKey = `ctf.count.${key}`;
    if (window.sessionStorage.getItem(storageKey)) return false;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Storage unavailable — the in-memory set above still covers this page load.
  }

  return true;
}

export function alreadyCounted(path: string, event: CountEvent): boolean {
  const key = `${event}:${path}`;
  if (sentInThisPageLoad.has(key)) return true;
  try {
    return Boolean(window.sessionStorage.getItem(`ctf.count.${key}`));
  } catch {
    return false;
  }
}

function suppressed(): boolean {
  if (!ENDPOINT) return true;
  if (typeof window === "undefined" || typeof navigator === "undefined") return true;

  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    webdriver?: boolean;
  };

  if (nav.globalPrivacyControl === true) return true;
  if (nav.doNotTrack === "1" || nav.doNotTrack === "yes") return true;
  if (nav.webdriver === true) return true;

  return false;
}

/**
 * Sent as text/plain so the request stays a CORS simple request and needs no
 * preflight — one round trip instead of two, and nothing to fail on a slow
 * connection. sendBeacon survives the reader navigating away mid-article, which
 * is exactly when a read completes.
 */
export function countEvent(path: string, event: CountEvent): void {
  if (suppressed()) return;
  if (!markSent(`${event}:${path}`)) return;

  const body = JSON.stringify({ path, event });

  try {
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(
        `${ENDPOINT}/count`,
        new Blob([body], { type: "text/plain;charset=UTF-8" }),
      );
      return;
    }

    void fetch(`${ENDPOINT}/count`, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body,
      keepalive: true,
      mode: "cors",
      credentials: "omit",
    }).catch(() => undefined);
  } catch {
    // A blocked or refused counter is not the reader's problem.
  }
}

export function counterEnabled(): boolean {
  return !suppressed();
}

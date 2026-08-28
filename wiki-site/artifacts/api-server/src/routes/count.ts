import { Router, type IRouter } from "express";

import { logger } from "../lib/logger";
import {
  getCounterStore,
  normalizePath,
  type CountEvent,
} from "../lib/counter-store";

const router: IRouter = Router();

/**
 * The blog posts here once when a page is opened and, on articles, once more if
 * the reader actually stays and reaches the end. See the client for how those
 * two are decided; this side only records which of the two arrived.
 *
 * The body is sent as text/plain so the request stays a CORS "simple request"
 * and needs no preflight. That is a bandwidth choice, not a way around the
 * origin allowlist, which app.ts still applies.
 */
function parseBody(body: unknown): { path: string; event: CountEvent } | null {
  let payload: unknown = body;

  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return null;
    }
  }

  if (typeof payload !== "object" || payload === null) return null;

  const { path: rawPath, event: rawEvent } = payload as Record<string, unknown>;
  const path = normalizePath(rawPath);
  if (!path) return null;
  if (rawEvent !== "view" && rawEvent !== "read") return null;

  return { path, event: rawEvent };
}

router.post("/count", (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  const parsed = parseBody(req.body);

  // Always 204, including for input this endpoint rejected. A reader's browser
  // must never see an error from a counter, and a prober gets no signal about
  // what was accepted. Rejections are visible in the log at debug level.
  if (!parsed) {
    logger.debug("Counter rejected a malformed request body");
    res.status(204).end();
    return;
  }

  const store = getCounterStore();
  if (!store) {
    res.status(204).end();
    return;
  }

  try {
    store.increment(parsed.path, parsed.event);
  } catch (err) {
    logger.error({ err }, "Counter write failed");
  }

  res.status(204).end();
});

export default router;

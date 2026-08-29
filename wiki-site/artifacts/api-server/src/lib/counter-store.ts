import { DatabaseSync } from "node:sqlite";

import { logger } from "./logger";

/**
 * Storage for the blog's view/read counter.
 *
 * This table is defined by what it does NOT hold. There is no column
 * for an IP address, a User-Agent, a referrer, a session identifier, a country,
 * or a timestamp finer than the day — not stored, and not derived on the way
 * in. Four columns is the entire record, and a reader appears in it only as
 * "+1 on this path today", indistinguishable from every other reader that day.
 *
 * Keep it that way. Any column added here is a promise broken on a blog whose
 * readers have specific reasons to care.
 */

export type CountEvent = "view" | "read";

export interface SummaryRow {
  path: string;
  views: number;
  reads: number;
}

export interface CounterSummary {
  /** Inclusive lower bound of the range, or null when the range is all time. */
  since: string | null;
  rows: SummaryRow[];
}

/**
 * Days are bucketed on the owner's clock (UTC-4/-5), not UTC. A container runs
 * on UTC, so bucketing there would file everything written after 20:00 local
 * under tomorrow — the same off-by-one the repo's post-dating rule exists to
 * prevent. en-CA formats as YYYY-MM-DD, which sorts correctly as text.
 */
const OWNER_TIME_ZONE = "America/New_York";

const DAY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: OWNER_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function dayKey(at: Date = new Date()): string {
  return DAY_FORMATTER.format(at);
}

export function daysAgoKey(days: number, from: Date = new Date()): string {
  return dayKey(new Date(from.getTime() - days * 24 * 60 * 60 * 1000));
}

/**
 * A path arrives from an anonymous public endpoint, so it is treated as hostile
 * input rather than as something the blog sent.
 *
 * A query string or fragment is rejected outright rather than trimmed off. The
 * client never sends one, and quietly accepting it would let a caller smuggle
 * arbitrary text into a column this file promises holds nothing but a path.
 */
const PATH_PATTERN = /^\/[A-Za-z0-9\-._~%/]*$/;
const MAX_PATH_LENGTH = 200;

export function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (raw.length === 0 || raw.length > MAX_PATH_LENGTH) return null;
  if (raw.includes("?") || raw.includes("#")) return null;
  if (!PATH_PATTERN.test(raw)) return null;
  return raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/**
 * Anyone can post to the counter, so anyone can invent paths. Shape validation
 * stops junk text; this stops junk volume, by refusing to open a row for a path
 * not already seen today once the day is carrying more than the blog could
 * plausibly have. Counts for real paths keep incrementing either way.
 */
const MAX_NEW_PATHS_PER_DAY = 5000;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS counts (
    path  TEXT    NOT NULL,
    day   TEXT    NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    reads INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (path, day)
  ) WITHOUT ROWID;
`;

export interface CounterStore {
  increment(path: string, event: CountEvent): void;
  summary(days: number | "all"): CounterSummary;
  close(): void;
}

/**
 * Storage is node:sqlite, which ships inside Node itself. A native module would
 * mean a compile or a prebuilt-binary download on every deploy — a failure mode
 * between the counter and its data for no gain at four columns.
 *
 * It is unflagged from Node 22.13 and a release candidate in Node 24, which the
 * Dockerfile pins.
 */
function createStore(file: string): CounterStore {
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA synchronous = NORMAL");
  db.exec(SCHEMA);

  const upsert = db.prepare(
    `INSERT INTO counts (path, day, views, reads) VALUES (?, ?, ?, ?)
     ON CONFLICT(path, day) DO UPDATE SET
       views = views + excluded.views,
       reads = reads + excluded.reads`,
  );
  const existsToday = db.prepare(
    `SELECT 1 FROM counts WHERE path = ? AND day = ? LIMIT 1`,
  );
  const pathsToday = db.prepare(
    `SELECT COUNT(*) AS total FROM counts WHERE day = ?`,
  );
  const summaryAll = db.prepare(
    `SELECT path, SUM(views) AS views, SUM(reads) AS reads FROM counts
     GROUP BY path ORDER BY views DESC, path ASC`,
  );
  const summarySince = db.prepare(
    `SELECT path, SUM(views) AS views, SUM(reads) AS reads FROM counts
     WHERE day >= ? GROUP BY path ORDER BY views DESC, path ASC`,
  );

  // node:sqlite has no transaction() helper, so the read-then-write pair that
  // enforces the daily cap is bracketed by hand. Without it a burst of new paths
  // could each see the same pre-cap count and all get through.
  function applyIncrement(
    path: string,
    day: string,
    views: number,
    reads: number,
  ): void {
    db.exec("BEGIN IMMEDIATE");
    try {
      if (!existsToday.get(path, day)) {
        const row = pathsToday.get(day) as { total: number } | undefined;
        if ((row?.total ?? 0) >= MAX_NEW_PATHS_PER_DAY) {
          db.exec("COMMIT");
          return;
        }
      }
      upsert.run(path, day, views, reads);
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }

  return {
    increment(path, event) {
      applyIncrement(
        path,
        dayKey(),
        event === "view" ? 1 : 0,
        event === "read" ? 1 : 0,
      );
    },

    summary(days) {
      if (days === "all") {
        return { since: null, rows: summaryAll.all() as unknown as SummaryRow[] };
      }
      const since = daysAgoKey(days - 1);
      return {
        since,
        rows: summarySince.all(since) as unknown as SummaryRow[],
      };
    },

    close() {
      db.close();
    },
  };
}

let store: CounterStore | null = null;
let warnedUnconfigured = false;

/**
 * Opened on first use rather than at import, so the server still boots (and its
 * health check still answers) when the volume is missing or read-only.
 * Returns null when unconfigured, which the routes surface as 503 rather than
 * pretending to count.
 */
export function getCounterStore(): CounterStore | null {
  if (store) return store;

  const file = process.env["COUNTER_DB_PATH"];
  if (!file) {
    if (!warnedUnconfigured) {
      warnedUnconfigured = true;
      logger.warn(
        "COUNTER_DB_PATH is not set; the counter is disabled and stores nothing.",
      );
    }
    return null;
  }

  try {
    store = createStore(file);
    logger.info({ file }, "Counter store opened");
    return store;
  } catch (err) {
    logger.error({ err, file }, "Could not open the counter store");
    return null;
  }
}

export function isCounterConfigured(): boolean {
  return Boolean(process.env["COUNTER_DB_PATH"]);
}

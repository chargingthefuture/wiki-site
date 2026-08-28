import { timingSafeEqual } from "node:crypto";

import { Router, type IRouter, type Request, type Response } from "express";

import {
  getCounterStore,
  isCounterConfigured,
  type CounterSummary,
} from "../lib/counter-store";

const router: IRouter = Router();

/**
 * The counts are the owner's, and only the owner's. Nothing here is linked from
 * the blog and nothing is rendered next to a post — a public per-post number
 * turns the feed into a scoreboard, which is not what these figures are for.
 */

function constantTimeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  // timingSafeEqual throws on a length mismatch, which would itself leak the
  // length, so compare against a same-length buffer and return false.
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

function authorized(req: Request): boolean {
  const user = process.env["COUNTER_STATS_USER"];
  const password = process.env["COUNTER_STATS_PASSWORD"];
  if (!user || !password) return false;

  const header = req.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  const decoded = Buffer.from(header.slice("Basic ".length), "base64").toString(
    "utf8",
  );
  const separator = decoded.indexOf(":");
  if (separator === -1) return false;

  // Both halves are always compared, so a wrong username costs the same time
  // as a wrong password.
  const userMatches = constantTimeEquals(decoded.slice(0, separator), user);
  const passwordMatches = constantTimeEquals(
    decoded.slice(separator + 1),
    password,
  );
  return userMatches && passwordMatches;
}

function guard(req: Request, res: Response): boolean {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  if (!process.env["COUNTER_STATS_USER"] || !process.env["COUNTER_STATS_PASSWORD"]) {
    res
      .status(503)
      .type("text/plain")
      .send(
        "Stats are unavailable: COUNTER_STATS_USER and COUNTER_STATS_PASSWORD are not set.\n",
      );
    return false;
  }

  if (!authorized(req)) {
    res.setHeader("WWW-Authenticate", 'Basic realm="counter", charset="UTF-8"');
    res.status(401).type("text/plain").send("Unauthorized\n");
    return false;
  }

  return true;
}

function parseRange(raw: unknown): number | "all" {
  if (raw === "all") return "all";
  const days = Number(raw);
  if (!Number.isInteger(days) || days < 1 || days > 3650) return 30;
  return days;
}

function loadSummary(range: number | "all"): CounterSummary | null {
  const store = getCounterStore();
  if (!store) return null;
  return store.summary(range);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readRate(row: { views: number; reads: number }): string {
  if (row.views === 0) return "—";
  return `${Math.round((row.reads / row.views) * 100)}%`;
}

function renderHtml(range: number | "all", summary: CounterSummary): string {
  const totals = summary.rows.reduce(
    (acc, row) => ({ views: acc.views + row.views, reads: acc.reads + row.reads }),
    { views: 0, reads: 0 },
  );

  const rangeLabel =
    range === "all"
      ? "all time"
      : `last ${range} days (from ${summary.since ?? "—"})`;

  const rows = summary.rows
    .map(
      (row) =>
        `<tr><td>${escapeHtml(row.path)}</td><td class="n">${row.views}</td>` +
        `<td class="n">${row.reads}</td><td class="n">${readRate(row)}</td></tr>`,
    )
    .join("\n");

  return `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Blog counts</title>
<style>
  body { font: 16px/1.5 system-ui, sans-serif; margin: 2rem 1rem; max-width: 60rem; }
  h1 { font-size: 1.25rem; }
  nav a { margin-right: 1rem; }
  table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
  th, td { border-bottom: 1px solid #ccc; padding: 0.4rem 0.5rem; text-align: left; }
  td.n, th.n { text-align: right; font-variant-numeric: tabular-nums; }
  tfoot td { font-weight: 600; border-top: 2px solid #333; }
  p.note { color: #555; font-size: 0.875rem; }
</style>
<h1>Blog counts — ${escapeHtml(rangeLabel)}</h1>
<nav>
  <a href="?days=7">7 days</a>
  <a href="?days=30">30 days</a>
  <a href="?days=all">all time</a>
  <a href="stats.csv?days=${range}">CSV</a>
</nav>
<table>
  <thead><tr><th>Path</th><th class="n">Views</th><th class="n">Reads</th><th class="n">Read rate</th></tr></thead>
  <tbody>
${rows || '<tr><td colspan="4">No counts recorded yet.</td></tr>'}
  </tbody>
  <tfoot><tr><td>Total</td><td class="n">${totals.views}</td><td class="n">${totals.reads}</td><td class="n">${readRate(totals)}</td></tr></tfoot>
</table>
<p class="note">
  A view is a page opened and still on screen. A read is an article whose end was
  reached and whose reader stayed long enough to have read it. Days run on the
  owner's clock, not UTC. Readers who block the counter, or who send Global
  Privacy Control or Do Not Track, are not counted — so these are floors, not
  totals, and the endpoint is public, so they are indicative rather than audited.
</p>
`;
}

function toCsv(summary: CounterSummary): string {
  const lines = ["path,views,reads"];
  for (const row of summary.rows) {
    // Paths are validated against a character allowlist on the way in, so none
    // can contain a comma or a quote; no escaping is needed to keep CSV valid.
    lines.push(`${row.path},${row.views},${row.reads}`);
  }
  return `${lines.join("\n")}\n`;
}

router.get("/stats.csv", (req, res) => {
  if (!guard(req, res)) return;

  const summary = loadSummary(parseRange(req.query["days"]));
  if (!summary) {
    res.status(503).type("text/plain").send("The counter store is not configured.\n");
    return;
  }

  res.type("text/csv").send(toCsv(summary));
});

router.get("/stats", (req, res) => {
  if (!guard(req, res)) return;

  const range = parseRange(req.query["days"]);
  const summary = loadSummary(range);
  if (!summary) {
    res
      .status(503)
      .type("text/plain")
      .send(
        isCounterConfigured()
          ? "The counter store could not be opened; check the server log.\n"
          : "The counter store is not configured (COUNTER_DB_PATH is unset).\n",
      );
    return;
  }

  res.type("html").send(renderHtml(range, summary));
});

export default router;

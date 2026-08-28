# Counter service

The blog's view/read counter. It runs on Railway, separately from the blog,
which is a static site on GitHub Pages and cannot count anything itself.

## What it stores

One table, four columns:

```
counts(path TEXT, day TEXT, views INTEGER, reads INTEGER)  PRIMARY KEY (path, day)
```

No IP address, no User-Agent, no referrer, no session identifier, no country, no
timestamp finer than the day. None of it is stored and none of it is derived on
the way in. A reader appears only as `+1 on this path today`, indistinguishable
from every other reader that day.

The request logger drops query strings and logs no address, so the log does not
reintroduce what the table leaves out.

Days run on the owner's clock (America/New_York), not UTC. A container runs on
UTC, so bucketing there would file everything written after 20:00 local under
tomorrow.

## View and read

A view is a page opened and left on screen for three seconds, or opened and
interacted with. Every route counts views.

A read is an article only, and needs both: the last 20% of the body reached, and
active time on the page of at least half the article's own estimated read time
(floor 20s, cap 120s). Time accumulates only while the tab is visible and
focused, so a tab left open overnight never becomes a read. A read is never
recorded without its view, so the two always compare as a rate.

Both are decided in the reader's browser — see `artifacts/wiki/src/lib/counter.ts`
and `artifacts/wiki/src/hooks/use-counter.ts`. Nothing about the reader is
measured to decide them.

## What it does not count

Readers who block the endpoint, and readers whose browser sends Global Privacy
Control or Do Not Track, are not counted. That is deliberate: the endpoint is
named plainly rather than disguised to slip past filter lists, and blocking it
costs the reader nothing.

So the numbers are floors. The endpoint is also public, so anyone can post to
it: treat the counts as indicative, not audited. Shape validation and a daily
cap on new paths keep junk out of the table, but nothing makes an anonymous
counter also an audited one.

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | yes | Set by Railway |
| `COUNTER_DB_PATH` | yes | SQLite file on the mounted volume, e.g. `/data/counter.sqlite`. Unset means the counter accepts requests and stores nothing. |
| `COUNTER_ALLOWED_ORIGINS` | yes | Comma-separated origins allowed to call it, e.g. `https://chargingthefuture.github.io`. Unset means no cross-origin access at all. |
| `COUNTER_STATS_USER` | yes | Username for `/api/stats` |
| `COUNTER_STATS_PASSWORD` | yes | Password for `/api/stats`. Unset (or the user unset) makes stats return 503 rather than opening up. |
| `LOG_LEVEL` | no | Defaults to `info`. `debug` also logs rejected counter requests. |

## Endpoints

| Route | Auth | Purpose |
|---|---|---|
| `POST /api/count` | none | `{"path": "/article/...", "event": "view"\|"read"}`, sent as `text/plain`. Always answers 204, including for input it rejected — a reader's browser must never see an error from a counter, and a prober gets no signal. |
| `GET /api/stats` | HTTP Basic | The owner's table: path, views, reads, read rate, over `?days=7\|30\|all`. |
| `GET /api/stats.csv` | HTTP Basic | The same as CSV. |
| `GET /api/healthz` | none | Liveness. |

Nothing is linked from the blog and no count is rendered next to a post. A
public per-post number turns the feed into a scoreboard, which is not what these
figures are for.

## Deploying to Railway

Once, by hand:

1. New service in the existing project, from this repository.
2. Root directory `wiki-site`. It builds from `wiki-site/Dockerfile`, which pins
   Node 24 — storage is `node:sqlite`, built into Node, so there is no native
   module to compile and nothing fetched at deploy time.
3. Attach a volume mounted at `/data`.
4. Set the variables above, with `COUNTER_DB_PATH=/data/counter.sqlite`.
5. Add a custom domain (`counter.chargingthefuture.com`) and the DNS record
   Railway asks for. A `*.up.railway.app` host works too; the blog only needs
   the address.
6. Set the repository variable `COUNTER_ENDPOINT` on GitHub to the service's
   `/api` base, e.g. `https://counter.chargingthefuture.com/api`. Until it is
   set, the deployed blog sends nothing.

The volume holds the whole dataset. To back it up, copy `counter.sqlite` off it.

## Running it locally

```
pnpm counter:dev     # http://localhost:5050, writes ./counter.sqlite
```

The blog's dev server does not send counts, because `VITE_COUNTER_ENDPOINT` is
unset locally. To exercise the pair, run the blog with it set:

```
VITE_COUNTER_ENDPOINT=http://localhost:5050/api pnpm wiki:preview
```

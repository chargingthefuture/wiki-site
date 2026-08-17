---
title: Admin tooling, block enforcement, and Community Value fixes
date: "2026-08-05"
excerpt: Admin controls, member block enforcement, Community Value Index labeling and fixes, and smaller hardening across plugins.
category: Updates
slug: Product-Update-2026-08-05-Admin-Blocks-Value
repo: chargingthefuture/chargingthefuture
---

## What Shipped

### Admin tooling expanded

Three admin surfaces moved from read-only to live:

- **LevelUp review queues** now act. Disputes carry a Resolve control for posting a written resolution; pending validations show Validate and Release buttons; cohorts flagged "needs trainer" have a Claim as trainer button. Completed actions refresh the queues via router.refresh().
- **AI Knowledge-Base curation** got a new admin page at /admin/comic/knowledge. It lists knowledge-base entries newest-first, filterable by active/inactive status, with a toggle to turn entries on or off for retrieval. Turning off an entry removes it from the assistant's available sources without deleting it; entries can be switched back on anytime.
- **Workforce audit trail** is now viewable. The admin screen gained a paginated Audit trail panel to browse audit events on demand.

### Member blocks now enforce everywhere

Member blocks — a feature that existed but only worked in one place — now apply across all member-to-member surfaces:

- **Foundation**: blocked providers are hidden from search; blocked pairs cannot create connection threads or make instant calls.
- **SocketRelay**: a blocked owner's posts are hidden from the browse feed; blocked pairs cannot claim requests.
- **TrustTransport**: a blocked requester's rides are hidden from helper discovery; blocked pairs cannot make or accept offers.
- **Commons**: blocked members' posts and replies are hidden from the timeline (announcements and AI answers always show). Paging and counts stay consistent.
- **MutualTime** is not applicable; events show only anonymous aggregates.

All refusals use neutral copy.

### Community Value Index labeled and fixed

- The Community Value Index dashboard now labels itself "Cumulative since June 12, 2026" so readers know what time window the figure covers.
- The index now counts SocketRelay favors at their posted value (e.g., a 15-credit favor counts as 15, not 1). The same counting applies to both the real index and the projected "value waiting to happen" figure, so a favor moves between them at the same size when it closes.
- The weekly community-stats draft now includes both the real index and the projected figure, labeling both as index numbers.

### Other fixes

- Gated channels: posting rate limits now check before reply-target lookup, so the rate-limit error appears first (no functional change, just clearer error reporting). A malformed post ID in reaction toggles now returns a clean 404 instead of a 503. Message lists no longer reverse in-process; ordering happens in SQL.
- ServiceCredits account-deletion surfaces now state the concrete 7-day reclaim window policy and note that credits return to the community treasury, never externally withdrawable.
- Skills taxonomy admin editor and SocketRelay profile admin surface reclassified in inventory from gaps to decided-against features (owner decision 2026-08-04).
- Workforce always-null region field removed from profile type, repository, and panel.
- Trust visibility selector on the member's own trust widget is now live, calling POST /api/trust/visibility.
- Trust admin verification route now has a live endpoint and admin review page.
- SkillsHunt team leaderboard is now reachable; the shell now passes the mode parameter and renders team rows by profession.
- Member presence hook for TrustTransport driver offers now records and clears presence on offer create and rejection.
- Community stats coverage count now reports distinct skills members actually listed (159 of 650, not 650 of 650).

## Why It Matters

Admin surfaces that only read block any operator action; making them live closes the gap between what the inventory promises and what you can actually do. Block enforcement across all surfaces means a block you create works everywhere, not just one plugin. Value Index fixes make the dashboard honest about what period it covers and what a favor is worth.

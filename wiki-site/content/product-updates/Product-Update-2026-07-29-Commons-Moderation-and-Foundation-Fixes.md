---
title: Commons moderation, admin tools, and Foundation fixes
date: "2026-07-29"
excerpt: Commons moderation surface, Foundation audit and race fixes, Unlock admin improvements, and dead-route detection.
category: Updates
slug: Product-Update-2026-07-29-Commons-Moderation-and-Foundation-Fixes
repo: chargingthefuture/chargingthefuture
---

# Product Update — 2026-07-29

## What Shipped

**Commons moderation.** The Commons now has a moderation surface. Moderators can hide member posts and replies, restore them, and record a reason (off-topic, suspected bad actor, or other from a fixed set). Hidden posts stop appearing in the timeline. Each action is its own decision — no bulk hide. Restoring a post clears the reason and metadata. A "By member" tab shows how many posts each author has contributed, ordered by volume, so accounts that are consistently off-topic look different from members who wandered once.

**Unlock admin queue improvements.** The queue now has a third tab to filter members on support-only access tier. Each card shows a Support-only pill when applicable. The tab displays a count of how many support-only members are shown on the current page, so if the list is longer than what fits, you see it as a shortfall instead of everyone.

**Foundation fixes.** Fixed a race condition in instant-call terminal state: when a per-block charge fails or an extend hits capacity, the call now guards against concurrent decline/timeout updates. Fixed service-credits idempotency: the route now requires a caller-supplied idempotencyKey (returns 400 if absent) instead of falling back to Date.now(), which was creating duplicate transfers on retry. The instant-call video call id is now read from the state response and checked before the audio room joins — if empty, the poll keeps running instead of joining a call that does not exist.

**Foundation capacity-policy audit.** Capacity-policy updates now write an event row with a monotonic version number, snapshot of limits, and timestamp. Queries now read the current version and activation time from the latest event.

**Admin routes audit.** Added a check that every API route is called from somewhere in the codebase. Found 91 orphan routes (88 dead code or unwired, 3 legitimately external). These are recorded as a burn-down list, not approvals — the list should only shrink. A route that hides the post but is never called is worse than a route nobody knows about, because the inventory then asserts a capability the product does not have.

**Smaller fixes.** Knowledge Library now appears in the Apps list (was registered in code but not seeded in the database). Fixed a display issue on phone-width where long Quora URLs in Unlock admin wrapped to one character per line. Synced mobile package lockfile. Removed a dead type check from the reviews widget dismissal guard and declared CORS headers defensively so a caller sending custom headers does not see the endpoint as down.

## Why It Matters

Moderation was a SQL-only task before. Now it is a surface with reasoning and audit trail. The orphan-routes check catches a failure mode that passes all other gates — code that is documented and does nothing. Foundation's fixes prevent race conditions that silently corrupt state and catch idempotency failures before they duplicate transactions. The capacity-policy audit gives Foundation a versioned history of every policy change instead of a snapshot with no timeline.


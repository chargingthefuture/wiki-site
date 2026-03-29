# Peer Programming Core Handoff — Agent 10

Date: 2026-03-04

## Clarifying Decisions Applied

- Dispatcher order was explicit: complete Agent 10 first, then continue sequentially.
- Deterministic weekly assignment uses fixed week-start key and stable batch slicing (target 5 users/cohort).
- Fallback-open mode is enabled whenever a generated cohort has fewer than 2 users.
- Notification idempotency is enforced via unique `(user_id, idempotency_key)`.

## Scope Completed

- Added migration-backed peer-programming domain schema.
- Added repository and policy support for topic governance, cohort assignment, room timeline, threaded replies, and feedback.
- Implemented user + admin API routes with authz and CSRF controls.
- Added plugin shell and admin page, plus route resolver integration.

## Changed Files

- `migrations/2026-03-04-peer-programming-core-phase2.sql`
- `packages/web/src/lib/peer-programming/constants.ts`
- `packages/web/src/lib/peer-programming/types.ts`
- `packages/web/src/lib/peer-programming/policy.ts`
- `packages/web/src/lib/peer-programming/repository.ts`
- `packages/web/src/app/api/peer-programming/_lib.ts`
- `packages/web/src/app/api/peer-programming/room/route.ts`
- `packages/web/src/app/api/peer-programming/messages/route.ts`
- `packages/web/src/app/api/peer-programming/messages/[messageId]/replies/route.ts`
- `packages/web/src/app/api/peer-programming/feedback/route.ts`
- `packages/web/src/app/api/peer-programming/admin/topics/route.ts`
- `packages/web/src/app/api/peer-programming/admin/assignments/run/route.ts`
- `packages/web/src/components/peer-programming/peer-programming-shell.tsx`
- `packages/web/src/app/admin/peer-programming/page.tsx`
- `packages/web/src/app/apps/[pluginSlug]/page.tsx`

## Cohort Algorithm Decisions and Edge Cases

- Cohorts are generated in deterministic order from unique active-user IDs, grouped by 5.
- Any cohort with `< 2` members sets `fallback_open = true`.
- Re-run is idempotent for notifications by `(user_id, idempotency_key)`; duplicate inserts are ignored.

## Open Operational Risks

- Source-of-truth active-user selection query remains caller-owned in this pass (admin run endpoint accepts a prepared list).
- No async queue transport is configured for notification retries; retries are currently idempotent DB inserts only.

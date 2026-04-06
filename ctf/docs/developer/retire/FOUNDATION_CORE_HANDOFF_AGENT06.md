# Foundation Core Handoff (Agent 06)

Date: 2026-03-03
Scope: `ctf/` only (web/API + migration + seed + docs)

## Clarifying questions asked and answers received

1. Start gate satisfied for Phase 1?
   - Answer: yes.
2. Delivery depth for this pass?
   - Answer: full Prompt 06 in one pass.
3. Realtime transport mode for message/call flows?
   - Answer: HTTP + websocket realtime.
4. Surface wiring for this pass?
   - Answer: both plugin and admin surfaces.

## Delivered scope

1. Foundation migration-backed schema:
   - added `ctf/migrations/2026-03-03-foundation-core-phase1.sql`.
   - includes extension/profile prefs, capacity/quota controls, connection threads/participants, message metadata, call sessions, quote requests + status events, notifications, rate-limit counters, and audit trail.

2. Foundation domain implementation:
   - created `ctf/packages/web/src/lib/foundation/` with constants/types/policy/audit/stream/repository.
   - repository implements:
     - provider discovery from Directory read-only projections,
     - 1:1 thread creation with survivor/provider participant enforcement,
     - message send + dedupe + notification fanout,
     - call session creation with quota/capacity policy checks,
     - quote create + deterministic lifecycle transitions,
     - connection/quote history listing,
     - notification preferences + ack behavior,
     - admin capacity policy update + rate-limit evaluation + audit listing.

3. API routes implemented:
   - User:
     - `GET /api/foundation/providers/search`
     - `POST /api/foundation/connections/threads`
     - `POST /api/foundation/connections/threads/:threadId/messages`
     - `POST /api/foundation/connections/threads/:threadId/calls`
     - `GET /api/foundation/connections/history`
     - `POST /api/foundation/quotes`
     - `POST /api/foundation/quotes/:quoteRequestId/state`
     - `GET /api/foundation/quotes/history`
     - `GET /api/foundation/notifications`
     - `PUT /api/foundation/notifications/preferences`
     - `POST /api/foundation/notifications/:notificationEventId/ack`
   - Admin:
     - `POST /api/foundation/admin/rate-limits/evaluate`
     - `GET/PUT /api/foundation/admin/capacity-policy`
     - `GET /api/foundation/admin/audit-events`

4. Web/admin surfaces:
   - plugin shell: `ctf/packages/web/src/components/foundation/foundation-shell.tsx`
   - admin page: `ctf/packages/web/src/app/admin/foundation/page.tsx`
   - plugin router integration: `ctf/packages/web/src/app/plugin/page.tsx` now renders Foundation shell for `plugin=foundation`.

5. Script/docs alignment:
   - added seed script: `ctf/scripts/seedFoundationPhase1.mjs`
   - added scripts in `ctf/package.json`:
     - `seed:foundation`
     - `migrate:foundation:phase1`
   - status matrix updated in `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-plugin-agent-assignment-matrix.md`.

## Read-only Directory boundary compliance summary

1. Provider discovery reads from `directory_profiles` only.
2. Foundation does not mutate any Directory table or projection.
3. Provider eligibility is resolved via `directory_profiles.claimed_by_user_id` and `is_active` read checks.
4. Foundation-owned entities are stored in `foundation_*` tables only.

## Realtime transport behavior summary

1. Realtime path is provided through Stream channel/call credentials, consistent with existing web repo patterns.
2. Thread creation provisions/uses Stream messaging channels and participant membership.
3. Message send forwards to Stream channel when configured and stores metadata regardless.
4. Call session create returns Stream token metadata for participant join flow.

## Known follow-up items

1. Maker-tier threshold transitions currently use DB policy/quota state checks and explicit admin controls; automatic meter ingestion can be hardened in a follow-up.
   - owner recommendation: `platform-architecture`
   - target date recommendation: 2026-03-14
2. Advanced trauma-informed copy and full accessibility/caption validation remain a UX hardening pass.
   - owner recommendation: `product-design`
   - target date recommendation: 2026-03-21

## Changed files

- `ctf/migrations/2026-03-03-foundation-core-phase1.sql`
- `ctf/scripts/seedFoundationPhase1.mjs`
- `ctf/package.json`
- `ctf/packages/web/src/lib/foundation/constants.ts`
- `ctf/packages/web/src/lib/foundation/types.ts`
- `ctf/packages/web/src/lib/foundation/policy.ts`
- `ctf/packages/web/src/lib/foundation/audit.ts`
- `ctf/packages/web/src/lib/foundation/stream.ts`
- `ctf/packages/web/src/lib/foundation/repository.ts`
- `ctf/packages/web/src/app/api/foundation/_lib.ts`
- `ctf/packages/web/src/app/api/foundation/providers/search/route.ts`
- `ctf/packages/web/src/app/api/foundation/connections/threads/route.ts`
- `ctf/packages/web/src/app/api/foundation/connections/threads/[threadId]/messages/route.ts`
- `ctf/packages/web/src/app/api/foundation/connections/threads/[threadId]/calls/route.ts`
- `ctf/packages/web/src/app/api/foundation/connections/history/route.ts`
- `ctf/packages/web/src/app/api/foundation/quotes/route.ts`
- `ctf/packages/web/src/app/api/foundation/quotes/[quoteRequestId]/state/route.ts`
- `ctf/packages/web/src/app/api/foundation/quotes/history/route.ts`
- `ctf/packages/web/src/app/api/foundation/notifications/route.ts`
- `ctf/packages/web/src/app/api/foundation/notifications/preferences/route.ts`
- `ctf/packages/web/src/app/api/foundation/notifications/[notificationEventId]/ack/route.ts`
- `ctf/packages/web/src/app/api/foundation/admin/rate-limits/evaluate/route.ts`
- `ctf/packages/web/src/app/api/foundation/admin/capacity-policy/route.ts`
- `ctf/packages/web/src/app/api/foundation/admin/audit-events/route.ts`
- `ctf/packages/web/src/components/foundation/foundation-shell.tsx`
- `ctf/packages/web/src/app/admin/foundation/page.tsx`
- `ctf/packages/web/src/app/plugin/page.tsx`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-plugin-agent-assignment-matrix.md`
- `ctf/docs/developer/FOUNDATION_CORE_HANDOFF_AGENT06.md`

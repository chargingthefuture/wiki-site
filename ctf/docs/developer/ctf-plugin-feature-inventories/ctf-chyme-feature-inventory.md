# Chyme Plugin Feature Inventory (CTF Rewrite)

## Scope and Boundary

- Rewrite target only: `ctf/`
- Legacy `platform/` remains reference-only and must not be modified.
- Unified plugin scope slug: `chyme`
- This document captures the **target implementation scope** for fresh-start delivery.

## Intent and Outcome

Chyme delivers a lightweight social-audio room with companion text chat, Stream-backed room join flow, and plugin-scoped deletion behavior under the CTF plugin-first architecture.

Lifecycle/governance references applied:

1. Inventory/checklist lifecycle follows `index.mdc` precedence and Rule 120.
2. Profile/deletion boundaries follow Rule 114 and `ctf/docs/contracts/CHYME_PROFILE_AND_DELETION_CONTRACT.md`.
3. Implementation sequencing must honor baseline phase order: Clerk integration, Railway deployment baseline, Vercel integration, Expo baseline.

## Target User Features (Implementation Scope)

1. Authenticated room bootstrap via `GET /api/chyme/room` with deterministic room provisioning (`chyme-main-room`) and participant upsert.
2. Companion text chat read/send via `GET /api/chyme/messages` and `POST /api/chyme/messages`.
3. Stream-backed room join/token flow via `POST /api/chyme/join`.
4. Service-scoped deletion request via `DELETE /api/account/chyme-profile`.
5. Full-account deletion request initiation via `DELETE /api/account/full-account` (request recording and Service Credits reclaim enqueue).
6. Web UI surface includes participant list, join-call action, chat panel, and deletion actions.

## Target Admin Features

1. No Chyme-specific admin UI is required for MVP unless called by contracts/checklist updates.
2. Eligibility gate must enforce shared access approval model (`approved user` or `admin`) for room/chat/join routes.

## API Surface and Route Map (Target)

Chyme plugin routes:

- `GET /api/chyme/room`
- `GET /api/chyme/messages`
- `POST /api/chyme/messages`
- `POST /api/chyme/join`

Deletion/account routes used by Chyme UI:

- `DELETE /api/account/chyme-profile`
- `DELETE /api/account/full-account`

Current command-contract note:

- Chyme should be delivered as route + repository flows aligned to plugin command/access/audit contracts.
- Plugin command/access/audit YAML triplet artifacts are present:
   - `ctf/docs/contracts/CHYME_PLUGIN_COMMAND_CONTRACTS.yaml`
   - `ctf/docs/contracts/CHYME_PLUGIN_ACCESS_POLICY_CONTRACTS.yaml`
   - `ctf/docs/contracts/CHYME_PLUGIN_AUDIT_CONTRACTS.yaml`

## Data Model and Storage Contracts (Target)

Canonical migration target: Chyme core tables under `ctf/migrations/` aligned to route assumptions and schema-drift checks.

1. `chyme_rooms`
   - Shared room metadata (`service_name='chyme'`, `call_active`).
2. `chyme_service_profiles`
   - Plugin extension lifecycle per user (`active|deleted`, timestamps).
3. `chyme_room_members`
   - Membership roster keyed by `(room_id, user_id)`, role enum (`speaker|listener`), last-seen updates.
4. `chyme_messages`
   - Message history with DB-level text constraint (`1..1000` chars).
5. `chyme_deletion_events`
   - Service/account deletion event log.

## Security, Privacy, and Compliance Controls (Target)

1. Clerk-authenticated access is required on Chyme routes; unauthenticated requests are denied (`401`).
2. Access gate enforces approved-user or admin eligibility (`403` for non-approved non-admin users).
3. Message payloads are trimmed server-side and rejected when empty.
4. Service deletion runs in transaction and records deletion event for audit trail.
5. Full-account endpoint currently records request and enqueues Service Credits reclaim dependency.

## Web and Android Delivery Status

1. Web implementation is required for room/chat/join/deletion workflows in Phase 0.
2. Android parity should be delivered or explicitly deferred with owner/date and milestone.
3. Current parity status is **fresh-start pending implementation**.

## Seed Coverage Status

Rule requirement: deterministic plugin seed script for manual validation in dev environments.

Current status:

- Deterministic Chyme seed script is required under `ctf/scripts/` before release gates close.
- Manual validation checklist evidence should be captured as implementation progresses.

## Risks, Ambiguities, and Known Technical Debt

1. Fresh-start implementation can drift from contracts without strict checklist synchronization.
2. Android parity can lag web delivery unless explicitly assigned and tracked.
3. Full-account delete lifecycle orchestration may need follow-up integration across plugins.
4. Chyme-specific admin tooling and moderation controls are out of MVP unless explicitly approved.

## Delivery Phasing

1. Phase 0 — Core implementation:
   - implement room/chat/join/deletion routes and persistence,
   - enforce policy and audit contracts.
2. Phase 0b — Deterministic dev/test readiness:
   - add Chyme seed script,
   - wire checklist evidence references.
3. Phase 1+ — Android parity and lifecycle closure:
   - implement mobile parity with matching policy outcomes,
   - align full-account lifecycle statuses with global orchestrator.

## Change Log

- 2026-02-25: Created initial Chyme CTF rewrite inventory and documented governance/parity requirements.
- 2026-02-25: Added Chyme command/access/audit YAML triplet references and removed contract-triplet gap from known technical debt.
- 2026-03-01: Reframed inventory for fresh-start implementation sequencing and removed implemented-baseline assumptions.

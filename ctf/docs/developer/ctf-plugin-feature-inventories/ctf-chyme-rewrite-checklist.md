# Chyme Rewrite Checklist (CTF)

## Scope and Boundary

- [x] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - Chyme implementation and supporting artifacts stay under `ctf/`.
- [x] Confirm plugin ID and room key stability.
  - Acceptance criteria:
    - Plugin slug remains `chyme`.
    - Default room remains `chyme-main-room` unless an explicit migration plan is approved.
- [x] Confirm profile/deletion contract exists.
  - Acceptance criteria:
    - `ctf/docs/contracts/CHYME_PROFILE_AND_DELETION_CONTRACT.md` exists and maps expected behavior.

## Baseline Prerequisite Gate (Mandatory)

- [ ] Confirm baseline sequence completion before Chyme build start.
  - Acceptance criteria:
    - Clerk foundation completed.
    - Railway deployment baseline completed.
    - Vercel staging integration completed.
    - Expo baseline completed.

## Phase 0 — Core Implementation and Contract Alignment

- [ ] Implement Chyme room bootstrap route behavior.
  - Acceptance criteria:
    - `GET /api/chyme/room` creates/loads deterministic room and upserts participant profile/member for eligible users.
- [ ] Implement Chyme chat list/send route behavior.
  - Acceptance criteria:
    - `GET /api/chyme/messages` returns bounded room history.
    - `POST /api/chyme/messages` trims input, rejects empty text, and persists valid messages.
- [ ] Implement Stream join route behavior.
  - Acceptance criteria:
    - `POST /api/chyme/join` returns Stream credentials when server config is present.
    - Route returns `503` when Stream server config is unavailable.
- [ ] Implement migration/data model coverage.
  - Acceptance criteria:
    - Core Chyme tables and indexes exist and match route assumptions.
- [ ] Confirm command/access/audit contract alignment.
  - Acceptance criteria:
    - Chyme command contract follows Rule 201 template conventions.
    - Chyme access/deny policy contract follows Rule 202 template conventions.
    - Chyme audit contract follows Rule 203 template conventions.

## Phase 1 — Deletion and Compliance

- [ ] Implement service-scoped deletion flow.
  - Acceptance criteria:
    - `DELETE /api/account/chyme-profile` marks service profile deleted and records service deletion event.
- [ ] Implement full-account request behavior.
  - Acceptance criteria:
    - `DELETE /api/account/full-account` records account-scope deletion request and enqueues downstream reclaim dependency.
- [ ] Align full-account lifecycle statuses with global orchestrator model.
  - Acceptance criteria:
    - Status model (`requested`/`processing`/`completed`/`failed`) is represented consistently in account deletion workflow.

## Phase 2 — Seed and Deterministic Dev Validation

- [ ] Add deterministic Chyme seed script.
  - Acceptance criteria:
    - Seed script under `ctf/scripts/` creates predictable Chyme baseline test data for local/dev validation.
- [ ] Capture dev validation evidence. [MANUAL VALIDATION CHECKLIST DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Seed data can be regenerated for local/dev manual validation.

## Phase 3 — Web/Android Parity

- [ ] Confirm web Chyme baseline is implemented.
  - Acceptance criteria:
    - Web UI and API support room, chat, join, and deletion actions.
- [ ] Implement Android parity for Chyme plugin flows.
  - Acceptance criteria:
    - Android delivers equivalent room/chat/join/deletion behavior and policy outcomes.
- [ ] Close platform parity deferment with owner/date (if not delivered in same phase).
  - Acceptance criteria:
    - Deferred Android items have explicit owner, target milestone, and validation evidence.

## Phase 4 — Release Gates and Lifecycle Maintenance

- [ ] Keep Chyme inventory/checklist synchronized with accepted changes. [EVIDENCE CAPTURE DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Feature/behavior changes update both Chyme docs in the same PR.
- [ ] Record release-gate compliance status.
  - Acceptance criteria:
    - Command/access/audit contracts, migration evidence, and policy/audit checks are linked before release cut.

## Change Log

- 2026-02-25: Created initial Chyme rewrite checklist with baseline sections and governance requirements.
- 2026-03-01: Replaced implemented-baseline validation checklist with fresh-start implementation checklist and baseline prerequisite gate.

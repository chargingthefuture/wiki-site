# Mood Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [ ] Confirm plugin identity and naming.
  - Acceptance criteria:
    - Rewrite artifacts use plugin slug `mood` in CTF folder naming.
- [ ] Confirm locked Mood scope exclusions.
  - Acceptance criteria:
    - No severe-value safety trigger logic/messages are included.
    - No Mood announcements route/API/UI scope is included.
    - No Mood in-app admin route/API/UI scope is included.
- [ ] Confirm plugin boundary separation from GentlePulse.
  - Acceptance criteria:
    - Mood user flows are standalone and not embedded in GentlePulse features.

## Phase 0 — Contracts and Scope Lock

- [ ] Lock authenticated API posture for Mood routes.
  - Acceptance criteria:
    - Auth requirements are explicit for all Mood endpoints.
- [ ] Lock retained user feature set.
  - Acceptance criteria:
    - Mood check submit and 7-day eligibility are listed as in-scope.
- [ ] Lock identity and persistence contract.
  - Acceptance criteria:
    - Submission access is authenticated-user-only.
    - Mood values are persisted by anonymous `clientId` (not `user_id`).

## Phase 1 — Data and Migration Readiness

- [ ] Define mood-check schema and uniqueness constraints.
  - Acceptance criteria:
    - Required mood-check fields and validation ranges are documented.
    - Eligibility computation basis (latest check by `clientId`) is deterministic.
- [ ] Define multi-device behavior policy.
  - Acceptance criteria:
    - Product decision for multiple `clientId`s per authenticated user is documented.

## Phase 2 — API and Behavior Implementation Readiness

- [ ] Finalize API route map for in-scope features.
  - Acceptance criteria:
    - `POST /api/mood/checks` and `GET /api/mood/checks/eligible` are documented and versioned.
- [ ] Finalize command contract map.
  - Acceptance criteria:
    - `mood.check.submit` and `mood.check.eligibility.fetch` are represented in command-contract artifacts.
- [ ] Add regression guard for excluded scopes.
  - Acceptance criteria:
    - Validation gate or lint/contract checks fail if announcements/admin/safety-trigger surface is introduced.

## Phase 3 — Security and Compliance Gates

- [ ] Verify authz coverage for all Mood writes/reads.
  - Acceptance criteria:
    - Mood routes reject unauthenticated access.
- [ ] Verify data minimization and privacy controls.
  - Acceptance criteria:
    - Logs and diagnostics exclude unnecessary sensitive request metadata.
- [ ] Verify policy language for anonymity model.
  - Acceptance criteria:
    - Product/policy wording is consistent with authenticated access plus anonymous `clientId` storage.

## Phase 4 — Web and Android Parity Gates

- [ ] Validate web/mobile parity for core Mood journey.
  - Acceptance criteria:
    - Check eligibility → submit mood flow is equivalent across web and Android.
- [ ] Validate cooldown and validation parity.
  - Acceptance criteria:
    - 7-day gating and `1..5` validation outcomes match across clients.
- [ ] Validate excluded-scope parity posture.
  - Acceptance criteria:
    - No Mood admin or announcements parity tasks are required because these are out of scope.

## Phase 5 — Validation, Seeds, and Release Evidence [MVP: VALIDATION DEFERRED — see Rule 118.]

- [ ] API/integration design documentation for retained feature scope.
  - Acceptance criteria:
    - Submit and eligibility behaviors are documented, including cooldown edges.
- [ ] Deterministic seed fixtures for retained domain entities.
  - Acceptance criteria:
    - Mood-check fixtures are deterministic and data-compatible.
- [ ] Scope evidence documentation. [EVIDENCE COLLECTION DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - CTF inventory + checklist are updated in same PR as feature-scope changes.

## Change Log

- 2026-02-25: Created initial Mood CTF rewrite checklist with locked scope exclusions (no severe-value safety trigger, no announcements, no in-app admin) and standalone-plugin boundary plus authenticated-route baseline using anonymous `clientId` persistence.

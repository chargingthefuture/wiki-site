# Unlock Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work required in `platform/`.
- [ ] Confirm plugin slug and command namespace lock.
  - Acceptance criteria:
    - Stable plugin slug is `unlock` across docs/contracts/routes.
- [ ] Confirm visibility policy.
  - Acceptance criteria:
    - Hidden in end-user plugin listing and available in admin contexts.

## Phase 0 — Contract Lock

- [ ] Define Unlock plugin command contracts for v1.
  - Acceptance criteria:
    - Every command conforms to `201-plugin-command-schema-template.mdc`.
- [ ] Define Unlock access policy contracts for v1.
  - Acceptance criteria:
    - Every command has role/attribute/consent/region/deny semantics under `202` template.
- [ ] Define Unlock audit contracts for v1.
  - Acceptance criteria:
    - Every command has allow/deny + result audit coverage under `203` template.
- [ ] Verify command parity across command/access/audit files.
  - Acceptance criteria:
    - Command set matches across all three contract files.

## Phase 1 — Schema and Persistence

- [ ] Implement Unlock schema and migration(s) in `ctf/migrations/`.
  - Acceptance criteria:
    - Runtime config, submissions, and audit tables exist with constraints/indexes.
- [ ] Implement submission state model and transitions.
  - Acceptance criteria:
    - `pending`, `approved`, `rejected`, `spam` and access-tier transitions are deterministic.
- [ ] Implement incentive grant state marker.
  - Acceptance criteria:
    - Incentive grant is tracked and cannot be double-marked.

## Phase 2 — User Submission Flow

- [ ] Implement Quora URL submission endpoint.
  - Acceptance criteria:
    - URL required, normalized, host/path validated, and persisted by user.
- [ ] Implement audit writes for allow/deny submissions.
  - Acceptance criteria:
    - Invalid URL and accepted submission outcomes are auditable.

## Phase 3 — Admin Moderation Flow

- [ ] Implement admin queue listing endpoint.
  - Acceptance criteria:
    - Supports status/tier filters and bounded limit.
- [ ] Implement admin moderation endpoint.
  - Acceptance criteria:
    - Supports approve/reject/spam with reviewer attribution.
- [ ] Implement admin Unlock shell page.
  - Acceptance criteria:
    - Queue snapshot and pending submissions render for admins only.

## Phase 4 — Incentive Integration

- [x] Implement one-time service-credits grant on approval (runtime-configurable).
  - Acceptance criteria:
    - Approval triggers service-credit mint (amount from runtime config) with deterministic idempotency key.
- [ ] Persist incentive grant marker and audit correlation.
  - Acceptance criteria:
    - Unlock submission stores grant timestamp and service-credits event is auditable.

## Phase 5 — Access-Tier Enforcement

- [x] Implement platform-wide, centralized access-tier policy integration.
  - Acceptance criteria:
    - Pending users are read-only, expired users are support-only, approved users get full access. Centralized in auth layer with explicit exceptions for Chyme/Unlock APIs and deletion.
- [ ] Implement expiry transition job/path.
  - Acceptance criteria:
    - Pending submissions past window can transition to support-only without manual edits.

## Phase 6 — Validation and Release Gates [MVP: VALIDATION DEFERRED — see Rule 118.]

- [ ] Command schema design documentation.
  - Acceptance criteria:
    - Invalid/unknown field behavior is documented.
- [ ] Access policy and audit design documentation.
  - Acceptance criteria:
    - Unauthorized/invalid transition cases are documented.
- [ ] Deterministic seed scenarios.
  - Acceptance criteria:
    - Seed data includes pending/approved/rejected/spam sample paths.

## Open Decisions Tracker

- [ ] Final copy for survivor-facing verification messaging.
- [ ] Reminder delivery mechanism (cron worker vs event queue).
- [ ] Dynamic incentive amount source of truth (runtime config vs policy constant).

## Change Log

- 2026-03-25: Created initial Unlock rewrite checklist with contracts, schema, submission/moderation, incentive, and access-tier enforcement phases.

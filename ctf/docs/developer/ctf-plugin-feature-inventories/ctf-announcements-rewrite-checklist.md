# Announcements Rewrite Checklist (CTF)

> **DEPRECATED (2026-04-05):** The standalone Announcements checklist has been merged into the unified **Feed Rewrite Checklist** (`ctf-feed-rewrite-checklist.md`). All announcement commands now use the `feed.announcement.*` namespace. Authoritative contracts are in `FEED_PLUGIN_COMMAND_CONTRACTS.yaml`, `FEED_PLUGIN_ACCESS_POLICY_CONTRACTS.yaml`, and `FEED_PLUGIN_AUDIT_CONTRACTS.yaml`. This file is retained for historical reference only.

## Scope and Boundary

- [x] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation requirement is placed on `platform/` code.
- [x] Confirm centralized admin surface.
  - Acceptance criteria:
    - Announcements admin operations are implemented in `/admin/feed-announcements`.
- [x] Confirm web-first policy with deferred Android tracking.
  - Acceptance criteria:
    - Android follow-up ticket exists with owner and due date.

## Phase 0 — Contracts and Naming Lock

- [x] Define Announcements command contracts.
  - Acceptance criteria:
    - Commands comply with `.github/instructions/201-plugin-command-schema-template.mdc`.
- [x] Define Announcements access policy contracts.
  - Acceptance criteria:
    - Policies comply with `.github/instructions/202-plugin-access-policy-schema-template.mdc`.
- [x] Define Announcements audit contracts.
  - Acceptance criteria:
    - Audit events comply with `.github/instructions/203-plugin-audit-schema-template.mdc` for allow/deny parity.
- [x] Lock naming normalization and legacy alias handling.
  - Acceptance criteria:
    - New docs/contracts use **Announcements** spelling; legacy typo alias note is documented for compatibility.

## Phase 1 — Schema and Migration Readiness

- [x] Implement Announcements domain schema.
  - Acceptance criteria:
    - Announcement lifecycle, targeting, user-state, and audit entities are present with constraints.
- [x] Add migration SQL under `ctf/migrations/`.
  - Acceptance criteria:
    - Replay and rollback behavior is validated.
- [x] Implement membership event stream entities/contracts.
  - Acceptance criteria:
    - Membership changes can trigger audience recalculation in a deterministic way.
- [x] Run schema drift predeployment checks.
  - Acceptance criteria:
    - Drift status across migration SQL, app schema, and API contracts is attached to PR.

## Phase 2 — API and Projection Pipeline

- [x] Implement draft/create/update/publish/archive API and command flows.
  - Acceptance criteria:
    - Validation, authz, and audit behavior is deterministic and complete.
- [x] Enforce Postgres canonical write-first flow.
  - Acceptance criteria:
    - Announcement state is committed before Stream projection.
- [x] Implement Stream fan-out projection and replay safety.
  - Acceptance criteria:
    - Projection is idempotent and safe under retries.
- [x] Implement read/dismiss/acknowledge user-state endpoints.
  - Acceptance criteria:
    - User-state transitions are policy-compliant and auditable.

## Phase 3 — Web Delivery

- [x] Implement authoring and publish UX on `/admin/feed-announcements`.
  - Acceptance criteria:
    - Draft/schedule/publish/archive and targeting controls are operable.
- [x] Implement announcement rendering in Feed.
  - Acceptance criteria:
    - Priority/expiry behavior and visibility targeting are correct.
- [x] Integrate optional toast mode under Feed controls.
  - Acceptance criteria:
    - Toast mode is optional and managed via Feed configuration.

## Phase 4 — Android Follow-Up (Required — see Feed Checklist Phase 6)

- [ ] All Android parity items are now tracked in `ctf-feed-rewrite-checklist.md` Phase 6.
  - Acceptance criteria:
    - See unified feed checklist for acceptance criteria.

## Phase 5 — Security, Compliance, and Hardening

- [x] Document policy and CSRF handling.
  - Acceptance criteria:
    - State-changing routes document authz + CSRF handling.
- [x] Document deletion and retention contracts.
  - Acceptance criteria:
    - Plugin deletion/full-account deletion mapping is documented against `ctf/docs/templates/PLUGIN_PROFILE_AND_DELETION_CONTRACT_TEMPLATE.md`.
- [x] Document log redaction and audit completeness.
  - Acceptance criteria:
    - Operational logs are safe; required audit fields are documented.

## Validation, Seeds, and Release Gates [MVP: VALIDATION DEFERRED — see Rule 118.]

- [x] Seed scenarios and data setup.
  - Acceptance criteria:
    - Seeds include lifecycle variants, targeting variants, and user-state variants.
- [x] Implementation documentation. [MANUAL TESTING DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Command, targeting, and membership event behavior are documented.

## Quota-Impact and Predeployment Evidence

- [x] Add stream quota-impact note for fan-out or targeting scale changes.
  - Acceptance criteria:
    - Note is created with `ctf/docs/quota-impact/TEMPLATE.md` and linked in PR.
- [x] Include schema drift predeployment evidence.
  - Acceptance criteria:
    - PR includes drift-check output and migration verification artifacts.
- [ ] Implementation tracking. [EVIDENCE CAPTURE DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Implementation status is tracked; detailed evidence collection deferred to post-MVP.

## Change Log

- 2026-02-24: Created initial Announcements rewrite checklist with approved central admin page, web-first policy + Android follow-up tracking, naming normalization/legacy alias guidance, Postgres+Stream architecture constraints, stream quota-impact gate, and schema drift predeployment evidence requirements.
- 2026-03-02: Completed phase-0 implementation with combined feed stream coupling, admin lifecycle routes, membership-event visibility recalculation, and deterministic seed coverage.
- 2026-04-05: Deprecated — merged into unified Feed Rewrite Checklist. All commands now under `feed.announcement.*` namespace.

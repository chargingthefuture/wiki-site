# Announcements Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation requirement is placed on `platform/` code.
- [ ] Confirm centralized admin surface.
  - Acceptance criteria:
    - Announcements admin operations are implemented in `/admin/feed-announcements`.
- [ ] Confirm web-first policy with deferred Android tracking.
  - Acceptance criteria:
    - Android follow-up ticket exists with owner and due date.

## Phase 0 — Contracts and Naming Lock

- [ ] Define Announcements command contracts.
  - Acceptance criteria:
    - Commands comply with `.github/instructions/201-plugin-command-schema-template.mdc`.
- [ ] Define Announcements access policy contracts.
  - Acceptance criteria:
    - Policies comply with `.github/instructions/202-plugin-access-policy-schema-template.mdc`.
- [ ] Define Announcements audit contracts.
  - Acceptance criteria:
    - Audit events comply with `.github/instructions/203-plugin-audit-schema-template.mdc` for allow/deny parity.
- [ ] Lock naming normalization and legacy alias handling.
  - Acceptance criteria:
    - New docs/contracts use **Announcements** spelling; legacy typo alias note is documented for compatibility.

## Phase 1 — Schema and Migration Readiness

- [ ] Implement Announcements domain schema.
  - Acceptance criteria:
    - Announcement lifecycle, targeting, user-state, and audit entities are present with constraints.
- [ ] Add migration SQL under `ctf/migrations/`.
  - Acceptance criteria:
    - Replay and rollback behavior is validated.
- [ ] Implement membership event stream entities/contracts.
  - Acceptance criteria:
    - Membership changes can trigger audience recalculation in a deterministic way.
- [ ] Run schema drift predeployment checks.
  - Acceptance criteria:
    - Drift status across migration SQL, app schema, and API contracts is attached to PR.

## Phase 2 — API and Projection Pipeline

- [ ] Implement draft/create/update/publish/archive API and command flows.
  - Acceptance criteria:
    - Validation, authz, and audit behavior is deterministic and complete.
- [ ] Enforce Postgres canonical write-first flow.
  - Acceptance criteria:
    - Announcement state is committed before Stream projection.
- [ ] Implement Stream fan-out projection and replay safety.
  - Acceptance criteria:
    - Projection is idempotent and safe under retries.
- [ ] Implement read/dismiss/acknowledge user-state endpoints.
  - Acceptance criteria:
    - User-state transitions are policy-compliant and auditable.

## Phase 3 — Web Delivery

- [ ] Implement authoring and publish UX on `/admin/feed-announcements`.
  - Acceptance criteria:
    - Draft/schedule/publish/archive and targeting controls are operable.
- [ ] Implement announcement rendering in Feed.
  - Acceptance criteria:
    - Priority/expiry behavior and visibility targeting are correct.
- [ ] Integrate optional toast mode under Feed controls.
  - Acceptance criteria:
    - Toast mode is optional and managed via Feed configuration.

## Phase 4 — Android Follow-Up (Tracked)

- [ ] Open and link Android follow-up parity ticket.
  - Acceptance criteria:
    - Ticket captures key parity outcomes and rollout risk.
- [ ] Define Android parity validation scope.
  - Acceptance criteria:
    - Rendering semantics and read-state outcomes are listed for parity verification.

## Phase 5 — Security, Compliance, and Hardening

- [ ] Document policy and CSRF handling.
  - Acceptance criteria:
    - State-changing routes document authz + CSRF handling.
- [ ] Document deletion and retention contracts.
  - Acceptance criteria:
    - Plugin deletion/full-account deletion mapping is documented against `ctf/docs/templates/PLUGIN_PROFILE_AND_DELETION_CONTRACT_TEMPLATE.md`.
- [ ] Document log redaction and audit completeness.
  - Acceptance criteria:
    - Operational logs are safe; required audit fields are documented.

## Validation, Seeds, and Release Gates [MVP: VALIDATION DEFERRED — see Rule 118.]

- [ ] Seed scenarios and data setup.
  - Acceptance criteria:
    - Seeds include lifecycle variants, targeting variants, and user-state variants.
- [ ] Implementation documentation. [MANUAL TESTING DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Command, targeting, and membership event behavior are documented.

## Quota-Impact and Predeployment Evidence

- [ ] Add stream quota-impact note for fan-out or targeting scale changes.
  - Acceptance criteria:
    - Note is created with `ctf/docs/quota-impact/TEMPLATE.md` and linked in PR.
- [ ] Include schema drift predeployment evidence.
  - Acceptance criteria:
    - PR includes drift-check output and migration verification artifacts.
- [ ] Implementation tracking. [EVIDENCE CAPTURE DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Implementation status is tracked; detailed evidence collection deferred to post-MVP.

## Change Log

- 2026-02-24: Created initial Announcements rewrite checklist with approved central admin page, web-first policy + Android follow-up tracking, naming normalization/legacy alias guidance, Postgres+Stream architecture constraints, stream quota-impact gate, and schema drift predeployment evidence requirements.

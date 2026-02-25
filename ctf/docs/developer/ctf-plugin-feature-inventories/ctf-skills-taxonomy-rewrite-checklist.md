# Skills Taxonomy Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [ ] Confirm plugin slug and namespace lock.
  - Acceptance criteria:
    - Stable plugin slug is `skills-taxonomy` across inventory, contracts, and routes.

## Phase 0 — Contract Lock

- [ ] Define v1 plugin command contracts.
  - Acceptance criteria:
    - Command set conforms to `.claude/rules/201-plugin-command-schema-template.mdc`.
- [ ] Define v1 access policy contracts.
  - Acceptance criteria:
    - Each command includes role/attribute checks, legal basis metadata, and deny conditions under `.claude/rules/202-plugin-access-policy-schema-template.mdc`.
- [ ] Define v1 audit contracts.
  - Acceptance criteria:
    - Each command has allow/deny and result audit coverage under `.claude/rules/203-plugin-audit-schema-template.mdc`.
- [ ] Lock destructive-delete policy matrix.
  - Acceptance criteria:
    - Clear allow/deny rules exist for sector/job-title/skill deletes with dependency thresholds.

## Phase 1 — Schema and Migrations

- [ ] Define taxonomy entities and constraints in `ctf/migrations/`.
  - Acceptance criteria:
    - Sector/job-title/skill tables and parent-child constraints are migration-backed.
- [ ] Define hierarchy and flattened read-model projections.
  - Acceptance criteria:
    - Projection rebuild strategy and versioning approach are documented.
- [ ] Define retention and rollback/replay notes.
  - Acceptance criteria:
    - Migration rollback and replay evidence plan is approved.

## Phase 2 — API and Policy Implementation

- [ ] Implement hierarchy and flattened read endpoints.
  - Acceptance criteria:
    - Read models are deterministic and match command contracts.
- [ ] Implement sector/job-title/skill CRUD endpoints.
  - Acceptance criteria:
    - Parent-child validation and integrity constraints are enforced server-side.
- [ ] Implement dependency-impact preview endpoint.
  - Acceptance criteria:
    - Preview returns impacted downstream consumers before destructive actions.
- [ ] Enforce deny-by-default policy checks.
  - Acceptance criteria:
    - Unauthorized or non-compliant writes are denied with stable reason categories.

## Phase 3 — Web and Mobile Parity

- [ ] Deliver web admin hierarchy management surface.
  - Acceptance criteria:
    - Hierarchy browse + CRUD + dependency warnings are functional.
- [ ] Deliver Android read-model parity for approved dependent apps.
  - Acceptance criteria:
    - Android consumers resolve hierarchy/flattened models with equivalent semantics.
- [ ] Validate parity drift controls.
  - Acceptance criteria:
    - Contract snapshots and parity checks detect web/mobile read-model divergence.

## Phase 4 — Security and Compliance

- [ ] Verify authz/authn controls for all plugin routes.
  - Acceptance criteria:
    - Admin mutation routes enforce server-side RBAC/ABAC and session controls.
- [ ] Verify CSRF controls for mutation routes.
  - Acceptance criteria:
    - Create/update/delete endpoints reject missing or invalid CSRF tokens.
- [ ] Verify audit evidence coverage for destructive actions.
  - Acceptance criteria:
    - Delete allow/deny outcomes include actor, purpose, target class, and timestamp metadata.

## Phase 5 — Validation, Seeds, and Release Gates

- [ ] Validate command/access/audit parity manually.
  - Acceptance criteria:
    - Command names and required fields match across contract files.
- [ ] Validate dependency safeguards manually.
  - Acceptance criteria:
    - Destructive-delete policy and dependency warnings are validated with deterministic fixtures.
- [ ] Validate cross-app compatibility manually.
  - Acceptance criteria:
    - Directory/Workforce (and approved dependents) remain compatible with hierarchy/flattened outputs.
- [ ] Add deterministic seed fixtures for taxonomy scenarios.
  - Acceptance criteria:
    - Seeded hierarchy trees and dependency references are reproducible.
- [ ] Complete release gate review.
  - Acceptance criteria:
    - Inventory + checklist are updated in the same PR as accepted scope changes.

## Open Decisions Tracker

- [ ] Final dependency threshold values for hard-delete denial.
- [ ] Final elevated-role policy for destructive actions.
- [ ] Full Android admin CRUD parity plan.

## Change Log

- 2026-02-25: Created initial Skills Taxonomy rewrite checklist with contract, schema, API/policy, parity, security/compliance, destructive-delete safeguards, dependency-impact checks, and cross-app compatibility validation gates.

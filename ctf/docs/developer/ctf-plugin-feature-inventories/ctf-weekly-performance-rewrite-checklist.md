# Weekly Performance Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [ ] Confirm plugin slug and namespace lock.
  - Acceptance criteria:
    - Stable plugin slug is `weekly-performance` across inventory, contracts, and routes.

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
- [ ] Lock week-boundary and metric dictionary semantics.
  - Acceptance criteria:
    - Week start policy and non-financial metric formulas are documented and approved.

## Phase 1 — Schema and Migrations

- [ ] Define weekly performance plugin tables/materializations in `ctf/migrations/`.
  - Acceptance criteria:
    - Week windows, metric snapshots, and comparison entities are represented.
- [ ] Define retention and rebuild strategy for aggregated metrics.
  - Acceptance criteria:
    - Retention class, recompute policy, and rollback/replay notes are documented.

## Phase 2 — API and Policy Implementation

- [ ] Implement admin week list/get and metrics/comparison endpoints.
  - Acceptance criteria:
    - Required fields and deterministic ordering match command contracts.
    - `weekStart` parsing/validation and default-week behavior are deterministic and contract-documented.
- [ ] Implement current-week polling policy.
  - Acceptance criteria:
    - Polling and focus-refetch behavior are enabled only for current-week queries.
- [ ] Implement report export mutation path (if in locked scope).
  - Acceptance criteria:
    - Export action is policy-gated, replay-safe, and contract-tested.
- [ ] Enforce deny-by-default policy checks server-side.
  - Acceptance criteria:
    - Unauthorized role/scope access is denied with stable reason categories.

## Phase 3 — Web and Mobile Parity

- [ ] Deliver web admin weekly review surface.
  - Acceptance criteria:
    - Week selector, metrics cards, and comparison table are functional and contract-aligned.
    - Previous/current/next controls enforce future-week guardrails.
    - Loading/empty/missing-metrics/error states are deterministic and testable.
- [ ] Deliver Android parity for approved operator read scope.
  - Acceptance criteria:
    - Android outputs equivalent metric values and week semantics for parity scope.
- [ ] Validate cross-platform consistency.
  - Acceptance criteria:
    - Error/deny semantics and metric formatting are equivalent across platforms.

## Phase 4 — Security and Compliance

- [ ] Verify authz/authn controls for all plugin routes.
  - Acceptance criteria:
    - Admin-protected endpoints enforce server-side RBAC/ABAC and session requirements.
- [ ] Verify CSRF controls for mutation routes.
  - Acceptance criteria:
    - All state-changing endpoints reject missing/invalid CSRF tokens.
- [ ] Verify audit evidence coverage.
  - Acceptance criteria:
    - Allow/deny outcomes and report exports are captured with actor/action/outcome/timestamp correlation fields.

## Phase 5 — Validation, Seeds, and Release Gates

- [ ] Validate command/access/audit parity manually.
  - Acceptance criteria:
    - Command names and required fields match across contract files.
- [ ] Validate week selection and comparison correctness manually.
  - Acceptance criteria:
    - Current/previous week calculations remain deterministic.
    - Current-week-only polling and focus-refetch behavior are included in manual validation walkthrough.
- [ ] Add deterministic seed fixtures for weekly metrics scenarios.
  - Acceptance criteria:
    - Seeded week datasets are reproducible via deterministic seed scripts/data for local/dev manual validation and CI.
- [ ] Complete release gate review.
  - Acceptance criteria:
    - Inventory + checklist are updated in the same PR as accepted scope changes.

## Open Decisions Tracker

- [ ] Final v1 export/report scope.
- [ ] Final Android operator parity breadth.
- [ ] Final non-financial metric set for v1 GA.
- [ ] Final mood-field inclusion decision for comparison outputs.

## Change Log

- 2026-02-25: Created initial Weekly Performance rewrite checklist with contract, schema, API/policy, parity, security/compliance, and validation/release phases.
- 2026-02-25: Updated checklist scope to enforce non-financial weekly metric parity for v1 dashboard reporting.

# Workforce Admin Rewrite Checklist

## Scope & Decisions

- [ ] Confirm in-app decision for Workforce Admin in `ctf` (no Retool split).
  - Acceptance criteria:
    - Occupations/config/reports/export/announcements workflows are all in-app.
- [ ] Freeze v1 parity scope for Workforce Admin.
  - Acceptance criteria:
    - Included: admin hub, occupations CRUD, config management, reports/drilldowns, export, announcements CRUD/deactivate.
    - Excluded unless approved: net-new BI dashboards or external reporting tools.
- [ ] Lock canonical report metric definitions.
  - Acceptance criteria:
    - “Recruited” and related percentages are defined once and reused across summary/drilldowns/export.
- [ ] Lock unified admin-write policy.
  - Acceptance criteria:
    - All admin mutations follow one authz + CSRF standard.

## Phase Plan

- [ ] Phase 0: Contract lock and decision resolution.
  - Acceptance criteria:
    - Metric, export, and policy definitions are approved with owner/date.
- [ ] Phase 1: Shared schema and migrations.
  - Acceptance criteria:
    - Workforce admin entities are aligned and migration replay is clean.
- [ ] Phase 2: Server implementation.
  - Acceptance criteria:
    - Config/occupations/reports/export/announcements endpoints are contract-complete.
- [ ] Phase 3: Web implementation.
  - Acceptance criteria:
    - Admin hub and all linked operational pages are complete.
- [ ] Phase 4: Mobile/shared integration (if relevant).
  - Acceptance criteria:
    - Shared contracts are reused; mobile scope decision is explicit.
- [ ] Phase 5: Hardening and rollout.
  - Acceptance criteria:
    - Security, test, performance, and release gates are complete.

## Contracts Tasks

- [ ] Define config contracts (`GET/PUT`).
  - Acceptance criteria:
    - Bounds and validation for assumptions fields are explicit and versioned.
- [ ] Define occupations admin contracts (`GET/POST/PUT/DELETE`).
  - Acceptance criteria:
    - Server-side pagination/filtering semantics are deterministic.
    - Duplicate and invalid update behavior has stable error shapes.
- [ ] Define reports contracts (summary + skill-level + sector drilldowns).
  - Acceptance criteria:
    - Metric formulas and field definitions are shared across endpoints.
- [ ] Define export contract (`csv|json`).
  - Acceptance criteria:
    - Schema, ordering, and formatting are stable for operational use.
- [ ] Define announcements admin contracts.
  - Acceptance criteria:
    - Create/edit/deactivate semantics and active/expiry behavior are explicit.

## Server Tasks

- [ ] Implement config and occupations handlers per locked contracts.
  - Acceptance criteria:
    - Validation, pagination/filtering, and mutation behavior are deterministic.
- [ ] Implement report aggregation with canonical metrics.
  - Acceptance criteria:
    - Summary and drilldowns return internally consistent values.
- [ ] Implement export generation using canonical report contracts.
  - Acceptance criteria:
    - CSV/JSON outputs match documented schema and metrics.
- [ ] Implement announcements admin handlers with policy parity.
  - Acceptance criteria:
    - Admin writes are CSRF-protected and audited.
- [ ] Add admin audit logging for high-impact changes.
  - Acceptance criteria:
    - Occupation/config/announcement mutations emit actor/action/target metadata.

## Web Tasks

- [ ] Build Workforce admin hub and route wiring.
  - Acceptance criteria:
    - Hub links reliably to occupations, config, announcements, and export/reports flows.
- [ ] Build occupations CRUD UI.
  - Acceptance criteria:
    - Search/pagination/create/edit/delete flows align with server behavior.
- [ ] Build config management UI.
  - Acceptance criteria:
    - Constraint validation and save feedback are clear and deterministic.
- [ ] Build reports and drilldown views.
  - Acceptance criteria:
    - Metric labels and values remain consistent across all report pages.
- [ ] Build export and announcements admin UX.
  - Acceptance criteria:
    - Export trigger behavior and announcements CRUD/deactivate are predictable.

## Mobile/Shared Tasks

- [ ] Reuse shared contracts for reports/config/occupations data.
  - Acceptance criteria:
    - No client-specific metric formula forks.
- [ ] Decide and implement mobile admin scope.
  - Acceptance criteria:
    - Inclusion/exclusion is explicit; if excluded, no hidden partial admin flows remain.

## Security & Policy Parity

- [ ] Enforce unified admin authorization for all admin endpoints.
  - Acceptance criteria:
    - Unauthorized/forbidden behavior is consistent across config, occupations, and announcements.
- [ ] Enforce CSRF parity for all admin writes.
  - Acceptance criteria:
    - No write endpoint uses weaker policy than announcements baseline.
- [ ] Validate export data exposure policy.
  - Acceptance criteria:
    - Exported fields are approved and do not leak unintended data.

## Testing & Validation

- [ ] Add contract tests for config/occupations/reports/export/announcements APIs.
  - Acceptance criteria:
    - Validation/authz/not-found/conflict coverage is complete.
- [ ] Add integration tests for metric consistency.
  - Acceptance criteria:
    - Summary, drilldowns, and exports agree for the same seeded dataset.
- [ ] Add web E2E coverage for key admin workflows.
  - Acceptance criteria:
    - Occupation CRUD, config update, announcements update, and export flow are stable.
- [ ] Validate migration/seed reliability.
  - Acceptance criteria:
    - Replay + seed produce deterministic report outputs for CI.

## Rollout

- [ ] Launch with staged admin enablement.
  - Acceptance criteria:
    - Internal operators verify parity before full rollout.
- [ ] Publish operational runbook and rollback path.
  - Acceptance criteria:
    - Known failure modes and remediation steps are documented.
- [ ] Confirm production observability.
  - Acceptance criteria:
    - Mutation failures, report errors, and export failures are monitored.

## Open Decisions

- [ ] Final canonical definition for “recruited” and related metrics.
  - Acceptance criteria:
    - One approved formula set is referenced by API/docs/tests.
- [ ] Final occupations query strategy (required filters/indexing/perf constraints).
  - Acceptance criteria:
    - Deterministic pagination and scalability expectations are documented.
- [ ] Mobile admin inclusion decision.
  - Acceptance criteria:
    - Decision captured with rationale and implementation impact.

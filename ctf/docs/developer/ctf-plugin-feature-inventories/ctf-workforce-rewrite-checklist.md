# Workforce Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [ ] Confirm legacy reference files remain intact.
  - Acceptance criteria:
    - `ctf/docs/developer/workforce-recruiter-feature-inventory.md` is unchanged.
    - `ctf/docs/developer/workforce-recruiter-rewrite-checklist.md` is unchanged.
- [ ] Confirm unified plugin slug and naming.
  - Acceptance criteria:
    - New rewrite assets use `workforce` (not `workforce-recruiter`) unless explicitly documented as legacy reference.
- [ ] Confirm accidental legacy event artifacts are excluded.
  - Acceptance criteria:
    - No legacy scaffold/event code paths from old Workforce Recruiter are included in rewrite contracts, schema, or routes.
- [ ] Confirm v1 feature scope includes full parity plus approved enhancements.
  - Acceptance criteria:
    - Included parity features: profile, occupations, announcements, reports, export, and admin management flows.
    - Included enhancements: deterministic recruited inference, canonical metric lock, recompute controls, and standardized audit-events route.
- [ ] Confirm mobile admin is in v1 scope.
  - Acceptance criteria:
    - Admin capabilities included in web and mobile parity contract/validation scope.

## Phase 0 — Legacy Review and Contract Lock

- [ ] Review and correct sections 8 and 9 from legacy Workforce inventory before implementation starts.
  - Acceptance criteria:
    - A reviewed/corrected planning note is committed and linked from implementation kickoff PR.
- [ ] Lock plugin command contract shape.
  - Acceptance criteria:
    - Workforce commands conform to `.github/instructions/201-plugin-command-schema-template.mdc`.
- [ ] Lock access policy contract shape.
  - Acceptance criteria:
    - Workforce access policies conform to `.github/instructions/202-plugin-access-policy-schema-template.mdc`.
- [ ] Lock audit contract shape.
  - Acceptance criteria:
    - Workforce audit events conform to `.github/instructions/203-plugin-audit-schema-template.mdc`.
- [ ] Confirm template bundle compliance.
  - Acceptance criteria:
    - Planning evidence references `.github/instructions/200-plugin-command-contract-templates.mdc` and all required template files.
- [ ] Lock route shape and naming decisions.
  - Acceptance criteria:
    - Drilldowns are explicit routes: `reports/skill-level/:skillLevel` and `reports/sector/:sector`.
    - Admin audit route is standardized: `GET /api/workforce/admin/audit-events`.
    - Export uses async jobs: create/status/result route family.
- [ ] Confirm contract-first-in-parallel execution mode.
  - Acceptance criteria:
    - Command/policy/audit contracts can be implemented in parallel with route handlers.

## Phase 1 — Canonical Metric Definition Lock

- [ ] Define and lock `recruited` canonical metric in `ctf/config/canonical_metrics.yaml`.
  - Acceptance criteria:
    - Metric entry includes required fields from `.github/instructions/121-canonical-metric-registry-rules.mdc` (`id`, `name`, `description`, `owner`, `data_type`, `unit`, `calculation`, `inputs`, `example_values`, `last_updated`).
- [ ] Lock recruited derivation semantics.
  - Acceptance criteria:
    - Definition states automatic derivation from Directory profile create/update writes only.
    - Definition states no manual admin/user trigger exists.
    - Definition states append-only inferred history for mapping changes.
    - Definition states live dashboard uses current state and historical dashboard uses weekly trend buckets from event history.
- [ ] Lock historical bucket and correction policy.
  - Acceptance criteria:
    - Week start day is Saturday.
    - Timezone is `America/New_York`.
    - Late-arrival correction window is T+14 days then bucket freeze.
- [ ] Record metric check evidence.
  - Acceptance criteria:
    - PR includes metric registry check output and explicit canonical metric identifier mapping.

## Phase 2 — Schema and Drift Readiness

- [ ] Define Workforce schema and migration plan in `ctf/migrations/`.
  - Acceptance criteria:
    - Migration replay and rollback strategy are documented.
- [ ] Add append-only inferred recruited event storage model.
  - Acceptance criteria:
    - Model supports immutable history and weekly historical bucketing inputs.
- [ ] Add deterministic inference idempotency model.
  - Acceptance criteria:
    - `inference_dedupe_key` is deterministic hash over canonical source/user/version fields.
    - Unique constraint prevents duplicate replay/backfill writes.
    - Duplicate replays produce idempotent no-op behavior.
- [ ] Run schema drift checks and capture evidence.
  - Acceptance criteria:
    - Drift validation aligns to `.github/instructions/122-schema-drift-predeployment-rules.mdc` and is attached in PR evidence.
- [ ] Enforce schema/contract version compatibility decision.
  - Acceptance criteria:
    - PR declares `Schema Drift: none`, `compatible`, or `versioned-breaking` with required details.

## Phase 3 — API and Behavior Implementation Readiness

- [ ] Finalize Workforce API route map and command mapping.
  - Acceptance criteria:
    - Planned routes/commands are versioned and mapped to policy/audit contracts.
- [ ] Implement full parity API groups in Workforce namespace.
  - Acceptance criteria:
    - Profile/config/occupations/reports/announcements/export/admin routes exist under `workforce` slug.
    - No new API contract uses `workforce-recruiter` slug.
- [ ] Validate recruited inference trigger boundaries.
  - Acceptance criteria:
    - Only Directory create/update writes can produce recruited inference events.
- [ ] Add regression guard against manual recruited event mutation paths.
  - Acceptance criteria:
    - Validation gate fails if user/admin-triggered recruited event creation is introduced.

## Phase 4 — Security and Compliance Gates

- [ ] Verify authz + CSRF coverage for all state-changing operations.
  - Acceptance criteria:
    - No state-changing endpoint bypasses CSRF or role policy checks.
- [ ] Lock unified web/mobile deny taxonomy.
  - Acceptance criteria:
    - Shared deny reasons are enforced for both web and mobile server-side policy outcomes.
    - At minimum include: `unauthenticated`, `insufficient_role`, `cross_workspace_access`, `missing_consent`, `region_not_permitted`, `csrf_missing`, `csrf_invalid`, `invalid_source_event`, `idempotency_replay`.
- [ ] Verify deletion/profile contract alignment.
  - Acceptance criteria:
    - Workforce behavior is documented against `ctf/docs/templates/PLUGIN_PROFILE_AND_DELETION_CONTRACT_TEMPLATE.md`.
- [ ] Verify audit parity for allow/deny outcomes.
  - Acceptance criteria:
    - Audit contract evidence includes both success and denied operation cases.

## Phase 5 — Validation, Seeds, and Non-Regression Gates [MVP: VALIDATION DEFERRED — see Rule 118.]

- [ ] Command/policy/audit schema design documentation. [MANUAL TESTING DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Valid and invalid payload paths for all core commands are documented.
- [ ] Recruited derivation and dashboard semantics design documentation.
  - Acceptance criteria:
    - Live current-state and historical weekly-bucket behavior is documented.
- [ ] Parity user/admin flows design scope. [PARITY TESTING DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Profile, occupations, announcements, report drilldowns, and export job flows are documented for post-MVP testing.
- [ ] Deterministic seed fixtures for Directory-write-derived recruited history.
  - Acceptance criteria:
    - Seed outputs are deterministic and schema-compatible.
- [ ] Non-regression guard for legacy event artifacts.
  - Acceptance criteria:
    - Lint gate fails if legacy accidental event artifact patterns are reintroduced.

## Phase 6 — PR Evidence and Release Readiness

- [ ] Include schema drift and migration evidence in PR.
  - Acceptance criteria:
    - PR includes drift check output, migration replay evidence, rollback notes, and compatibility decision.
- [ ] Implementation tracking. [EVIDENCE COLLECTION DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Implementation status is tracked; detailed evidence collection deferred to post-MVP.
- [ ] Confirm inventory + checklist lifecycle compliance.
  - Acceptance criteria:
    - `ctf-workforce-feature-inventory.md` and this checklist are updated in the same PR as behavior/contract changes.

## Change Log

- 2026-02-24: Created initial Workforce rewrite checklist with phase gates for legacy section review, canonical metric lock, schema drift evidence, and non-regression controls preventing accidental legacy event artifacts.

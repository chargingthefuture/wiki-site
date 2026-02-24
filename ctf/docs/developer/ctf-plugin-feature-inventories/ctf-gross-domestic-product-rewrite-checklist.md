# Gross Domestic Product Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No code changes required in `platform/`.
- [ ] Confirm GDP plugin ID and command namespace.
  - Acceptance criteria:
    - Stable plugin ID `gross-domestic-product` approved.
- [ ] Confirm phased parity policy (web then Android completion before GA).
  - Acceptance criteria:
    - Core survivor-facing transparency flows marked parity-required.

## Phase 0 — Contract Lock

- [ ] Define GDP plugin command contracts for v1.
  - Acceptance criteria:
    - Every command includes required fields from `201-plugin-command-schema-template.mdc`.
- [ ] Define access policy contracts for v1 GDP commands.
  - Acceptance criteria:
    - Every command includes roles, attribute checks, consent/legal basis, and deny conditions from `202-plugin-access-policy-schema-template.mdc`.
- [ ] Define audit event contracts for v1 GDP commands.
  - Acceptance criteria:
    - Every command logs allow/deny + result using `203-plugin-audit-schema-template.mdc`.
- [ ] Resolve open governance and publication policy decisions.
  - Acceptance criteria:
    - Metric ownership, publish cadence, correction policy, and public disclosure controls approved.

## Phase 1 — Metrics Registry and Model Definition

- [ ] Add canonical GDP metric definitions to `ctf/config/canonical_metrics.yaml`.
  - Acceptance criteria:
    - Full model fields included with required MDC fields (`id`, `name`, `description`, `owner`, `data_type`, `unit`, `calculation`, `inputs`, `example_values`, `last_updated`).
- [ ] Define service category split metrics and provider-tier metrics.
  - Acceptance criteria:
    - Category and tier metrics map to baseline GDP model assumptions and formulas.
- [ ] Define rollout target metrics for years 0–5.
  - Acceptance criteria:
    - Target and actual metrics are versioned and comparable by year.
- [ ] Confirm metric naming/versioning policy.
  - Acceptance criteria:
    - Aliases and deprecations are documented; ambiguous names avoided.

## Phase 2 — Schema and Migration Planning

- [ ] Design GDP extension model on canonical profile.
  - Acceptance criteria:
    - No duplicate standalone profile table; extension keyed by `user_id`.
- [ ] Define GDP snapshot and governance domain tables.
  - Acceptance criteria:
    - Snapshot, breakdown, tier, target/actual, and publish/audit entities are specified.
- [ ] Prepare migration strategy under `ctf/migrations/`.
  - Acceptance criteria:
    - Replay and rollback strategy documented before implementation.
- [ ] Define retention classes per entity.
  - Acceptance criteria:
    - Retention metadata is explicit for snapshots, events, and governance records.

## Phase 3 — API and Command Execution Planning

- [ ] Define public read command projections.
  - Acceptance criteria:
    - Dashboard snapshot, metric list/detail, and rollout-progress retrieval contracts are deterministic.
- [ ] Define admin mutation command projections.
  - Acceptance criteria:
    - Metric propose/approve, snapshot publish, and backfill commands enforce policy and audit.
- [ ] Define failure and fallback schema behavior.
  - Acceptance criteria:
    - Fallback payloads match declared contracts and avoid schema drift.

## Phase 4 — Web Delivery Planning

- [ ] Plan public GDP dashboard surfaces.
  - Acceptance criteria:
    - Total/per-capita/category/tier/rollout views included with canonical metric references.
- [ ] Plan admin governance surfaces.
  - Acceptance criteria:
    - Metric proposal/review/publish operations are role-gated and auditable.
- [ ] Plan data quality and trust cues.
  - Acceptance criteria:
    - Freshness, ownership, and formula context visible to users.

## Phase 5 — Android Delivery Planning

- [ ] Plan critical path parity for survivor-facing GDP transparency.
  - Acceptance criteria:
    - Android displays equivalent KPI semantics and outcomes to web.
- [ ] Plan parity closure for deferred admin capabilities.
  - Acceptance criteria:
    - Deferrals tracked with owner, due date, and risk notes.

## Phase 6 — Compliance, Hardening, and Operations

- [ ] Define observability and error-budget requirements.
  - Acceptance criteria:
    - Key GDP command latency/error/failure metrics are measurable.
- [ ] Define correction and republishing governance.
  - Acceptance criteria:
    - Historical corrections preserve immutable history and audit linkage.
- [ ] Define plugin-scoped and full-account deletion behavior.
  - Acceptance criteria:
    - GDP extension and domain data deletion contracts are documented and policy-aligned.

## Testing and Release Gates

- [ ] Add command schema validation tests.
  - Acceptance criteria:
    - Unknown fields/invalid types/bounds failures are covered.
- [ ] Add access policy enforcement tests.
  - Acceptance criteria:
    - Unauthorized role and deny-condition scenarios are blocked deterministically.
- [ ] Add audit integrity tests.
  - Acceptance criteria:
    - Allow + deny events are append-only and correlation fields are present.
- [ ] Add integration tests for snapshot publish/retrieval and model rollup calculations.
  - Acceptance criteria:
    - Core read/mutate paths are deterministic across web and mobile clients.
- [ ] Add schema-drift pre-deploy checks.
  - Acceptance criteria:
    - Drift checks pass and PR includes required schema-drift evidence.

## Documentation and Inventory Lifecycle

- [ ] Keep `ctf-gross-domestic-product-feature-inventory.md` updated per accepted scope change.
  - Acceptance criteria:
    - Any add/remove/behavioral change updates inventory in same PR.
- [ ] Record deprecations/removals in inventory changelog.
  - Acceptance criteria:
    - Removed features are moved to dated changelog entries.
- [ ] Add implementation status updates to this checklist.
  - Acceptance criteria:
    - Each completed checkbox references PR evidence.

## Open Decisions Tracker

- [ ] Final owner teams for economics and platform metric governance.
- [ ] Public disclosure policy for sensitive regional breakdowns.
- [ ] Backfill/late-data correction SLA and approval workflow.
- [ ] Versioning strategy for canonical metric formula changes.
- [ ] GA criteria for parity closure across web and Android.

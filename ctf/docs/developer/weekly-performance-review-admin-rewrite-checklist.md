# Weekly Performance Review Admin Rewrite Checklist

## Scope & Decisions

- [ ] Confirm in-app decision for Weekly Performance Review Admin in `ctf` (no Retool split).
  - Acceptance criteria:
    - Week selection, metric cards, and comparison table are fully delivered in product UI.
    - No required operator workflow depends on external BI/admin tooling.
- [ ] Freeze v1 parity scope for Weekly Performance Review Admin.
  - Acceptance criteria:
    - Included: week selector/navigation, loading/error/empty states, metrics cards, week-over-week comparison table.
    - Excluded unless approved: net-new forecasting dashboards or external analytics connectors.
- [ ] Lock canonical metric definitions and comparison baselines.
  - Acceptance criteria:
    - Weekly vs monthly-context metrics are explicitly defined and versioned.
    - Churn/CLV/MRR/ARR formulas are documented and testable.
- [ ] Lock week-boundary policy.
  - Acceptance criteria:
    - Server and UI use the same week start (Saturday) and date parsing contract.

## Phase Plan

- [ ] Phase 0: Contract lock and ambiguity resolution.
  - Acceptance criteria:
    - Metrics dictionary and API response schema are approved with owner/date.
- [ ] Phase 1: Shared schema/contracts alignment.
  - Acceptance criteria:
    - DTO/types used by server and clients are synchronized and version-safe.
- [ ] Phase 2: Server implementation.
  - Acceptance criteria:
    - Weekly performance endpoint and aggregation pipeline are contract-complete.
- [ ] Phase 3: Web implementation.
  - Acceptance criteria:
    - Admin page, week navigation, and metric/comparison rendering are parity-complete.
- [ ] Phase 4: Shared/mobile integration decision.
  - Acceptance criteria:
    - Shared contracts are reusable; mobile inclusion/exclusion is explicit.
- [ ] Phase 5: Hardening and rollout.
  - Acceptance criteria:
    - Security, performance, observability, and rollback gates are complete.

## Contracts Tasks

- [ ] Define weekly performance read contract.
  - Acceptance criteria:
    - `GET /api/admin/weekly-performance` request/response schema includes all required metric fields.
    - `weekStart` format, validation errors, and default-week behavior are explicit.
- [ ] Define metric field dictionary.
  - Acceptance criteria:
    - Every metric includes formula, time window, and fallback behavior.
    - Previous-week month comparison fields are explicitly required or explicitly removed.
- [ ] Define UI state contract.
  - Acceptance criteria:
    - Loading, no-data, error, and missing-metrics behavior are deterministic and documented.

## Server Tasks

- [ ] Implement endpoint with deterministic parsing and validation.
  - Acceptance criteria:
    - Invalid `weekStart` returns stable validation error shape.
    - Current-week default behavior matches contract.
- [ ] Implement analytics aggregation pipeline with canonical formulas.
  - Acceptance criteria:
    - Weekly and monthly-context values are internally consistent.
    - Test/deleted-user exclusion rules are consistently applied.
- [ ] Align fallback metrics object with final contract.
  - Acceptance criteria:
    - Fallback includes every required client field; no implicit undefined metrics.
- [ ] Add admin audit/diagnostic logging policy for analytics endpoint.
  - Acceptance criteria:
    - Logs provide request context without leaking sensitive values.
- [ ] Optimize heavy aggregation paths.
  - Acceptance criteria:
    - Query and indexing strategy meets agreed performance SLOs.

## Web Tasks

- [ ] Build week selector and navigation parity.
  - Acceptance criteria:
    - Previous/current/next controls obey future-week guardrails.
    - Week range labels match server-provided boundaries.
- [ ] Build metrics cards parity.
  - Acceptance criteria:
    - Growth/revenue/user/DAU sections match approved metric dictionary.
    - Privacy-aware rendering is used for sensitive financial values.
- [ ] Build comparison table parity.
  - Acceptance criteria:
    - Weekly and month-context rows are accurate and use correct change formulas.
- [ ] Build resilient UI states.
  - Acceptance criteria:
    - Loading/error/no-data/missing-metrics states are testable and non-ambiguous.
- [ ] Implement polling behavior policy.
  - Acceptance criteria:
    - Polling and focus refetch run only for current week as specified.

## Mobile/Shared Tasks

- [ ] Reuse shared Weekly Performance contracts/types.
  - Acceptance criteria:
    - No web-only contract forks are introduced.
- [ ] Decide mobile admin scope.
  - Acceptance criteria:
    - Inclusion or exclusion is explicitly documented with rationale.

## Security & Policy Parity

- [ ] Enforce authenticated admin access parity.
  - Acceptance criteria:
    - Non-admin and unauthenticated access is consistently forbidden.
- [ ] Enforce admin CSRF/session policy parity.
  - Acceptance criteria:
    - Admin endpoint behavior matches ctf admin policy baseline.
- [ ] Enforce privacy constraints for financial metrics.
  - Acceptance criteria:
    - Sensitive values remain masked/controlled according to product privacy controls.

## Testing & Validation

- [ ] Add contract tests for weekly performance endpoint.
  - Acceptance criteria:
    - Valid/invalid `weekStart`, authz failures, and response-schema checks are covered.
- [ ] Add integration tests for metric correctness.
  - Acceptance criteria:
    - Seeded datasets validate MRR/ARR/MAU/churn/CLV and week-over-week changes.
- [ ] Add web E2E tests for admin weekly performance workflows.
  - Acceptance criteria:
    - Week navigation, polling behavior, table rows, and error states are stable.
- [ ] Validate seed compatibility.
  - Acceptance criteria:
    - Seed data supports deterministic weekly performance assertions in CI.

## Rollout

- [ ] Roll out with controlled admin enablement.
  - Acceptance criteria:
    - Internal operators verify data parity before broad rollout.
- [ ] Publish runbook and rollback plan.
  - Acceptance criteria:
    - Includes known failure modes, metric discrepancy triage, and remediation steps.
- [ ] Confirm observability baseline.
  - Acceptance criteria:
    - Endpoint errors, latency, and metric-computation failures are monitored and alertable.

## Open Decisions

- [ ] Final canonical dictionary for each metric and baseline window.
  - Acceptance criteria:
    - One approved source is referenced by contracts/docs/tests.
- [ ] Final contract decision for mood metric fields.
  - Acceptance criteria:
    - Keep/compute/remove decision is explicit and reflected in UI/tests.
- [ ] Final performance budget and caching strategy.
  - Acceptance criteria:
    - SLO/SLA targets and implementation strategy are documented.
# TrustTransport Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No code changes required in `platform/`.
- [ ] Confirm TrustTransport plugin ID and command namespace.
  - Acceptance criteria:
    - Stable plugin ID and command naming convention approved.
- [ ] Confirm parity policy (web + Android) for critical flows.
  - Acceptance criteria:
    - Ride/package/food booking and safety controls marked parity-required.

## Phase 0 — Contract Lock

- [ ] Define plugin command contracts for v1.
  - Acceptance criteria:
    - Every command includes required fields from `201-plugin-command-schema-template.mdc`.
- [ ] Define access policy contracts for v1 commands.
  - Acceptance criteria:
    - Every command includes roles, consent, region restrictions, and deny conditions from `202-plugin-access-policy-schema-template.mdc`.
- [ ] Define audit event contracts for v1 commands.
  - Acceptance criteria:
    - Every command logs allow/deny + result using `203-plugin-audit-schema-template.mdc`.
- [ ] Resolve open business/policy decisions.
  - Acceptance criteria:
    - Launch regions, payout policy, verification, cancellation/refunds, and dispute SLA are approved.

## Phase 1 — Schema and Migrations

- [ ] Implement TrustTransport extension model on canonical profile.
  - Acceptance criteria:
    - No duplicate standalone profile table; extension keyed by `user_id`.
- [ ] Implement core domain tables and relationships.
  - Acceptance criteria:
    - Requests/offers/trips/deliveries/orders/events/proofs/disputes/ratings/ledger/payouts exist with constraints.
- [ ] Add migration SQL under `ctf/migrations/`.
  - Acceptance criteria:
    - Migration replay and rollback plan validated.
- [ ] Define retention class metadata per entity.
  - Acceptance criteria:
    - Retention class documented for proof, events, disputes, and financial records.

## Phase 2 — API and Command Execution

- [ ] Implement request/create and offer/list/accept flows.
  - Acceptance criteria:
    - Idempotent create/update behavior with validation and authz checks.
- [ ] Implement lifecycle status updates and proof capture.
  - Acceptance criteria:
    - State transitions are valid, auditable, and recoverable on failure.
- [ ] Implement cancellation, ratings, and payout request flows.
  - Acceptance criteria:
    - Policy rules and edge-case errors are deterministic.
- [ ] Implement admin dispute/risk/market-config APIs.
  - Acceptance criteria:
    - Admin mutation endpoints enforce role + CSRF + audit logging.

## Phase 3 — Web Delivery

- [ ] Build unified mode-selection and booking UX (ride/package/food).
  - Acceptance criteria:
    - Users can complete end-to-end booking per mode.
- [ ] Build provider/courier/driver action surfaces.
  - Acceptance criteria:
    - Accept, pickup, dropoff, proof, completion are fully operable.
- [ ] Build tracking/status and communication surfaces.
  - Acceptance criteria:
    - Real-time or near-real-time updates with clear state labels.
- [ ] Build earnings/payout and reputation surfaces.
  - Acceptance criteria:
    - Earnings, payout requests, ratings, and reliability indicators visible.

## Phase 4 — Android Delivery

- [ ] Implement critical path parity for booking and tracking.
  - Acceptance criteria:
    - Ride/package/food flows match web outcomes.
- [ ] Implement safety/consent/deletion parity.
  - Acceptance criteria:
    - Safety and privacy controls are behaviorally equivalent to web.
- [ ] Validate accessibility and trauma-informed constraints on Android.
  - Acceptance criteria:
    - Critical journeys pass accessibility checks and avoid overload patterns.

## Phase 5 — Admin, Compliance, and Hardening

- [ ] Build admin trust-and-safety operations UI.
  - Acceptance criteria:
    - Incident triage, account restriction/restoration, and decisions are auditable.
- [ ] Build admin disputes and refunds UI.
  - Acceptance criteria:
    - Evidence-driven adjudication with reason codes and financial adjustments.
- [ ] Add observability hooks and error budgets.
  - Acceptance criteria:
    - Command errors, latency, and failure classes are measurable.
- [ ] Validate plugin deletion and full-account deletion behavior.
  - Acceptance criteria:
    - Plugin-scoped deletion preserves canonical profile and other plugin data; full-account flow executes cross-plugin deletion policy.

## Validation, Seeds, and Release Gates

- [ ] Validate command schema behavior manually.
  - Acceptance criteria:
    - Unknown fields/invalid types/bounds failures are covered.
- [ ] Validate access policy enforcement manually.
  - Acceptance criteria:
    - Missing consent, wrong role, cross-tenant, and region restriction cases are denied.
- [ ] Validate audit integrity manually.
  - Acceptance criteria:
    - Allow + deny events are append-only and correlation fields are present.
- [ ] Validate lifecycle/disputes/payouts behavior manually.
  - Acceptance criteria:
    - Core transactional paths and failure recovery are deterministic.
- [ ] Run web and Android parity manual validation walkthroughs.
  - Acceptance criteria:
    - Critical journeys pass on both platforms with equivalent outcomes.
- [ ] Add deterministic seed checks.
  - Acceptance criteria:
    - Seeded scenarios are reproducible via deterministic seed scripts/data for local/dev manual validation and CI.

## Documentation and Inventory Lifecycle

- [ ] Keep `ctf-trusttransport-feature-inventory.md` updated per accepted scope change.
  - Acceptance criteria:
    - Any add/remove/behavioral change updates inventory in same PR.
- [ ] Record deprecations/removals in inventory changelog.
  - Acceptance criteria:
    - Removed features are moved to dated changelog entries.
- [ ] Add implementation status updates to this checklist.
  - Acceptance criteria:
    - Each completed checkbox references PR/commit evidence.

## Open Decisions Tracker

- [ ] Launch region set and service-zone rules.
- [ ] Verification/KYC requirements by mode.
- [ ] Payout methods and settlement windows.
- [ ] Cancellation/refund policy matrix.
- [ ] Safety escalation owner and protocol.
- [ ] Retention classes for proof and messaging artifacts.

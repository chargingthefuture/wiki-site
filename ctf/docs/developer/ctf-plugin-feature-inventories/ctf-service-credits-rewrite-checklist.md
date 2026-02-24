# Service Credits Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No code changes required in `platform/`.
- [ ] Confirm Service Credits plugin ID and command namespace.
  - Acceptance criteria:
    - Stable plugin ID `service-credits` and command naming convention approved.
- [ ] Confirm Formance-first adapter seam policy.
  - Acceptance criteria:
    - External ledger calls are routed through adapter interfaces only.

## Phase 0 — Contract Lock

- [ ] Define Service Credits plugin command contracts for v1.
  - Acceptance criteria:
    - Every command includes required fields from `201-plugin-command-schema-template.mdc`.
- [ ] Define access policy contracts for v1 Service Credits commands.
  - Acceptance criteria:
    - Every command includes roles, attribute checks, consent/legal basis, region controls, and deny conditions from `202-plugin-access-policy-schema-template.mdc`.
- [ ] Define audit event contracts for v1 Service Credits commands.
  - Acceptance criteria:
    - Every command logs allow/deny + result using `203-plugin-audit-schema-template.mdc`.
- [ ] Resolve non-fiat and cross-plugin policy decisions.
  - Acceptance criteria:
    - No-fiat-redeemability and mandatory cross-plugin-path constraints are documented and approved.

## Phase 1 — Schema and Integration

- [ ] Design Service Credits extension model on canonical profile.
  - Acceptance criteria:
    - No duplicate standalone profile table; extension keyed by `user_id`.
- [ ] Define core wallet, transfer, escrow, governance, treasury, and dispute entities.
  - Acceptance criteria:
    - Domain entities and relationships are specified with retention classes and integrity constraints.
- [ ] Define Formance adapter integration boundary and outbox behavior.
  - Acceptance criteria:
    - Adapter interfaces, retry semantics, and failure class mapping are explicit.
- [ ] Prepare migration strategy under `ctf/migrations/`.
  - Acceptance criteria:
    - Replay and rollback strategy documented before implementation.

## Phase 2 — Command Execution

- [ ] Implement `wallet.create` and `wallet.balance.get` command execution paths.
  - Acceptance criteria:
    - Deterministic authz checks and idempotent wallet provisioning behavior are validated.
- [ ] Implement `transfer.create` and escrow command execution paths.
  - Acceptance criteria:
    - Hold/release/refund transitions are valid, auditable, and replay-safe.
- [ ] Implement governance and treasury mutation command execution paths.
  - Acceptance criteria:
    - Mint/burn/fee collect commands enforce role, policy, and idempotency contracts.
- [ ] Implement dispute adjustment command execution path.
  - Acceptance criteria:
    - Adjustment reason coding and balance mutation ordering are deterministic.

## Phase 3 — Cross-Plugin Enforcement

- [ ] Enforce cross-plugin-path metadata for value-moving commands.
  - Acceptance criteria:
    - Missing or invalid origin plugin context is denied with deterministic reason codes.
- [ ] Enforce no direct ledger-provider invocation from feature code.
  - Acceptance criteria:
    - All external ledger operations pass through the Formance-first adapter seam.
- [ ] Enforce no-fiat-redeemability constraints.
  - Acceptance criteria:
    - Commands implying fiat redemption, withdrawal, or cash-out are denied and audited.

## Phase 4 — Web and Android Parity

- [ ] Deliver wallet, balance, transfer, and escrow critical path parity.
  - Acceptance criteria:
    - Web and Android produce equivalent outcomes and status semantics for critical flows.
- [ ] Deliver command error and deny-reason parity.
  - Acceptance criteria:
    - Policy-deny categories and user-safe error responses align across platforms.
- [ ] Track and close deferred parity items before GA.
  - Acceptance criteria:
    - Each deferral has owner, due date, and risk note with closure evidence.

## Phase 5 — Admin and Compliance

- [ ] Deliver governance, treasury, and dispute admin operations.
  - Acceptance criteria:
    - Admin mutations are role-gated, CSRF-safe (where applicable), and fully audited.
- [ ] Validate retention and lawful-basis controls.
  - Acceptance criteria:
    - Data classes and retention classes are declared and policy-aligned per command.
- [ ] Validate deletion behavior for plugin-scoped and full-account flows.
  - Acceptance criteria:
    - Service Credits extension/domain deletion behavior is documented and compliant.

## Phase 6 — Tests and Release

- [ ] Add command schema validation tests.
  - Acceptance criteria:
    - Unknown fields/invalid types/bounds failures are covered.
- [ ] Add access policy enforcement tests.
  - Acceptance criteria:
    - Missing scope, wrong role, cross-tenant, invalid plugin-path, and no-fiat violations are denied.
- [ ] Add audit integrity tests.
  - Acceptance criteria:
    - Allow + deny events are append-only and include request/trace correlation fields.
- [ ] Add integration tests for adapter seam and failure recovery.
  - Acceptance criteria:
    - Adapter timeout/retry/failure classes produce deterministic command outcomes.
- [ ] Add deterministic seed checks for financial scenarios.
  - Acceptance criteria:
    - Wallet/transfer/escrow/treasury/dispute seed scenarios are reproducible in local/dev/test/CI.

## Phase 7 — Docs Lifecycle

- [ ] Keep `ctf-service-credits-feature-inventory.md` updated per accepted scope change.
  - Acceptance criteria:
    - Any add/remove/behavioral change updates inventory in same PR.
- [ ] Record deprecations/removals in inventory changelog.
  - Acceptance criteria:
    - Removed features are moved to dated changelog entries.
- [ ] Keep command/access/audit contract YAMLs versioned and synchronized.
  - Acceptance criteria:
    - Command version bumps and policy/audit schema changes are updated in the same PR.
- [ ] Add implementation status updates to this checklist.
  - Acceptance criteria:
    - Each completed checkbox references PR evidence.

## Open Decisions Tracker

- [ ] Final role ownership model for governance, treasury, and dispute operators.
- [ ] Cross-plugin-path attestation schema and signing requirements.
- [ ] Adapter retry ceilings and dead-letter escalation policy.
- [ ] Regional/legal constraints for credit issuance and expiration policy.

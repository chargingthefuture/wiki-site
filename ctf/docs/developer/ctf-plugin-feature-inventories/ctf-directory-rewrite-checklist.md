# Directory Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [ ] Confirm legacy references remain intact.
  - Acceptance criteria:
    - `ctf/docs/developer/directory-feature-inventory.md` is unchanged.
    - `ctf/docs/developer/directory-admin-feature-inventory.md` is unchanged.
- [ ] Confirm unified rewrite surface decision is locked.
  - Acceptance criteria:
    - Directory rewrite uses one combined user/admin UI page/surface.
    - Admin controls are role-gated on that same surface.
- [ ] Confirm v1 parity decisions are locked.
  - Acceptance criteria:
    - Android admin parity is required in v1.
    - Post-create public URL behavior remains display-only parity for v1.

## Phase 0 — Decision Lock and Ambiguity Resolution

- [ ] Resolve all user-facing open decisions from inventory section A.
  - Acceptance criteria:
    - Each A-item in `ctf-directory-feature-inventory.md` has an explicit decision, owner, and date.
- [ ] Resolve all admin open decisions from inventory section B.
  - Acceptance criteria:
    - Each B-item in `ctf-directory-feature-inventory.md` has an explicit decision, owner, and date.
- [ ] Resolve migration-risk handling plan from inventory section C.
  - Acceptance criteria:
    - Each C-item has a mitigation strategy and verification gate.
- [ ] Lock route ownership for announcements and admin APIs.
  - Acceptance criteria:
    - Directory announcement and admin routes have explicit module ownership.
    - No unresolved route ownership ambiguity remains.

## Phase 1 — Unified UI and Policy Boundary

- [ ] Implement one unified Directory UI surface for user + admin workflows.
  - Acceptance criteria:
    - Shared page/surface supports user flows and role-gated admin controls.
- [ ] Ensure frontend admin hiding is UX-only.
  - Acceptance criteria:
    - Security posture does not rely on client visibility checks.
    - Server policy checks remain authoritative.
- [ ] Preserve post-create public URL display-only behavior.
  - Acceptance criteria:
    - No mandatory copy/open action control is introduced in v1 parity scope.

## Phase 2 — API and Backend Policy Gates

- [ ] Enforce server-side authz on every admin endpoint.
  - Acceptance criteria:
    - Unauthorized admin API attempts return deny outcomes.
    - Deny outcomes are covered by automated tests.
- [ ] Enforce CSRF protection on every admin write endpoint.
  - Acceptance criteria:
    - Missing/invalid CSRF tokens are rejected for admin writes.
    - CSRF failure paths are covered by automated tests.
- [ ] Enforce claimed/unclaimed guardrails.
  - Acceptance criteria:
    - Unclaimed-only delete behavior is preserved.
    - Assignment transition constraints are validated server-side.
    - Guardrail violation paths are covered by automated tests.
- [ ] Enforce route ownership constraints.
  - Acceptance criteria:
    - Route-to-module ownership map is documented and validated in tests/lint gates.

## Phase 3 — Privacy and Anti-Scraping Controls

- [ ] Validate public projection privacy contract.
  - Acceptance criteria:
    - Public list/detail responses expose only approved privacy-minimized fields.
    - Non-public profiles remain inaccessible via public detail routes.
- [ ] Validate anti-scraping controls on public endpoints.
  - Acceptance criteria:
    - Rate limit thresholds are active and tested.
    - Suspicious traffic delay/mitigation behavior is tested.
    - Public ordering/privacy controls remain deterministic and policy-compliant.

## Phase 4 — Data, Schema, and Seed Consistency

- [ ] Confirm schema consistency for profile, announcement, and audit contracts.
  - Acceptance criteria:
    - Schema and migration artifacts are consistent with planned contracts.
- [ ] Confirm deterministic seed consistency.
  - Acceptance criteria:
    - Claimed/unclaimed, announcement, and skills fixtures are deterministic.
    - Seed outputs are stable across CI and local runs.
- [ ] Validate schema/seed compatibility gates.
  - Acceptance criteria:
    - Automated checks fail on schema drift or incompatible seed assumptions.

## Phase 5 — Web and Android Delivery Parity (Required)

- [ ] Ship web user + admin parity for in-scope Directory flows.
  - Acceptance criteria:
    - Unified UI behavior and policy outcomes match inventory requirements.
- [ ] Ship Android user + admin parity for in-scope Directory flows.
  - Acceptance criteria:
    - Android admin parity is complete in v1 and not deferred.
    - Android and web share equivalent server deny/allow outcomes.
- [ ] Validate parity with automated coverage.
  - Acceptance criteria:
    - Cross-client parity tests cover user and admin critical paths.

## Phase 6 — Test and Release Gates

- [ ] Add tests for unauthorized admin API attempts.
  - Acceptance criteria:
    - All admin endpoints include negative authz test coverage.
- [ ] Add tests for CSRF protection on admin writes.
  - Acceptance criteria:
    - Each admin write route has missing/invalid token test coverage.
- [ ] Add tests for claimed/unclaimed guardrails.
  - Acceptance criteria:
    - Assignment and unclaimed-delete constraints are fully exercised.
- [ ] Add tests for public projection privacy and anti-scraping controls.
  - Acceptance criteria:
    - Public response field exposure and anti-scraping behavior are validated.
- [ ] Add tests/gates for schema/seed consistency and route ownership.
  - Acceptance criteria:
    - CI gates fail when schema/seed or route ownership contracts drift.

## Docs Lifecycle

- [ ] Keep inventory/checklist lifecycle synchronized with implementation changes.
  - Acceptance criteria:
    - `ctf-directory-feature-inventory.md` and this checklist are updated in the same PR as behavior or contract changes.
- [ ] Record implementation evidence links for completed checklist items.
  - Acceptance criteria:
    - Each checked item references code/tests/docs proving completion.

## Change Log

- 2026-02-25: Created initial Directory rewrite checklist with unified UI scope, backend policy gates, open-decision resolution requirements, security/privacy test gates, schema/seed consistency checks, and required Android admin parity in v1.

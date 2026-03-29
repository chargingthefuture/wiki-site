# LightHouse Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [ ] Confirm plugin identity and naming.
  - Acceptance criteria:
    - Rewrite artifacts use plugin slug `lighthouse` in CTF folder naming.
    - Plugin name remains `LightHouse` in product-facing contexts.
- [ ] Confirm inventory/checklist artifact pairing is complete.
  - Acceptance criteria:
    - `ctf-lighthouse-feature-inventory.md` exists and is current.
    - This checklist is updated in the same PR as behavior/contract scope changes.
- [ ] Confirm v1 scope lock for required parity.
  - Acceptance criteria:
    - Included: profile CRUD, property browse/detail, host property CRUD, match lifecycle, announcements, admin operations, blocks.
    - No net-new non-parity discovery features are introduced without explicit approval.

## Phase 0 — Decision Lock and Contract Baseline

- [ ] Lock canonical schema authority for LightHouse rewrite.
  - Acceptance criteria:
    - Migration SQL and shared contracts have one explicit source-of-truth workflow.
    - Schema-drift gate expectations are documented.
- [ ] Lock host-profile deletion semantics for linked data.
  - Acceptance criteria:
    - FK-safe behavior for linked properties/matches is approved.
    - User-facing outcomes and audit expectations are documented.
- [ ] Lock blocks policy contract for v1.
  - Acceptance criteria:
    - Block lifecycle operations (create/check/list/delete) are approved.
    - Match/interactions behavior under block state is explicitly documented.
- [ ] Lock web+android parity obligations for critical LightHouse flows.
  - Acceptance criteria:
    - Critical user/admin/safety flows are marked parity-required across web and Android.

## Phase 1 — Data, Migration, and Contract Readiness

- [ ] Implement canonical schema contracts for LightHouse entities.
  - Acceptance criteria:
    - `lighthouse_profiles`, `lighthouse_properties`, `lighthouse_matches`, `lighthouse_announcements`, and `lighthouse_blocks` are represented in canonical contracts.
- [ ] Validate migration compatibility and replay safety.
  - Acceptance criteria:
    - Migrations apply cleanly in local and CI workflows.
    - Drift checks pass for schema and contract artifacts.
- [ ] Finalize API projection contract map.
  - Acceptance criteria:
    - Profile/property/match/announcement/admin/blocks route contracts are versioned and documented.

## Phase 2 — API and Policy Gate Implementation

- [ ] Enforce auth requirements across LightHouse user routes.
  - Acceptance criteria:
    - Unauthenticated attempts return deterministic deny outcomes.
- [ ] Enforce role and ownership constraints.
  - Acceptance criteria:
    - Host ownership checks protect property mutations.
    - Seeker/host action boundaries for match lifecycle are server-enforced.
- [ ] Enforce admin-role plus CSRF controls on admin writes.
  - Acceptance criteria:
    - Admin property/match/announcement mutations reject missing or invalid CSRF tokens.
- [ ] Implement blocks policy enforcement.
  - Acceptance criteria:
    - Block relationships are respected in affected interaction paths.
    - Policy-deny behavior is deterministic and documented.

## Phase 3 — Web Delivery

- [ ] Implement dashboard parity with role-based entry behavior.
  - Acceptance criteria:
    - No-profile onboarding and role-specific CTA paths are complete.
    - Announcements banner behavior follows contract.
- [ ] Implement profile flow parity (create/read/update/delete).
  - Acceptance criteria:
    - Seeker/host field differences and validation constraints are complete.
    - Profile delete flow behavior matches approved deletion contract.
- [ ] Implement property and match journey parity.
  - Acceptance criteria:
    - Browse/detail, host management, and match lifecycle paths are complete.
    - Duplicate match request prevention behavior is preserved.
- [ ] Implement admin surface parity.
  - Acceptance criteria:
    - Admin stats, profile views, moderation updates, and announcement management are complete.
- [ ] Implement blocks UX parity.
  - Acceptance criteria:
    - User block create/check/list/delete interactions are accessible and policy-aligned.

## Phase 4 — Android Delivery Parity

- [ ] Implement Android parity for core user flows.
  - Acceptance criteria:
    - Profile/property/match/announcement outcomes are equivalent to web behavior.
- [ ] Implement Android parity for required admin flows.
  - Acceptance criteria:
    - In-scope admin moderation outcomes are equivalent to web policy outcomes.
- [ ] Implement Android parity for blocks behavior.
  - Acceptance criteria:
    - Blocks lifecycle and enforcement behavior mirror shared contract outcomes.

## Phase 5 — Security, Validation, Seeds, and Release Gates [MVP: VALIDATION DEFERRED — see Rule 118.]

- [ ] API contracts design documentation for all route families.
  - Acceptance criteria:
    - Profile/property/match/announcement/admin/blocks endpoints are documented.
- [ ] Policy-critical security controls design documentation.
  - Acceptance criteria:
    - Authz, CSRF, role, ownership, and block-policy handling is documented.
- [ ] LightHouse critical journey design documentation.
  - Acceptance criteria:
    - Seeker, host, and admin primary paths are documented with stable selectors.
- [ ] Web + Android parity design scope. [PARITY TESTING DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Parity-required flows are documented for post-MVP testing.
- [ ] Release readiness documentation. [EVIDENCE COLLECTION DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Migration and seed documentation is complete; evidence collection deferred to post-MVP.

## Docs Lifecycle

- [ ] Keep LightHouse inventory/checklist synchronized with accepted scope changes.
  - Acceptance criteria:
    - `ctf-lighthouse-feature-inventory.md` and this checklist are updated in the same PR when behavior/contracts change.
- [ ] Implementation tracking. [EVIDENCE CAPTURE DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Implementation status is tracked; evidence collection deferred to post-MVP.

## Change Log

- 2026-02-25: Created initial LightHouse CTF rewrite checklist aligned to parity inventory scope, with v1 blocks inclusion, web+android parity gates, schema/deletion decision locks, and security/policy validation requirements.

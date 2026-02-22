# LightHouse Rewrite Checklist

## Scope & Decisions
- [ ] Confirm rewrite boundary is ctf-only; platform is reference-only and must not be copied module-for-module.
  - Acceptance criteria:
    - All implementation tasks target ctf packages/apps only.
    - No task requires editing platform runtime modules.
- [ ] Freeze v1 parity scope for LightHouse.
  - Acceptance criteria:
    - Included: profile CRUD, property browse/detail, host property CRUD, match lifecycle, announcements, admin stats/tables/mutations.
    - Excluded unless approved: redesign-only or net-new discovery features.
- [ ] Resolve canonical schema source-of-truth before migrations.
  - Acceptance criteria:
    - Shared schema and migration SQL definitions are aligned.
    - Drift items are tracked and closed before API implementation.
- [ ] Resolve blocks subsystem scope decision.
  - Acceptance criteria:
    - Blocks are explicitly either implemented for v1 or deferred with documented rationale.
    - If deferred, all dependent contracts/routes/UI references are clearly excluded.
- [ ] Resolve profile deletion semantics for host-linked records.
  - Acceptance criteria:
    - FK-safe behavior is defined for properties/matches on profile deletion.
    - User-facing messaging and audit expectations are specified.

## Phase Plan
- [ ] Phase 0: Contract alignment and open-decision closure.
  - Acceptance criteria:
    - Open decisions in this checklist are approved or deferred with owner/date.
    - Draft API + schema contracts are published for review.
- [ ] Phase 1: Shared schema and migration implementation.
  - Acceptance criteria:
    - Profiles/properties/matches/announcements (+blocks decision outcome) are represented in canonical schema.
    - Migrations replay successfully in local and CI workflows.
- [ ] Phase 2: API implementation and policy controls.
  - Acceptance criteria:
    - User and admin endpoints are implemented with role and CSRF controls.
    - Error semantics are deterministic and tested.
- [ ] Phase 3: Web implementation.
  - Acceptance criteria:
    - Dashboard/profile/browse/property/matches/announcements/admin flows are wired to ctf contracts.
    - Empty/loading/error states meet product acceptance.
- [ ] Phase 4: Mobile parity.
  - Acceptance criteria:
    - In-scope user/admin behaviors are implemented or explicitly excluded by decision.
    - Shared contracts are reused without client-specific API forks.
- [ ] Phase 5: Hardening and release.
  - Acceptance criteria:
    - Security/privacy tests, release gates, and rollback notes are complete.

## API Contract Tasks
- [ ] Define profile contracts (`GET/POST/PUT/DELETE`).
  - Acceptance criteria:
    - Seeker/host field differences and validation constraints are explicit.
    - Profile-type mutability rules are documented.
- [ ] Define property contracts for browse, detail, host list, and host CRUD.
  - Acceptance criteria:
    - Ownership and host-role enforcement are server-side and test-covered.
    - Property field validations and optionality are finalized.
- [ ] Define match contracts for create/list/update lifecycle.
  - Acceptance criteria:
    - Allowed status transitions by actor (seeker/host/admin) are documented.
    - Duplicate request prevention and conflict responses are deterministic.
- [ ] Define announcement contracts for user read and admin CRUD/deactivate.
  - Acceptance criteria:
    - Active/expiry filtering is server-enforced.
    - Type enum and metadata fields are stable across web/mobile.
- [ ] Define admin stats/list/update contracts.
  - Acceptance criteria:
    - Stats payload shape and table list projections are versioned.
    - Admin property/match mutations include validation and audit behavior.
- [ ] Define blocks contracts per scope decision (implement or explicitly defer).
  - Acceptance criteria:
    - If implemented: create/list/check/delete behavior is specified with auth/privacy controls.
    - If deferred: contract docs note absence and migration artifacts match decision.

## Web Tasks
- [ ] Implement dashboard with profile-exists branching and role-based CTAs.
  - Acceptance criteria:
    - No-profile onboarding and role-specific pathways are complete.
    - Announcement banner behavior matches contract.
- [ ] Implement profile page create/edit/delete flows.
  - Acceptance criteria:
    - Seeker/host conditional fields and validation states are complete.
    - Delete flow includes reason capture and clear post-delete routing.
- [ ] Implement property browse/detail and host management pages.
  - Acceptance criteria:
    - Host-only create/edit/delete is enforced via UX + backend policy.
    - Detail page correctly gates seeker match-request action.
- [ ] Implement matches page role-specific actions.
  - Acceptance criteria:
    - Status updates respect transition rules and actor permissions.
    - Request/response messages render safely and consistently.
- [ ] Implement admin surfaces for stats/tables/profile view/announcements.
  - Acceptance criteria:
    - Admin routes require role access and handle forbidden states.
    - Announcement create/edit/deactivate invalidates dependent queries.
- [ ] Implement blocks UX only if included in scope decision.
  - Acceptance criteria:
    - User-facing block actions and visibility effects are documented and testable.
    - If excluded, no stray navigation/control remains.

## Mobile Tasks
- [ ] Implement profile/property/match/announcement flows for mobile parity.
  - Acceptance criteria:
    - Behavior parity to web for in-scope flows is documented and validated.
- [ ] Implement admin mobile behavior per explicit scope decision.
  - Acceptance criteria:
    - If included, admin route and policy parity are verified.
    - If excluded, navigation and docs explicitly state exclusion.
- [ ] Implement blocks behavior per scope decision.
  - Acceptance criteria:
    - Implemented behavior mirrors web contract, or exclusion is explicit.

## Shared/Schema Tasks
- [ ] Finalize canonical shared schema for LightHouse entities.
  - Acceptance criteria:
    - Profile/property/match/announcement schemas compile and validate.
    - Blocks schema presence/absence matches approved scope decision.
- [ ] Reconcile shared schema vs SQL drift before migration freeze.
  - Acceptance criteria:
    - Nullability/type/table mismatches are resolved.
    - Migration review sign-off captured.
- [ ] Define deletion/anonymization strategy in schema + service layer.
  - Acceptance criteria:
    - FK-safe path is implemented and documented.
    - Historical records behavior aligns with product/legal decisions.
- [ ] Standardize DTOs for user/admin projections.
  - Acceptance criteria:
    - Admin-enriched views are separate from end-user DTOs.
    - No per-client schema forks for core entities.

## Security/Compliance Tasks
- [ ] Enforce auth on all LightHouse user routes.
  - Acceptance criteria:
    - Unauthenticated behavior is consistent and tested.
- [ ] Enforce admin-role + CSRF on admin writes.
  - Acceptance criteria:
    - Property/match/announcement admin mutations require both controls.
- [ ] Enforce ownership and role checks for property/match mutations.
  - Acceptance criteria:
    - Host ownership checks and seeker/host action boundaries are test-covered.
- [ ] Add/verify audit logging for sensitive admin mutations.
  - Acceptance criteria:
    - Logs include actor/action/target/timestamp metadata.
- [ ] Define blocks privacy/safety guardrails if blocks are in scope.
  - Acceptance criteria:
    - Blocked-relationship visibility and data handling are explicitly specified.

## Testing & Release Gates
- [ ] Contract tests for profile/property/match/announcement/admin endpoints.
  - Acceptance criteria:
    - Validation, authz, conflict, and not-found cases are covered.
- [ ] Web integration tests for key LightHouse flows.
  - Acceptance criteria:
    - Dashboard/profile/property/matches/admin scenarios pass with stable selectors.
- [ ] Mobile integration tests for in-scope flows.
  - Acceptance criteria:
    - Behavioral parity checks are documented and passing.
- [ ] Blocks test matrix per scope decision.
  - Acceptance criteria:
    - If implemented, block lifecycle and enforcement behaviors are tested.
    - If deferred, tests assert absence of block API/UI dependencies.
- [ ] Release readiness checklist.
  - Acceptance criteria:
    - Migration replay, seed validation, monitoring hooks, and rollback plan are complete.

## Open Decisions
- [ ] Canonical schema authority and migration generation source.
  - Acceptance criteria:
    - Owner and workflow are documented.
- [ ] Blocks v1 inclusion details.
  - Acceptance criteria:
    - Implementation/defer decision includes policy, API, UI, and data implications.
- [ ] Final profile deletion policy for host-linked matches/properties.
  - Acceptance criteria:
    - FK-safe data behavior and user-visible outcomes are approved.
- [ ] Admin/mobile scope boundary.
  - Acceptance criteria:
    - Mobile admin inclusion/exclusion is explicitly documented.

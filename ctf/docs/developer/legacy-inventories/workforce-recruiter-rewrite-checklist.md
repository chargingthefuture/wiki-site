# Workforce Recruiter Rewrite Checklist

## Scope & Decisions

- [ ] Confirm rewrite boundary is ctf-only; platform remains reference-only.
  - Acceptance criteria:
    - No implementation tasks require edits to `platform/`.
- [ ] Freeze v1 parity scope for Workforce Recruiter.
  - Acceptance criteria:
    - Included: profile/config/occupations/reports/export/announcements/admin management.
- [ ] Resolve schema source-of-truth drift.
  - Acceptance criteria:
    - Shared schema and migration SQL are aligned for all workforce recruiter entities.
- [ ] Resolve report semantics for “recruited” and related metrics.
  - Acceptance criteria:
    - Metric definitions are explicit and consistent across summary and drilldown endpoints.
- [ ] Resolve admin-route policy and CSRF consistency.
  - Acceptance criteria:
    - Admin page guarding and mutation policy are standardized.

## Phase Plan

- [ ] Phase 0: Contract lock and ambiguity resolution.
  - Acceptance criteria:
    - Open decisions are approved/deferred with owner/date.
- [ ] Phase 1: Shared schema and migration implementation.
  - Acceptance criteria:
    - Profiles/config/occupations/announcements models are migration-safe.
- [ ] Phase 2: API implementation.
  - Acceptance criteria:
    - Profile/config/occupation/report/export/announcement/admin endpoints are complete.
- [ ] Phase 3: Web + mobile implementation.
  - Acceptance criteria:
    - User/admin routes and workflows are wired to final contracts.
- [ ] Phase 4: Hardening and release.
  - Acceptance criteria:
    - Security/performance/tests/release gates are complete.

## API Contract Tasks

- [ ] Define profile contracts (`GET/POST/PUT/DELETE`).
  - Acceptance criteria:
    - Validation and deletion behavior are deterministic and documented.
- [ ] Define config contracts (`GET/PUT`).
  - Acceptance criteria:
    - Workforce assumptions fields and bounds are explicit.
- [ ] Define occupations contracts.
  - Acceptance criteria:
    - List filters, pagination, create/update/delete validation are stable.
- [ ] Define reports contracts.
  - Acceptance criteria:
    - Summary, skill-level detail, and sector detail use unified metric definitions.
- [ ] Define export contract.
  - Acceptance criteria:
    - Supported formats and payload schemas are versioned.
- [ ] Define announcements/admin contracts.
  - Acceptance criteria:
    - User read and admin CRUD/deactivate are explicit and policy-protected.

## Web Tasks

- [ ] Implement dashboard/reports flows.
  - Acceptance criteria:
    - Summary and drilldown views render consistent metrics.
- [ ] Implement profile flow.
  - Acceptance criteria:
    - Create/edit/delete behavior and post-action routing are complete.
- [ ] Implement occupations browse/detail/admin CRUD.
  - Acceptance criteria:
    - Admin create/edit/delete and list filtering/pagination are stable.
- [ ] Implement config and export UX.
  - Acceptance criteria:
    - Config update and export affordances map to final API contracts.
- [ ] Implement announcements/admin-announcements pages.
  - Acceptance criteria:
    - Query invalidation and active/inactive handling work predictably.

## Mobile Tasks

- [ ] Implement workforce recruiter user-flow parity on mobile.
  - Acceptance criteria:
    - Profile, occupations, reports, announcements parity is validated.
- [ ] Implement admin-mobile scope decision.
  - Acceptance criteria:
    - Admin inclusion/exclusion is explicit and enforced.
- [ ] Implement export behavior on mobile (if in scope).
  - Acceptance criteria:
    - Format handling and user download/share behavior are defined.

## Shared/Schema Tasks

- [ ] Finalize shared schema package for workforce recruiter.
  - Acceptance criteria:
    - Entities and validation match API and UI behavior.
- [ ] Resolve drift between SQL and shared schema artifacts.
  - Acceptance criteria:
    - Migration review sign-off captured.
- [ ] Normalize metric definitions in shared report contracts.
  - Acceptance criteria:
    - “Recruited,” target, and percent formulas are documented and testable.
- [ ] Define deterministic seed strategy for workforce recruiter datasets.
  - Acceptance criteria:
    - Seed repeatability policy is explicit for CI/dev/test modes.

## Security/Compliance Tasks

- [ ] Enforce auth and admin authorization across routes.
  - Acceptance criteria:
    - Unauthorized/forbidden responses are consistent and tested.
- [ ] Enforce CSRF policy for all admin writes.
  - Acceptance criteria:
    - Config/occupations/announcements writes follow one policy.
- [ ] Add/verify admin audit logging.
  - Acceptance criteria:
    - All sensitive admin mutations produce auditable events.
- [ ] Review export endpoint data exposure.
  - Acceptance criteria:
    - Export payload fields are approved by product/security.

## Testing & Release Gates

- [ ] Add contract tests for all API groups.
  - Acceptance criteria:
    - Validation/authz/not-found/conflict cases are covered.
- [ ] Add integration tests for reports and occupations data paths.
  - Acceptance criteria:
    - Metric calculations and pagination behavior are validated.
- [ ] Add robust E2E coverage with stable selectors.
  - Acceptance criteria:
    - Key user/admin flows run without skip-heavy assumptions.
- [ ] Add seed validation checks.
  - Acceptance criteria:
    - Seeded data quality and repeatability checks pass per environment policy.
- [ ] Release readiness checklist.
  - Acceptance criteria:
    - Migration replay, monitoring hooks, rollback plan complete.

## Open Decisions

- [ ] Canonical schema authority and migration path.
  - Acceptance criteria:
    - Owner and process are documented.
- [ ] Final metric definition for “recruited.”
  - Acceptance criteria:
    - Summary and drilldown semantics match exactly.
- [ ] Final CSRF/admin-route policy standard.
  - Acceptance criteria:
    - Policy is uniform across all admin mutation surfaces.

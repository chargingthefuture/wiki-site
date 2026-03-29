# Mood Rewrite Checklist

## Scope & Decisions

- [ ] Confirm rewrite boundary is ctf-only; platform is reference-only.
  - Acceptance criteria:
    - No implementation tasks require edits in `platform/`.
- [ ] Freeze v1 parity scope for Mood.
  - Acceptance criteria:
    - Included: mood check submit, 7-day eligibility, safety trigger messaging, announcements, admin announcement management.
    - Excluded unless approved: net-new analytics dashboards.
- [ ] Resolve announcement API contract mismatch.
  - Acceptance criteria:
    - User announcements page and admin announcements page each map to a valid, documented endpoint set.
    - No UI query points to undefined route paths.
- [ ] Resolve client admin-route guard policy.
  - Acceptance criteria:
    - Admin pages are wrapped with explicit admin route guard (not auth-only guard).
- [ ] Resolve privacy model language vs implementation details.
  - Acceptance criteria:
    - Client ID retention/logging posture is documented and approved.

## Phase Plan

- [ ] Phase 0: Contract lock and risk closure.
  - Acceptance criteria:
    - Open decisions are approved or deferred with owner/date.
- [ ] Phase 1: Shared schema and migration alignment.
  - Acceptance criteria:
    - Mood check and announcement schema definitions are migration-safe and replayable.
- [ ] Phase 2: API implementation.
  - Acceptance criteria:
    - Mood check, eligibility, and announcements/admin endpoints are complete and contract-tested.
- [ ] Phase 3: Web + mobile implementation.
  - Acceptance criteria:
    - User/admin Mood surfaces are wired to final contracts with parity across clients.
- [ ] Phase 4: Hardening and release.
  - Acceptance criteria:
    - Security, privacy, test, and seed gates are complete.

## API Contract Tasks

- [ ] Define mood check submit contract.
  - Acceptance criteria:
    - Request validates `clientId`, `moodValue`, and date handling.
    - Response includes explicit safety-message field semantics.
- [ ] Define eligibility contract.
  - Acceptance criteria:
    - 7-day gating rule is explicit and deterministic.
- [ ] Define user announcement read contract.
  - Acceptance criteria:
    - Active/non-expired filtering is server-enforced.
- [ ] Define admin announcement contracts.
  - Acceptance criteria:
    - List/create/update/deactivate endpoints are explicit and used consistently by clients.
- [ ] Define error semantics for invalid or missing client identity.
  - Acceptance criteria:
    - API responses are stable for validation and unauthorized/admin errors.

## Web Tasks

- [ ] Implement mood check page and dialog behavior.
  - Acceptance criteria:
    - Submit/eligibility/safety state transitions are accurate.
- [ ] Implement announcements page against final user endpoint.
  - Acceptance criteria:
    - No undefined endpoint usage remains.
- [ ] Implement admin landing and admin announcements pages.
  - Acceptance criteria:
    - Admin routes are guarded and forbidden states are handled.
- [ ] Standardize query keys and invalidation for mood announcements.
  - Acceptance criteria:
    - User/admin views refresh correctly after admin writes.

## Mobile Tasks

- [ ] Implement mood check parity on mobile.
  - Acceptance criteria:
    - Eligibility and submit behavior match web.
- [ ] Implement announcements parity on mobile.
  - Acceptance criteria:
    - User/admin visibility and filtering match web contracts.
- [ ] Implement admin-route policy on mobile.
  - Acceptance criteria:
    - Admin surfaces are either included with proper guardrails or explicitly excluded.

## Shared/Schema Tasks

- [ ] Finalize Mood shared schema package contracts.
  - Acceptance criteria:
    - Runtime validation and TypeScript types match route behavior.
- [ ] Define client identity handling policy.
  - Acceptance criteria:
    - Data retention and privacy expectations are documented with compliance sign-off.
- [ ] Ensure migration lineage for mood tables is explicit in ctf migration path.
  - Acceptance criteria:
    - Replayable migration artifacts exist and are reviewed.

## Security/Compliance Tasks

- [ ] Maintain rate limits for public mood submission.
  - Acceptance criteria:
    - Abuse controls are test-covered.
- [ ] Enforce admin + CSRF on announcement mutations.
  - Acceptance criteria:
    - All write routes reject missing/invalid CSRF/admin context.
- [ ] Align privacy copy with technical behavior.
  - Acceptance criteria:
    - Product/legal language reflects actual clientId and logging practices.

## Testing & Release Gates

- [ ] Add dedicated Mood API tests.
  - Acceptance criteria:
    - Submit/eligibility/announcement/admin paths covered.
- [ ] Add Mood E2E test coverage.
  - Acceptance criteria:
    - Core user path and admin announcement path covered with stable selectors.
- [ ] Add seed validation checks.
  - Acceptance criteria:
    - Mood seed executes in both standalone and master-seed workflows per final decision.
- [ ] Release checklist.
  - Acceptance criteria:
    - Monitoring, rollback, and migration validation notes complete.

## Open Decisions

- [ ] Final announcement route taxonomy (user/admin endpoints).
  - Acceptance criteria:
    - Final endpoint map is approved and implemented.
- [ ] Final admin route-guard strategy for Mood pages.
  - Acceptance criteria:
    - Guarding pattern matches platform standard.
- [ ] Final privacy/retention policy for mood client IDs and logs.
  - Acceptance criteria:
    - Policy is documented and testable.

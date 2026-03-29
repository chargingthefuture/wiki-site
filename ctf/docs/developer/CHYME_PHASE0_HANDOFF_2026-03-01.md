# Chyme Phase 0 Handoff (agent-00-chyme-core)

Date: 2026-03-01
Scope: `ctf/` only

## Start Gate Confirmation

Baseline gate satisfied: `ctf/docs/developer/BASELINE_HANDOFF_BF01_BF04.md` confirms BF-01 through BF-04 completion.

## Contract and Route Decisions

### Routes implemented

- `GET /api/chyme/room`
- `GET /api/chyme/messages`
- `POST /api/chyme/messages`
- `POST /api/chyme/join`
- `DELETE /api/account/chyme-profile`
- `DELETE /api/account/full-account`

### Policy decisions applied

- All Chyme APIs require Clerk-authenticated session.
- `approved_user_or_admin` policy gate enforced server-side.
- Username is canonical handle source, but Chyme allows fallback display names when username is missing.

### Audit decisions applied

- Allow/deny audit emission for room fetch, messages list/send, join, service deletion, and full-account deletion request.
- Message payload content is not logged in audit records.

## Migration and Schema Drift

### Migration

- `ctf/migrations/2026-03-01-chyme-core-phase0.sql`

### Schema drift compatibility notes

- Drift class impact: DB-Migration Drift, Contract Drift, Seed Drift (all addressed in same change set).
- Compatibility decision: compatible (contract version remains `1.0.0`; no breaking field removals).

## Seed and Deterministic Validation Notes

### Seed fixture script

- `ctf/scripts/seedChymePhase0.mjs`

### Deterministic fixture set

- Fixed room key: `chyme-main-room`
- Fixed seed users: `seed-chyme-user-001`, `seed-chyme-user-002`
- Fixed IDs for message and deletion-event fixtures to make reruns idempotent

## Validation Evidence

- Manual validation checklist updated in `ctf/docs/testing/CHYME_FIRST_TEST_PASS.md`.
- Rule 118 MVP exemption applied: automated tests are deferred; lint/type/build checks still expected for this package.

## Android Parity Status

- Android parity deferred.
- Owner: `mobile-phase2-chyme`
- Target milestone: `2026-04-15`
- Evidence recorded in checklist: `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-chyme-rewrite-checklist.md`

## Open Gaps and Debt

1. Full-account deletion remains request-recording only; global orchestrator dependency still open.
   - Owner recommendation: account-orchestration stream.
2. Chyme audit logs are emitted to application logs but not yet wired to an operational dashboard.
   - Owner recommendation: observability stream.
3. Web UI currently displays Stream join credential status but does not start in-browser audio session.
   - Owner recommendation: web-realtime stream in post-MVP phase.

# GentlePulse Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [ ] Confirm plugin identity and naming.
  - Acceptance criteria:
    - Rewrite artifacts use plugin slug `gentlepulse` in CTF folder naming.
- [ ] Confirm app-level ownership transfer for settings/accessibility.
  - Acceptance criteria:
    - GentlePulse plugin does not own `Settings and Accessibility Personalization` in CTF.
    - Ownership reference exists in `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-non-plugin-feature-inventory.md`.
- [ ] Confirm plugin announcements removal from GentlePulse scope.
  - Acceptance criteria:
    - No plugin-specific announcements routes/components are in GentlePulse parity scope.
    - App-wide Announcements/Feed ownership is referenced.
- [ ] Confirm no in-app GentlePulse admin UI.
  - Acceptance criteria:
    - No `/apps/gentlepulse/admin*` implementation tasks are required in this checklist.
- [ ] Confirm progress endpoint exclusion.
  - Acceptance criteria:
    - No `/api/gentlepulse/progress*` contract or implementation tasks are in scope.

## Phase 0 — Contracts and Scope Lock

- [ ] Lock authenticated API posture for GentlePulse routes.
  - Acceptance criteria:
    - Auth requirements are explicit for all GentlePulse endpoints.
- [ ] Lock retained user feature set.
  - Acceptance criteria:
    - Library listing/filtering/sorting, play tracking, ratings, favorites, and support page are listed as in-scope.
- [ ] Lock excluded feature set.
  - Acceptance criteria:
    - Exclusions include plugin settings/accessibility, plugin announcements, in-app admin surfaces, and progress endpoints.

## Phase 1 — Data and Migration Readiness

- [ ] Define migration approach from anonymous `clientId` to authenticated user model.
  - Acceptance criteria:
    - Backfill/cutover strategy is documented with rollback notes.
- [ ] Define rating/favorite uniqueness and aggregation constraints.
  - Acceptance criteria:
    - Storage constraints prevent duplicate user-meditation records where intended.
    - Aggregate rating derivation behavior is deterministic.
- [ ] Validate meditations schema parity.
  - Acceptance criteria:
    - Required fields and sorting/filtering indexes are documented.

## Phase 2 — API and Behavior Implementation Readiness

- [ ] Finalize API route map for in-scope features.
  - Acceptance criteria:
    - Meditations/play/ratings/favorites routes are versioned and documented.
- [ ] Add regression guard for excluded scopes.
  - Acceptance criteria:
    - Validation gate or lint/contract checks fail if excluded route groups are introduced.

## Phase 3 — Security and Compliance Gates

- [ ] Verify authz coverage for all GentlePulse writes.
  - Acceptance criteria:
    - All mutation endpoints enforce authentication and role/policy checks as required.
- [ ] Verify data minimization and privacy controls.
  - Acceptance criteria:
    - Logs and diagnostics exclude unnecessary sensitive request metadata.
- [ ] Verify cross-plugin policy consistency.
  - Acceptance criteria:
    - Exposed GentlePulse contracts align with approved shared deny/error taxonomy.

## Phase 4 — Web and Android Parity Gates

- [ ] Validate web/mobile parity for core user journeys.
  - Acceptance criteria:
    - Browse → play → rate → favorite behavior is equivalent across web and Android.
- [ ] Validate ownership boundary for settings/accessibility.
  - Acceptance criteria:
    - GentlePulse clients consume app-level settings contracts rather than plugin-local settings logic.

## Phase 5 — Validation, Seeds, and Release Evidence

- [ ] Validate API/integration behavior manually for retained feature scope.
  - Acceptance criteria:
    - Meditations, play count, ratings, and favorites are covered.
- [ ] Add deterministic seed fixtures for retained domain entities.
  - Acceptance criteria:
    - Meditation and interaction fixtures are deterministic, schema-compatible, and ready for local/dev manual validation.
- [ ] Include parity and scope evidence in PRs.
  - Acceptance criteria:
    - Each completed checklist item references implementation/validation/doc evidence.
    - CTF inventory + checklist are updated in same PR as feature-scope changes.

## Change Log

- 2026-02-25: Created initial GentlePulse CTF rewrite checklist with locked exclusions (plugin settings/accessibility, plugin announcements, in-app admin, progress endpoints) and authenticated-route baseline.
- 2026-02-25: Removed Mood integration tasks from GentlePulse rewrite checklist to preserve plugin separation.

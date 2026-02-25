# Skills Hunt Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [ ] Confirm plugin slug and command namespace lock.
  - Acceptance criteria:
    - Stable plugin slug is `skills-hunt` across docs/contracts/routes.
- [ ] Confirm Directory boundary semantics.
  - Acceptance criteria:
    - Only governed generation of unclaimed profiles is allowed; ownership lifecycle remains Directory-authoritative.

## Phase 0 — Contract Lock

- [ ] Define Skills Hunt plugin command contracts for v1.
  - Acceptance criteria:
    - Every command conforms to `.claude/rules/201-plugin-command-schema-template.mdc`.
- [ ] Define Skills Hunt access policy contracts for v1.
  - Acceptance criteria:
    - Every command has role, attribute, consent/lawful basis, region, and deny conditions under `.claude/rules/202-plugin-access-policy-schema-template.mdc`.
- [ ] Define Skills Hunt audit contracts for v1.
  - Acceptance criteria:
    - Every command has allow/deny + result audit coverage under `.claude/rules/203-plugin-audit-schema-template.mdc`.
- [ ] Verify command parity across command, access, and audit files.
  - Acceptance criteria:
    - Command set matches exactly across the three contract files.

## Phase 1 — Schema, Migrations, and Retention

- [ ] Define Skills Hunt domain schema and migrations in `ctf/migrations/`.
  - Acceptance criteria:
    - Round, submission, leaderboard, achievement, notification, reward-card, audit, and directory-profile entities are represented.
- [ ] Define retention behavior for moderation and reward entities.
  - Acceptance criteria:
    - Retention classes and deletion semantics are documented and policy-aligned.
- [ ] Prepare rollback/replay notes.
  - Acceptance criteria:
    - Replay and rollback steps are documented for PR evidence.

## Phase 2 — Core Contributor Flow

- [ ] Implement rounds list/get surfaces.
  - Acceptance criteria:
    - Users can discover active and upcoming rounds with deterministic ordering.
- [ ] Implement submission creation with validation.
  - Acceptance criteria:
    - `displayName`, `bio`, URL, skills, and professions enforce policy constraints.
- [ ] Enforce duplicate and rate-limit safeguards.
  - Acceptance criteria:
    - Duplicate signature blocking and rolling 7-day caps are enforced server-side.

## Phase 3 — Review and Scoring Flow

- [ ] Implement moderator/admin submission review actions.
  - Acceptance criteria:
    - Accept/reject/edit/flag actions persist deterministic outcomes and reviewer attribution.
- [ ] Implement scoring and points assignment logic.
  - Acceptance criteria:
    - Match, first-match, stack, rare-skill, and quality bonuses produce deterministic totals.
- [ ] Implement rejection-rate guardrails.
  - Acceptance criteria:
    - Guard thresholds prevent policy-violating contributor patterns.

## Phase 4 — Leaderboard, Rewards, and Notifications

- [ ] Implement leaderboard rebuild and retrieval.
  - Acceptance criteria:
    - Individual and team modes are available and rank deterministically.
- [ ] Implement achievements and notification surfaces.
  - Acceptance criteria:
    - Users can view achievements and mark notifications read.
- [ ] Implement feature reward card read/update.
  - Acceptance criteria:
    - Admin update path is audited and user read path is stable.

## Phase 5 — Directory Projection and Safety

- [ ] Implement governed unclaimed Directory profile generation.
  - Acceptance criteria:
    - Generated profile includes source linkage and invite attribution.
- [ ] Validate Directory ownership boundary.
  - Acceptance criteria:
    - Skills Hunt cannot claim ownership or bypass Directory policy controls.

## Phase 6 — Security, Compliance, and Deletion

- [ ] Verify authz, consent/lawful basis, and deny conditions.
  - Acceptance criteria:
    - All mutation commands enforce deny-by-default checks server-side.
- [ ] Verify audit integrity.
  - Acceptance criteria:
    - Allow and deny outcomes are append-only and carry request/trace correlation.
- [ ] Verify profile/deletion contract behavior.
  - Acceptance criteria:
    - Plugin deletion removes user-scoped plugin records while preserving required audit evidence and Directory ownership boundaries.

## Phase 7 — Validation, Seeds, and Release Gates

- [ ] Validate command schema behavior manually.
  - Acceptance criteria:
    - Unknown/invalid fields and enum/bounds violations are covered.
- [ ] Validate access policy and audit contract behavior manually.
  - Acceptance criteria:
    - Missing role/scope, invalid region, rate-limit, and policy-deny cases are covered.
- [ ] Validate scoring and leaderboard behavior manually.
  - Acceptance criteria:
    - Review transitions and leaderboard recompute outcomes are deterministic.
- [ ] Add seed fixtures for rounds/submissions/reviews.
  - Acceptance criteria:
    - Seed scenarios are reproducible via deterministic seed scripts/data for local/dev manual validation and CI.

## Open Decisions Tracker

- [ ] Final role model split between moderator and admin for review/edit powers.
- [ ] Final policy for admin-preapproved submitter pathways.
- [ ] Android parity target date and owners.

## Change Log

- 2026-02-24: Created initial Skills Hunt rewrite checklist with phase gates for contracts, validation, moderation scoring, leaderboard/reward workflows, directory-profile generation, security/compliance, and release readiness.

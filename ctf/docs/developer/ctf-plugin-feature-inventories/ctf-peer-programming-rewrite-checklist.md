# Peer Programming Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [ ] Confirm plugin slug and command namespace lock.
  - Acceptance criteria:
    - Stable plugin slug is `peer-programming` across docs/contracts/routes.
- [ ] Confirm MVP functional scope lock.
  - Acceptance criteria:
    - Weekly active-user selection (login within 7 days), 5-user cohorts, assignment notifications, fallback-open behavior, room UI, threaded async text, tiered participation, feedback loop, and admin topic guidance are all explicitly accepted.

## Phase 0 — Contract Lock

- [ ] Define plugin command contracts for v1.
  - Acceptance criteria:
    - Every command conforms to `.github/instructions/201-plugin-command-schema-template.mdc`.
- [ ] Define plugin access policy contracts for v1.
  - Acceptance criteria:
    - Every command has aligned role, attribute, consent/lawful basis, region, and deny conditions under `.github/instructions/202-plugin-access-policy-schema-template.mdc`.
- [ ] Define plugin audit contracts for v1.
  - Acceptance criteria:
    - Every command has allow/deny + result audit coverage under `.github/instructions/203-plugin-audit-schema-template.mdc`.
- [ ] Verify command parity across all three contract files.
  - Acceptance criteria:
    - Command set matches exactly across command, policy, and audit YAML.

## Phase 1 — Cohort Selection and Assignment

- [ ] Implement weekly active-user selection based on login recency.
  - Acceptance criteria:
    - Selection includes only users with login activity in the prior 7 days.
- [ ] Implement cohort formation rules.
  - Acceptance criteria:
    - Target cohort size is 5 users per cohort.
    - Partial cohort handling is deterministic and documented.
- [ ] Implement assignment notification flow.
  - Acceptance criteria:
    - In-app notification event is generated for each assigned member.
    - Notification retries are idempotent.

## Phase 2 — Room Experience and Persistence

- [ ] Implement cohort room state retrieval.
  - Acceptance criteria:
    - Room state includes active topic guidance, member summary, and fallback-open status.
- [ ] Implement async text-first thread posting.
  - Acceptance criteria:
    - Cohort members can create root posts.
- [ ] Implement threaded reply flow.
  - Acceptance criteria:
    - Replies are scoped to parent thread and ordered deterministically.
- [ ] Implement 24/7 persistence behavior.
  - Acceptance criteria:
    - Posts/replies remain available across reconnects and session restarts.

## Phase 3 — Fallback and Tiered Participation

- [ ] Implement fallback-open activation path.
  - Acceptance criteria:
    - Fallback-open mode activates when fewer than 2 cohort members show.
- [ ] Implement participation tier resolver.
  - Acceptance criteria:
    - Access behavior is enforced across cohort member, authenticated audience, and unauthenticated audience tiers.
- [ ] Validate tier-based action restrictions.
  - Acceptance criteria:
    - Non-cohort and unauthenticated users are blocked from unauthorized write actions.

## Phase 4 — Topic Guidance and Feedback Loop

- [ ] Implement admin weekly topic guidance set/get.
  - Acceptance criteria:
    - Topic guidance is scoped by week and available to room surfaces.
- [ ] Implement in-room feedback submit flow.
  - Acceptance criteria:
    - Feedback captures issue category and suggestion payload.
- [ ] Close iteration loop with review cadence.
  - Acceptance criteria:
    - Feedback summaries are reviewed weekly and linked to follow-up planning decisions.

## Phase 5 — Web-First Delivery and Android Follow-Up

- [ ] Deliver MVP web-first release for all core commands.
  - Acceptance criteria:
    - Weekly selection, assignment notifications, room state, posting, replies, tier resolution, fallback-open, feedback, and topic guidance all function on web.
- [ ] Create Android follow-up parity tracker.
  - Acceptance criteria:
    - Each deferred Android item has owner, target date, risk, and closure criteria.
- [ ] Verify cross-platform semantic parity for completed capabilities.
  - Acceptance criteria:
    - Completed Android items match web command outcomes and deny reason behavior.

## Phase 6 — Security, Audit, and Release Gates [MVP: VALIDATION DEFERRED — see Rule 118.]

- [ ] Policy deny-by-default posture design.
  - Acceptance criteria:
    - All commands document expected deny conditions for missing role/scope/tenancy or tier mismatch.
- [ ] Audit integrity design.
  - Acceptance criteria:
    - Allow and deny outcomes are documented with request/trace correlation requirements for each command.
- [ ] Contract and integration design documentation. [MANUAL TESTING DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Command schema and policy/audit behavior requirements are documented.
- [ ] Inventory and checklist synchronization.
  - Acceptance criteria:
    - Feature inventory + checklist are updated in same PR as scope or contract changes.

## Open Decisions Tracker

- [ ] Final fallback-open "show" detection signals (presence heartbeat vs message activity).
- [ ] Strategy for users left unassigned in low-activity weeks.
- [ ] Final Android parity deadline and release owner.

## Change Log

- 2026-02-24: Initial Peer Programming rewrite checklist created with MVP feature gates, web-first release path, and Android follow-up parity tracking requirements.

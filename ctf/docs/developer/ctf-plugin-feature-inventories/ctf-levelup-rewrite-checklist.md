# LevelUp Rewrite Checklist (CTF)

## Scope and Boundary

- [x] Confirm implementation scope is `ctf/` only.
- [x] Confirm plugin slug and route namespace (`levelup`).
- [x] Confirm no Prisma usage; SQL migration + repository pattern only.

## Phase 1 - Schema and Registry

- [x] Add core migration for LevelUp domain tables.
- [x] Add plugin registry availability entry for `levelup`.
- [x] Add baseline policy config (`starter_credits`, split defaults).

## Phase 2 - Repository and Business Rules

- [x] Implement cohort creation/list/detail repository methods.
- [x] Implement enrollment and escrow allocation logic with idempotency.
- [x] Implement milestone validation and release settlement.
- [x] Implement dispute open/resolve and admin adjust credit flows.
- [x] Implement persisted DB rate-limit counters for enroll/validate.

## Phase 3 - API Surface

- [x] Implement route helpers for authz, CSRF, and error mapping.
- [x] Add zod validation to LevelUp mutation/query handlers.
- [x] Add routes for cohorts, enrollments, milestones, transfers, disputes, admin adjustment.

## Phase 4 - Web UI Shell

- [x] Add `LevelupShell` under plugin app route.
- [x] Add `CohortList`, `CohortDetail`, `EnrollModal` components.
- [x] Add `UserDashboard`, `TrainerDashboard`, `AdminPanel` components.
- [x] Add `/admin/levelup` page.

## Phase 5 - Contracts and Inventory

- [x] Add command contracts file.
- [x] Add access policy contracts file.
- [x] Add audit contracts file.
- [x] Add plugin feature inventory file.
- [x] Add rewrite checklist file.

## Phase 6 - Seed and Release Readiness

- [x] Add deterministic seed script for sample users/cohort/milestones.
- [ ] Android parity implementation (follow-up required before GA).
  - Ticket: `PARITY-LEVELUP-ANDROID-001` (placeholder)
  - Owner: Mobile plugin parity owner (TBD)
  - Deadline: Before LevelUp GA release
  - Risk note: Web-only critical training flow until parity closes
- [x] Observability KPI finalization for non-placeholder admin metrics.

## MVP Testing Note

- [x] Automated test suites deferred for MVP per Rule 118.

## Change Log

- 2026-03-24: Initial checklist created and baseline implementation items marked.

# Directory Plugin Feature Inventory (CTF Rewrite)

## Scope and Boundary

- Rewrite target only: `ctf/`
- Legacy `platform/` is reference-only and must not be modified.
- Unified plugin scope slug: `directory`
- This document is a planning inventory (not implementation evidence yet).
- Directory rewrite uses one unified UI surface for both user-facing and admin flows, with role-gated controls on the same page/surface.

Legacy reference preservation:

- Keep `ctf/docs/developer/directory-feature-inventory.md` as legacy reference.
- Keep `ctf/docs/developer/directory-admin-feature-inventory.md` as legacy historical reference.
- Legacy admin inventory content remains untouched and is not a rewrite execution artifact.
- This document is the authoritative rewrite planning source for Directory user + admin behavior.

## Intent and Outcome

Directory in CTF is planned as a deterministic profile-and-discovery plugin with one combined user/admin UI surface, server-enforced policy controls, and parity-safe delivery across web and Android.

Decision locks for rewrite planning:

1. Combined user/admin UI page in rewrite is mandatory.
2. Android admin parity is required in v1 and is not deferred.
3. Post-create public URL behavior remains display-only parity in v1.

## Planned User Features

1. Authenticated dashboard/profile experience for create, update, and delete profile operations.
2. Directory list and profile discovery experience for authenticated users.
3. Public profile controls (`isPublic`) and deterministic profile visibility outcomes.
4. Public directory projection routes for unauthenticated list/detail consumption.
5. Announcement consumption in user-visible contexts.
6. Deterministic validation limits for description, selectors, and URL fields.

## Planned Admin Features (same page role-gated controls)

1. Admin controls are embedded in the same Directory UI surface and hidden for non-admin users.
2. Admin profile list, create, update, assign, and unclaimed-only delete flows.
3. Admin announcement list/create/update/deactivate flows.
4. Admin skills compatibility and selector governance operations.
5. Claimed/unclaimed guardrails are preserved as hard policy constraints.
6. Post-create public URL behavior for admin profile creation remains display-only in v1.

## Unified UI Information Architecture

1. Single Directory plugin route surface hosts both user and admin workflows.
2. User sections are always available to authenticated users.
3. Admin sections render only for authorized admin roles.
4. Unauthorized users must not discover admin action controls in normal UI paths.
5. Frontend hiding is presentation-only; server authorization remains the source of truth.
6. Public routes remain separate projection endpoints for unauthenticated consumption.

## API Surface and Route Map (planned)

Planned route families:

- User/authenticated:
  - `GET /api/directory/profile`
  - `POST /api/directory/profile`
  - `PUT /api/directory/profile`
  - `DELETE /api/directory/profile`
  - `GET /api/directory/list`
  - `GET /api/directory/skills`
  - `GET /api/directory/sectors`
  - `GET /api/directory/job-titles`
  - `GET /api/directory/announcements`
- Public:
  - `GET /api/directory/public`
  - `GET /api/directory/public/:id`
- Admin (same plugin policy boundary):
  - `GET /api/directory/admin/profiles`
  - `POST /api/directory/admin/profiles`
  - `PUT /api/directory/admin/profiles/:id`
  - `PUT /api/directory/admin/profiles/:id/assign`
  - `DELETE /api/directory/admin/profiles/:id`
  - `GET /api/directory/admin/skills`
  - `GET /api/directory/admin/announcements`
  - `POST /api/directory/admin/announcements`
  - `PUT /api/directory/admin/announcements/:id`
  - `DELETE /api/directory/admin/announcements/:id`

Route ownership policy (planned):

1. Directory announcement routes are owned by Directory rewrite boundaries.
2. Route ownership must be explicit and enforceable per module boundaries.

## Data Model and Storage Contracts (planned)

1. `directory_profiles` remains canonical for Directory profile records.
2. `directory_announcements` remains canonical for Directory announcement records.
3. Shared skills hierarchy remains source for selector-backed taxonomy data.
4. Profile contracts preserve claimed/unclaimed state and assignment constraints.
5. Public projection contracts preserve privacy-filtered output shape.
6. Audit storage contracts capture sensitive admin mutation outcomes.
7. Seed contracts remain deterministic across local/dev environments.

## Security, Privacy, and Compliance Controls

1. Frontend hiding of admin controls is presentation-only and is never treated as authorization.
2. Server-side authorization is required on every admin endpoint.
3. CSRF protection is required on every admin write endpoint.
4. Audit logging is required for admin write attempts (allow and deny outcomes).
5. Claimed/unclaimed mutation guardrails are enforced server-side.
6. Public projection returns privacy-minimized fields only.
7. Public endpoints enforce anti-scraping controls and rate-limited access.

## Web and Android Delivery Strategy

1. Directory rewrite ships with web + Android user parity in v1.
2. Directory rewrite ships with web + Android admin parity in v1.
3. Android admin parity is a release gate and not a post-v1 deferment.
4. Server policy outcomes and deny taxonomy are identical for web and Android clients.
5. Unified UI contract governs both clients, with platform-specific presentation only.

## Seed Coverage Status (Planned)

Seed script requirement: Provide a deterministic plugin seed script with dummy development data for manual plugin validation in dev environments.

## Open Decisions, Ambiguities, and Migration Risks

Resolved for Prompt 02 implementation (2026-03-02):

1. Authenticated list behavior when no own profile exists: return `404` with `DIRECTORY_OWN_PROFILE_REQUIRED`.
2. Admin list pagination model: offset pagination (`page`, `pageSize`).
3. Claimed/unclaimed delete guardrail: admin delete is allowed only when `claimed_by_user_id IS NULL`; claimed rows return `409` policy deny.

### A) User-facing decisions/questions to answer

1. Confirm final authenticated list behavior when no profile exists (empty-state CTA and visibility semantics).
2. Confirm exact v1 public URL display wording and placement across dashboard/profile states.
3. Confirm final user-facing behavior for announcement expiration edge cases.

### B) Admin decisions/questions to answer

1. Confirm final admin skills compatibility strategy when shared skill deletions affect historical profile data.
2. Confirm final admin list pagination/search model and performance thresholds.
3. Confirm final assignment wording and validation outcomes for claimed/unclaimed transitions.
4. Confirm final admin toast/message contract for post-create public URL display-only parity.

### C) Migration risks

1. Route ownership drift risk for announcement APIs if module boundaries are not explicitly enforced.
2. Policy drift risk for claimed/unclaimed guardrails during migration.
3. Privacy regression risk if public projection fields diverge from legacy constraints.
4. Seed/schema drift risk if deterministic fixtures are not validated in CI.
5. Client parity risk if Android admin features are treated as optional.

## Delivery Phasing (plan)

1. Phase 0: Decision lock for UI contract, route ownership, and policy constraints.
2. Phase 1: Contract-first implementation for API routes, authz, CSRF, and audit events.
3. Phase 2: Unified UI implementation with role-gated controls on one Directory surface.
4. Phase 3: Web + Android parity completion for user and admin flows.
5. Phase 4: Security/privacy/non-regression gates and seed consistency validation.
6. Phase 5: Release readiness evidence and lifecycle documentation updates.

## Change Log

- 2026-02-25: Created initial unified Directory CTF rewrite inventory merging user and admin flows into one planned UI surface; locked v1 decisions for combined UI, Android admin parity, and display-only post-create public URL behavior.
- 2026-03-02: Implemented Prompt 02 phase-0 backend and unified web surface (user/admin role-gated sections), with resolved list/pagination/claimed-delete decisions and migration-backed API contracts.

# Directory Core Handoff (Agent 02)

Date: 2026-03-02  
Scope: `ctf/` only (web/API + migration + seed; Android parity tracked as phase follow-up)

## Clarifying questions asked and answers received

1. `GET /api/directory/list` behavior when signed-in user has no profile?
   - Answer: return `404` until profile exists.
2. Admin list pagination model?
   - Answer: offset pagination (`page`, `pageSize`).
3. Claimed/unclaimed delete guardrail?
   - Answer: delete allowed only when `claimed_by_user_id IS NULL`; claimed delete returns deny.

## Delivered core scope

1. Implemented migration-backed Directory schema and projection view:
   - `directory_user_extension`, `directory_profiles`, `directory_profile_skills`, `directory_profile_tags`,
   - `directory_announcements`, `directory_profile_change_events`, `directory_deletion_events`,
   - `directory_public_projection` view.
2. Implemented user/authenticated routes:
   - `GET/POST/PUT/DELETE /api/directory/profile`
   - `GET /api/directory/list` (returns `404` + `DIRECTORY_OWN_PROFILE_REQUIRED` when no own profile)
   - selector routes: `GET /api/directory/sectors|job-titles|skills`
   - `GET /api/directory/announcements`
3. Implemented public projection routes:
   - `GET /api/directory/public`
   - `GET /api/directory/public/:id`
4. Implemented admin role-gated routes:
   - `GET/POST /api/directory/admin/profiles`
   - `PUT/DELETE /api/directory/admin/profiles/:id`
   - `PUT /api/directory/admin/profiles/:id/assign`
   - `GET /api/directory/admin/skills`
   - `GET/POST /api/directory/admin/announcements`
   - `PUT/DELETE /api/directory/admin/announcements/:id`
5. Implemented policy and security controls:
   - server-side admin role enforcement,
   - CSRF enforcement on admin write routes (`x-ctf-csrf: 1` + same-origin host check),
   - claimed/unclaimed delete guard returning `409` for claimed profiles.
6. Implemented audit logging:
   - structured `directory.audit` logs for allow/deny outcomes on critical profile mutations.
7. Implemented unified plugin surface:
   - `/plugin?plugin=directory` now renders a unified Directory shell with role-gated admin section.
8. Added deterministic seed script:
   - `ctf/scripts/seedDirectoryPhase0.mjs`
   - script command: `pnpm seed:directory`.

## Changed files

- `ctf/migrations/2026-03-02-directory-core-phase0.sql`
- `ctf/scripts/seedDirectoryPhase0.mjs`
- `ctf/package.json`
- `ctf/packages/web/src/lib/directory/constants.ts`
- `ctf/packages/web/src/lib/directory/types.ts`
- `ctf/packages/web/src/lib/directory/audit.ts`
- `ctf/packages/web/src/lib/directory/policy.ts`
- `ctf/packages/web/src/lib/directory/repository.ts`
- `ctf/packages/web/src/app/api/directory/_lib.ts`
- `ctf/packages/web/src/app/api/directory/profile/route.ts`
- `ctf/packages/web/src/app/api/directory/list/route.ts`
- `ctf/packages/web/src/app/api/directory/sectors/route.ts`
- `ctf/packages/web/src/app/api/directory/job-titles/route.ts`
- `ctf/packages/web/src/app/api/directory/skills/route.ts`
- `ctf/packages/web/src/app/api/directory/announcements/route.ts`
- `ctf/packages/web/src/app/api/directory/public/route.ts`
- `ctf/packages/web/src/app/api/directory/public/[id]/route.ts`
- `ctf/packages/web/src/app/api/directory/admin/profiles/route.ts`
- `ctf/packages/web/src/app/api/directory/admin/profiles/[id]/route.ts`
- `ctf/packages/web/src/app/api/directory/admin/profiles/[id]/assign/route.ts`
- `ctf/packages/web/src/app/api/directory/admin/skills/route.ts`
- `ctf/packages/web/src/app/api/directory/admin/announcements/route.ts`
- `ctf/packages/web/src/app/api/directory/admin/announcements/[id]/route.ts`
- `ctf/packages/web/src/components/directory/directory-shell.tsx`
- `ctf/packages/web/src/app/plugin/page.tsx`
- `ctf/docs/contracts/DIRECTORY_PLUGIN_COMMAND_CONTRACTS.yaml`
- `ctf/docs/contracts/DIRECTORY_PLUGIN_ACCESS_POLICY_CONTRACTS.yaml`
- `ctf/docs/contracts/DIRECTORY_PLUGIN_AUDIT_CONTRACTS.yaml`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-directory-feature-inventory.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-directory-rewrite-checklist.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-plugin-agent-assignment-matrix.md`
- `ctf/docs/developer/DIRECTORY_CORE_HANDOFF_AGENT02.md`

## Validation evidence

- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.

## Selector compatibility notes with skills-taxonomy

1. Directory profile writes validate selector IDs against active taxonomy records.
2. Directory selector APIs (`/sectors`, `/job-titles`, `/skills`) read from `skills_taxonomy_*` tables.
3. Admin compatibility route (`/api/directory/admin/skills`) returns selector counts and source lists for integration sanity checks.

## Unresolved policy/parity items

1. Android Directory admin parity remains open for phase tracking.
   - Owner recommendation: `directory-android-parity`
   - Target: 2026-04-15
2. Public anti-scraping runtime throttling implementation remains deferred (documented contract gate only in this pass).
   - Owner recommendation: `platform-api-guardrails`
   - Target: 2026-03-29

## Completion recommendation

- **complete** for `agent-02-directory-core` phase-0 web/backend scope.

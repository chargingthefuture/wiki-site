# Skills Taxonomy Core Handoff (Agent 01)

Date: 2026-03-02  
Scope: `ctf/` only (web/API + migration + safeguards + seed; Android parity deferred)

## Clarifying questions asked and answers received

1. Scope depth now?
   - Answer: web/API + migration + seed now; Android parity deferred with owner/date.
2. Destructive policy in this pass?
   - Answer: block delete when any children/dependencies exist.
3. Dependency-impact preview external source?
   - Answer: return taxonomy-internal counts now and mark external dependency counts as pending.
4. Validation depth?
   - Answer: run existing web checks only.

## Delivered core scope

1. Implemented migration-backed taxonomy entities and projections:
   - sectors, job titles, skills,
   - consumer bindings, dependency graph view, flattened projection view,
   - change/deletion and extension support tables.
2. Implemented consumer and admin read routes:
   - `GET /api/skills-taxonomy/hierarchy`
   - `GET /api/skills-taxonomy/flattened`
   - `GET /api/skills-taxonomy/admin/hierarchy`
   - `GET /api/skills-taxonomy/admin/flattened`
3. Implemented admin CRUD routes:
   - sectors: list/get/create/update/delete
   - job titles: list/get/create/update/delete
   - skills: list/get/create/update/delete
4. Implemented dependency-impact preview:
   - `GET /api/skills-taxonomy/admin/dependency-impact?targetType=&targetId=`
   - returns internal child/dependency counts, known external binding counts, and `external.pending=true`.
5. Implemented destructive safeguards:
   - delete requires reason,
   - delete denied with `409` when child/dependency thresholds fail.
6. Implemented policy and audit runtime controls:
   - admin role enforcement (`admin` or `taxonomy_admin`),
   - approved-user/admin read gating,
   - mutation CSRF protection (`x-ctf-csrf: 1` + same-origin host check when origin metadata is present),
   - structured audit logging for read/mutation/dependency commands.
7. Added deterministic seed fixtures:
   - `ctf/scripts/seedSkillsTaxonomyPhase0.mjs` now performs one-time backfill from legacy source data.
   - `ctf/scripts/syncSkillsTaxonomyFromPlatform.mjs` performs repeat incremental sync from legacy source data.

## Changed files

- `ctf/migrations/2026-03-02-skills-taxonomy-core-phase0.sql`
- `ctf/scripts/seedSkillsTaxonomyPhase0.mjs`
- `ctf/scripts/syncSkillsTaxonomyFromPlatform.mjs`
- `ctf/scripts/lib/loadLegacySkillsData.mjs`
- `ctf/scripts/lib/syncSkillsTaxonomyFromLegacy.mjs`
- `ctf/packages/web/src/lib/skills-taxonomy/constants.ts`
- `ctf/packages/web/src/lib/skills-taxonomy/types.ts`
- `ctf/packages/web/src/lib/skills-taxonomy/audit.ts`
- `ctf/packages/web/src/lib/skills-taxonomy/policy.ts`
- `ctf/packages/web/src/lib/skills-taxonomy/repository.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/_lib.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/hierarchy/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/flattened/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/admin/hierarchy/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/admin/flattened/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/admin/dependency-impact/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/admin/sectors/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/admin/sectors/[id]/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/admin/job-titles/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/admin/job-titles/[id]/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/admin/skills/route.ts`
- `ctf/packages/web/src/app/api/skills-taxonomy/admin/skills/[id]/route.ts`
- `ctf/packages/web/eslint.config.mjs`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-skills-taxonomy-rewrite-checklist.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-skills-taxonomy-feature-inventory.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-plugin-agent-assignment-matrix.md`
- `ctf/docs/developer/SKILLS_TAXONOMY_CORE_HANDOFF_AGENT01.md`

## Validation evidence

- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.

## Compatibility notes for Directory and Workforce consumers

1. `GET /api/skills-taxonomy/hierarchy` and `GET /api/skills-taxonomy/flattened` are stable read-model entry points for consumers.
2. Flattened projection includes canonical cross-level IDs (`sectorId`, `jobTitleId`, `skillId`) for deterministic selector integration.
3. Delete safeguards now enforce strict internal dependency checks and known binding count checks; consumers should register binding references in `skills_taxonomy_consumer_bindings` before enabling destructive admin flows.
4. Canonical source ingestion for Option B is now mapped from `platform/scripts/data/skills-data.ts` into plugin-owned tables under `ctf/`.

## Open gaps / debt with owner recommendation

1. Web admin taxonomy UX surface (hierarchy browser + CRUD controls) is not yet delivered.
   - Owner: `taxonomy-web-admin-phase1`
   - Target milestone: 2026-03-22
   - Next action: implement admin UI over delivered routes and include dependency warning UX.
2. Android read-model parity for dependent apps remains deferred.
   - Owner: `taxonomy-android-read-parity`
   - Target milestone: 2026-04-15
   - Next action: integrate taxonomy hierarchy/flattened endpoints in Android selector surfaces with parity checks.
3. External dependency adapters beyond seeded binding records remain pending.
   - Owner: Platform Ops + plugin owners (`directory`, `workforce`)
   - Target date: 2026-03-29
   - Next action: wire runtime consumer binding writes and validate destructive guardrail behavior in integrated environments.

## Completion recommendation

- **complete** for `agent-01-taxonomy-core` Phase-0 backend scope.

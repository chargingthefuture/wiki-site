# Workforce Core Handoff (Agent 04)

Date: 2026-03-03
Scope: `ctf/` only (web/API + migration + seed + contracts + metric alignment)

## Clarifying questions asked and answers received

1. Delivery slice for first pass?
   - Answer: full prompt scope now.
2. Export workflow mode?
   - Answer: defer export implementation.
3. Web/mobile parity handling?
   - Answer: web-first with explicit mobile deferment.
4. Default blocked-by owner label?
   - Answer: `platform-architecture`.

## Gate status before start

- `agent-03-feed-announcements` completion was reconciled before dispatch:
  - handoff artifact `ctf/docs/developer/FEED_ANNOUNCEMENTS_CORE_HANDOFF_AGENT03.md` reports complete,
  - assignment matrix marks `agent-03-feed-announcements` as `Done` with handoff received.
- `agent-04-workforce` status moved to `In progress` in assignment tracker.
- Closeout reconciliation: `agent-04-workforce` status is `Done` with handoff received.

## Delivered scope

1. Workforce migration-backed storage and derivation model:
   - added `ctf/migrations/2026-03-03-workforce-core-phase1.sql`.
   - includes `workforce_profiles`, `workforce_user_extension`, `workforce_occupations`, `workforce_announcements`, `workforce_config`, `workforce_recruited_events`, `workforce_report_snapshots`, `workforce_export_jobs`, `workforce_admin_audit_trail`.
   - deterministic recruited dedupe via unique `inference_dedupe_key`.

2. Workforce plugin domain implementation under web package:
   - created repository/policy/audit/types/constants in `ctf/packages/web/src/lib/workforce/`.
   - implemented dashboard/report/profile/occupation/announcement/config/recompute/export-job APIs.

3. API routes delivered:
   - User routes:
     - `GET /api/workforce/dashboard`
     - `GET|POST|PUT|DELETE /api/workforce/profile`
     - `GET /api/workforce/occupations`
     - `GET /api/workforce/occupations/:id`
     - `GET /api/workforce/announcements`
     - `GET /api/workforce/reports/summary`
     - `GET /api/workforce/reports/skill-level/:skillLevel`
     - `GET /api/workforce/reports/sector/:sector`
   - Admin routes:
     - `GET|PUT /api/workforce/admin/config`
     - `GET|POST /api/workforce/admin/occupations`
     - `PUT|DELETE /api/workforce/admin/occupations/:id`
     - `GET|POST /api/workforce/admin/announcements`
     - `PUT|DELETE /api/workforce/admin/announcements/:id`
     - `POST /api/workforce/admin/recompute`
     - `GET /api/workforce/admin/audit-events`
   - Export routes (deferred behavior with persisted deferred jobs):
     - `POST /api/workforce/export/jobs` returns deferred response + recorded job
     - `GET /api/workforce/export/jobs/:jobId`
     - `GET /api/workforce/export/jobs/:jobId/result` returns deferred response

4. UI/admin surfaces:
   - `ctf/packages/web/src/components/workforce/workforce-shell.tsx`
   - plugin route integration for `workforce` in `ctf/packages/web/src/app/plugin/page.tsx`
   - admin summary page `ctf/packages/web/src/app/admin/workforce/page.tsx`

5. Contract and metric updates:
   - updated workforce command/access/audit contracts:
     - `ctf/docs/contracts/WORKFORCE_PLUGIN_COMMAND_CONTRACTS.yaml`
     - `ctf/docs/contracts/WORKFORCE_PLUGIN_ACCESS_POLICY_CONTRACTS.yaml`
     - `ctf/docs/contracts/WORKFORCE_PLUGIN_AUDIT_CONTRACTS.yaml`
   - updated profile/deletion contract:
     - `ctf/docs/contracts/WORKFORCE_PROFILE_AND_DELETION_CONTRACT.md`
   - aligned canonical metric SQL/inputs for recruited metric:
     - `ctf/config/canonical_metrics.yaml` (`workforce_recruited_current_count`)

6. Seed + scripts:
   - added deterministic seed script: `ctf/scripts/seedWorkforcePhase1.mjs`
   - updated scripts in `ctf/package.json`:
     - `seed:workforce`
     - `migrate:workforce:phase1`

## Directory dependency assumptions

1. Recruited-state derivation source is `directory_profiles` where `claimed_by_user_id IS NOT NULL`.
2. Recompute route derives inferred events from Directory state (no manual direct recruited-event write payload exposed to end users).
3. Current implementation performs derivation via Workforce-side recompute pass and deterministic dedupe while reading Directory source-of-truth rows; no cross-plugin write coupling is required.

## Validation evidence

1. Build/type validation (web package):
   - command: `corepack pnpm build`
   - result: success (all routes compile + type-check passes).
2. Schema drift gate:
   - command: `bash /workspaces/chargingthefuture/ctf/scripts/check-schema-drift.sh --all`
   - result: passed.

## Remaining open compliance/metric decisions

1. Export execution remains explicitly deferred by decision; only deferred job recording/status is implemented.
   - owner: `platform-architecture`
   - target date recommendation: 2026-03-14
2. Automated Workforce-side recompute scheduling/on-change triggering was previously open; incremental sync baseline is now implemented via cursor-backed delta processing and internal tokenized endpoint.
   - owner: `platform-architecture`
   - status: closed in follow-up incremental sync pass (2026-03-03)
3. Legal-basis and retention sign-off for workforce export payload classes still needed before enabling export execution.
   - owner: `platform-architecture`
   - target date recommendation: 2026-03-14

## Changed files

- `ctf/README.md`
- `ctf/package.json`
- `ctf/config/canonical_metrics.yaml`
- `ctf/migrations/2026-03-03-workforce-core-phase1.sql`
- `ctf/scripts/seedWorkforcePhase1.mjs`
- `ctf/packages/web/src/app/plugin/page.tsx`
- `ctf/packages/web/src/app/admin/workforce/page.tsx`
- `ctf/packages/web/src/components/workforce/workforce-shell.tsx`
- `ctf/packages/web/src/lib/workforce/constants.ts`
- `ctf/packages/web/src/lib/workforce/types.ts`
- `ctf/packages/web/src/lib/workforce/policy.ts`
- `ctf/packages/web/src/lib/workforce/audit.ts`
- `ctf/packages/web/src/lib/workforce/repository.ts`
- `ctf/packages/web/src/app/api/workforce/_lib.ts`
- `ctf/packages/web/src/app/api/workforce/dashboard/route.ts`
- `ctf/packages/web/src/app/api/workforce/profile/route.ts`
- `ctf/packages/web/src/app/api/workforce/occupations/route.ts`
- `ctf/packages/web/src/app/api/workforce/occupations/[id]/route.ts`
- `ctf/packages/web/src/app/api/workforce/announcements/route.ts`
- `ctf/packages/web/src/app/api/workforce/reports/summary/route.ts`
- `ctf/packages/web/src/app/api/workforce/reports/skill-level/[skillLevel]/route.ts`
- `ctf/packages/web/src/app/api/workforce/reports/sector/[sector]/route.ts`
- `ctf/packages/web/src/app/api/workforce/admin/config/route.ts`
- `ctf/packages/web/src/app/api/workforce/admin/occupations/route.ts`
- `ctf/packages/web/src/app/api/workforce/admin/occupations/[id]/route.ts`
- `ctf/packages/web/src/app/api/workforce/admin/announcements/route.ts`
- `ctf/packages/web/src/app/api/workforce/admin/announcements/[id]/route.ts`
- `ctf/packages/web/src/app/api/workforce/admin/recompute/route.ts`
- `ctf/packages/web/src/app/api/workforce/admin/audit-events/route.ts`
- `ctf/packages/web/src/app/api/workforce/export/jobs/route.ts`
- `ctf/packages/web/src/app/api/workforce/export/jobs/[jobId]/route.ts`
- `ctf/packages/web/src/app/api/workforce/export/jobs/[jobId]/result/route.ts`
- `ctf/docs/contracts/WORKFORCE_PLUGIN_COMMAND_CONTRACTS.yaml`
- `ctf/docs/contracts/WORKFORCE_PLUGIN_ACCESS_POLICY_CONTRACTS.yaml`
- `ctf/docs/contracts/WORKFORCE_PLUGIN_AUDIT_CONTRACTS.yaml`
- `ctf/docs/contracts/WORKFORCE_PROFILE_AND_DELETION_CONTRACT.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-workforce-feature-inventory.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-workforce-rewrite-checklist.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-plugin-agent-assignment-matrix.md`
- `ctf/docs/developer/WORKFORCE_CORE_HANDOFF_AGENT04.md`

# Skills Hunt Core Handoff (Agent 05)

Date: 2026-03-03
Scope: `ctf/` only (web/API + migration + seed + contracts + docs)

## Clarifying questions asked and answers received

1. Delivery slice for this pass?
   - Answer: full prompt scope now.
2. Review role model for moderation actions?
   - Answer: moderator + admin.
3. Admin-preapproved submitter pathway in v1?
   - Answer: disabled in v1.
4. Directory projection generation mode?
   - Answer: support both explicit admin/moderator action and auto-on-accept.

## Gate status before start

- Phase dependency assumptions were treated as satisfied from prior completed Directory baseline and policy contract work.
- Status reconciliation performed after implementation:
  - `agent-04-workforce` updated to `Done` with handoff received.
  - `agent-05-skills-hunt` updated to `Done` with handoff received.

## Delivered scope

1. Skills Hunt migration-backed schema:
   - added `ctf/migrations/2026-03-03-skills-hunt-core-phase1.sql`.
   - includes rounds, submissions, leaderboard, achievements, notifications, feature reward card, rare-skills lookup, governed Directory projection mapping, and audit log tables.

2. Skills Hunt domain implementation:
   - created `ctf/packages/web/src/lib/skills-hunt/` with constants/types/policy/audit/repository.
   - repository implements:
     - round lifecycle CRUD/read,
     - submission validation + anti-spam/duplicate checks,
     - rejection-rate guard,
     - moderation review + deterministic scoring,
     - leaderboard rebuild (individual/team),
     - achievements + notifications,
     - feature reward card read/update,
     - governed Directory unclaimed profile generation.

3. API routes implemented:
   - User:
     - `GET /api/skills-hunt/rounds`
     - `POST /api/skills-hunt/rounds/:roundId/submissions`
     - `GET /api/skills-hunt/rounds/:roundId/leaderboard?mode=individual|team`
     - `GET /api/skills-hunt/achievements`
     - `GET /api/skills-hunt/notifications`
     - `POST /api/skills-hunt/notifications/:notificationId/read`
     - `GET /api/skills-hunt/feature-reward-card`
   - Admin/Moderator:
     - `GET/POST /api/skills-hunt/admin/rounds`
     - `PUT /api/skills-hunt/admin/rounds/:roundId`
     - `GET /api/skills-hunt/admin/rounds/:roundId/submissions`
     - `POST /api/skills-hunt/admin/submissions/:submissionId/review`
     - `PUT /api/skills-hunt/admin/feature-reward-card`
     - `POST /api/skills-hunt/admin/submissions/:submissionId/generate-directory-profile`
     - `GET /api/skills-hunt/admin/audit-events`

4. UI/admin surfaces:
   - plugin shell: `ctf/packages/web/src/components/skills-hunt/skills-hunt-shell.tsx`
   - admin page: `ctf/packages/web/src/app/admin/skills-hunt/page.tsx`
   - plugin router integration: `ctf/packages/web/src/app/plugin/page.tsx` now renders Skills Hunt shell for `plugin=skills-hunt`.

5. Seed/scripts/contracts/docs alignment:
   - added seed script: `ctf/scripts/seedSkillsHuntPhase1.mjs`
   - added scripts in `ctf/package.json`:
     - `seed:skills-hunt`
     - `migrate:skills-hunt:phase1`
   - command contract updated to remove `adminPreapproved` input for `skills-hunt.submission.create`.
   - inventory/checklist updated to lock decision: admin-preapproved pathway disabled in v1.

## Directory integration behavior summary

1. Skills Hunt writes unclaimed projections only by inserting into `directory_profiles` with `claimed_by_user_id = NULL`.
2. Projection ownership is never claimed by Skills Hunt; claim lifecycle remains Directory-authoritative.
3. Two generation paths are active in this implementation:
   - auto-generation on accepted moderation outcomes,
   - explicit moderator/admin generation endpoint for accepted submissions.
4. Projection linkage and attribution are persisted in `skills_hunt_directory_profiles` (`submission_id`, `directory_profile_id`, `invited_by_username`, `created_by_user_id`).

## Anti-spam and moderation policy enforcement evidence

1. Submission creation enforces:
   - rolling 7-day submission cap,
   - duplicate signature block (`round_id + signature_hash`),
   - rejection-rate guardrail based on recent reviewed outcomes,
   - unsafe markup filtering and bounded payload validation,
   - Quora URL normalization/validation.
2. Review actions enforce deterministic status transitions + scoring + leaderboard rebuild.
3. Audit evidence captured via:
   - structured route-level audit logs,
   - persisted admin audit rows in `skills_hunt_audit_log` for privileged mutations.

## Validation evidence

1. Web build/type/lint gate:
   - command: `cd /workspaces/chargingthefuture/ctf/packages/web && corepack pnpm build`
   - result: success.
2. Schema drift gate:
   - command: `cd /workspaces/chargingthefuture/ctf && bash ./scripts/check-schema-drift.sh --all`
   - result: passed.

## Open policy ambiguities / deferred items

1. Quora URL liveness verification remains basic normalization/pattern validation in this pass; external liveness SLO is still open.
   - owner recommendation: `platform-architecture`
   - target date recommendation: 2026-03-14
2. Android parity remains deferred (web-first delivery completed).
   - owner recommendation: `mobile-platform`
   - target date recommendation: 2026-03-21

## Changed files

- `ctf/migrations/2026-03-03-skills-hunt-core-phase1.sql`
- `ctf/scripts/seedSkillsHuntPhase1.mjs`
- `ctf/package.json`
- `ctf/packages/web/src/lib/skills-hunt/constants.ts`
- `ctf/packages/web/src/lib/skills-hunt/types.ts`
- `ctf/packages/web/src/lib/skills-hunt/policy.ts`
- `ctf/packages/web/src/lib/skills-hunt/audit.ts`
- `ctf/packages/web/src/lib/skills-hunt/repository.ts`
- `ctf/packages/web/src/app/api/skills-hunt/_lib.ts`
- `ctf/packages/web/src/app/api/skills-hunt/rounds/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/rounds/[roundId]/submissions/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/rounds/[roundId]/leaderboard/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/achievements/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/notifications/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/notifications/[notificationId]/read/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/feature-reward-card/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/admin/rounds/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/admin/rounds/[roundId]/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/admin/rounds/[roundId]/submissions/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/admin/submissions/[submissionId]/review/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/admin/submissions/[submissionId]/generate-directory-profile/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/admin/feature-reward-card/route.ts`
- `ctf/packages/web/src/app/api/skills-hunt/admin/audit-events/route.ts`
- `ctf/packages/web/src/components/skills-hunt/skills-hunt-shell.tsx`
- `ctf/packages/web/src/app/admin/skills-hunt/page.tsx`
- `ctf/packages/web/src/app/plugin/page.tsx`
- `ctf/docs/contracts/SKILLS_HUNT_PLUGIN_COMMAND_CONTRACTS.yaml`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-skills-hunt-feature-inventory.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-skills-hunt-rewrite-checklist.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-plugin-agent-assignment-matrix.md`
- `ctf/docs/developer/SKILLS_HUNT_CORE_HANDOFF_AGENT05.md`

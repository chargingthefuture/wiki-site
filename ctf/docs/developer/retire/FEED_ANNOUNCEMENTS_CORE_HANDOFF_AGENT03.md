# Feed + Announcements Core Handoff (Agent 03)

Date: 2026-03-02  
Scope: `ctf/` only (web/API + migration + seed; Android parity tracked as phase follow-up)

## Clarifying questions asked and answers received

1. Pagination model for `GET /api/feed/items`?
   - Answer: offset pagination (`page`, `pageSize`).
2. Can users dismiss mandatory announcements?
   - Answer: no; dismissal only for non-mandatory announcements.
3. Membership event source for phase-0 visibility recalculation?
   - Answer: persist in DB and emit externally.
4. Publish/archive approval model?
   - Answer: direct admin publish/archive with role + CSRF + audit (no separate approval state in phase-0).

## Delivered core scope

1. Implemented migration-backed Feed + Announcements schema:
   - `feed_user_extension`, `feed_render_config`, `feed_items`, `feed_item_targets`,
   - `feed_user_read_state`, `feed_user_dismissals`, `feed_membership_events`, `feed_admin_audit_trail`,
   - `announcements`, `announcement_revisions`, `announcement_delivery_events`, `announcement_user_state`,
   - `announcement_membership_events`, `announcement_admin_audit_trail`,
   - `feed_timeline_projection` view.
2. Implemented user routes:
   - `GET /api/feed/items`
   - `POST /api/feed/items/:itemId/read`
   - `POST /api/feed/items/:itemId/dismiss`
   - `GET /api/feed/config`
   - `GET /api/announcements`
   - `POST /api/announcements/:announcementId/read`
   - `POST /api/announcements/:announcementId/dismiss`
3. Implemented admin routes:
   - `GET/PUT /api/feed/admin/config`
   - `GET/POST /api/feed/admin/announcements`
   - `PUT /api/feed/admin/announcements/:announcementId`
   - `POST /api/feed/admin/announcements/:announcementId/publish`
   - `POST /api/feed/admin/announcements/:announcementId/archive`
   - `POST /api/feed/membership/events`
   - `POST /api/announcements/admin/drafts`
   - `PUT /api/announcements/admin/drafts/:draftId`
   - `POST /api/announcements/admin/:announcementId/publish`
   - `POST /api/announcements/admin/:announcementId/archive`
   - `POST /api/announcements/admin/targeting/validate`
   - `POST /api/announcements/membership/events`
4. Implemented policy and security controls:
   - server-side role enforcement for admin routes,
   - CSRF enforcement for state-changing routes (`x-ctf-csrf: 1` + same-origin host check),
   - mandatory-item dismiss guards returning `409`.
5. Implemented external membership event emission path:
   - canonical DB event persistence plus Stream emission via `feed/stream.ts`.
6. Implemented UI surfaces:
   - plugin surface for `feed-announcements` via `/plugin?plugin=feed-announcements`,
   - centralized admin surface `/admin/feed-announcements`.
7. Added deterministic seed script:
   - `ctf/scripts/seedFeedAnnouncementsPhase0.mjs`
   - script command: `pnpm seed:feed-announcements`.
8. Added quota-impact note:
   - `ctf/docs/quota-impact/2026-03-02-feed-announcements-phase0.md`.

## Feed/announcements coupling decisions

1. Shared canonical source-of-truth in Postgres with announcement lifecycle driving feed projection entries.
2. Membership visibility recalculation events are persisted once in both plugin event tables and can emit externally to Stream.
3. Admin lifecycle remains centralized at `/admin/feed-announcements` with direct publish/archive.
4. Offset pagination is authoritative for phase-0 timeline fetch.

## Changed files

- `ctf/migrations/2026-03-02-feed-announcements-core-phase0.sql`
- `ctf/scripts/seedFeedAnnouncementsPhase0.mjs`
- `ctf/package.json`
- `ctf/packages/web/src/lib/feed/constants.ts`
- `ctf/packages/web/src/lib/feed/types.ts`
- `ctf/packages/web/src/lib/feed/policy.ts`
- `ctf/packages/web/src/lib/feed/audit.ts`
- `ctf/packages/web/src/lib/feed/stream.ts`
- `ctf/packages/web/src/lib/feed/repository.ts`
- `ctf/packages/web/src/app/api/feed/_lib.ts`
- `ctf/packages/web/src/app/api/feed/items/route.ts`
- `ctf/packages/web/src/app/api/feed/items/[itemId]/read/route.ts`
- `ctf/packages/web/src/app/api/feed/items/[itemId]/dismiss/route.ts`
- `ctf/packages/web/src/app/api/feed/config/route.ts`
- `ctf/packages/web/src/app/api/feed/admin/config/route.ts`
- `ctf/packages/web/src/app/api/feed/admin/announcements/route.ts`
- `ctf/packages/web/src/app/api/feed/admin/announcements/[announcementId]/route.ts`
- `ctf/packages/web/src/app/api/feed/admin/announcements/[announcementId]/publish/route.ts`
- `ctf/packages/web/src/app/api/feed/admin/announcements/[announcementId]/archive/route.ts`
- `ctf/packages/web/src/app/api/feed/membership/events/route.ts`
- `ctf/packages/web/src/app/api/announcements/route.ts`
- `ctf/packages/web/src/app/api/announcements/[announcementId]/read/route.ts`
- `ctf/packages/web/src/app/api/announcements/[announcementId]/dismiss/route.ts`
- `ctf/packages/web/src/app/api/announcements/admin/drafts/route.ts`
- `ctf/packages/web/src/app/api/announcements/admin/drafts/[draftId]/route.ts`
- `ctf/packages/web/src/app/api/announcements/admin/[announcementId]/publish/route.ts`
- `ctf/packages/web/src/app/api/announcements/admin/[announcementId]/archive/route.ts`
- `ctf/packages/web/src/app/api/announcements/admin/targeting/validate/route.ts`
- `ctf/packages/web/src/app/api/announcements/membership/events/route.ts`
- `ctf/packages/web/src/components/feed/feed-announcements-shell.tsx`
- `ctf/packages/web/src/app/admin/feed-announcements/page.tsx`
- `ctf/packages/web/src/app/plugin/page.tsx`
- `ctf/docs/contracts/FEED_PLUGIN_COMMAND_CONTRACTS.yaml`
- `ctf/docs/contracts/FEED_PLUGIN_ACCESS_POLICY_CONTRACTS.yaml`
- `ctf/docs/contracts/FEED_PLUGIN_AUDIT_CONTRACTS.yaml`
- `ctf/docs/contracts/ANNOUNCEMENTS_PLUGIN_COMMAND_CONTRACTS.yaml`
- `ctf/docs/contracts/ANNOUNCEMENTS_PLUGIN_ACCESS_POLICY_CONTRACTS.yaml`
- `ctf/docs/contracts/ANNOUNCEMENTS_PLUGIN_AUDIT_CONTRACTS.yaml`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-feed-rewrite-checklist.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-announcements-rewrite-checklist.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-plugin-agent-assignment-matrix.md`
- `ctf/docs/quota-impact/2026-03-02-feed-announcements-phase0.md`
- `ctf/docs/developer/FEED_ANNOUNCEMENTS_CORE_HANDOFF_AGENT03.md`

## Deferred parity items

1. Android parity implementation for feed timeline/announcement lifecycle remains deferred.
   - Owner recommendation: `feed-android-parity`
   - Target date: 2026-04-18
2. Stream dashboard/alerts for fan-out anomaly detection remain post-MVP observability work.
   - Owner recommendation: `platform-observability`
   - Target date: 2026-03-31

## Completion recommendation

- **complete** for `agent-03-feed-announcements` phase-0 web/backend scope.

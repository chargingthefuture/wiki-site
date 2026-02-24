# Feed Plugin Feature Inventory (CTF Rewrite)

## Scope

- Rewrite target only: `ctf/`
- Legacy reference excluded from implementation: `platform/`
- Plugin name: `Feed`
- Central admin surface decision: `/admin/feed-announcements`
- Delivery decision: web-first launch; Android follow-up must be tracked by explicit parity ticket.

## Intent and Outcome

Feed is the survivor-facing timeline and discovery surface for community activity and announcements.

Approved architecture decisions:

1. Source-of-truth for persisted feed/announcement objects is PostgreSQL.
2. Stream is used for fan-out and timeline delivery behavior, not canonical storage.
3. Admin operations for Feed + Announcements are centralized at `/admin/feed-announcements`.
4. Web-first implementation is approved, with Android follow-up ticket required before release sign-off closure.

Approved suggestions incorporated into this plan:

1. Normalize product/documentation naming to **Announcements**.
2. Preserve a legacy typo alias note for backward compatibility where old naming appears in code/history.
3. Introduce plugin membership event stream for join/leave and visibility recalculation events.
4. Optional toast is supported as a Feed rendering mode under Feed controls.

---

## 1) Planned User-Facing Features

### 1.1 Feed Timeline Core

1. Paginated timeline of feed items with deterministic ordering.
2. Filter controls for plugin-scoped activity and announcement visibility.
3. Empty/error/loading states with accessible fallback messaging.

### 1.2 Announcement Visibility in Feed

1. Announcement items render in-feed using shared card contract.
2. Priority and expiry windows influence rank/visibility.
3. Optional toast rendering mode is configurable under Feed display controls.

### 1.3 Membership-Aware Personalization

1. Membership changes trigger visibility recalculation.
2. Membership event stream is used for fan-out invalidation/update workflows.
3. Non-member and member experiences remain policy-compliant and auditable.

### 1.4 Interaction and Read-State

1. Mark-read / unread tracking per user and item.
2. Dismiss/hide actions for non-mandatory announcements.
3. Link-out behavior with safe redirect and telemetry.

---

## 2) Planned Admin Features

### 2.1 Central Admin Surface

1. Single admin page at `/admin/feed-announcements` for Feed + Announcements controls.
2. Role-gated create/edit/publish/archive actions.
3. Moderation and publish-state controls with auditability.

### 2.2 Feed Rendering Controls

1. Global rendering-mode configuration (card-only, card+toast where allowed).
2. Priority and targeting rules management.
3. Preview/simulation mode before publish.

### 2.3 Governance and Operational Visibility

1. Change history and actor attribution for admin mutations.
2. Quota-impact awareness for Stream fan-out heavy changes.
3. Feature flag and kill-switch controls.

---

## 3) API Surface and Route Map (Planned)

### 3.1 Plugin Command Surface (Authoritative)

All command contracts must conform to templates from:

- `.claude/rules/201-plugin-command-schema-template.mdc`
- `.claude/rules/202-plugin-access-policy-schema-template.mdc`
- `.claude/rules/203-plugin-audit-schema-template.mdc`

Planned command groups:

1. `feed.timeline.fetch`
2. `feed.item.read.mark`
3. `feed.item.dismiss`
4. `feed.announcement.render-mode.update`
5. `feed.admin.config.update`
6. `feed.admin.announcement.publish`
7. `feed.admin.announcement.archive`
8. `feed.membership.event.emit`

### 3.2 HTTP Projection Routes (Planned)

User routes:

- `GET /api/feed/items`
- `POST /api/feed/items/:itemId/read`
- `POST /api/feed/items/:itemId/dismiss`
- `GET /api/feed/config`

Admin routes:

- `GET /api/feed/admin/config`
- `PUT /api/feed/admin/config`
- `POST /api/feed/admin/announcements`
- `PUT /api/feed/admin/announcements/:announcementId`
- `POST /api/feed/admin/announcements/:announcementId/publish`
- `POST /api/feed/admin/announcements/:announcementId/archive`

---

## 4) Data Model and Storage Contracts (Planned)

### 4.1 Canonical Profile and Plugin Extension

Must follow single-profile rule:

1. Reuse canonical user profile for identity and baseline preferences.
2. Plugin extension data is keyed by `user_id` only.
3. No duplicate full profile table for Feed.

Planned extension entity:

- `feed_user_extension`
  - `user_id`
  - feed preference flags,
  - read-state settings,
  - toast rendering preference where permitted.

### 4.2 Domain Entities

Planned domain tables (initial set):

1. `feed_items`
2. `feed_item_targets`
3. `feed_user_read_state`
4. `feed_user_dismissals`
5. `feed_render_config`
6. `feed_membership_events`
7. `feed_admin_audit_trail`

### 4.3 Source-of-Truth and Fan-Out

1. PostgreSQL stores canonical feed and announcement metadata.
2. Stream receives projected fan-out payloads after DB commit success.
3. Retries/idempotency ensure at-least-once fan-out without duplicate canonical writes.

---

## 5) Security, Privacy, and Compliance Controls (Planned)

1. Server-side authorization on all user/admin commands.
2. Role and consent checks enforced by command access policy contracts.
3. CSRF protection for all state-changing web routes.
4. Audit logging for allow/deny and publish/archive transitions.
5. Sensitive payload redaction in logs and diagnostics.
6. Plugin-scoped deletion + full-account deletion contracts aligned to template in `ctf/docs/templates/PLUGIN_PROFILE_AND_DELETION_CONTRACT_TEMPLATE.md`.

---

## 6) Web and Android Delivery Plan (Approved)

1. Web-first release is approved for initial CTF rewrite delivery.
2. Android parity is deferred only via explicit follow-up ticket with owner + due date.
3. Release readiness requires linking that Android follow-up ticket in checklist evidence.

---

## 7) Quota-Impact and Operational Budget Notes

1. Any change increasing Stream fan-out volume must include a quota-impact note.
2. Quota notes must follow `ctf/docs/quota-impact/TEMPLATE.md`.
3. Checklist evidence must include expected monthly impact and degradation plan.

---

## 8) Test and Seed Coverage Status

Current status: **Planned (not yet implemented)**

Planned test layers:

1. Command contract tests for schema/policy/audit templates.
2. API tests for timeline/read-state/admin mutation paths.
3. Integration tests for DB canonical write + Stream fan-out consistency.
4. Web E2E tests for timeline rendering, announcement visibility, and toast mode behavior.
5. Android follow-up test plan to be attached to parity ticket.

Planned seed scope:

1. Deterministic feed item and announcement fixtures.
2. Membership event fixtures for visibility recalculation paths.
3. Read/unread and dismissal state fixtures.

---

## 9) Schema Drift and Predeployment Expectations

1. Predeployment requires schema drift check between migration SQL, ORM/schema definitions, and API contracts.
2. Any drift acceptance must be explicit and documented with mitigation.
3. PR evidence must include migration replay/rollback proof and drift-check output.

---

## 10) Change Log

- 2026-02-24: Created initial CTF rewrite Feed inventory with approved architecture decisions (Postgres source-of-truth + Stream fan-out), centralized admin surface, naming normalization guidance, quota-impact requirement, and schema drift evidence gates.

# Feed Profile and Deletion Contract (Draft)

## 1) Plugin Metadata

- Plugin Name: Feed
- Service Key (lowercase, stable): `feed`
- Owner Team: Social Platform (proposed)
- Rollout Stage: Planning

## 2) Canonical Profile Usage

Rule 114 baseline: Feed relies on canonical identity and does not duplicate account profile fields.

- Read fields:
  - `user_id`
  - display name
  - avatar URL
  - locale/timezone
- Write fields:
  - none to canonical profile
- Why canonical fields are needed:
  - content ownership and moderation decisions
  - identity consistency across plugins

## Identity Handle Baseline

- Canonical handle source: the active auth provider's canonical `username` or equivalent handle field (see `ctf/docs/contracts/PLUGIN_IDENTITY_HANDLE_BASELINE.md`).
- Plugin must not create plugin-local username ownership models.
- If the canonical provider handle is missing, use non-handle display fallback and treat `@mention` targeting as unavailable.
- Any persisted username snapshot fields must be derived from the canonical provider handle at write time.

## 3) Plugin Extension Fields

- Storage location (table or json path): `feed_user_extension`
- Fields:
  - field name: `user_id`
    - type: uuid
    - nullable/default: non-null, unique, FK to canonical profile
    - purpose: plugin extension ownership key
  - field name: `content_preferences`
    - type: jsonb
    - nullable/default: default `{}`
    - purpose: feed ranking/safety preferences
  - field name: `muted_topics`
    - type: text[]
    - nullable/default: default `{}`
    - purpose: user topic filters
  - field name: `service_deleted_at`
    - type: timestamptz
    - nullable/default: nullable
    - purpose: plugin-scoped deletion marker

## 4) Domain Data Owned by Plugin

- Table/entity: `feed_posts`
  - Contains personal data? yes (author linkage + content)
  - Retention period: long-lived under moderation policy
  - Legal/compliance note: abuse evidence may require retention
- Table/entity: `feed_comments`
  - Contains personal data? yes
  - Retention period: long-lived under moderation policy
  - Legal/compliance note: user-generated content controls apply
- Table/entity: `feed_reactions`
  - Contains personal data? yes (user linkage)
  - Retention period: medium-lived
  - Legal/compliance note: engagement metadata
- Table/entity: `feed_deletion_events`
  - Contains personal data? minimal (`user_id`, scope, timestamps)
  - Retention period: compliance retention window
  - Legal/compliance note: Rule 114 deletion audit trail

## 5) Service-Scoped Deletion Contract

When user deletes Feed usage only:

- Delete immediately:
  - `feed_user_extension` and preference rows
  - user reactions and removable drafts
- Anonymize/pseudonymize:
  - historical authored content where hard delete is not policy-allowed
- Retain for compliance/fraud/finance:
  - policy-required moderation records
  - `feed_deletion_events`
- Never touch (must remain):
  - canonical profile
  - content owned by other users
- User-facing confirmation text:
  - “Delete Feed plugin data only? Your account remains active.”

## 6) Full-Account Deletion Contract

When user requests full account deletion:

- Additional records removed vs service-scoped deletion:
  - remaining user-linked feed posts/comments/reactions where policy allows hard delete
- Cross-service dependencies:
  - full-account orchestrator coordinates deletion sequencing and audit completion
- Final expected state:
  - no recoverable user-scoped Feed data except policy-required compliance artifacts

## 7) Rejoin/Re-enable Behavior

If user returns after service-scoped deletion:

- Recreated defaults:
  - new `feed_user_extension` with default preferences
- Data that is not restored:
  - removed reactions/preferences and hard-deleted content
- Re-consent required? (yes/no):
  - yes (personalization preferences)

## 8) Audit and Events

- Deletion event schema fields:
  - `id`, `user_id`, `scope`, `plugin_id`, `requested_at`, `processed_at`, `result`, `request_id`, `trace_id`
- Event table/path:
  - `feed_deletion_events`
- Who can trigger deletion:
  - authenticated user (self)
  - full-account orchestrator/system actor
- Alerting/monitoring requirement:
  - alert on deletion failures and moderation-retention exceptions

## 9) API and UX Surface

- Service delete endpoint:
  - `DELETE /api/account/feed-profile` (planned)
- Full account delete endpoint (or orchestrator):
  - `DELETE /api/account/full-account`
- Status model (`requested`, `processing`, `completed`, `failed`):
  - required for plugin and account deletion flows
- User-facing copy reviewed by:
  - Product, Compliance/Privacy, Trust & Safety

## 10) Migration and Rollback

- Migration file(s):
  - All schema changes are made directly in `ctf/schema.sql` (canonical source of truth).
- Rollback approach:
  - reverse-order rollback for Feed-only extension/deletion tables
- Backfill required? (yes/no):
  - no

## 11) Sign-off Checklist

- [ ] Product approved data behavior
- [ ] Engineering reviewed schema boundaries
- [ ] Compliance/privacy reviewed retention and deletion
- [ ] Observability added (without sensitive payloads)
- [ ] Web and Android parity confirmed

## Change Log

- 2026-02-25: Created initial draft.

# Lighthouse Profile and Deletion Contract (Draft)

## 1) Plugin Metadata

- Plugin Name: Lighthouse
- Service Key (lowercase, stable): `lighthouse`
- Owner Team: Guidance Platform (proposed)
- Rollout Stage: Planning

## 2) Canonical Profile Usage

Rule 114 baseline: Lighthouse consumes canonical identity and stores plugin extension data keyed by `user_id`.

- Read fields:
  - `user_id`
  - display name
  - locale/timezone
- Write fields:
  - none to canonical profile
- Why canonical fields are needed:
  - ownership and policy checks for goals and progress tracking

## Identity Handle Baseline

- Canonical handle source: the active auth provider's canonical `username` or equivalent handle field (see `ctf/docs/contracts/PLUGIN_IDENTITY_HANDLE_BASELINE.md`).
- Plugin must not create plugin-local username ownership models.
- If the canonical provider handle is missing, use non-handle display fallback and treat `@mention` targeting as unavailable.
- Any persisted username snapshot fields must be derived from the canonical provider handle at write time.

## 3) Plugin Extension Fields

- Storage location (table or json path): `lighthouse_user_extension`
- Fields:
  - field name: `user_id`
    - type: uuid
    - nullable/default: non-null, unique, FK to canonical profile
    - purpose: plugin extension ownership key
  - field name: `goal_preferences`
    - type: jsonb
    - nullable/default: default `{}`
    - purpose: guidance cadence and category preferences
  - field name: `insight_visibility`
    - type: enum (`private` | `coach-shared`)
    - nullable/default: default `private`
    - purpose: sharing controls
  - field name: `service_deleted_at`
    - type: timestamptz
    - nullable/default: nullable
    - purpose: plugin-scoped deletion marker

## 4) Domain Data Owned by Plugin

- Table/entity: `lighthouse_goals`
  - Contains personal data? yes
  - Retention period: medium/long-lived
  - Legal/compliance note: user progress artifact
- Table/entity: `lighthouse_milestones`
  - Contains personal data? yes
  - Retention period: medium/long-lived
  - Legal/compliance note: derived planning metadata
- Table/entity: `lighthouse_progress_events`
  - Contains personal data? yes
  - Retention period: medium-lived
  - Legal/compliance note: event history for continuity
- Table/entity: `lighthouse_deletion_events`
  - Contains personal data? minimal (`user_id`, scope, timestamps)
  - Retention period: compliance retention window
  - Legal/compliance note: Rule 114 deletion audit trail

## 5) Service-Scoped Deletion Contract

When user deletes Lighthouse usage only:

- Delete immediately:
  - `lighthouse_user_extension`
  - user-scoped goals, milestones, and progress events
- Anonymize/pseudonymize:
  - none expected for user-owned records
- Retain for compliance/fraud/finance:
  - `lighthouse_deletion_events`
- Never touch (must remain):
  - canonical profile
  - non-Lighthouse plugin data
- User-facing confirmation text:
  - “Delete Lighthouse plugin data only? Your account remains active.”

## 6) Full-Account Deletion Contract

When user requests full account deletion:

- Additional records removed vs service-scoped deletion:
  - remaining user-linked Lighthouse records not already removed
- Cross-service dependencies:
  - full-account orchestrator controls sequencing and completion events
- Final expected state:
  - no recoverable user-scoped Lighthouse data except policy-required audit evidence

## 7) Rejoin/Re-enable Behavior

If user returns after service-scoped deletion:

- Recreated defaults:
  - new `lighthouse_user_extension` with default preferences
- Data that is not restored:
  - deleted goals, milestones, and progress history
- Re-consent required? (yes/no):
  - yes (insight storage preferences)

## 8) Audit and Events

- Deletion event schema fields:
  - `id`, `user_id`, `scope`, `plugin_id`, `requested_at`, `processed_at`, `result`, `request_id`, `trace_id`
- Event table/path:
  - `lighthouse_deletion_events`
- Who can trigger deletion:
  - authenticated user (self)
  - full-account orchestrator/system actor
- Alerting/monitoring requirement:
  - alert on deletion failures and retries

## 9) API and UX Surface

- Service delete endpoint:
  - `DELETE /api/account/lighthouse-profile` (planned)
- Full account delete endpoint (or orchestrator):
  - `DELETE /api/account/full-account`
- Status model (`requested`, `processing`, `completed`, `failed`):
  - required for plugin and account deletion flows
- User-facing copy reviewed by:
  - Product, Compliance/Privacy

## 10) Migration and Rollback

- Migration file(s):
  - All schema changes are made directly in `ctf/schema.sql` (canonical source of truth).
- Rollback approach:
  - reverse-order rollback for Lighthouse-only extension/deletion tables
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

# Weekly Performance Profile and Deletion Contract (Draft)

## 1) Plugin Metadata

- Plugin Name: Weekly Performance
- Service Key (lowercase, stable): `weekly-performance`
- Owner Team: Performance Insights (proposed)
- Rollout Stage: Planning

## 2) Canonical Profile Usage

Rule 114 baseline: Weekly Performance uses canonical identity and plugin extension data keyed by `user_id`.

- Read fields:
  - `user_id`
  - display name
  - role/workspace membership
  - locale/timezone
- Write fields:
  - none to canonical profile
- Why canonical fields are needed:
  - weekly metric ownership and policy-scoped access control

## Identity Handle Baseline

- Canonical handle source: Clerk `username` (see `ctf/docs/contracts/PLUGIN_IDENTITY_HANDLE_BASELINE.md`).
- Plugin must not create plugin-local username ownership models.
- If Clerk `username` is missing, use non-handle display fallback and treat `@mention` targeting as unavailable.
- Any persisted username snapshot fields must be derived from Clerk `username` at write time.

## 3) Plugin Extension Fields

- Storage location (table or json path): `weekly_performance_user_extension`
- Fields:
  - field name: `user_id`
    - type: uuid
    - nullable/default: non-null, unique, FK to canonical profile
    - purpose: plugin extension ownership key
  - field name: `dashboard_preferences`
    - type: jsonb
    - nullable/default: default `{}`
    - purpose: layout and metric visibility preferences
  - field name: `notification_preferences`
    - type: jsonb
    - nullable/default: default `{}`
    - purpose: digest reminders and threshold alerts
  - field name: `service_deleted_at`
    - type: timestamptz
    - nullable/default: nullable
    - purpose: plugin-scoped deletion marker

## 4) Domain Data Owned by Plugin

- Table/entity: `weekly_performance_snapshots`
  - Contains personal data? yes (user-linked performance aggregates)
  - Retention period: medium/long-lived
  - Legal/compliance note: metric provenance controls apply
- Table/entity: `weekly_performance_goals`
  - Contains personal data? yes
  - Retention period: medium-lived
  - Legal/compliance note: operational planning metadata
- Table/entity: `weekly_performance_feedback_events`
  - Contains personal data? yes (actor linkage)
  - Retention period: medium-lived
  - Legal/compliance note: review traceability
- Table/entity: `weekly_performance_deletion_events`
  - Contains personal data? minimal (`user_id`, scope, timestamps)
  - Retention period: compliance retention window
  - Legal/compliance note: Rule 114 deletion audit trail

## 5) Service-Scoped Deletion Contract

When user deletes Weekly Performance usage only:

- Delete immediately:
  - `weekly_performance_user_extension`
  - user preference and optional goal draft rows
- Anonymize/pseudonymize:
  - historical snapshot ownership where retention is required
- Retain for compliance/fraud/finance:
  - policy-required metric provenance records
  - `weekly_performance_deletion_events`
- Never touch (must remain):
  - canonical profile
  - workspace-level aggregate records not owned solely by requester
- User-facing confirmation text:
  - “Delete Weekly Performance plugin data only? Your account remains active.”

## 6) Full-Account Deletion Contract

When user requests full account deletion:

- Additional records removed vs service-scoped deletion:
  - remaining user-linked goal and feedback artifacts where removable
- Cross-service dependencies:
  - full-account orchestrator coordinates completion across all plugin contracts
- Final expected state:
  - no recoverable user-scoped Weekly Performance data except policy-required compliance artifacts

## 7) Rejoin/Re-enable Behavior

If user returns after service-scoped deletion:

- Recreated defaults:
  - new `weekly_performance_user_extension` with default dashboard preferences
- Data that is not restored:
  - deleted personal preference and removed history details
- Re-consent required? (yes/no):
  - yes (digest/notification preferences)

## 8) Audit and Events

- Deletion event schema fields:
  - `id`, `user_id`, `scope`, `plugin_id`, `requested_at`, `processed_at`, `result`, `request_id`, `trace_id`
- Event table/path:
  - `weekly_performance_deletion_events`
- Who can trigger deletion:
  - authenticated user (self)
  - full-account orchestrator/system actor
- Alerting/monitoring requirement:
  - alert on deletion failures and aggregation-policy exceptions

## 9) API and UX Surface

- Service delete endpoint:
  - `DELETE /api/account/weekly-performance-profile` (planned)
- Full account delete endpoint (or orchestrator):
  - `DELETE /api/account/full-account`
- Status model (`requested`, `processing`, `completed`, `failed`):
  - required for plugin and account deletion flows
- User-facing copy reviewed by:
  - Product, Compliance/Privacy

## 10) Migration and Rollback

- Migration file(s):
  - planned under `ctf/migrations/`
- Rollback approach:
  - reverse-order rollback for Weekly Performance-only extension/deletion tables
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

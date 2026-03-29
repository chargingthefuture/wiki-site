# TrustTransport Profile and Deletion Contract (Draft)

## 1) Plugin Metadata

- Plugin Name: TrustTransport
- Service Key (lowercase, stable): `trusttransport`
- Owner Team: Mobility Platform (proposed)
- Rollout Stage: Planning

## 2) Canonical Profile Usage

Rule 114 baseline: TrustTransport uses a single canonical profile and plugin extension by `user_id`.

- Read fields:
  - `user_id`
  - display name
  - avatar URL
  - role/workspace membership
  - locale/timezone
- Write fields:
  - none to canonical profile
- Why canonical fields are needed:
  - trip ownership, participant authorization, and safety policy checks

## Identity Handle Baseline

- Canonical handle source: Clerk `username` (see `ctf/docs/contracts/PLUGIN_IDENTITY_HANDLE_BASELINE.md`).
- Plugin must not create plugin-local username ownership models.
- If Clerk `username` is missing, use non-handle display fallback and treat `@mention` targeting as unavailable.
- Any persisted username snapshot fields must be derived from Clerk `username` at write time.

## 3) Plugin Extension Fields

- Storage location (table or json path): `trusttransport_user_extension`
- Fields:
  - field name: `user_id`
    - type: uuid
    - nullable/default: non-null, unique, FK to canonical profile
    - purpose: plugin extension ownership key
  - field name: `transport_preferences`
    - type: jsonb
    - nullable/default: default `{}`
    - purpose: routing and accessibility preferences
  - field name: `safety_contact_preferences`
    - type: jsonb
    - nullable/default: default `{}`
    - purpose: emergency and trust-contact behavior
  - field name: `service_deleted_at`
    - type: timestamptz
    - nullable/default: nullable
    - purpose: plugin-scoped deletion marker

## 4) Domain Data Owned by Plugin

- Table/entity: `trusttransport_trip_requests`
  - Contains personal data? yes (trip ownership and route metadata)
  - Retention period: medium/long-lived transactional history
  - Legal/compliance note: safety and dispute evidence may require retention
- Table/entity: `trusttransport_trip_events`
  - Contains personal data? yes (status transitions with actor linkage)
  - Retention period: medium/long-lived
  - Legal/compliance note: operational accountability
- Table/entity: `trusttransport_safety_flags`
  - Contains personal data? yes (high-sensitivity incident metadata)
  - Retention period: policy-defined compliance window
  - Legal/compliance note: trust & safety handling required
- Table/entity: `trusttransport_deletion_events`
  - Contains personal data? minimal (`user_id`, scope, timestamps)
  - Retention period: compliance retention window
  - Legal/compliance note: Rule 114 deletion audit trail

## 5) Service-Scoped Deletion Contract

When user deletes TrustTransport usage only:

- Delete immediately:
  - `trusttransport_user_extension`
  - user preference records and removable draft trip data
- Anonymize/pseudonymize:
  - historical trip ownership fields where retention is required
- Retain for compliance/fraud/finance:
  - safety/incident records required by policy
  - `trusttransport_deletion_events`
- Never touch (must remain):
  - canonical profile
  - completed trip records still required for policy/compliance
- User-facing confirmation text:
  - “Delete TrustTransport plugin data only? Your account remains active.”

## 6) Full-Account Deletion Contract

When user requests full account deletion:

- Additional records removed vs service-scoped deletion:
  - remaining user-linked trip preference and removable history records
- Cross-service dependencies:
  - full-account orchestrator coordinates transport/safety retention obligations across plugins
- Final expected state:
  - no recoverable user-scoped TrustTransport data except policy-required safety/compliance artifacts

## 7) Rejoin/Re-enable Behavior

If user returns after service-scoped deletion:

- Recreated defaults:
  - new `trusttransport_user_extension` with default safety preferences
- Data that is not restored:
  - deleted trip preferences and removed historical ownership details
- Re-consent required? (yes/no):
  - yes (safety contact and routing preferences)

## 8) Audit and Events

- Deletion event schema fields:
  - `id`, `user_id`, `scope`, `plugin_id`, `requested_at`, `processed_at`, `result`, `request_id`, `trace_id`
- Event table/path:
  - `trusttransport_deletion_events`
- Who can trigger deletion:
  - authenticated user (self)
  - full-account orchestrator/system actor
- Alerting/monitoring requirement:
  - alert on deletion failures and unresolved safety-retention exceptions

## 9) API and UX Surface

- Service delete endpoint:
  - `DELETE /api/account/trusttransport-profile` (planned)
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
  - reverse-order rollback for TrustTransport-only extension/deletion tables
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

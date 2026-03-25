# Trust Profile and Deletion Contract (Draft)

## 1) Plugin Metadata

- Plugin Name: Trust
- Service Key (lowercase, stable): `trust`
- Owner Team: Trust and Safety Platform (proposed)
- Rollout Stage: Planning

## 2) Canonical Profile Usage

Rule 114 baseline: Trust extends the canonical profile by `user_id` and must not create a separate identity system.

- Read fields:
  - `user_id`
  - canonical account created timestamp or equivalent member-start timestamp
  - display name
  - avatar URL
  - role/workspace membership
- Write fields:
  - none to canonical profile
- Why canonical fields are needed:
  - attach trust signals to one canonical member identity
  - support policy checks for self-service visibility changes and moderator/admin review
  - render consistent identity context across plugin surfaces

## Identity Handle Baseline

- Canonical handle source: Clerk `username` (see `ctf/docs/contracts/PLUGIN_IDENTITY_HANDLE_BASELINE.md`).
- Trust must not create plugin-local handles or alternate member identifiers.
- Any trust UI references to handles must use Clerk-derived values only.

## 3) Plugin Extension Fields

- Storage location (table or json path): `trust_user_extension`
- Fields:
  - field name: `user_id`
    - type: uuid or text keyed to canonical identity implementation
    - nullable/default: non-null, unique, FK to canonical profile equivalent
    - purpose: plugin extension ownership key
  - field name: `verification_status`
    - type: enum (`verified` | `unverified` | `under_review` | `restricted`)
    - nullable/default: default `unverified`
    - purpose: public-safe trust state for trust badge rendering
  - field name: `verification_label_public`
    - type: text
    - nullable/default: nullable
    - purpose: short public-safe explanation string if product requires tailored display text
  - field name: `trust_visibility_level`
    - type: enum (`standard` | `limited` | `hidden`)
    - nullable/default: default `standard`
    - purpose: reduce stalking/harassment risk by limiting public trust signal detail
  - field name: `member_since_at`
    - type: timestamptz
    - nullable/default: nullable, derived/backfilled from canonical account timeline when available
    - purpose: month/year member-since rendering
  - field name: `service_deleted_at`
    - type: timestamptz
    - nullable/default: nullable
    - purpose: plugin-scoped deletion marker

- Storage location (table or json path): `trust_signal_snapshots`
- Fields:
  - field name: `user_id`
    - type: uuid or text keyed to canonical identity implementation
    - nullable/default: non-null
    - purpose: snapshot subject
  - field name: `last_online_bucket`
    - type: enum (`active_today` | `active_this_week` | `active_this_month` | `inactive_30_plus`)
    - nullable/default: nullable
    - purpose: coarse presence display without exposing exact timestamps
  - field name: `activity_bucket`
    - type: enum (`new` | `light` | `established` | `long_term`)
    - nullable/default: nullable
    - purpose: coarse cumulative usage band without exact time totals
  - field name: `transaction_bucket`
    - type: enum (`none` | `one_to_five` | `six_to_twenty` | `twenty_plus`)
    - nullable/default: nullable
    - purpose: optional cross-plugin bucketed transaction summary
  - field name: `active_plugin_count`
    - type: integer
    - nullable/default: default `0`
    - purpose: high-level plugin footprint summary without raw event detail
  - field name: `snapshot_generated_at`
    - type: timestamptz
    - nullable/default: non-null
    - purpose: freshness marker for server-side safety controls and support diagnostics

## 4) Domain Data Owned by Plugin

- Table/entity: `trust_user_extension`
  - Contains personal data? yes
  - Retention period: long-lived while plugin is enabled
  - Legal/compliance note: extension-only trust state; not a second profile table
- Table/entity: `trust_signal_snapshots`
  - Contains personal data? yes (derived behavioral metadata in coarse buckets)
  - Retention period: rolling snapshots while plugin is enabled
  - Legal/compliance note: must remain privacy-safe and avoid exact stalking-enabling telemetry
- Table/entity: `trust_admin_audit_trail`
  - Contains personal data? minimal actor and target linkage
  - Retention period: compliance retention window
  - Legal/compliance note: append-only trust moderation and policy evidence

## 5) Service-Scoped Deletion Contract

When user deletes Trust usage only:

- Delete immediately:
  - `trust_user_extension`
  - user-scoped `trust_signal_snapshots`
- Anonymize/pseudonymize:
  - none planned in Phase 1; snapshots should be removable without preserving user-identifiable copies
- Retain for compliance/fraud/finance:
  - `trust_admin_audit_trail` with minimal actor/target linkage and no raw sensitive payloads
- Never touch (must remain):
  - canonical profile/account
  - non-Trust plugin data
  - source plugin domain records used to derive trust signals
- User-facing confirmation text:
  - “Delete Trust plugin data only? Your account and other plugin data stay active.”

## 6) Full-Account Deletion Contract

When user requests full account deletion:

- Additional records removed vs service-scoped deletion:
  - any remaining user-linked trust extension state and snapshots
- Cross-service dependencies:
  - full-account orchestrator clears Trust extension records after dependent plugin deletion jobs finalize
- Final expected state:
  - no recoverable user-scoped Trust display state except policy-required audit artifacts

## 7) Rejoin/Re-enable Behavior

If user returns after service-scoped deletion:

- Recreated defaults:
  - new `trust_user_extension` with `unverified` status and `standard` visibility
  - empty or re-derived `trust_signal_snapshots`
- Data that is not restored:
  - prior public-safe trust summary state unless re-derived from approved source systems
- Re-consent required? (yes/no):
  - yes (for public display of trust summary surfaces if product requires explicit opt-in)

## 8) Audit and Events

- Deletion event schema fields:
  - `id`, `user_id`, `scope`, `plugin_id`, `requested_at`, `processed_at`, `result`, `request_id`, `trace_id`
- Event table/path:
  - centralized deletion event table/orchestrator path plus `trust_admin_audit_trail` for trust moderation actions
- Who can trigger deletion:
  - authenticated user (self) for plugin-scoped deletion
  - full-account orchestrator/system actor
- Alerting/monitoring requirement:
  - alert on failed trust snapshot deletion or policy/audit write failures

## 9) API and UX Surface

- Service delete endpoint:
  - `DELETE /api/account/trust` (planned)
- Full account delete endpoint (or orchestrator):
  - `DELETE /api/account/full-account`
- Status model (`requested`, `processing`, `completed`, `failed`):
  - required for plugin and account deletion flows
- User-facing copy reviewed by:
  - Product, Trust and Safety, Compliance/Privacy
- Primary Phase 1 UX surfaces:
  - right-rail personal Trust card beneath the welcome/profile card
  - expandable viewed-user Trust preview beneath member name/header in plugin profile views

## 10) Migration and Rollback

- Migration file(s):
  - planned under `ctf/migrations/`
- Rollback approach:
  - reverse-order rollback for Trust-only extension and snapshot tables
- Backfill required? (yes/no):
  - yes (member-since derivation and any approved initial verification carry-over from legacy systems)

## 11) Sign-off Checklist

- [ ] Product approved data behavior
- [ ] Engineering reviewed schema boundaries
- [ ] Compliance/privacy reviewed retention and deletion
- [ ] Observability added (without sensitive payloads)
- [ ] Web and Android parity confirmed

## Change Log

- 2026-03-25: Created initial Trust Phase 1 draft focused on privacy-safe trust signals, shared UI surfaces, and plugin-scoped extension storage.
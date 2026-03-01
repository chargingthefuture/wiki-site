# Skills Taxonomy Profile and Deletion Contract (Draft)

## 1) Plugin Metadata

- Plugin Name: Skills Taxonomy
- Service Key (lowercase, stable): `skills-taxonomy`
- Owner Team: Skills Platform (proposed)
- Rollout Stage: Planning

## 2) Canonical Profile Usage

Rule 114 baseline: Skills Taxonomy extends canonical identity by `user_id` and keeps profile data centralized.

- Read fields:
  - `user_id`
  - display name
  - role/workspace membership
- Write fields:
  - none to canonical profile
- Why canonical fields are needed:
  - skill ownership, endorsements, and policy enforcement

## Identity Handle Baseline

- Canonical handle source: Clerk `username` (see `ctf/docs/contracts/PLUGIN_IDENTITY_HANDLE_BASELINE.md`).
- Plugin must not create plugin-local username ownership models.
- If Clerk `username` is missing, use non-handle display fallback and treat `@mention` targeting as unavailable.
- Any persisted username snapshot fields must be derived from Clerk `username` at write time.

## 3) Plugin Extension Fields

- Storage location (table or json path): `skills_taxonomy_user_extension`
- Fields:
  - field name: `user_id`
    - type: uuid
    - nullable/default: non-null, unique, FK to canonical profile
    - purpose: plugin extension ownership key
  - field name: `skill_visibility_preferences`
    - type: jsonb
    - nullable/default: default `{}`
    - purpose: profile skill display controls
  - field name: `endorsement_opt_in`
    - type: boolean
    - nullable/default: default `true`
    - purpose: endorsement participation consent
  - field name: `service_deleted_at`
    - type: timestamptz
    - nullable/default: nullable
    - purpose: plugin-scoped deletion marker

## 4) Domain Data Owned by Plugin

- Table/entity: `skills_taxonomy_user_skills`
  - Contains personal data? yes (user linkage)
  - Retention period: long-lived while active
  - Legal/compliance note: user skill declarations
- Table/entity: `skills_taxonomy_skill_votes`
  - Contains personal data? yes (voter linkage)
  - Retention period: medium/long-lived
  - Legal/compliance note: ranking provenance
- Table/entity: `skills_taxonomy_change_events`
  - Contains personal data? minimal actor linkage
  - Retention period: compliance retention window
  - Legal/compliance note: taxonomy governance evidence
- Table/entity: `skills_taxonomy_deletion_events`
  - Contains personal data? minimal (`user_id`, scope, timestamps)
  - Retention period: compliance retention window
  - Legal/compliance note: Rule 114 deletion audit trail

## 5) Service-Scoped Deletion Contract

When user deletes Skills Taxonomy usage only:

- Delete immediately:
  - `skills_taxonomy_user_extension`
  - user-owned skill preference records
- Anonymize/pseudonymize:
  - historical vote ownership where retention is required
- Retain for compliance/fraud/finance:
  - taxonomy governance events
  - `skills_taxonomy_deletion_events`
- Never touch (must remain):
  - canonical profile
  - shared taxonomy definitions
- User-facing confirmation text:
  - “Delete Skills Taxonomy plugin data only? Your account remains active.”

## 6) Full-Account Deletion Contract

When user requests full account deletion:

- Additional records removed vs service-scoped deletion:
  - remaining user-linked skills and endorsements where policy allows hard delete
- Cross-service dependencies:
  - full-account orchestrator coordinates identity removal and plugin completion
- Final expected state:
  - no recoverable user-scoped Skills Taxonomy data except policy-required audit artifacts

## 7) Rejoin/Re-enable Behavior

If user returns after service-scoped deletion:

- Recreated defaults:
  - new `skills_taxonomy_user_extension` with default visibility
- Data that is not restored:
  - deleted user skill declarations and removed vote records
- Re-consent required? (yes/no):
  - yes (endorsement participation preferences)

## 8) Audit and Events

- Deletion event schema fields:
  - `id`, `user_id`, `scope`, `plugin_id`, `requested_at`, `processed_at`, `result`, `request_id`, `trace_id`
- Event table/path:
  - `skills_taxonomy_deletion_events`
- Who can trigger deletion:
  - authenticated user (self)
  - full-account orchestrator/system actor
- Alerting/monitoring requirement:
  - alert on deletion failures and policy-exception retries

## 9) API and UX Surface

- Service delete endpoint:
  - `DELETE /api/account/skills-taxonomy-profile` (planned)
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
  - reverse-order rollback for Skills Taxonomy-only extension/deletion tables
- Backfill required? (yes/no):
  - yes (for existing user skill rows mapped to canonical IDs)

## 11) Sign-off Checklist

- [ ] Product approved data behavior
- [ ] Engineering reviewed schema boundaries
- [ ] Compliance/privacy reviewed retention and deletion
- [ ] Observability added (without sensitive payloads)
- [ ] Web and Android parity confirmed

## Change Log

- 2026-02-25: Created initial draft.

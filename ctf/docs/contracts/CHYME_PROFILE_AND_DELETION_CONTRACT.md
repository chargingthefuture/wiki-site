# Chyme Profile and Deletion Contract (Draft)

This is the first completed draft using `PLUGIN_PROFILE_AND_DELETION_CONTRACT_TEMPLATE.md`.

## 1) Plugin Metadata

- Plugin Name: Chyme
- Service Key (lowercase, stable): `chyme`
- Owner Team: TBD
- Rollout Stage: MVP (internal/private)

## 2) Canonical Profile Usage

Current implementation reads user identity from Clerk server user context.

- Read fields:
  - display name fallback (`firstName`, `username`)
  - avatar (`imageUrl`)
- Write fields:
  - none currently written to canonical profile by Chyme routes
- Why canonical fields are needed:
  - show consistent participant identity in room roster/chat
  - avoid separate plugin identity records

## 3) Plugin Extension Fields

- Storage location (table or json path): `chyme_service_profiles`
- Fields:
  - `user_id`
  - `status` (`active` | `deleted`)
  - `created_at`
  - `updated_at`
  - `deleted_at`
- Purpose:
  - service-scoped activation/deletion lifecycle for Chyme without deleting account-level profile

## 4) Domain Data Owned by Plugin

- Table/entity: `chyme_rooms`
  - Contains personal data? no (room metadata only)
  - Retention period: persistent while feature is active
  - Legal/compliance note: no direct user PII fields
- Table/entity: `chyme_room_members`
  - Contains personal data? yes (`user_id`, `display_name`, optional avatar URL)
  - Retention period: until service-scoped delete or policy change
  - Legal/compliance note: considered service participation metadata
- Table/entity: `chyme_messages`
  - Contains personal data? yes (`user_id`, message text, display name)
  - Retention period: currently retained until service-scoped delete by sender
  - Legal/compliance note: high-sensitivity user content; avoid logging payloads
- Table/entity: `chyme_deletion_events`
  - Contains personal data? minimal (`user_id`, scope, service_name, timestamp)
  - Retention period: retained as compliance/audit evidence
  - Legal/compliance note: should be part of deletion accountability trail

## 5) Service-Scoped Deletion Contract

When user deletes Chyme usage only (`DELETE /api/account/chyme-profile`):

- Delete immediately:
  - `chyme_room_members` row for `(room_id = chyme-main-room, user_id)`
  - `chyme_messages` rows for `(room_id = chyme-main-room, user_id)`
- Anonymize/pseudonymize:
  - none currently (hard delete for user-owned member/message rows)
- Retain for compliance/fraud/finance:
  - `chyme_deletion_events` service-scope record
- Never touch (must remain):
  - canonical account identity and non-Chyme services
  - shared room metadata (`chyme_rooms`)
- User-facing confirmation text:
  - “Delete Chyme service data only? Your account will remain active.”

## 6) Full-Account Deletion Contract

When user requests full account deletion (`DELETE /api/account/full-account`):

- Additional records removed vs service-scoped deletion:
  - currently none immediately; request is recorded only
- Cross-service dependencies:
  - requires global account deletion orchestrator across all plugin domains
- Final expected state:
  - target state (TBD in orchestrator): account and all plugin data deleted/anonymized per policy

## 7) Rejoin/Re-enable Behavior

If user returns to Chyme after service-scoped deletion:

- Recreated defaults:
  - `chyme_service_profiles.status` set back to `active`
  - room membership row recreated on room/join/message operations
- Data that is not restored:
  - prior deleted chat messages and membership history
- Re-consent required? (yes/no):
  - currently no explicit re-consent gate; policy decision pending

## 8) Audit and Events

- Deletion event schema fields:
  - `id`, `user_id`, `scope`, `service_name`, `requested_at`
- Event table/path:
  - `chyme_deletion_events`
- Who can trigger deletion:
  - authenticated end user for own account
- Alerting/monitoring requirement:
  - TODO: add dashboard/alert on deletion failure rates and unusual spike patterns

## 9) API and UX Surface

- Service delete endpoint:
  - `DELETE /api/account/chyme-profile`
- Full account delete endpoint (or orchestrator):
  - `DELETE /api/account/full-account` (currently records request)
- Status model (`requested`, `processing`, `completed`, `failed`):
  - currently synchronous `ok` response for service delete
  - full-account currently `requested` only (needs async orchestrator states)
- User-facing copy reviewed by:
  - TBD (Product + Compliance)

## 10) Migration and Rollback

- Migration file(s):
  - `ctf/migrations/2026-02-19-create-chyme-core-tables.sql`
- Rollback approach:
  - drop Chyme-only tables/indexes in reverse dependency order if needed:
    - `chyme_messages`
    - `chyme_room_members`
    - `chyme_service_profiles`
    - `chyme_deletion_events`
    - `chyme_rooms`
- Backfill required? (yes/no):
  - no (new tables)

## 11) Sign-off Checklist

- [ ] Product approved data behavior
- [ ] Engineering reviewed schema boundaries
- [ ] Compliance/privacy reviewed retention and deletion
- [ ] Observability added (without sensitive payloads)
- [ ] Web and Android parity confirmed

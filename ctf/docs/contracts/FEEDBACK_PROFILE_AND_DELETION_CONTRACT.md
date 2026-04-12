# Feedback Plugin Profile and Deletion Contract (Draft)

## 1) Plugin Metadata

- Plugin Name: Feedback
- Service Key (lowercase, stable): `feedback`
- Owner Team: Product Management
- Rollout Stage: Implementation (Phase 1)

## 2) Canonical Profile Usage

Rule 114 baseline: Feedback relies on canonical identity and does not duplicate account profile fields.

- Read fields:
  - `user_id`
  - display name
  - avatar URL
- Write fields:
  - none to canonical profile
- Why canonical fields are needed:
  - content ownership and attribution
  - identity consistency across plugins

## Identity Handle Baseline

- Canonical handle source: the active auth provider's canonical `username` or equivalent handle field (see `ctf/docs/contracts/PLUGIN_IDENTITY_HANDLE_BASELINE.md`).
- Plugin must not create plugin-local username ownership models.
- If the canonical provider handle is missing, use non-handle display fallback.
- Any persisted username snapshot fields must be derived from the canonical provider handle at write time.

## 3) Plugin Extension Fields

- Storage location (table or json path): None currently (feedback submitter is referenced by `user_id` only)
- Future expansion:
  - may add `feedback_user_extension` table if user-scoped preferences needed

## 4) Domain Data Owned by Plugin

- Table/entity: `feedback_items`
  - Contains personal data? yes (author `user_id` + content)
  - Retention period: long-lived (retention policy TBD by Product/Compliance)
  - Legal/compliance note: user-generated content controls apply; may inform product decisions
  
- Table/entity: `feedback_votes`
  - Contains personal data? yes (voter `user_id`)
  - Retention period: medium-lived (aggregates decay in importance over time)
  - Legal/compliance note: engagement metadata
  
- Table/entity: `feedback_audit`
  - Contains personal data? minimal (`actor_id`, action, timestamp)
  - Retention period: compliance retention window (2555 days ~ 7 years standard)
  - Legal/compliance note: audit trail for admin actions on feedback

## 5) Service-Scoped Deletion Contract

When user deletes Feedback plugin data only:

- Delete immediately:
  - all `feedback_items` submitted by user
  - all `feedback_votes` by user
  - related `feedback_audit` entries for user's feedback submissions (not admin actions)
- Anonymize/pseudonymize:
  - none (hard delete for user-generated feedback is appropriate)
- Retain for compliance/fraud/finance:
  - feedback_audit entries where actor is admin (not the user)
- Never touch (must remain):
  - canonical profile
  - feedback items owned by other users
  - admin actions on other feedback
- User-facing confirmation text:
  - "Delete all your feedback submissions and votes? Your account remains active."

## 6) Full-Account Deletion Contract

When user requests full account deletion:

- Additional records removed vs service-scoped deletion:
  - all user feedback and votes already covered in service deletion
- Cross-service dependencies:
  - full-account orchestrator must schedule feedback plugin deletion during orchestrated sequence
  - if feedback is linked to PM tasks (Phase 2+), ensure task links are cleared or tasks are reviewed
- Final expected state:
  - no recoverable user-scoped feedback data except policy-required compliance artifacts

## 7) Rejoin/Re-enable Behavior

If user returns after service-scoped deletion:

- Recreated defaults:
  - user can submit new feedback immediately upon returning
- Data that is not restored:
  - deleted feedback submissions and votes are permanently gone
- Re-consent required? (yes/no):
  - no (implied by renewed participation)

## 8) Audit and Events

- Deletion event schema fields:
  - tracked by general account deletion orchestrator
  - feedback plugin records user data deletion event in `feedback_audit` with action='deleted'
- Event table/path:
  - `feedback_audit` (action='deleted' entry)
- Who can trigger deletion:
  - authenticated user (self)
  - full-account orchestrator/system actor
- Alerting/monitoring requirement:
  - alert on deletion failures
  - monitor for bulk feedback deletions (potential abuse/spam cleanup)

## 9) API and UX Surface

- Service delete endpoint:
  - `DELETE /api/account/feedback-profile` (planned)
- Full account delete endpoint (or orchestrator):
  - `DELETE /api/account/full-account`
- Status model (`requested`, `processing`, `completed`, `failed`):
  - required for plugin deletion flow
- User-facing copy reviewed by:
  - Product, Compliance/Privacy, Trust & Safety

## 10) Migration and Rollback

- Migration file(s):
  - All schema changes are made directly in `ctf/schema.sql` (canonical source of truth).
  - Added tables: `feedback_items`, `feedback_votes`, `feedback_audit`
- Rollback approach:
  - reverse-order rollback: drop `feedback_audit`, `feedback_votes`, `feedback_items`
- Backfill required? (yes/no):
  - no (Phase 1 launch)

## 11) Sign-off Checklist

- [ ] Product approved data behavior
- [ ] Engineering reviewed schema boundaries
- [ ] Compliance/privacy reviewed retention and deletion
- [ ] Observability added (without sensitive payloads)
- [ ] Web and Android parity confirmed for feedback submission UI

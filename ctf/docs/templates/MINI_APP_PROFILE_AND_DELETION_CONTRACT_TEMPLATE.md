# Mini-App Profile and Deletion Contract Template

Use this for every new mini-app (for example Chyme, Transport, Stays).

## 1) Mini-App Metadata

- Mini-App Name:
- Service Key (lowercase, stable):
- Owner Team:
- Rollout Stage:

## 2) Canonical Profile Usage

List only canonical fields consumed (read/write) by this mini-app.

- Read fields:
- Write fields:
- Why canonical fields are needed:

## 3) Mini-App Extension Fields

Define the extension fields added by this mini-app (not global identity fields).

- Storage location (table or json path):
- Fields:
  - field name:
  - type:
  - nullable/default:
  - purpose:

## 4) Domain Data Owned by Mini-App

List transactional/domain tables owned by this mini-app.

- Table/entity:
- Contains personal data? (yes/no):
- Retention period:
- Legal/compliance note:

## 5) Service-Scoped Deletion Contract

When user deletes this mini-app usage only:

- Delete immediately:
- Anonymize/pseudonymize:
- Retain for compliance/fraud/finance:
- Never touch (must remain):
- User-facing confirmation text:

## 6) Full-Account Deletion Contract

When user requests full account deletion:

- Additional records removed vs service-scoped deletion:
- Cross-service dependencies:
- Final expected state:

## 7) Rejoin/Re-enable Behavior

If user returns to this mini-app after service-scoped deletion:

- Recreated defaults:
- Data that is not restored:
- Re-consent required? (yes/no):

## 8) Audit and Events

- Deletion event schema fields:
- Event table/path:
- Who can trigger deletion:
- Alerting/monitoring requirement:

## 9) API and UX Surface

- Service delete endpoint:
- Full account delete endpoint (or orchestrator):
- Status model (`requested`, `processing`, `completed`, `failed`):
- User-facing copy reviewed by:

## 10) Migration and Rollback

- Migration file(s):
- Rollback approach:
- Backfill required? (yes/no):

## 11) Sign-off Checklist

- [ ] Product approved data behavior
- [ ] Engineering reviewed schema boundaries
- [ ] Compliance/privacy reviewed retention and deletion
- [ ] Observability added (without sensitive payloads)
- [ ] Web and Android parity confirmed

# Gross Domestic Product Profile and Deletion Contract (Draft)

This draft uses `PLUGIN_PROFILE_AND_DELETION_CONTRACT_TEMPLATE.md`.

## 1) Plugin Metadata

- Plugin Name: Gross Domestic Product
- Service Key (lowercase, stable): `gross-domestic-product`
- Owner Team: Economics Platform (proposed), Platform Data (proposed)
- Rollout Stage: Planning (pre-runtime)

## 2) Canonical Profile Usage

GDP uses canonical profile fields only for personalization, access context, and accessibility defaults.

- Read fields:
  - locale / language preference
  - accessibility preferences
  - region membership context
- Write fields:
  - none to canonical profile (plugin-specific settings use extension fields)
- Why canonical fields are needed:
  - provide localized, accessible GDP transparency views without duplicating identity state

## Identity Handle Baseline

- Canonical handle source: Clerk `username` (see `ctf/docs/contracts/PLUGIN_IDENTITY_HANDLE_BASELINE.md`).
- Plugin must not create plugin-local username ownership models.
- If Clerk `username` is missing, use non-handle display fallback and treat `@mention` targeting as unavailable.
- Any persisted username snapshot fields must be derived from Clerk `username` at write time.

## 3) Plugin Extension Fields

- Storage location (table or json path): `gdp_user_extension`
- Fields:
  - field name: `user_id`
    - type: uuid
    - nullable/default: non-null, FK to canonical profile
    - purpose: link plugin extension to canonical profile
  - field name: `display_currency`
    - type: text
    - nullable/default: default `USD`
    - purpose: user-selected display currency preference
  - field name: `display_density`
    - type: text enum (`summary` | `detailed`)
    - nullable/default: default `summary`
    - purpose: control dashboard complexity
  - field name: `category_visibility_prefs`
    - type: jsonb
    - nullable/default: default `{}`
    - purpose: category panel visibility preferences
  - field name: `notifications_enabled`
    - type: boolean
    - nullable/default: default `false`
    - purpose: opt-in to GDP update notifications

## 4) Domain Data Owned by Plugin

- Table/entity: `gdp_metric_snapshots`
  - Contains personal data? no
  - Retention period: long-lived historical
  - Legal/compliance note: public transparency artifact, immutable publish history required
- Table/entity: `gdp_category_breakdowns`
  - Contains personal data? no
  - Retention period: long-lived historical
  - Legal/compliance note: composition reporting metadata
- Table/entity: `gdp_provider_tier_snapshots`
  - Contains personal data? no (aggregate only)
  - Retention period: long-lived historical
  - Legal/compliance note: aggregate-only requirement to avoid re-identification
- Table/entity: `gdp_rollout_targets`
  - Contains personal data? no
  - Retention period: persistent while plan version is active + archived revisions
  - Legal/compliance note: governance artifact
- Table/entity: `gdp_metric_definition_events`
  - Contains personal data? minimal (`actor_id`, action metadata)
  - Retention period: compliance retention policy
  - Legal/compliance note: required for definition provenance and accountability

## 5) Service-Scoped Deletion Contract

When user deletes GDP plugin usage only:

- Delete immediately:
  - `gdp_user_extension` row for requesting user
- Anonymize/pseudonymize:
  - none required for aggregate plugin domain records
- Retain for compliance/fraud/finance:
  - plugin deletion request audit event (`scope = plugin`, `mini_app_name = gross-domestic-product`)
- Never touch (must remain):
  - canonical profile identity
  - plugin aggregate snapshot/history datasets
  - other plugin extension/domain data
- User-facing confirmation text:
  - “Delete Gross Domestic Product plugin preferences only? Your account and community GDP records remain active.”

## 6) Full-Account Deletion Contract

When user requests full account deletion:

- Additional records removed vs service-scoped deletion:
  - all GDP extension records for the user and GDP user-scoped audit references where policy permits
- Cross-service dependencies:
  - full-account orchestrator must execute cross-plugin policy for shared compliance tables
- Final expected state:
  - no recoverable user-scoped GDP preference data linked to deleted account; aggregate historical GDP metrics remain non-identifying

## 7) Rejoin/Re-enable Behavior

If user returns to GDP plugin after service-scoped deletion:

- Recreated defaults:
  - default GDP display preferences and notification settings
- Data that is not restored:
  - prior personalized GDP display preferences
- Re-consent required? (yes/no):
  - yes, for optional notifications and any future personalization requiring consent

## 8) Audit and Events

- Deletion event schema fields:
  - `id`, `user_id`, `scope`, `mini_app_name`, `requested_at`, `result`, `request_id`, `trace_id`
- Event table/path:
  - centralized deletion events table/path (platform canonical)
- Who can trigger deletion:
  - authenticated end user for own plugin scope
  - authorized system actor for full-account orchestration
- Alerting/monitoring requirement:
  - alert on deletion failures and abnormal deletion-spike patterns

## 9) API and UX Surface

- Service delete endpoint:
  - `DELETE /api/account/gross-domestic-product-profile` (planned)
- Full account delete endpoint (or orchestrator):
  - `DELETE /api/account/full-account` (platform orchestrator)
- Status model (`requested`, `processing`, `completed`, `failed`):
  - required for both plugin-scoped and full-account flows
- User-facing copy reviewed by:
  - Product, Compliance/Privacy, Survivor Advisory

## 10) Migration and Rollback

- Migration file(s):
  - TBD in implementation phase under `ctf/migrations/`
- Rollback approach:
  - reverse-order drop of GDP extension and GDP-only entities with explicit data-retention checks
- Backfill required? (yes/no):
  - yes (for historical GDP snapshots if importing baseline years)

## 11) Sign-off Checklist

- [ ] Product approved data behavior
- [ ] Engineering reviewed schema boundaries
- [ ] Compliance/privacy reviewed retention and deletion
- [ ] Observability added (without sensitive payloads)
- [ ] Web and Android parity confirmed

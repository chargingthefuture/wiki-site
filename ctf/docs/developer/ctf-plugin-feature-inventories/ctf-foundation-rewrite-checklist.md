# Foundation Rewrite Checklist (CTF)

## Scope and Boundary

- [ ] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation changes are required in `platform/`.
- [ ] Confirm plugin ID and command namespace.
  - Acceptance criteria:
    - All contracts/routes use stable slug `foundation`.
- [ ] Confirm Directory boundary contract.
  - Acceptance criteria:
    - Foundation reads Directory data through read-only projections only.
    - No Foundation command can mutate Directory behavior/data.

## Phase 0 — Contract and Policy Lock

- [ ] Lock Foundation command contracts for full-v1.
  - Acceptance criteria:
    - Every command includes `pluginId`, `command`, `version`, `purpose`, `retentionClass`, and `idempotency`.
- [ ] Lock Foundation access policy contracts.
  - Acceptance criteria:
    - Every command policy includes `consentRequirements`, `regionRestrictions`, `highRiskFlags`, and `denyConditions`.
- [ ] Lock Foundation audit contracts.
  - Acceptance criteria:
    - Every command has audit shape covering allow/deny decisions and policy evidence checks.
- [ ] Confirm Stream Maker-tier governance alignment.
  - Acceptance criteria:
    - Contracts and inventory align with `.claude/rules/110-stream-maker-tier-rules.mdc` threshold model and fallback rules.

## Phase 1 — Schema, Migrations, and Retention

- [ ] Define Foundation extension/domain schema and migrations under `ctf/migrations/`.
  - Acceptance criteria:
    - Schema includes thread/message/call/quote/notification/rate-limit/audit entities.
- [ ] Define quote lifecycle state model (`requested`, `provider_responded`, `closed`).
  - Acceptance criteria:
    - Invalid transitions are blocked and auditable.
- [ ] Define retention classes for communication, transactional, and audit entities.
  - Acceptance criteria:
    - Retention tags are documented and mapped in contracts and schema notes.
- [ ] Prepare rollback and replay notes.
  - Acceptance criteria:
    - Migration replay and rollback steps are captured for PR evidence.

## Phase 2 — Core Service and Command Execution

- [ ] Implement provider search service using Directory read-only projections.
  - Acceptance criteria:
    - Search/filter/ranking does not write to Directory domain.
- [ ] Implement 1:1 text thread create/send flows.
  - Acceptance criteria:
    - Thread membership is strictly survivor-provider pair only.
- [ ] Implement 1:1 voice/video session creation and policy checks.
  - Acceptance criteria:
    - Participant cap, duration cap, and region pinning checks are enforced.
- [ ] Implement quote create and state-transition commands.
  - Acceptance criteria:
    - Lifecycle transitions are deterministic and fully auditable.
- [ ] Implement history and notification command family.
  - Acceptance criteria:
    - Actor ownership checks prevent cross-user history access.

## Phase 3 — Rate Limiting, Quotas, and Scalability

- [ ] Implement command-level rate limiting for high-frequency actions.
  - Acceptance criteria:
    - Messaging/search/notification and quote updates enforce bounded request rates.
- [ ] Implement Stream usage meters and threshold states.
  - Acceptance criteria:
    - Green/yellow/orange/red transitions are observable and trigger expected degrade behavior.
- [ ] Implement graceful degradation strategy.
  - Acceptance criteria:
    - At orange/red states, non-critical behaviors degrade while core 1:1 messaging reliability is preserved.
- [ ] Add quota impact documentation for Stream-consuming surfaces.
  - Acceptance criteria:
    - PR includes required note under `ctf/docs/quota-impact/` with fallback and observability sections.

## Phase 4 — Web Full-v1 Delivery

- [ ] Deliver web provider search and profile preview flows.
  - Acceptance criteria:
    - Survivors can discover and select providers with accessibility-aware filters.
- [ ] Deliver web 1:1 messaging and voice/video flows.
  - Acceptance criteria:
    - Survivors/providers can complete text, voice, and video interactions end-to-end.
- [ ] Deliver web quote lifecycle flows.
  - Acceptance criteria:
    - Users can create, update, and review quote requests across 3-state lifecycle.
- [ ] Deliver web history and notification settings.
  - Acceptance criteria:
    - Users can review interaction history and control notification channels/quiet hours.

## Phase 5 — Android Parity Follow-up Tracking

- [ ] Create parity tracking table for all web-delivered Foundation capabilities.
  - Acceptance criteria:
    - Each capability includes owner, target sprint/date, risk, and parity test status.
- [ ] Implement Android parity for provider search and selection.
  - Acceptance criteria:
    - Android outcomes match web command semantics and policy decisions.
- [ ] Implement Android parity for 1:1 text/voice/video.
  - Acceptance criteria:
    - Android interactions match web command outcomes and audit events.
- [ ] Implement Android parity for quote lifecycle, history, and notifications.
  - Acceptance criteria:
    - Android supports requested/provider_responded/closed lifecycle and equivalent history/notification behavior.
- [ ] Close parity deferments.
  - Acceptance criteria:
    - Any deferred item includes approved risk note and final completion date.

## Phase 6 — Trauma-Informed and Accessibility Validation

- [ ] Validate trauma-informed UX constraints.
  - Acceptance criteria:
    - Language and interaction pacing avoid coercive urgency or harm-amplifying patterns.
- [ ] Validate accessibility constraints on web and Android.
  - Acceptance criteria:
    - Screen-reader, keyboard navigation, contrast, and caption/call accessibility criteria pass.
- [ ] Validate safety and reporting affordances.
  - Acceptance criteria:
    - Critical safety pathways are discoverable, clear, and policy-compliant.

## Phase 7 — Security, Compliance, and Deletion

- [ ] Verify authz, consent, region, and deny-condition enforcement.
  - Acceptance criteria:
    - Enforcement exists server-side for all command families.
- [ ] Verify audit integrity (allow + deny).
  - Acceptance criteria:
    - Audit records are append-only, redacted/tokenized, and correlation IDs are present.
- [ ] Verify Foundation profile/deletion contract behavior.
  - Acceptance criteria:
    - Plugin-scoped deletion preserves canonical profile and Directory data.
    - Full-account flow removes Foundation user-scoped data per orchestrator policy.

## Testing and Release Gates

- [ ] Add command schema validation tests.
  - Acceptance criteria:
    - Unknown fields, type errors, bounds violations, and invalid enum values fail.
- [ ] Add access policy enforcement tests.
  - Acceptance criteria:
    - Missing consent, wrong role, region restrictions, cross-tenant access, and deny conditions are covered.
- [ ] Add audit contract tests.
  - Acceptance criteria:
    - Allow and deny outcomes include expected evidence fields and request/trace correlations.
- [ ] Add integration tests for quote lifecycle and history.
  - Acceptance criteria:
    - Requested/provider_responded/closed transitions and read permissions are deterministic.
- [ ] Add integration tests for Stream degradation behavior.
  - Acceptance criteria:
    - Yellow/orange/red threshold behavior aligns with Maker-tier rules.
- [ ] Add web + Android parity acceptance tests.
  - Acceptance criteria:
    - Parity-required flows pass with equivalent outcomes.

## Documentation and Inventory Lifecycle

- [ ] Keep `ctf-foundation-feature-inventory.md` updated with each accepted feature change.
  - Acceptance criteria:
    - Add/remove/behavior changes are reflected in same PR as implementation.
- [ ] Keep Foundation contracts updated with version and compatibility notes.
  - Acceptance criteria:
    - Command/policy/audit changes include migration impact notes when relevant.
- [ ] Capture checklist evidence links for completed items.
  - Acceptance criteria:
    - Each completed checkbox references PR/commit/test/document evidence.

## Change Log

- 2026-02-24: Created initial Foundation rewrite checklist with full-v1 gates for search, 1:1 text/voice/video, quote lifecycle, history, notifications, rate limiting/scalability, trauma-informed accessibility, and web-first to Android parity follow-up tracking.

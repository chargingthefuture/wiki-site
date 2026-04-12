# Feed Rewrite Checklist (CTF)

## Scope and Boundary

- [x] Confirm implementation scope is `ctf/` only.
  - Acceptance criteria:
    - No implementation work is required in `platform/`.
- [x] Confirm central admin surface decision.
  - Acceptance criteria:
    - Feed + Announcements admin workflows are implemented under `/admin/feed-announcements`.
- [x] Confirm delivery policy.
  - Acceptance criteria:
    - Web-first implementation accepted; Android follow-up tracked by ticket link in PR.

## Phase 0 — Contract and Naming Lock

- [x] Lock Feed command contracts.
  - Acceptance criteria:
    - Commands conform to `.github/instructions/201-plugin-command-schema-template.mdc`.
- [x] Lock Feed access policy contracts.
  - Acceptance criteria:
    - Access policy conforms to `.github/instructions/202-plugin-access-policy-schema-template.mdc` with role/consent/region constraints.
- [x] Lock Feed audit contracts.
  - Acceptance criteria:
    - Audit events conform to `.github/instructions/203-plugin-audit-schema-template.mdc` with allow/deny parity.
- [x] Normalize Announcements spelling across new docs and APIs where feasible.
  - Acceptance criteria:
    - New implementation removes legacy typo

## Phase 1 — Schema and Migration Readiness

- [x] Implement Feed extension and domain schema.
  - Acceptance criteria:
    - Canonical profile is reused; extension table keyed by `user_id` with no duplicate profile model.
- [x] Add Feed migration SQL under `ctf/migrations/`.
  - Acceptance criteria:
    - Migration replay and rollback are validated.
- [x] Implement membership event stream table/contracts.
  - Acceptance criteria:
    - Join/leave membership event payload is stable and auditable.
- [x] Run schema drift predeployment checks.
  - Acceptance criteria:
    - Drift check between SQL migrations, app schema, and API contracts is attached as PR evidence.

## Phase 2 — API and Fan-Out Behavior

- [x] Implement timeline/read/dismiss API flows.
  - Acceptance criteria:
    - Authz, validation, and idempotency behavior are deterministic.
- [x] Implement Postgres source-of-truth write path for Feed content.
  - Acceptance criteria:
    - Canonical object state is committed to Postgres before fan-out.
- [x] Implement Stream fan-out projection pipeline.
  - Acceptance criteria:
    - Projection retries are safe; duplicate fan-out does not duplicate canonical records.
- [x] Implement admin mutation endpoints for Feed controls.
  - Acceptance criteria:
    - Publish/archive/render-mode updates are role-gated and audited.

## Phase 3 — Web Delivery

- [x] Implement web timeline UI and item states.
  - Acceptance criteria:
    - Feed items, read/unread, dismiss states are fully operable.
- [x] Implement Announcements-in-Feed rendering.
  - Acceptance criteria:
    - Announcement cards render with priority/expiry handling.
- [x] Implement optional toast mode under Feed controls.
  - Acceptance criteria:
    - Toast mode is configurable and can be disabled without disabling card rendering.
- [x] Implement `/admin/feed-announcements` surface.
  - Acceptance criteria:
    - Admin can configure rendering, publish/archive items, and review change history.

## Phase 4 — Questions Channel and LLM Integration

- [x] Implement `feed_questions`, `feed_answers`, `feed_answer_ratings`, and `llm_inference_log` schema.
  - Acceptance criteria:
    - Tables use `CREATE TABLE IF NOT EXISTS` + `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` per migration rules.
- [x] Implement `feed.question.submit` API and command flow.
  - Acceptance criteria:
    - Questions are persisted to Postgres, visible in unified timeline, and audited.
- [x] Implement `feed.question.answer.generate` LLM inference pipeline.
  - Acceptance criteria:
    - LLM call is logged in `llm_inference_log`; model ID, latency, and token counts are tracked.
    - Consent scope `llm_processing` is verified before inference.
- [x] Implement `feed.question.answer.rate` endpoint.
  - Acceptance criteria:
    - Users can rate LLM answers; ratings are audited and feed back into quality metrics.
- [x] Implement questions channel tab/filter in web timeline UI.
  - Acceptance criteria:
    - Timeline can filter to questions-only view; LLM answers render inline.

## Phase 5 — Community Support Channel

- [x] Implement `feed_community_posts` and `feed_community_replies` schema.
  - Acceptance criteria:
    - Tables use guarded DDL per migration rules.
- [x] Implement `feed.community.post.create` and `feed.community.post.reply` API flows.
  - Acceptance criteria:
    - Posts and replies are persisted, visible in timeline, and audited.
    - Content moderation policies are enforced per access contracts.
- [x] Implement community channel tab/filter in web timeline UI.
  - Acceptance criteria:
    - Timeline can filter to community-only view.

## Phase 6 — Android Parity (Required)

- [ ] Implement Android feed timeline with three-channel support.
  - Acceptance criteria:
    - Announcements, questions, and community posts render with correct visibility and read/dismiss states.
- [ ] Implement Android LLM Q&A flow.
  - Acceptance criteria:
    - Question submission, LLM answer display, and answer rating work on Android.
- [ ] Implement Android community support flow.
  - Acceptance criteria:
    - Community post creation and reply work on Android.
- [ ] Validate Android parity against `plugin-parity-contracts.json`.
  - Acceptance criteria:
    - All three channels pass parity validation; no web-only gaps remain.

## Phase 7 — Security, Compliance, and Hardening

- [x] Validate policy enforcement and CSRF coverage.
  - Acceptance criteria:
    - All state mutations have server-side authz and CSRF protections.
- [x] Validate deletion contracts.
  - Acceptance criteria:
    - Plugin-scoped and full-account deletion behavior is documented against `ctf/docs/templates/PLUGIN_PROFILE_AND_DELETION_CONTRACT_TEMPLATE.md`.
- [x] Validate observability and redaction.
  - Acceptance criteria:
    - Logs omit sensitive payload details while preserving operational/audit fields.

## Validation, Seeds, and Release Gates [MVP: VALIDATION DEFERRED — see Rule 118.]

- [x] Command contract documentation.
  - Acceptance criteria:
    - Schema, policy, and audit behavior are documented.
- [x] Postgres + Stream consistency design.
  - Acceptance criteria:
    - Canonical-write-before-fan-out behavior is documented.
- [x] Web timeline and optional toast mode design.
  - Acceptance criteria:
    - Rendering mode toggles and fallbacks are implemented.
- [x] Deterministic seed scenarios.
  - Acceptance criteria:
    - Seed set includes feed items, announcements, membership events, and read/dismiss states.

## Quota-Impact and Predeployment Evidence

- [x] Add Stream quota-impact note for fan-out changes.
  - Acceptance criteria:
    - Note is created using `ctf/docs/quota-impact/TEMPLATE.md` and linked in PR.
- [x] Include schema drift predeployment evidence in PR.
  - Acceptance criteria:
    - PR includes command output/screenshots/logs proving drift check completion and migration verification.
- [ ] Implementation tracking. [EVIDENCE CAPTURE DEFERRED FOR MVP — see Rule 118.]
  - Acceptance criteria:
    - Implementation status is tracked; detailed evidence collection deferred to post-MVP.

## Change Log

- 2026-02-24: Created initial Feed rewrite checklist with approved web-first policy, central admin page decision, naming normalization/alias guidance, Postgres+Stream architecture controls, stream quota-impact gate, and schema drift predeployment evidence requirements.
- 2026-03-02: Completed phase-0 implementation for combined feed+announcements stream, including migration, API routes, policy/audit guards, admin surface, seed fixtures, and quota-impact note.
- 2026-04-05: Added Phase 4 (Questions + LLM), Phase 5 (Community Support), Phase 6 (Android Parity — required). Renumbered security/compliance to Phase 7. All commands now use unified `feed.*` namespace per FEED_PLUGIN_COMMAND_CONTRACTS.yaml.
- 2026-04-05: Implemented the unified three-channel web runtime for Feed, including questions, LLM-assisted answers with audit logging, community support posts/replies, and mobile parity shell directories for `feed`, `announcements`, `questions`, and `community`.

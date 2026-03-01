# Foundation Plugin Feature Inventory (CTF Rewrite)

## Scope and Boundary

- Rewrite target only: `ctf/`
- Legacy `platform/` remains reference-only and must not be modified.
- Unified plugin scope slug: `foundation`
- Product scope: 1-on-1 survivor-provider connection plugin using GetStream for text/voice/video.
- This document is the full-v1 planning inventory and lifecycle artifact.

## Intent and Outcome

Foundation delivers trauma-informed survivor-provider connection workflows that are policy-controlled, auditable, and scalable under current Stream Maker-tier constraints.

Planning constraints applied:

1. Inventory/checklist lifecycle follows `.github/instructions/120-plugin-feature-inventory-lifecycle-rules.mdc`.
2. Command/access/audit design follows `.github/instructions/200-plugin-command-contract-templates.mdc` and templates `201`/`202`/`203`.
3. Stream usage design and quota safety follows `.github/instructions/110-stream-maker-tier-rules.mdc`.
4. Canonical profile/plugin extension boundaries follow single-profile plugin-extension rules.

---

## 1) Planned User Features (Full-v1)

### 1.1 Provider Discovery and Search

1. Survivor search for providers by service type, location, language, and availability.
2. Filter and ranking support for trauma-informed criteria (for example: communication style tags, support modality, scheduling flexibility).
3. Read-only ingestion of Directory provider projections for search cards and provider details.
4. Clear empty-state and no-match guidance without coercive interaction patterns.

### 1.2 Survivor-Provider 1:1 Text Connection

1. Deterministic thread creation for survivor-provider 1:1 messaging only.
2. Real-time text messaging over shared GetStream adapters.
3. In-thread delivery/read/seen semantics.
4. Attachment support limited to approved, policy-scanned types.

### 1.3 Survivor-Provider 1:1 Voice and Video

1. Voice session start/join for approved 1:1 participants.
2. Video session start/join for approved 1:1 participants.
3. Session guardrails for participant caps, duration caps, and graceful fallback under quota pressure.
4. Caption/subtitle and low-bandwidth fallback modes where available.

### 1.4 Quote Requests (Three-State Lifecycle)

1. Survivor creates quote request from provider thread context.
2. Provider responds through explicit lifecycle transitions:
   - `requested`
   - `provider_responded`
   - `closed`
3. Immutable lifecycle timeline view for both participants.
4. Deterministic state-transition validation and denial messaging.

### 1.5 History and Continuity

1. Thread and quote history lists scoped by actor ownership.
2. History surfaces for text, voice, and video summaries.
3. Continuity summaries to support follow-up without exposing unnecessary sensitive payloads.
4. Explicit retention-window behavior for historical data access.

### 1.6 Notifications

1. In-app notifications for new messages, quote state changes, and missed call events.
2. Push channel support where user has opted in.
3. Quiet-hour and notification preference controls.
4. Notification acknowledgment and deduplicated delivery behavior.


## 2) Planned Admin Features

### 2.1 Capacity and Quota Operations

1. Admin control for Foundation capacity policy under Stream Maker-tier limits.
2. Configurable green/yellow/orange/red threshold handling aligned to rule-based budgets.
3. Kill-switch and degrade controls for non-critical behavior when quotas tighten.

### 2.2 Policy and Safety Operations

1. Operational review of denied command decisions and reason-code trends.
2. Moderation escalation support for abusive or unsafe communication patterns.
3. Policy diagnostics for consent, region, and role-driven denials.

### 2.3 Reliability Operations

1. Rate-limit tuning by command family.
2. Alert triage for quota threshold transitions and command failure spikes.
3. Recovery controls for delayed notification jobs and queue backpressure.

## 3) API Surface and Route Map (Planned)

### 3.1 Plugin Command Surface (Authoritative)

All command contracts conform to:

- `.github/instructions/201-plugin-command-schema-template.mdc`
- `.github/instructions/202-plugin-access-policy-schema-template.mdc`
- `.github/instructions/203-plugin-audit-schema-template.mdc`

Full-v1 command groups:

1. `foundation.search.providers`
2. `foundation.connection.thread.create`
3. `foundation.connection.message.send`
4. `foundation.connection.call.session.create`
5. `foundation.quote.request.create`
6. `foundation.quote.request.state.update`
7. `foundation.quote.request.history.list`
8. `foundation.connection.history.list`
9. `foundation.notification.preferences.update`
10. `foundation.notification.event.ack`
11. `foundation.safeguards.rate_limit.evaluate`
12. `foundation.admin.capacity.policy.update`

### 3.2 HTTP Projection Routes (Planned)

User routes:

- `GET /api/foundation/providers/search`
- `POST /api/foundation/connections/threads`
- `POST /api/foundation/connections/threads/:threadId/messages`
- `POST /api/foundation/connections/threads/:threadId/calls`
- `POST /api/foundation/quotes`
- `POST /api/foundation/quotes/:quoteRequestId/state`
- `GET /api/foundation/quotes/history`
- `GET /api/foundation/connections/history`
- `PUT /api/foundation/notifications/preferences`
- `POST /api/foundation/notifications/:notificationEventId/ack`

Admin routes:

- `POST /api/foundation/admin/rate-limits/evaluate`
- `PUT /api/foundation/admin/capacity-policy`
- `GET /api/foundation/admin/audit-events`

## 4) Data Model and Storage Contracts (Planned)

### 4.1 Canonical Profile and Extension Strategy

1. Reuse canonical profile for identity, consent pointering, and baseline defaults.
2. Use Foundation extension data keyed by canonical `user_id`.
3. No duplicate standalone identity table for Foundation.

### 4.2 Foundation-Owned Domain Entities

1. `foundation_user_extension`
2. `foundation_connection_threads`
3. `foundation_thread_participants`
4. `foundation_message_metadata`
5. `foundation_call_sessions`
6. `foundation_quote_requests`
7. `foundation_quote_status_events`
8. `foundation_notification_preferences`
9. `foundation_notification_events`
10. `foundation_rate_limit_counters`
11. `foundation_quota_threshold_states`
12. `foundation_capacity_policies`
13. `foundation_admin_audit_trail`

### 4.3 Directory Integration Boundary (Mandatory)

1. Foundation reads Directory projections as input to provider discovery and eligibility checks.
2. Foundation MUST NOT write to Directory tables or trigger Directory mutation behavior.
3. Directory remains authoritative for provider profile ownership and lifecycle.
4. Any Directory data dependency changes require explicit contract review.

### 4.4 Stream Integration and Scalability Constraints

1. All Stream chat/video calls go through shared wrappers in `packages/shared`.
2. Meter usage for MAU, API calls, and participant minutes per command family.
3. At quota thresholds:
   - Yellow (70–85%): reduce non-critical refresh/enrichment.
   - Orange (85–95%): disable/queue non-critical automations.
   - Red (95–100%): preserve core send/receive and active 1:1 thread reliability first.
4. Rate limiting and command-level throttling are mandatory for all high-frequency actions.

## 5) Security, Privacy, and Compliance Controls (Planned)

1. Server-side policy enforcement for roles, consent, region restrictions, and deny conditions.
2. Deny-by-default cross-tenant and unauthorized cross-region access.
3. Audit contracts must log both allow and deny outcomes with decision evidence fields.
4. Data minimization for history and notification payloads.
5. Redaction/tokenization for sensitive communication metadata in logs.
6. Distinct plugin-scoped deletion and full-account deletion handling.

## 6) Web and Android Delivery Strategy (Planned)

1. Full-v1 delivery strategy is web-first.
2. Android parity follows as tracked deliverables in checklist with owner + due date for each deferred parity item.
3. Policy behavior, consent enforcement, and deletion behavior cannot be permanently platform-divergent.
4. Any temporary parity deferment must include risk note and mitigation timeline.

## 7) Seed Coverage Status (Planned)

Seed script requirement: Provide a deterministic plugin seed script with dummy development data for manual plugin validation in dev environments.

## 8) Gaps, Ambiguities, and Known Technical Debt (Planning)

1. Final quote payload schema by service category needs product + compliance sign-off.
2. Voice/video fallback interaction copy requires survivor-advisory review.
3. Notification channel rollout order by region needs operations decision.
4. Capacity policy defaults need validated monthly demand assumptions.
5. Android parity execution windows and owners need milestone lock.

## 9) Delivery Phasing (Plan)

1. Phase 0 — Contract and policy lock:
   - finalize command/policy/audit contracts,
   - lock read-only Directory boundary,
   - lock retention/deletion semantics.
2. Phase 1 — Core backend and Stream integration:
   - thread/message/call/quote/notification primitives,
   - rate limiting + threshold logic,
   - audit instrumentation.
3. Phase 2 — Web full-v1 experience:
   - search,
   - 1:1 messaging/calls,
   - quote lifecycle and history,
   - notification settings.
4. Phase 3 — Android parity follow-up:
   - parity tracking closure items from rewrite checklist,
   - trauma-informed validation.
5. Phase 4 — Hardening and release readiness:
   - quota-impact docs,
   - observability thresholds,
   - release gates.

## 10) Change Log

- 2026-02-24: Created initial Foundation CTF rewrite inventory with full-v1 scope for search, 1:1 text/voice/video, quote lifecycle, history, notifications, rate limiting, scalability controls, and trauma-informed constraints.

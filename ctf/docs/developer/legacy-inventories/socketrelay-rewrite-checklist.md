# SocketRelay Rewrite Checklist

## Scope & Decisions

- [ ] Confirm rewrite boundary is ctf-only; platform is reference-only.
  - Acceptance criteria:
    - No implementation tasks target `platform/`.
- [ ] Freeze v1 parity scope for SocketRelay.
  - Acceptance criteria:
    - Included: profile CRUD, request lifecycle, fulfillment lifecycle, chat, public share views, announcements, admin moderation.
- [ ] Resolve schema source-of-truth conflicts.
  - Acceptance criteria:
    - Shared schema, migration SQL, and seed payloads agree on profile/request fields.
- [ ] Resolve public privacy projection contract.
  - Acceptance criteria:
    - Public API explicitly defines identity and location field exposure.
- [ ] Resolve cross-module route ownership.
  - Acceptance criteria:
    - Directory announcement routes are not owned by SocketRelay module boundaries in ctf.

## Phase Plan

- [ ] Phase 0: Contract and boundary lock.
  - Acceptance criteria:
    - Open decisions are resolved or deferred with owner/date.
- [ ] Phase 1: Shared schema + migrations.
  - Acceptance criteria:
    - Profile/request/fulfillment/message/announcement entities are finalized and replay-safe.
- [ ] Phase 2: API implementation.
  - Acceptance criteria:
    - Private, public, and admin route contracts are implemented with policy controls.
- [ ] Phase 3: Web + mobile implementation.
  - Acceptance criteria:
    - Dashboard/profile/chat/public/admin flows use shared contracts.
- [ ] Phase 4: Hardening and release.
  - Acceptance criteria:
    - Security, privacy, performance, and release gates are complete.

## API Contract Tasks

- [ ] Define profile contracts (`GET/POST/PUT/DELETE`).
  - Acceptance criteria:
    - Validation and deletion semantics are explicit.
- [ ] Define request contracts (list/detail/my/create/update/repost).
  - Acceptance criteria:
    - Expiration, status, and ownership behavior are deterministic.
- [ ] Define fulfillment contracts (create/get/my/close).
  - Acceptance criteria:
    - Allowed close statuses and actor permissions are explicit.
- [ ] Define message contracts (list/send).
  - Acceptance criteria:
    - Access control for fulfillment participants is enforced and tested.
- [ ] Define public contracts (`/public`, `/public/:id`).
  - Acceptance criteria:
    - Public DTO and anti-scraping/rate-limit policy are documented.
- [ ] Define announcements/admin contracts.
  - Acceptance criteria:
    - User and admin announcement endpoints + moderation endpoints are stable.

## Web Tasks

- [ ] Implement dashboard request workflow.
  - Acceptance criteria:
    - Create/edit/repost/claim flows are complete with clear status UX.
- [ ] Implement profile CRUD flow.
  - Acceptance criteria:
    - Validation, delete confirmation, and post-delete behavior are complete.
- [ ] Implement chat flow for fulfillments.
  - Acceptance criteria:
    - Polling/refresh strategy and error states are deterministic.
- [ ] Implement public list/detail pages.
  - Acceptance criteria:
    - Public privacy projection matches API contract exactly.
- [ ] Implement admin pages for requests/fulfillments/announcements.
  - Acceptance criteria:
    - Admin route guards and forbidden states are handled.

## Mobile Tasks

- [ ] Implement request/fulfillment/chat parity on mobile.
  - Acceptance criteria:
    - Core workflow parity with web is validated.
- [ ] Implement public view parity on mobile as approved.
  - Acceptance criteria:
    - Public exposure contract is identical to web.
- [ ] Implement admin scope decision on mobile.
  - Acceptance criteria:
    - Included or excluded state is explicit and documented.

## Shared/Schema Tasks

- [ ] Finalize SocketRelay schema contracts.
  - Acceptance criteria:
    - Field definitions are consistent across shared schema and SQL migration artifacts.
- [ ] Define canonical status enums.
  - Acceptance criteria:
    - Request and fulfillment statuses are shared and validated in all clients.
- [ ] Define profile deletion and anonymization behavior.
  - Acceptance criteria:
    - Cascade/anonymization outcomes are explicit and testable.
- [ ] Separate public vs authenticated DTOs.
  - Acceptance criteria:
    - Public DTO cannot leak non-public identity fields.

## Security/Compliance Tasks

- [ ] Enforce auth and ownership checks for private workflows.
  - Acceptance criteria:
    - Unauthorized and forbidden responses are consistent.
- [ ] Enforce admin + CSRF on admin writes.
  - Acceptance criteria:
    - Moderation and announcement writes require both controls.
- [ ] Enforce anti-scraping + rate limits for public routes.
  - Acceptance criteria:
    - Listing and item views include abuse-control coverage.
- [ ] Add/verify audit logging for admin mutations.
  - Acceptance criteria:
    - Actor/action/target/timestamp are recorded.

## Testing & Release Gates

- [ ] Add contract tests for all SocketRelay API groups.
  - Acceptance criteria:
    - Success, authz, validation, conflict, and not-found paths are covered.
- [ ] Add integration tests for request→fulfillment→close lifecycle.
  - Acceptance criteria:
    - Lifecycle transitions and access checks are validated end-to-end.
- [ ] Add web/mobile integration tests for key user/admin flows.
  - Acceptance criteria:
    - Stable selectors and non-skip paths are defined.
- [ ] Add public-route privacy tests.
  - Acceptance criteria:
    - Public payload projection checks are enforced in CI.
- [ ] Release readiness checklist.
  - Acceptance criteria:
    - Migration replay, seed validation, monitoring, rollback plan complete.

## Open Decisions

- [ ] Canonical schema authority and migration pipeline.
  - Acceptance criteria:
    - Owner and process documented.
- [ ] Public DTO field-level privacy contract.
  - Acceptance criteria:
    - Product/security approved and testable.
- [ ] Cross-plugin route ownership cleanup strategy.
  - Acceptance criteria:
    - SocketRelay module only owns SocketRelay routes in ctf.

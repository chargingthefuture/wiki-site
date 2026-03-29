# Platform Non-Plugin Feature Inventory (Legacy Reference)

## Scope

- **Source analyzed (reference-only):** `platform/`
- **Rewrite target:** `ctf/`
- **Surface inventoried:** cross-cutting platform features and shared APIs (non-plugin)
- **Write boundary observed:** no edits in `platform/` (per `.claude/rules/index.mdc` and `099-agent-scope-guardrails.mdc`)
- **Inclusion rule used:** include shared/global capabilities even when consumed by plugins; exclude plugin-specific feature bodies already covered by plugin inventories.

---

## Executive Summary

Legacy `platform/` includes a substantial non-plugin foundation that spans:

- global route shell and access control,
- authentication/account lifecycle,
- onboarding/approval/terms gating,
- global admin operations,
- shared taxonomy and messaging APIs,
- security/compliance middleware,
- observability and health operations,
- deployment/runtime and ops scripts.

This inventory consolidates those features so rewrite planning can explicitly choose what to keep, rebuild, defer, or remove.

---

## 1) Boundary and Classification Rules

Evidence:

- `platform/client/src/routes/plugin-routes.tsx`
- `platform/client/src/routes/index.tsx`
- `platform/server/routes/index.ts`

Classification used:

1. **Plugin scope** = route/functionality under `/apps/{plugin}` and plugin-specific storage/routes/pages.
2. **Non-plugin scope** = platform shell, identity/access lifecycle, global admin, shared APIs/contracts, security/compliance layers, and runtime/ops.
3. Plugin code is referenced only when it proves cross-app shared behavior.

---

## 2) Global Routing and App Shell Features

### 2.1 Route Group Composition

Evidence:

- `platform/client/src/routes/index.tsx`
- `platform/client/src/routes/public-routes.tsx`
- `platform/client/src/routes/protected-routes.tsx`
- `platform/client/src/routes/admin-routes.tsx`

Features:

1. Split route model: public, protected, admin, plugin route groups.
2. Root route behavior toggles between landing and authenticated home shell.
3. Conditional 404 strategy for unmatched client routes.
4. Route-base allowlist pattern to avoid false 404 in shell composition.

### 2.2 Access Wrappers and Gating

Evidence:

- `platform/client/src/routes/route-wrappers.tsx`
- `platform/client/src/components/pending-approval.tsx`
- `platform/client/src/components/terms-acceptance-dialog.tsx`

Features:

1. `ProtectedRoute` gate for signed-in access.
2. Pending approval interstitial for non-approved non-admin users.
3. Terms acceptance blocking flow before platform usage.
4. `AdminRoute` privilege gate with explicit access-denied UX.
5. Conditional room access wrapper (`ChymeRoomRoute`) with room-type check before auth redirect.

---

## 3) Auth, Identity, and Account Lifecycle

Evidence:

- `platform/server/routes/auth.routes.ts`
- `platform/server/auth.ts`
- `platform/client/src/pages/account/delete.tsx`
- `platform/client/src/pages/logout.tsx`

Features:

1. Current-user session endpoint (`GET /api/auth/user`).
2. Account deletion pathway (`DELETE /api/account/delete`) with optional reason capture.
3. Terms acceptance write endpoint (`POST /api/account/accept-terms`).
4. User profile writes for identity/contact fields:
   - `PUT /api/user/quora-profile-url`
   - `PUT /api/user/name`
5. User payment read endpoints:
   - `GET /api/payments`
   - `GET /api/payments/status`
6. Clerk-backed auth middleware integration and user synchronization pipeline.

---

## 4) Global Admin Core (Non Plugin Admin)

Evidence:

- `platform/server/routes/admin.routes.ts`
- `platform/client/src/pages/admin/users.tsx`
- `platform/client/src/pages/admin/payments.tsx`
- `platform/client/src/pages/admin/activity.tsx`
- `platform/client/src/pages/admin/pricing-tiers.tsx`
- `platform/client/src/pages/admin/weekly-performance.tsx`

Features:

1. Weekly performance metrics read (`GET /api/admin/weekly-performance`).
2. Anti-scraping admin controls:
   - `GET /api/admin/anti-scraping/patterns`
   - `DELETE /api/admin/anti-scraping/patterns` (CSRF-guarded)
3. User admin operations:
   - `GET /api/admin/users`
   - `PUT /api/admin/users/:id/verify` (CSRF-guarded)
   - `PUT /api/admin/users/:id/approve` (CSRF-guarded)
4. Payment admin operations:
   - `GET /api/admin/payments`
   - `GET /api/admin/payments/delinquent`
   - `POST /api/admin/payments` (CSRF-guarded)
5. Admin activity feed (`GET /api/admin/activity`).
6. Pricing tier management:
   - `GET /api/admin/pricing-tiers`
   - `POST /api/admin/pricing-tiers` (CSRF-guarded)
   - `PUT /api/admin/pricing-tiers/:id/set-current` (CSRF-guarded)

---

## 5) Shared APIs and Cross-App Data Services

### 5.1 Shared Skills Taxonomy Service

Evidence:

- `platform/server/routes/skills.routes.ts`
- `platform/shared/schema/skills/index.ts`

Features:

1. Read hierarchy/flattened skill trees.
2. Admin CRUD for sectors.
3. Admin CRUD for job titles.
4. Admin CRUD for skills.
5. Reused by multiple plugin selectors and admin tooling.

### 5.2 Generic Messaging Surface (Legacy)

Evidence:

- `platform/server/routes/chat.routes.ts`
- `platform/shared/schema/chat.ts`

Features:

1. Message create (`POST /api/chat/messages`).
2. Message read (`GET /api/chat/messages`).
3. Shared chat schema contract used outside a single plugin namespace.

### 5.3 Shared Storage Composition

Evidence:

- `platform/server/storage/core/core-storage.ts`
- `platform/server/storage/composed/core-storage-composed.ts`
- `platform/server/storage/index.ts`

Features:

1. Core storage abstractions for users, payments, and admin-level records.
2. Composed storage surface exposed to route modules.
3. Centralized storage export used as a cross-domain dependency layer.

---

## 6) Cross-App UI Pattern: External Link Safety Flow

Evidence:

- `platform/client/src/hooks/useExternalLink.tsx`
- `platform/client/src/components/app-sidebar.tsx`
- `platform/client/src/pages/home.tsx`
- `platform/client/src/pages/user-payments.tsx`
- `platform/client/src/pages/admin/users.tsx`
- `platform/test/client/hooks/useExternalLink.test.tsx`
- `platform/guides/TESTING.md`

Features:

1. Central hook (`useExternalLink`) normalizes opening links in a controlled dialog flow.
2. Dialog presents URL preview, cancel/open actions, and clipboard copy action.
3. Internal-vs-external detection affects warning copy but still enforces deliberate open flow.
4. Pattern reused broadly across shell/admin/page components (and within plugin pages), making it a platform-level UX primitive suitable for ctf rewrite.
5. Dedicated hook tests exist in legacy test suite.

---

## 7) Security, Privacy, and Compliance Middleware

Evidence:

- `platform/server/index.ts`
- `platform/server/csrf.ts`
- `platform/server/rateLimiter.ts`
- `platform/server/antiScraping.ts`
- `platform/server/securityProbeBlocker.ts`
- `platform/server/dataObfuscation.ts`

Features:

1. Security headers at app level (HSTS, CSP, frame/content/referrer/permissions policies).
2. Request fingerprinting middleware applied before route handling.
3. CSRF token validation for sensitive admin mutations.
4. Route-specific and health-specific rate limiting support.
5. Suspicious traffic detection/anti-scraping response controls.
6. Security probe path blocking (e.g., `.git`, `.env`, known exploit probe paths).
7. Data exposure minimization utilities for public-facing responses.

---

## 8) Observability and Health Operations

Evidence:

- `platform/server/sentry.ts`
- `platform/server/healthCheck.ts`
- `platform/server/routes/health.routes.ts`
- `platform/server/statusPageIntegration.ts`

Features:

1. Sentry initialization with environment/release metadata.
2. Console capture and breadcrumb/error forwarding into Sentry.
3. Health endpoint matrix including app-level and plugin-specific health checks:
   - `GET /api/health`
   - `GET /api/health/all`
   - `GET /api/health/database`
   - plugin health endpoints under `/api/health/*`
4. Health check limiter support.
5. Unhandled rejection and uncaught exception capture path in server bootstrap.

---

## 9) Runtime, Deployment, and Operational Tooling

Evidence:

- `platform/Dockerfile`
- `platform/railway.toml`
- `platform/vercel.json`
- `platform/package.json`
- `platform/scripts/seed_scripts.md`
- `platform/scripts/deleteUserAccount.ts`
- `platform/scripts/seedPaymentTracking.ts`
- `platform/scripts/seedWeeklyPerformanceMetrics.ts`

Features:

1. Multi-target runtime/deploy configuration (Railway/Vercel/Docker artifacts).
2. Scripted local dev/build/test lifecycle in package scripts.
3. Data/ops scripts for account cleanup and environment seeding.
4. Dedicated seed orchestration docs for operator workflows.

---

## 10) API Surface (Non-Plugin Consolidated)

### 10.1 Identity and Account

- `GET /api/auth/user`
- `DELETE /api/account/delete`
- `POST /api/account/accept-terms`
- `GET /api/payments`
- `GET /api/payments/status`
- `PUT /api/user/quora-profile-url`
- `PUT /api/user/name`

### 10.2 Global Admin

- `GET /api/admin/weekly-performance`
- `GET /api/admin/anti-scraping/patterns`
- `DELETE /api/admin/anti-scraping/patterns`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/verify`
- `PUT /api/admin/users/:id/approve`
- `GET /api/admin/payments`
- `GET /api/admin/payments/delinquent`
- `POST /api/admin/payments`
- `GET /api/admin/activity`
- `GET /api/admin/pricing-tiers`
- `POST /api/admin/pricing-tiers`
- `PUT /api/admin/pricing-tiers/:id/set-current`

### 10.3 Shared Taxonomy + Messaging

- `GET /api/skills/hierarchy`
- `GET /api/skills/flattened`
- `GET/POST/PUT/DELETE /api/skills/sectors*`
- `GET/POST/PUT/DELETE /api/skills/job-titles*`
- `GET/POST/PUT/DELETE /api/skills/skills*`
- `POST /api/chat/messages`
- `GET /api/chat/messages`

### 10.4 Health and Runtime

- `GET /api/health`
- `GET /api/health/all`
- `GET /api/health/database`
- `GET /api/health/{plugin-slug}` (existing legacy health matrix)

---

## 11) Broken / Stub / Scaffold Reality

This section explicitly separates direct evidence from inferred risks.

### 11.1 Confirmed by Code Evidence

1. **E2E disabled in default script path**
   - `platform/package.json` uses `test:e2e` script that exits success with disabled message.

2. **Extensive runtime skipping in e2e suites**
   - `platform/test/e2e/supportmatch.spec.ts` contains numerous `test.skip()` branches.
   - `platform/test/e2e/lighthouse.spec.ts` contains numerous `test.skip()` branches.

3. **Conditional smoke/integration coverage**
   - `platform/test/smoke.test.ts` uses `it.skipIf(!process.env.DATABASE_URL)` for key import checks.

4. **Scaffold artifact in route extraction utility**
   - `platform/server/routes/extract_routes.py` includes TODO scaffold comment for schema imports.

5. **Temporary workaround called out in router composition**
   - `platform/client/src/routes/index.tsx` documents a workaround strategy around historical white-screen routing behavior.

### 11.2 Likely Migration Risk Signals

1. **Auth/runtime coupling risk in server bootstrap**
   - `platform/server/index.ts` maps `VITE_CLERK_PUBLISHABLE_KEY` into `CLERK_PUBLISHABLE_KEY` at runtime as a defensive fallback; rewrite should formalize env contract.

2. **Policy drift risk for chat naming/positioning**
   - Legacy exposes generic `/api/chat/*` while ctf product rules require plugin contextualized chat framing.

3. **Test confidence gap for release readiness**
   - Combined disabled e2e default and high skip density implies limited confidence from automated end-to-end coverage.

---

## 12) Ambiguities and Rewrite Decisions Needed

1. **Generic chat route strategy**
   - Keep as shared API, or split/reframe strictly by plugin context in ctf contracts?

2. **Skills service ownership model**
   - Keep one global taxonomy service, or derive plugin bounded projections with explicit ownership?

3. **Global admin scope in ctf**
   - Preserve all legacy global admin panels vs. reduce to minimal operational set for MVP.

4. **External-link UX policy**
   - Keep universal confirmation-dialog pattern for all outbound opens, or restrict to external-only while preserving trauma-informed predictability.

5. **Observability baseline**
   - Keep current Sentry + health matrix breadth as baseline, or phase subset for initial ctf releases.

---

## 13) Rewrite Decision Matrix (Planning Aid)

Use this matrix to choose retention strategy for each non-plugin capability cluster.

| Capability Cluster | Current Legacy Status | Suggested ctf Decision Options |
| --- | --- | --- |
| Routing shell + access wrappers | Implemented, workaround notes present | Keep + simplify router internals |
| Auth/account lifecycle | Implemented with Clerk coupling | Keep, formalize env + contract boundaries |
| Global admin core | Implemented, broad scope | Keep core subset first, phase advanced panels |
| Shared skills service | Implemented, heavily reused | Keep as shared service with explicit contract versioning |
| Generic chat API | Implemented but naming tension vs ctf rule | Reframe by plugin context or decompose |
| External-link safety UX (`useExternalLink`) | Implemented and broadly reused | Keep/rebuild as shared primitive across web/mobile |
| Security middleware stack | Implemented and layered | Keep baseline; verify parity in Next/Expo architecture |
| Sentry + health operations | Implemented | Keep baseline with clearer SLO-driven ownership |
| E2E/testing posture | Partially disabled/skipped | Rebuild reliable ctf acceptance suite before release gates |

---

## 14) Source File Index (Primary Evidence)

### Routing and UX Shell

- `platform/client/src/routes/index.tsx`
- `platform/client/src/routes/public-routes.tsx`
- `platform/client/src/routes/protected-routes.tsx`
- `platform/client/src/routes/admin-routes.tsx`
- `platform/client/src/routes/route-wrappers.tsx`
- `platform/client/src/hooks/useExternalLink.tsx`

### Server Route Registration and Shared APIs

- `platform/server/routes/index.ts`
- `platform/server/routes/auth.routes.ts`
- `platform/server/routes/admin.routes.ts`
- `platform/server/routes/skills.routes.ts`
- `platform/server/routes/chat.routes.ts`
- `platform/server/routes/health.routes.ts`

### Security / Observability / Runtime

- `platform/server/index.ts`
- `platform/server/csrf.ts`
- `platform/server/rateLimiter.ts`
- `platform/server/antiScraping.ts`
- `platform/server/securityProbeBlocker.ts`
- `platform/server/dataObfuscation.ts`
- `platform/server/sentry.ts`
- `platform/server/healthCheck.ts`
- `platform/server/statusPageIntegration.ts`

### Storage and Shared Contracts

- `platform/server/storage/core/core-storage.ts`
- `platform/server/storage/composed/core-storage-composed.ts`
- `platform/server/storage/index.ts`
- `platform/shared/schema/core/users.ts`
- `platform/shared/schema/core/payments.ts`
- `platform/shared/schema/core/admin.ts`
- `platform/shared/schema/skills/index.ts`
- `platform/shared/schema/chat.ts`

### Tests and Tooling Signals

- `platform/package.json`
- `platform/playwright.config.ts`
- `platform/test/smoke.test.ts`
- `platform/test/e2e/supportmatch.spec.ts`
- `platform/test/e2e/lighthouse.spec.ts`
- `platform/server/routes/extract_routes.py`

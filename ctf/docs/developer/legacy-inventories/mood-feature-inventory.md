# Mood Plugin Feature Inventory (Legacy Reference)

## Scope

- Source analyzed (reference-only): `platform/`
- Rewrite target: `ctf/`
- Plugin name to retain: `Mood`
- Guardrail honored: no edits in `platform/`

---

## Executive Summary

`Mood` is a lightweight anonymous mood-check plugin with:

- anonymous mood check capture,
- eligibility gating (once every 7 days),
- safety trigger on repeated severe mood values,
- announcements for users,
- admin announcement management UI.

Legacy implementation has important contract mismatches and scaffolding-level gaps (notably announcement endpoint mismatch, weak route guarding in client, and missing dedicated tests) that should be resolved during ctf rewrite.

---

## 1) User-Facing Features

### 1.1 Mood Check Submission

Evidence:

- `platform/client/src/pages/mood/index.tsx`
- `platform/client/src/components/mood/mood-check-dialog.tsx`
- `platform/server/routes/mood.routes.ts`

Features:

1. Route: `/apps/mood`.
2. Anonymous mood check submit via `POST /api/mood/checks`.
3. Mood scale validation (1–5).
4. Submission can return `showSafetyMessage` when severe moods recur.
5. Mood-check dialog reused in GentlePulse flow.

### 1.2 Eligibility Window

Evidence:

- `platform/server/routes/mood.routes.ts`
- `platform/client/src/components/mood/mood-check-dialog.tsx`
- `platform/client/src/pages/gentlepulse/library.tsx`

Features:

1. Eligibility endpoint: `GET /api/mood/checks/eligible?clientId=...`.
2. Cooldown model: one check every 7 days.
3. If no prior record (or parse failure), user is treated as eligible.

### 1.3 User Announcements View

Evidence:

- `platform/client/src/pages/mood/announcements.tsx`
- `platform/server/routes/mood.routes.ts`

Features:

1. Announcements route: `/apps/mood/announcements`.
2. Announcement card rendering with title/content/type/created/expiry fields.

Note:

- UI currently queries `/api/mood/admin/announcements`, while server exposes `/api/mood/announcements` and `/api/mood/announcements/all`.

---

## 2) Admin Features

### 2.1 Admin Landing

Evidence:

- `platform/client/src/pages/mood/admin.tsx`
- `platform/client/src/routes/plugin-routes.tsx`

Features:

1. Admin route: `/apps/mood/admin`.
2. Presents “Mood Analytics” heading and announcement management CTA.
3. Links to `/apps/mood/admin/announcements`.

Observed behavior:

- Page is mostly informational; no concrete analytics widgets or API-backed metrics are implemented here.

### 2.2 Admin Announcement Management

Evidence:

- `platform/client/src/pages/mood/admin-announcements.tsx`
- `platform/server/routes/mood.routes.ts`

Features:

1. Admin route: `/apps/mood/admin/announcements`.
2. Server-admin announcement endpoints:
   - `POST /api/mood/announcements`
   - `GET /api/mood/announcements/all`
   - `PATCH /api/mood/announcements/:id`
   - `DELETE /api/mood/announcements/:id`
3. Mutation endpoints use admin + CSRF enforcement (`isAdminWithCsrf`).

---

## 3) API Surface (Discovered)

### 3.1 Mood Check APIs

- `POST /api/mood/checks`
- `GET /api/mood/checks/eligible`

### 3.2 Announcement APIs

- `GET /api/mood/announcements`
- `GET /api/mood/announcements/all`
- `POST /api/mood/announcements`
- `PATCH /api/mood/announcements/:id`
- `DELETE /api/mood/announcements/:id`

---

## 4) Data Model and Storage Behaviors

Evidence:

- `platform/shared/schema/mood/index.ts`
- `platform/server/storage/plugins/mood-storage.ts`
- `platform/schema.sql`

Entities:

1. `mood_checks`
2. `mood_announcements`

Storage and behavior notes:

1. Mood checks keyed by `clientId` (anonymous client identity).
2. Mood check stores `moodValue`, `date`, `createdAt`.
3. Announcement records support active state and optional expiration.

---

## 5) Security and Policy Controls

Evidence:

- `platform/server/routes/mood.routes.ts`
- `platform/server/rateLimiter.ts`
- `platform/client/src/routes/plugin-routes.tsx`

Implemented controls:

1. Public mood submission uses `publicItemLimiter`.
2. Admin announcement mutations enforce admin + CSRF checks.
3. API attempts privacy stripping helper (`stripIPAndMetadata`) before submission processing.

Observed policy gap:

1. Client routes for `/apps/mood/admin*` are wrapped in `ProtectedRoute` (authenticated), not `AdminRoute`.
2. Server still enforces admin rules on write endpoints, but client-side guard is weaker than intent.

---

## 6) Routing and UI Surface

Evidence:

- `platform/client/src/routes/plugin-routes.tsx`

Discovered routes:

1. `/apps/mood`
2. `/apps/mood/announcements`
3. `/apps/mood/admin`
4. `/apps/mood/admin/announcements`

Cross-plugin usage:

1. Mood check dialog is invoked in GentlePulse (`/apps/gentlepulse`).

---

## 7) Test and Seed Coverage Signals

Evidence:

- `platform/scripts/seedMood.ts`
- `platform/scripts/seedAllPlugins.ts`
- `platform/test/`

Observed:

1. Dedicated mood seed script exists (`seedMood.ts`).
2. `seedAllPlugins.ts` does not include `seedMood.ts` in the master list.
3. No dedicated mood API/e2e test files were found under `platform/test`.

---

## 8) Gaps, Ambiguities, and Migration Risks

1. **Announcement endpoint mismatch (functional blocker):**
   - Mood announcements page queries `/api/mood/admin/announcements` but this route is not implemented in `mood.routes.ts`.
2. **Admin route guard mismatch:**
   - Client route protection for mood admin pages uses `ProtectedRoute`, not stricter admin route wrapper.
3. **Analytics surface appears scaffolded/incomplete:**
   - “Mood Analytics” admin page presents high-level copy and link-outs, but no real analytics API wiring.
4. **Coverage gap risk:**
   - Mood plugin has no dedicated API/E2E test files discovered.
5. **Seed workflow gap:**
   - Mood seed exists but is excluded from master seed script, reducing parity confidence in shared seed workflows.
6. **Privacy-contract ambiguity:**
   - Product copy says anonymous/no tracking, while implementation persists `clientId` and logs request context in route handler logging.

---

## 9) Rewrite Inputs (for ctf planning)

Before implementing ctf Mood, lock these decisions:

1. Canonical announcements endpoint contract (user vs admin read routes).
2. Admin route-guard standard in web/mobile routing.
3. Analytics scope: actual in-app metrics vs announcements-only admin screen.
4. Test baseline: add dedicated API + E2E coverage for mood checks and announcement admin flows.
5. Seed baseline: include Mood in master seed workflow or explicitly document exclusion.

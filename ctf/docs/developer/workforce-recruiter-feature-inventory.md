# Workforce Recruiter Mini-App Feature Inventory (Legacy Reference)

## Scope

- Source analyzed (reference-only): `platform/`
- Rewrite target: `ctf/`
- Mini-app name to retain: `Workforce`
- Guardrail honored: no edits in `platform/`

---

## Executive Summary

`Workforce Recruiter` is a recruitment planning and reporting mini-app with:

- authenticated profile flow,
- configurable workforce assumptions,
- occupation CRUD and tracking,
- summary and skill-level/sector reports,
- CSV/JSON export,
- announcements and admin management surfaces.

Legacy implementation is functional but includes notable migration risks: schema-source drift, partial CSRF consistency, in-memory pagination for occupations, and scaffold-like UI/storage artifacts.

---

## 1) User-Facing Features

### 1.1 Dashboard and Reports Navigation

Evidence:

- `platform/client/src/pages/workforce-recruiter/dashboard.tsx`
- `platform/client/src/pages/workforce-recruiter/reports.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. Dashboard route: `/apps/workforce-recruiter`.
2. Reports route: `/apps/workforce-recruiter/reports`.
3. Summary report endpoint: `GET /api/workforce-recruiter/reports/summary`.
4. Skill-level detail endpoint: `GET /api/workforce-recruiter/reports/skill-level/:skillLevel`.
5. Sector detail endpoint: `GET /api/workforce-recruiter/sector/:sector`.

### 1.2 Profile Create/Edit/Delete

Evidence:

- `platform/client/src/pages/workforce-recruiter/profile.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`
- `platform/server/storage/mini-apps/workforce-recruiter-storage.ts`

Features:

1. Profile read: `GET /api/workforce-recruiter/profile`.
2. Profile create: `POST /api/workforce-recruiter/profile`.
3. Profile update: `PUT /api/workforce-recruiter/profile`.
4. Profile delete with reason: `DELETE /api/workforce-recruiter/profile`.
5. Profile deletion writes to profile deletion logs.

### 1.3 Occupations Browse and Detail

Evidence:

- `platform/client/src/pages/workforce-recruiter/occupations.tsx`
- `platform/client/src/pages/workforce-recruiter/occupation-detail.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. Occupations route: `/apps/workforce-recruiter/occupations`.
2. Occupation detail route: `/apps/workforce-recruiter/occupations/:id`.
3. Occupation list endpoint supports sector + skill-level filtering plus limit/offset.
4. Occupation detail endpoint by ID.

### 1.4 Config and Export

Evidence:

- `platform/client/src/pages/workforce-recruiter/config.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. Config read: `GET /api/workforce-recruiter/config`.
2. Export route: `GET /api/workforce-recruiter/export?format=csv|json`.
3. Export includes summary + occupation datasets.

### 1.5 User Announcements

Evidence:

- `platform/client/src/pages/workforce-recruiter/announcements.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. Announcements route: `/apps/workforce-recruiter/announcements`.
2. Active announcements endpoint: `GET /api/workforce-recruiter/announcements`.

---

## 2) Admin Features

### 2.1 Admin Landing and Tools

Evidence:

- `platform/client/src/pages/workforce-recruiter/admin.tsx`
- `platform/client/src/routes/mini-app-routes.tsx`

Features:

1. Admin route: `/apps/workforce-recruiter/admin`.
2. Links into occupation and announcement admin tools.
3. Admin export access.

### 2.2 Admin Occupations CRUD

Evidence:

- `platform/client/src/pages/workforce-recruiter/admin-occupations.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. Admin occupations route: `/apps/workforce-recruiter/admin/occupations`.
2. Occupation create: `POST /api/workforce-recruiter/occupations`.
3. Occupation update: `PUT /api/workforce-recruiter/occupations/:id`.
4. Occupation delete: `DELETE /api/workforce-recruiter/occupations/:id`.
5. Admin action logs emitted for create/update/delete.

### 2.3 Admin Announcement Management

Evidence:

- `platform/client/src/pages/workforce-recruiter/admin-announcements.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. Admin announcements route: `/apps/workforce-recruiter/admin/announcements`.
2. Admin announcement list/create/update/deactivate APIs.
3. Admin action logs emitted for announcement mutations.

### 2.4 Admin Config Mutation

Evidence:

- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. Config update endpoint: `PUT /api/workforce-recruiter/config` (admin-only).

---

## 3) API Surface (Discovered)

### 3.1 Profile APIs

- `GET /api/workforce-recruiter/profile`
- `POST /api/workforce-recruiter/profile`
- `PUT /api/workforce-recruiter/profile`
- `DELETE /api/workforce-recruiter/profile`

### 3.2 Config APIs

- `GET /api/workforce-recruiter/config`
- `PUT /api/workforce-recruiter/config`

### 3.3 Occupation and Report APIs

- `GET /api/workforce-recruiter/occupations`
- `GET /api/workforce-recruiter/occupations/:id`
- `POST /api/workforce-recruiter/occupations`
- `PUT /api/workforce-recruiter/occupations/:id`
- `DELETE /api/workforce-recruiter/occupations/:id`
- `GET /api/workforce-recruiter/reports/summary`
- `GET /api/workforce-recruiter/reports/skill-level/:skillLevel`
- `GET /api/workforce-recruiter/sector/:sector`
- `GET /api/workforce-recruiter/export`

### 3.4 Announcement APIs

- `GET /api/workforce-recruiter/announcements`
- `GET /api/workforce-recruiter/admin/announcements`
- `POST /api/workforce-recruiter/admin/announcements`
- `PUT /api/workforce-recruiter/admin/announcements/:id`
- `DELETE /api/workforce-recruiter/admin/announcements/:id`

---

## 4) Data Model and Storage Behaviors

Evidence:

- `platform/shared/schema/workforcerecruitertracker/index.ts`
- `platform/server/storage/mini-apps/workforce-recruiter-storage.ts`
- `platform/server/storage/mini-apps/workforce-recruiter/reports.ts`
- `platform/schema.sql`

Core entities:

1. `workforce_recruiter_profiles`
2. `workforce_recruiter_config`
3. `workforce_recruiter_occupations`
4. `workforce_recruiter_announcements`

Storage-level behavior notes:

1. Occupation list filtering and pagination is implemented in memory after full-query fetch.
2. Report calculations are composed from occupations/config and shared skills/directory-linked data.
3. Profile deletion logs to `profileDeletionLogs` and deletes profile record.

---

## 5) Security and Policy Controls

Evidence:

- `platform/server/routes/workforce-recruiter.routes.ts`
- `platform/server/auth.ts`
- `platform/client/src/routes/mini-app-routes.tsx`

Implemented controls:

1. Endpoints are authentication-gated.
2. Admin checks on admin endpoints and occupation/config write paths.
3. Admin announcements writes use `isAdminWithCsrf`.
4. Admin action logging exists for occupation/announcement writes.

Observed policy gap:

1. Some admin state-changing endpoints (e.g., config/occupations) do not use CSRF helper while announcements do.
2. Client routes for admin pages are `ProtectedRoute` only; admin role enforcement is server-side.

---

## 6) Routing and UI Surface

Evidence:

- `platform/client/src/routes/mini-app-routes.tsx`

Discovered routes:

1. `/apps/workforce-recruiter`
2. `/apps/workforce-recruiter/profile`
3. `/apps/workforce-recruiter/occupations`
4. `/apps/workforce-recruiter/occupations/:id`
5. `/apps/workforce-recruiter/reports`
6. `/apps/workforce-recruiter/skill-level/:skillLevel`
7. `/apps/workforce-recruiter/announcements`
8. `/apps/workforce-recruiter/admin`
9. `/apps/workforce-recruiter/admin/announcements`
10. `/apps/workforce-recruiter/config`
11. `/apps/workforce-recruiter/admin/occupations`

---

## 7) Test and Seed Coverage Signals

Evidence:

- `platform/test/api/workforce-recruiter.test.ts`
- `platform/test/e2e/workforce-recruiter.spec.ts`
- `platform/test/client/pages/workforce-recruiter/profile.test.tsx`
- `platform/test/integration/storage.test.ts`
- `platform/scripts/seedWorkforceRecruiter.ts`
- `platform/scripts/seedAllMiniApps.ts`

Observed:

1. API/E2E/client/integration test files exist.
2. API tests heavily emphasize mocked request/auth/schema shape checks.
3. E2E coverage includes skip-heavy branches and selector fragility concerns.
4. Seed script exists and is included by master seed workflow.
5. Seed script uses randomized target generation, producing non-deterministic seeded values.

---

## 8) Gaps, Ambiguities, and Migration Risks

1. **Schema drift risk:**
   - SQL and Drizzle schema have mismatches (e.g., profile field coverage such as `display_name`).
2. **Partial CSRF policy application:**
   - Announcements writes use CSRF helper, while some other admin writes do not.
3. **Client admin guarding gap:**
   - Admin routes are protected by auth-only wrapper, not explicit admin wrapper.
4. **Scaffold/incomplete indicators in UI/storage:**
   - Admin occupations and occupation detail include event-related artifacts that are not wired to complete feature flows.
   - Storage module header references signups, but no signup model/routes are present in this mini-app.
5. **Report metric-definition ambiguity:**
   - “Recruited” semantics vary by report context and should be normalized for ctf parity.
6. **Performance risk in list queries:**
   - Occupations pagination is in-memory, which may not scale.

---

## 9) Rewrite Inputs (for ctf planning)

Before implementing ctf Workforce Recruiter, lock these decisions:

1. Canonical schema authority and migration generation path.
2. Uniform CSRF policy for all admin state-changing writes.
3. Client-side admin route guard standard.
4. Final “recruited” metric semantics for reports and drilldowns.
5. Data-access strategy for occupations pagination (DB-level vs in-memory slicing).

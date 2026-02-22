# Workforce Admin Feature Inventory (Legacy Reference)

## Scope

- Source analyzed (reference-only): `platform/`
- Rewrite target: `ctf/`
- Surface inventoried: `Workforce Admin` (`/apps/workforce-recruiter/admin` and linked admin routes)
- Guardrail honored: no edits in `platform/`

---

## Executive Summary

`Workforce Admin` combines operational CRUD (occupations/config/announcements) with reports and export workflows.

This surface is practical to operate in-app because it includes domain-specific calculations and data dependencies that are easier to validate in custom UI than via direct DB tooling.

---

## 1) Feature Inventory

### 1.1 Admin Hub and Navigation

Evidence:

- `platform/client/src/pages/workforce-recruiter/admin.tsx`
- `platform/client/src/routes/mini-app-routes.tsx`

Features:

1. Admin landing page with links to occupations, announcements, and config.
2. CSV export trigger from admin page.
3. Centralized admin workflow entry point.

### 1.2 Occupations Admin CRUD

Evidence:

- `platform/client/src/pages/workforce-recruiter/admin-occupations.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. Occupation list/query with limit/offset support.
2. Create occupation.
3. Update occupation.
4. Delete occupation.
5. Client-side fuzzy search and pagination controls.

### 1.3 Config Management

Evidence:

- `platform/client/src/pages/workforce-recruiter/config.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. Read workforce config assumptions.
2. Update population, participation rate, and recruitable bounds.

### 1.4 Reports + Drilldowns + Export

Evidence:

- `platform/client/src/pages/workforce-recruiter/reports.tsx`
- `platform/client/src/pages/workforce-recruiter/skill-level-detail.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`
- `platform/server/storage/mini-apps/workforce-recruiter/reports.ts`

Features:

1. Summary report view.
2. Skill-level drilldown.
3. Sector drilldown.
4. CSV/JSON export endpoint and file-download UX.

### 1.5 Admin Announcements

Evidence:

- `platform/client/src/pages/workforce-recruiter/admin-announcements.tsx`
- `platform/server/routes/workforce-recruiter.routes.ts`

Features:

1. List admin announcements.
2. Create announcement.
3. Edit announcement.
4. Deactivate announcement.

---

## 2) API Surface (Admin-Relevant)

### 2.1 Admin Mutations

- `PUT /api/workforce-recruiter/config`
- `POST /api/workforce-recruiter/occupations`
- `PUT /api/workforce-recruiter/occupations/:id`
- `DELETE /api/workforce-recruiter/occupations/:id`
- `POST /api/workforce-recruiter/admin/announcements`
- `PUT /api/workforce-recruiter/admin/announcements/:id`
- `DELETE /api/workforce-recruiter/admin/announcements/:id`

### 2.2 Admin Reads and Reporting

- `GET /api/workforce-recruiter/config`
- `GET /api/workforce-recruiter/occupations`
- `GET /api/workforce-recruiter/admin/announcements`
- `GET /api/workforce-recruiter/reports/summary`
- `GET /api/workforce-recruiter/reports/skill-level/:skillLevel`
- `GET /api/workforce-recruiter/sector/:sector`
- `GET /api/workforce-recruiter/export?format=csv|json`

---

## 3) Data Dependencies

Evidence:

- `platform/shared/schema/workforcerecruitertracker/index.ts`
- `platform/server/storage/mini-apps/workforce-recruiter-storage.ts`
- `platform/server/storage/mini-apps/workforce-recruiter/reports.ts`

Dependencies:

1. `workforce_recruiter_occupations`
2. `workforce_recruiter_config`
3. `workforce_recruiter_announcements`
4. `workforce_recruiter_profiles`
5. Shared skills entities and Directory-linked data paths used by report calculations

---

## 4) Security and Policy Controls

Evidence:

- `platform/server/routes/workforce-recruiter.routes.ts`

Controls:

1. Auth is required for workforce routes.
2. Admin checks gate occupation/config/announcement mutations.
3. Admin announcement writes use `isAdminWithCsrf`.

Observed inconsistency:

- Config and occupations admin mutations are admin-guarded but not consistently using the same CSRF helper pattern as announcements.

---

## 5) UX Complexity and Operator Risk

1. Occupation CRUD is high-impact for downstream reports.
2. Report/drilldown definitions are custom and require exact metric consistency.
3. Export workflows depend on stable payload shape and formatting.
4. Admin UI reduces error risk versus direct SQL/flattened table editing.

---

## 6) Gaps, Ambiguities, and Migration Risks

1. **Metric ambiguity:** “Recruited” semantics vary across report paths and need canonical definition.
2. **CSRF policy inconsistency:** announcements use stricter helper than some other admin writes.
3. **Performance risk:** occupation list pagination is currently applied after in-memory slicing.
4. **Scaffold artifacts:** admin occupations has unused event-related state/import traces.
5. **Schema drift risk:** shared schema and SQL artifacts require reconciliation before rewrite hardening.

---

## 7) Rewrite Inputs (for ctf planning)

Before implementing ctf Workforce Admin, lock these decisions:

1. Canonical report metric definitions.
2. Unified admin-write CSRF policy.
3. DB-level pagination/filtering strategy for occupations.
4. Schema source-of-truth process for migrations.

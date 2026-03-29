# Skills Database Admin Feature Inventory (Legacy Reference)

## Scope

- Source analyzed (reference-only): `platform/`
- Rewrite target: `ctf/`
- Surface inventoried: `Skills Database Admin` (`/admin/skills`)
- Guardrail honored: no edits in `platform/`

---

## Executive Summary

`Skills Database Admin` is a shared taxonomy management surface for sectors, job titles, and skills.

This is a high-risk admin surface because it affects multiple plugins (including Directory and Workforce Recruiter), so preserving rich in-app safety and context is important for rewrite.

---

## 1) Feature Inventory

### 1.1 Hierarchy Browser

Evidence:

- `platform/client/src/pages/admin/skills.tsx`
- `platform/server/routes/skills.routes.ts`

Features:

1. Expand/collapse tree for Sector → Job Title → Skill.
2. Ordered hierarchy display using display-order and name sorting.
3. Hierarchy read endpoint for admin management workflows.

### 1.2 Sector CRUD

Evidence:

- `platform/client/src/pages/admin/skills.tsx`
- `platform/server/routes/skills.routes.ts`
- `platform/server/storage/plugins/skills-storage.ts`

Features:

1. Create sector.
2. Update sector metadata (name, ordering, workforce share/count).
3. Delete sector.

### 1.3 Job Title CRUD

Evidence:

- `platform/client/src/pages/admin/skills.tsx`
- `platform/server/routes/skills.routes.ts`
- `platform/server/storage/plugins/skills-storage.ts`

Features:

1. Create job title under sector.
2. Update job title fields.
3. Delete job title.

### 1.4 Skill CRUD

Evidence:

- `platform/client/src/pages/admin/skills.tsx`
- `platform/server/routes/skills.routes.ts`
- `platform/server/storage/plugins/skills-storage.ts`

Features:

1. Create skill under job title.
2. Update skill fields.
3. Delete skill.

### 1.5 Compatibility and Consumer Feeds

Evidence:

- `platform/server/routes/skills.routes.ts`
- `platform/server/storage/plugins/skills-storage.ts`

Features:

1. Flattened skills feed for downstream consumers (`/api/skills/flattened`).
2. Admin hierarchy feed (`/api/skills/hierarchy`).

---

## 2) API Surface (Admin-Relevant)

### 2.1 Admin Read APIs

- `GET /api/skills/hierarchy`
- `GET /api/skills/sectors`
- `GET /api/skills/job-titles`
- `GET /api/skills/skills`

### 2.2 Admin Mutation APIs

- `POST /api/skills/sectors`
- `PUT /api/skills/sectors/:id`
- `DELETE /api/skills/sectors/:id`
- `POST /api/skills/job-titles`
- `PUT /api/skills/job-titles/:id`
- `DELETE /api/skills/job-titles/:id`
- `POST /api/skills/skills`
- `PUT /api/skills/skills/:id`
- `DELETE /api/skills/skills/:id`

### 2.3 Consumer Feed API

- `GET /api/skills/flattened`

---

## 3) Data Dependencies

Evidence:

- `platform/shared/schema/skills/index.ts`
- `platform/server/storage/plugins/skills-storage.ts`

Dependencies:

1. `skills_sectors`
2. `skills_job_titles`
3. `skills_skills`
4. Downstream consumers:
   - Directory selectors and admin compatibility paths
   - Workforce recruiter occupation linkage/reporting paths

---

## 4) Security and Policy Controls

Evidence:

- `platform/server/routes/skills.routes.ts`

Controls:

1. Admin auth required for hierarchy and CRUD endpoints.
2. CSRF enforced on admin writes via `isAdminWithCsrf`.
3. Admin action logging for sector/job-title/skill mutations.

---

## 5) UX Complexity and Operator Risk

1. Hierarchical CRUD requires context-aware operations (parent-child correctness).
2. Delete actions can have large downstream impact across dependent plugins.
3. Operator safety depends on clear hierarchy visibility and confirmation prompts.
4. Direct DB editing is materially riskier than this structured admin UI.

---

## 6) Gaps, Ambiguities, and Migration Risks

1. **Cross-app blast radius risk:** taxonomy edits immediately affect Directory and Workforce behavior.
2. **Delete side-effect ambiguity:** parent-level deletes can be destructive; downstream dependency implications need explicit operator guidance.
3. **Legacy overlap ambiguity:** coexistence with legacy compatibility pathways can confuse canonical taxonomy source decisions.
4. **Coverage gap risk:** limited dedicated integration/E2E validation for complex admin hierarchy operations.

---

## 7) Rewrite Inputs (for ctf planning)

Before implementing ctf Skills Database Admin, lock these decisions:

1. Canonical skills taxonomy source-of-truth and governance process.
2. Mandatory dependency checks/warnings before destructive hierarchy deletes.
3. Explicit downstream-impact policy for Directory and Workforce consumers.
4. Test coverage baseline for hierarchy CRUD and cross-app compatibility.

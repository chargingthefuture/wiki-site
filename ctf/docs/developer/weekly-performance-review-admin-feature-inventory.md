# Weekly Performance Review Admin Feature Inventory (Legacy Reference)

## Scope

- Source analyzed (reference-only): `platform/`
- Rewrite target: `ctf/`
- Surface inventoried: `Weekly Performance Review Admin` (`/admin/weekly-performance`)
- Guardrail honored: no edits in `platform/`

---

## Executive Summary

`Weekly Performance Review Admin` is an analytics and operator-reporting surface that aggregates user growth, engagement, payment, and subscription metrics for week-over-week review.

This surface should remain custom in-app for ctf rewrite because it combines domain-specific calculations, privacy-sensitive values, and multi-source aggregation logic that needs explicit contract and policy parity.

---

## 1) Feature Inventory

### 1.1 Week Selection and Navigation

Evidence:

- `platform/client/src/pages/admin/weekly-performance.tsx`
- `platform/client/src/pages/admin/weekly-performance/hooks/useWeekSelection.ts`
- `platform/client/src/pages/admin/weekly-performance/components/WeeklyPerformanceWeekSelector.tsx`

Features:

1. Saturday-based week selection (`yyyy-MM-dd`) via date input.
2. Previous/current/next week navigation with future-week guardrails.
3. “Live” state for current week and real-time polling behavior for current-week queries.
4. Display of current and previous week date ranges after data load.

### 1.2 Weekly Metrics Cards

Evidence:

- `platform/client/src/pages/admin/weekly-performance/components/WeeklyPerformanceMetrics.tsx`
- `platform/client/src/pages/admin/weekly-performance/utils/weeklyPerformanceUtils.ts`

Features:

1. Growth metric (weekly new-user growth %) with threshold labels.
2. Revenue metrics: current week revenue, MRR, ARR, and MRR growth.
3. User metrics: new users, churn, CLV.
4. User statistics: total users, verified users, approved users and week-over-week deltas.
5. DAU weekly totals and change vs previous week.
6. Sensitive financial values rendered through privacy-aware UI fields.

### 1.3 Week-over-Week Comparison Table

Evidence:

- `platform/client/src/pages/admin/weekly-performance/components/WeeklyPerformanceComparison.tsx`

Features:

1. Comparison table for weekly and monthly-context metrics.
2. Includes new users, DAU, revenue, MRR, ARR, churn, CLV, user counts, MAU, mood metrics.
3. Uses previous-week month metric fields for MRR/ARR/MAU/churn/CLV comparisons.
4. Badge-based directional changes for operator readability.

### 1.4 API Query and Load/Error/Empty Handling

Evidence:

- `platform/client/src/pages/admin/weekly-performance/hooks/useWeeklyPerformance.ts`
- `platform/client/src/pages/admin/weekly-performance.tsx`

Features:

1. Query endpoint: `GET /api/admin/weekly-performance?weekStart=YYYY-MM-DD`.
2. Current-week polling (`30s`) and window-focus refetch only for current week.
3. Distinct loading, error, no-data, and missing-metrics UI states.

### 1.5 Backend Aggregation Pipeline

Evidence:

- `platform/server/routes/admin.routes.ts`
- `platform/server/storage/composed/core-storage-composed.ts`
- `platform/server/storage/core/analytics-storage.ts`

Features:

1. Admin route parses `weekStart` and returns current/previous week + comparison + metrics payload.
2. Storage composition delegates to analytics storage and injects Default Alive/Dead EBITDA snapshot accessor.
3. Aggregates from users, payments, and login events; filters test/deleted users.
4. Computes weekly and month-context metrics (MRR, ARR, MAU, churn, CLV, retention).
5. Returns explicit default metrics fallback when metrics object is absent.

---

## 2) API Surface (Admin-Relevant)

### 2.1 Primary Admin Endpoint

- `GET /api/admin/weekly-performance`
  - Optional query: `weekStart=YYYY-MM-DD`

### 2.2 Related Route Registration

- Route registration and auth checks are in `platform/server/routes/admin.routes.ts`.
- Client route wiring exists in:
  - `platform/client/src/routes/routes.tsx`
  - `platform/client/src/routes/admin-routes.tsx`

---

## 3) Data Dependencies

Evidence:

- `platform/server/storage/core/analytics-storage.ts`
- `platform/server/storage/types/core-storage.interface.ts`

Dependencies:

1. `users` (new users, totals, verification/approval stats)
2. `payments` (weekly revenue, MRR/ARR, churn, CLV)
3. `loginEvents` (DAU/MAU calculations)
4. Default Alive/Dead EBITDA snapshot via composed storage mini-app adapter

---

## 4) Security and Policy Controls

Evidence:

- `platform/server/routes/admin.routes.ts`

Controls:

1. Endpoint requires authenticated admin context (`isAuthenticated`, `isAdmin`).
2. Read endpoint participates in admin CSRF token generation middleware for admin surfaces.
3. Financial fields in UI are rendered with privacy-aware field components.

---

## 5) UX Complexity and Operator Risk

1. Mixed weekly and monthly comparison semantics increase interpretation risk for operators.
2. Week boundary logic (Saturday start) must remain consistent across server/client.
3. Large aggregation scope (users/payments/logins) can create subtle metric drift if contracts change.
4. Privacy handling for revenue/financial metrics is operationally sensitive.

---

## 6) Gaps, Ambiguities, and Migration Risks

1. **Metric semantics ambiguity:** several metrics (MRR growth/churn/CLV month context) require canonical definitions to avoid interpretation drift.
2. **Unused metric fields risk:** mood metrics are present but currently zeroed in analytics storage, which can mislead dashboards.
3. **Contract mismatch risk:** server fallback metrics object omits some fields included in client/types (e.g., previous-week month metrics).
4. **Performance risk:** analytics computation performs multiple broad queries and in-memory filtering across users/payments/login events.
5. **Coverage gap:** no dedicated Weekly Performance Review tests were surfaced during this inventory pass.

---

## 7) Rewrite Inputs (for ctf planning)

Before implementing ctf Weekly Performance Review Admin, lock these decisions:

1. Canonical definitions and formulas for each metric and comparison baseline.
2. Final API contract including required metrics fields (including previous-week month fields).
3. Performance expectations and query/index strategy for aggregation workloads.
4. Privacy policy for displaying/exporting financial metrics in admin UIs.
5. Test baseline (contract, integration, and E2E) for week selection and metric correctness.
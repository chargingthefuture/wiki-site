# TI Skills Economy Monorepo (ctf)

This folder contains the rewrite monorepo scaffold for:

- Next.js web application (`packages/web`)
- React Native mobile application (`packages/mobile`)
- Shared platform-agnostic logic (`packages/shared`)

## Quick Start

1. Install dependencies
   - `pnpm install`
2. Run web app
   - `pnpm run dev:web`
3. Run mobile app (cloud-first Expo workflow)
   - `pnpm run dev:mobile`

## Mobile Cloud Workflow

- Preview Android builds: GitHub Actions workflow `Expo Preview Build`
- Production APK release: GitHub Actions workflow `Expo Android Release`
- JavaScript-only updates: EAS Update channels (`preview`, `staging`, `production`)

## Observability Provider Selection

- Web: set `NEXT_PUBLIC_OBSERVABILITY_PROVIDER` to `sentry`, `signoz`, or `noop`.
- Mobile: set `MOBILE_OBSERVABILITY_PROVIDER` to `sentry`, `signoz`, or `noop`.
- Unknown or missing values default to `noop`.

## Structure

- `packages/shared`: API wrappers, domain models, and reusable logic
- `packages/web`: Next.js web application
- `packages/mobile`: Expo + React Native Android application

## Invite-Only Access Flow (Rewrite)

- Users sign in with Clerk on the web app root page.
- First-time users must submit a Quora profile URL.
- Access stays pending until an admin approves them.
- Admins (existing `users.is_admin = true`) can review and approve users at `/admin/users`.

## Auth Foundation Baseline (BF-01)

- Clerk foundation implementation notes: `ctf/docs/developer/CLERK_FOUNDATION_BASELINE_BF01.md`
- Plugin deny taxonomy baseline: `ctf/docs/contracts/PLUGIN_AUTH_DENY_TAXONOMY_BASELINE.md`
- Clerk username rollout plan (legacy user backfill + migration): `ctf/docs/developer/CLERK_USERNAME_ROLLOUT_PLAN.md`

## Prompt Leak Protection

- This repository includes git hooks that block committing/pushing AI prompt text patterns.
- One-time setup (run from repository root): `git config core.hooksPath .githooks`
- Store temporary prompt drafts in `.ai/` (already ignored by git).

## Metric Definition and Confirmation (MDC)

- Canonical metric source is `ctf/config/canonical_metrics.yaml` (override with `CANONICAL_METRICS_PATH`).
- Before any metric-related changes (alerts, ETL/transforms, schema, dashboards, docs), call `check_metric_defined` / `checkMetricDefined`.
- If a metric is undefined or ambiguous, implementation is blocked and you must open a definition request using `ctf/docs/templates/canonical-metric-template.md`.
- The definition request must include these exact questions:
   - a. Confirm exact metric name and any aliases.
   - b. Give a precise human-readable description.
   - c. Specify data_type and unit.
   - d. Provide calculation logic (SQL, formula, or pseudocode) and required inputs.
   - e. Provide example inputs with expected output.
   - f. Specify owner/contact and acceptable thresholds/alerts.
   - g. Indicate update cadence and retention.
- Each metric check writes structured JSON audit logs with `timestamp`, `caller`, `metric_identifier`, `result`, and `canonical_id` (when found).

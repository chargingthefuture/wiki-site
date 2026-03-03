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

## Railway Deploy Baseline

- Railway service root is `ctf/packages/web`; build/start commands run from that directory.
- Keep `ctf/railway.toml` commands package-local (`pnpm build`, `pnpm start`) and do not add a second workspace-level `pnpm install --filter ...` step.
- Reason: Railpack already performs install, and a second filtered install/build chain can trigger Node heap OOM during deploy.
- Keep package manager alignment pinned to `pnpm@9.12.0` in deploy commands for deterministic behavior.

## Workforce Incremental Sync Baseline

- Use incremental sync as the primary freshness path for Workforce recruited-state derivation.
- Internal sync endpoint: `POST /api/workforce/internal/sync`.
- Required header for internal sync: `x-workforce-sync-token`.
- Configure `WORKFORCE_SYNC_TOKEN` in environments that run scheduled sync jobs.
- Optional JSON body: `{ "batchSize": number }` to bound per-run delta processing volume.
- Keep `POST /api/workforce/admin/recompute` as backfill/repair only.

## Prompt Leak Protection

- This repository includes git hooks that block committing/pushing AI prompt text patterns.
- One-time setup (run from repository root): `git config core.hooksPath .githooks`
- Store temporary prompt drafts in `.ai/` (already ignored by git).

## GitHub Actions Budget Monitoring

- Monitor workflow: `.github/workflows/github-actions-budget-monitor.yml`
- Token reminder workflow: `.github/workflows/github-actions-billing-token-reminder.yml`
- Evaluator script: `ctf/scripts/githubActionsBudgetMonitor.mjs`
- Token setup + rotation runbook: `ctf/docs/developer/GITHUB_ACTIONS_BILLING_TOKEN_RUNBOOK.md`
- Budget thresholds (GitHub Free):
  - Warning: 60%
  - Critical: 80%
  - Blocked: 90% (deploy workflows are blocked)
- Alert channel: GitHub issue titled `GitHub Actions Budget Monitor` (label: `ci-budget-monitor`)
- Secrets:
  - Required for org-scope monitoring: `GH_ACTIONS_BILLING_TOKEN`
  - Fallback token: default `GITHUB_TOKEN` (repo-level estimates, potentially degraded)

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

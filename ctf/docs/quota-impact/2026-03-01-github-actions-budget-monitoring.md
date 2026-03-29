# GitHub Actions Free-Tier Budget Monitoring Baseline

## Summary

- Feature/Change: GitHub Actions usage monitoring and deploy guardrail baseline
- PR: pending
- Owner: platform/infra
- Date: 2026-03-01

## Stream Surfaces Affected

- Not applicable.
- This note defines GitHub Actions platform quota monitoring for CI reliability.

## Estimated Monthly Impact

- Budget model (GitHub Free):
  - Minutes: 2,000/month
  - Artifact storage: 500 MB
  - Cache storage: 10 GB
- Threshold bands:
  - Warning: >= 60%
  - Critical: >= 80%
  - Blocked: >= 90% (deploy block)

## Budget Threshold Risk

- Expected threshold after rollout: Green to Yellow (monitoring overhead is low).
- Peak scenario estimate: Critical/Blocked during high-volume branch deploy windows.

## Fallback and Degradation Plan

- What degrades first:
  - Deploy workflows are blocked when status is `blocked`.
  - Non-deploy quality gates continue to run to preserve engineering feedback loops.
- User-visible messaging behavior:
  - Scheduled monitor workflow opens/updates a GitHub issue titled `GitHub Actions Budget Monitor`.
  - When status returns to `ok`, the issue is commented and closed.
- Kill switch / feature flag:
  - Temporarily bypass by removing the deploy job `actions-budget-gate` dependency/condition in workflow files.

## Observability

- Workflow: `.github/workflows/github-actions-budget-monitor.yml`
- Evaluator script: `ctf/scripts/githubActionsBudgetMonitor.mjs`
- Artifact: `github-actions-budget-<run_id>` JSON file
- Alert channel: GitHub issue labeled `ci-budget-monitor`

### Deny Taxonomy Baseline (for plugin-route and deploy consumers)

- `ok`: All monitored dimensions below warning threshold.
- `warning`: Any monitored dimension >= 60% and < 80%.
- `critical`: Any monitored dimension >= 80% and < 90%.
- `blocked`: Any monitored dimension >= 90%; deploy workflows are denied.
- `degraded-auth`: Billing/auth data could not be resolved at required scope.

## Validation

- Automated:
  - Scheduled and manual monitor workflow execution (`workflow_dispatch`).
  - Deploy workflows evaluate budget status before deploy step execution.
- Manual:
  - Confirm issue lifecycle (create/update/close) from budget status transitions.
  - Confirm secret `GH_ACTIONS_BILLING_TOKEN` is provisioned for org-scope billing reads.

## Environment and Key Assumptions

- Scope target: Organization-level usage by default.
- Preferred credential: `GH_ACTIONS_BILLING_TOKEN` with org billing read permission.
- Setup and rotation procedure: `ctf/docs/developer/GITHUB_ACTIONS_BILLING_TOKEN_RUNBOOK.md`.
- Fallback behavior:
  - If org billing endpoints are unavailable, script falls back to repository-level cache/artifact estimates.
  - Minutes may be unavailable in repo fallback mode and status can become `degraded-auth`.

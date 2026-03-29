# GitHub Actions Billing Token Runbook

Date: 2026-03-01
Owner: platform/infra

This runbook documents how to create, rotate, and validate the `GH_ACTIONS_BILLING_TOKEN` used by GitHub Actions budget monitoring.

## Why this token exists

- The monitor workflow reads organization-level billing endpoints for Actions usage.
- `GITHUB_TOKEN` is often insufficient for org billing APIs (`Resource not accessible by integration`).
- `GH_ACTIONS_BILLING_TOKEN` is the explicit credential for org-scope usage visibility.

## Prerequisites

- You are an organization owner (or have permission to manage org Actions secrets).
- You can create Personal Access Tokens for your GitHub account.
- You know which repositories should receive this org secret.

## Create token (initial setup)

1. GitHub avatar → **Settings**.
2. **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
3. Select **Generate new token (classic)**.
4. Name it: `ctf-actions-billing-monitor`.
5. Set expiration (recommended: 60 days).
6. Select scope: `read:org`.
7. Generate token and copy it immediately.

## Store token in organization Actions secrets

1. Organization → **Settings** → **Secrets and variables** → **Actions**.
2. Select **New organization secret**.
3. Name: `GH_ACTIONS_BILLING_TOKEN`.
4. Secret value: paste the generated PAT.
5. Repository access:
   - Select repositories and include `chargingthefuture` (or broader set if desired).
6. Save.

## Rotation procedure (every 60 days)

1. Create a new token with the same scope (`read:org`) before old token expiry.
2. Update org Actions secret `GH_ACTIONS_BILLING_TOKEN` with the new token value.
3. Trigger workflow manually:
   - `.github/workflows/github-actions-budget-monitor.yml` via `workflow_dispatch`.
4. Confirm run status output is not `degraded-auth`.
5. Confirm deploy workflows still evaluate gate successfully:
   - `.github/workflows/deploy-backend-railway.yml`
   - `.github/workflows/deploy-web-vercel.yml`
6. Revoke/delete the old PAT from the token owner account.

## Validation checklist after setup or rotation

- Budget monitor job runs successfully.
- Workflow summary shows minutes/artifact/cache usage table.
- `degraded-auth` is absent under normal conditions.
- GitHub issue `GitHub Actions Budget Monitor` is created/updated/closed as expected.

## Failure modes and recovery

### `degraded-auth` status appears

Possible causes:

- Missing `GH_ACTIONS_BILLING_TOKEN` secret.
- Token expired or revoked.
- Token lacks required scope (`read:org`).
- Secret not shared with this repository.

Recovery:

1. Regenerate PAT with `read:org`.
2. Update org secret `GH_ACTIONS_BILLING_TOKEN`.
3. Re-run the budget monitor workflow.

### Deploy unexpectedly blocked by budget gate

- Deploy workflows block only when `enforce_block=true` from verified org-level `blocked` state.
- If this is unexpected, run monitor workflow manually and inspect summary/artifact.

Temporary emergency bypass (documented/approved use only):

- Remove or relax `actions-budget-gate` condition in deploy workflow files, then restore after incident resolution.

## Security guidance

- Prefer shortest practical PAT expiration.
- Keep token scope minimal (`read:org` only for this use case).
- Store token only in GitHub encrypted org secrets.
- Revoke old tokens immediately after rotation.

## Operational cadence recommendation

- Automated reminder workflow: `.github/workflows/github-actions-billing-token-reminder.yml`.
   - Runs weekly.
   - Opens issue `Rotate GH_ACTIONS_BILLING_TOKEN` when no reminder has been created in the last 45 days.
- Auto-close behavior:
   - `.github/workflows/github-actions-budget-monitor.yml` closes open `Rotate GH_ACTIONS_BILLING_TOKEN` issues when monitor status is healthy (not `degraded-auth`).
- Optional: keep a personal/team calendar reminder as backup.
- Keep two maintainers listed as backup owners for token rotation.

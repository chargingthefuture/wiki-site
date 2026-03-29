# Branch Protection Checklist (Rewrite)

Use this checklist to configure repository branch protection for `main` so CI and compliance gates are enforced before merge.

## 1) Protect `main`

- [ ] Go to **GitHub → Settings → Branches → Add branch protection rule**.
- [ ] Branch name pattern: `main`.
- [ ] Enable **Require a pull request before merging**.
- [ ] Enable **Require approvals** (recommended: at least 1).
- [ ] Enable **Dismiss stale pull request approvals when new commits are pushed**.

## 2) Require status checks to pass

- [ ] Enable **Require status checks to pass before merging**.
- [ ] Enable **Require branches to be up to date before merging**.
- [ ] Add these required checks from workflow [rewrite-ci.yml](workflows/rewrite-ci.yml):
  - `Rules Integrity`
  - `Plugin Contract Templates`
  - `Modularity and Complexity Governance`
  - `Stream Quota Policy`
  - `Stream Quota Impact Note`
  - `Rewrite Quality Gates`
- [ ] Add these required checks for mobile paths (recommended):
  - `Expo Preview Android` from [expo-preview.yml](workflows/expo-preview.yml)
  - `Expo EAS Update` from [expo-update.yml](workflows/expo-update.yml)
- [ ] Add these required checks from workflow [security-compliance.yml](workflows/security-compliance.yml):
  - `Secret Scanning`
  - `Compliance Artifacts`
- [ ] Add this operational monitor check if desired for visibility (not required for PR merge by default):
  - `Actions Budget Monitor` from [github-actions-budget-monitor.yml](workflows/github-actions-budget-monitor.yml)

Note: `Dependency Review (PR)` only runs on pull requests. Add it as a required check if it appears in your check list and you want dependency policy enforcement on all PRs.

## 3) Restrict bypass and risky operations

- [ ] Enable **Do not allow bypassing the above settings** (recommended).
- [ ] Enable **Restrict who can push to matching branches** (recommended for admin-only direct pushes).
- [ ] Disable force pushes.
- [ ] Disable branch deletion.

## 4) Merge strategy and history hygiene

- [ ] Enable **Require linear history** (recommended).
- [ ] Optionally enable **Require conversation resolution before merging**.

## 5) Environment protections (for production deployments)

- [ ] In **Settings → Environments**, create `production`.
- [ ] Require reviewers for the `production` environment.
- [ ] Ensure deploy workflows use this protected environment.

## 6) Ongoing maintenance

- [ ] Revisit required checks when workflow job names change.
- [ ] Revalidate branch protection quarterly with compliance rule review.
- [ ] Reconfirm budget thresholds (60/80/90) and deploy-block policy against current GitHub plan limits.

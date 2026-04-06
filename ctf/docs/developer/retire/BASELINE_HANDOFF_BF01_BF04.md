# Baseline Handoff Summary (BF-01 to BF-04)

Date: 2026-03-01
Scope: Rewrite baselines under `ctf/` only
Status: Baseline phases BF-01, BF-02, BF-03, BF-04 completed for handoff

---

## Executive Summary

The rewrite baseline sequence is now in place across identity, Railway runtime, Vercel staging frontend integration, and Expo/EAS Android workflow foundations.

- BF-01 established Clerk as the baseline web identity model with server-side auth checks and deny taxonomy.
- BF-02 established Railway runtime guardrails and fail-fast Clerk/domain env validation.
- BF-03 established Vercel staging integration while keeping backend runtime canonical on Railway.
- BF-04 established Expo/EAS Android profiles/channels and mobile env-contract preflight checks.

---

## BF-01 Clerk Foundation

### Implemented

- App Router Clerk provider and middleware baseline for protected web routes.
- Server-side authz adapter and deny taxonomy baseline (`401`/`403` with stable deny codes).
- Env contract file and Clerk env check script for deterministic validation.

### Primary artifacts

- `ctf/packages/web/src/middleware.ts`
- `ctf/packages/web/src/lib/auth/deny-taxonomy.ts`
- `ctf/packages/web/src/lib/auth/server-authz.ts`
- `ctf/packages/web/scripts/check-clerk-env.mjs`
- `ctf/docs/contracts/PLUGIN_AUTH_DENY_TAXONOMY_BASELINE.md`
- `ctf/docs/developer/CLERK_FOUNDATION_BASELINE_BF01.md`

### Validation evidence

- Web lint/build passed.
- Clerk env validation passes for configured target environments.

### Remaining decisions

- None after BF-01 v2 closure pass.

### BF-01 v2 Delta (2026-03-02)

#### What was incomplete
- Role claim source-of-truth was unresolved (`metadata.role` vs `publicMetadata.role`).
- Baseline `/plugin` and `/admin` pages still exposed scaffold-like responses.

#### What is now closed
- Server-side role extraction is canonicalized to `publicMetadata.role`.
- Production env-key policy is documented as unprefixed canonical with `RAILWAY_PROD_*` compatibility fallback.
- `/plugin` and `/admin` baseline pages now return production-grade baseline auth/policy outcomes.

#### Clarifying questions asked and answers received
1. Canonical role claim source?
   - Answer: `publicMetadata.role` only.
2. Production key policy?
   - Answer: canonical unprefixed preference with `RAILWAY_PROD_*` fallback compatibility.
3. Remove scaffold-only route behavior now?
   - Answer: yes, in BF-01 v2.
4. Validation evidence depth?
   - Answer: run existing checks only.

#### Changed files (BF-01 v2)
- `ctf/packages/web/src/lib/auth/server-authz.ts`
- `ctf/packages/web/src/app/plugin/page.tsx`
- `ctf/packages/web/src/app/admin/page.tsx`
- `ctf/docs/developer/CLERK_FOUNDATION_BASELINE_BF01.md`
- `ctf/docs/developer/BASELINE_HANDOFF_BF01_BF04.md`

#### Remaining blockers
- None for BF-01 scope.

#### Updated validation evidence
- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.

#### Completion recommendation
- **complete**

---

## BF-02 Railway Baseline

### Implemented

- Railway startup now runs Clerk/env preflight before app start.
- Env checker auto-infers Railway staging/production targets when possible.
- Domain mismatch errors (apex vs `www`) fail fast with explicit diagnostics.

### Primary artifacts

- `ctf/railway.toml`
- `ctf/packages/web/scripts/check-clerk-env.mjs`
- `.github/workflows/deploy-backend-railway.yml`
- `ctf/docs/developer/RAILWAY_BASELINE_BF02.md`

### Validation evidence

- Railway-focused env checks pass for correct settings.
- Host mismatch simulation fails with explicit error message.

### Remaining risks

- DNS/redirect consistency for active Railway domain.
- Clerk dashboard domain/redirect settings must exactly match deployed host.

### BF-02 v2 Delta (2026-03-02)

#### What was incomplete
- Railway build install path was not lockfile-deterministic (`--no-frozen-lockfile`).
- Railway deploy workflow lacked explicit staging/production environment targeting and pre-deploy build proof.
- Clerk env preflight diagnostics lacked explicit target-source output and strict Railway deploy-host constraints.

#### What is now closed
- Railway build install path is lockfile-deterministic with `--frozen-lockfile`.
- Railway deploy workflow now selects explicit environments and runs web build pre-deploy.
- Clerk env checker now logs target source and enforces HTTPS + non-localhost app URL constraints for Railway targets.

#### Clarifying questions asked and answers received
1. Scope path for changes?
   - Answer: allow `.github/` edits.
2. Production deploy gate behavior now?
   - Answer: keep automatic deploy from `main`.
3. External blocker owner/date default?
   - Answer: Platform Ops — 2026-03-09.
4. Validation depth?
   - Answer: run existing checks only.

#### Changed files (BF-02 v2)
- `ctf/railway.toml`
- `ctf/packages/web/scripts/check-clerk-env.mjs`
- `.github/workflows/deploy-backend-railway.yml`
- `ctf/docs/developer/RAILWAY_BASELINE_BF02.md`
- `ctf/docs/developer/BASELINE_HANDOFF_BF01_BF04.md`

#### Updated validation evidence
- `pnpm --filter @ctf/web run check:clerk-env` passed for simulated `railway-staging`.
- `pnpm --filter @ctf/web run check:clerk-env` passed for simulated `railway-production`.
- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.

#### Remaining blockers
- DNS and Clerk dashboard host alignment remain external configuration tasks.
- Owner/date: Platform Ops — 2026-03-09.

#### Completion recommendation
- **complete**

---

## BF-03 Vercel Integration

### Implemented

- Added Vercel project config for web package with env preflight in build path.
- Added Vercel staging env-check command and automatic target inference in checker.
- Preserved deployment topology: Vercel frontend staging, Railway backend canonical.

### Primary artifacts

- `ctf/packages/web/vercel.json`
- `ctf/packages/web/package.json`
- `ctf/packages/web/scripts/check-clerk-env.mjs`
- `ctf/docs/developer/VERCEL_INTEGRATION_BASELINE_BF03.md`

### Validation evidence

- Web lint/build passed post-change.
- Vercel-mode env simulation passed for `vercel-staging`.

### Remaining risks

- Vercel custom domain must be configured in Clerk redirect URIs.
- Railway backend CORS must allow Vercel staging origin where required.

### BF-03 v2 Delta (2026-03-02)

#### What was incomplete
- Vercel install path remained non-deterministic (`--no-frozen-lockfile`).
- Env preflight did not fail-fast on forbidden `*.vercel.app` host usage for Clerk-bound staging auth.
- Workflow environment label was not aligned with rewrite-scoped staging naming.

#### What is now closed
- Vercel install path is lockfile-deterministic with `--frozen-lockfile`.
- `check:clerk-env` now blocks `vercel-staging` when app URL host is `*.vercel.app`.
- Vercel deploy workflow environment now targets `rewrite-vercel-staging`.

#### Clarifying questions asked and answers received
1. Scope path for changes?
   - Answer: allow `.github/` edits.
2. Should custom-domain guardrail be enforced now?
   - Answer: yes, enforce now.
3. Workflow environment label?
   - Answer: `rewrite-vercel-staging`.
4. Validation depth?
   - Answer: run existing checks only.

#### Changed files (BF-03 v2)
- `ctf/packages/web/vercel.json`
- `ctf/packages/web/scripts/check-clerk-env.mjs`
- `.github/workflows/deploy-web-vercel.yml`
- `ctf/docs/developer/VERCEL_INTEGRATION_BASELINE_BF03.md`
- `ctf/docs/developer/BASELINE_HANDOFF_BF01_BF04.md`

#### Updated validation evidence
- `pnpm --filter @ctf/web run check:vercel-staging` passed with custom-domain values.
- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.

#### Remaining blockers
- Clerk dashboard redirect/origin and Railway CORS allowlist alignment remain external configuration tasks.
- Owner/date: Platform Ops — 2026-03-09.

#### Completion recommendation
- **complete**

---

## BF-04 Expo Baseline

### Implemented

- Added `eas.json` with required `preview`, `staging`, `production` build profiles and channels.
- Added `app.config.ts` with env-driven mobile configuration.
- Added mobile env preflight checker and wired it into Expo preview/update/release workflows.

### Primary artifacts

- `ctf/packages/mobile/eas.json`
- `ctf/packages/mobile/app.config.ts`
- `ctf/packages/mobile/scripts/check-mobile-env.mjs`
- `.github/workflows/expo-preview.yml`
- `.github/workflows/expo-update.yml`
- `.github/workflows/expo-android-release.yml`
- `ctf/docs/mobile/EXPO_CLOUD_WORKFLOW.md`
- `ctf/docs/developer/EXPO_BASELINE_BF04.md`

### Validation evidence

- Mobile env preflight passed for preview and production profile simulations.
- Required CI-expected Expo files now exist.

### Remaining blockers

- Required mobile GitHub `vars`/`secrets` must be configured for each target profile.
- EAS ownership (`EXPO_OWNER`) and `EXPO_TOKEN` must match target Expo project.

### BF-04 v2 Delta (2026-03-02)

#### What was incomplete
- Expo workflows still allowed skip-on-missing-token behavior.
- Expo workflows were not explicitly bound to rewrite-scoped GitHub Environments.
- Mobile env preflight did not enforce strict deploy-host URL rules or production owner requirement.

#### What is now closed
- Expo preview/update/release workflows now fail-fast when `EXPO_TOKEN` is missing.
- Expo workflows now target rewrite mobile environments (`rewrite-mobile-preview`, `rewrite-mobile-staging`, `rewrite-mobile-production`).
- Mobile env preflight now enforces HTTPS/non-localhost `MOBILE_APP_URL` and requires `EXPO_OWNER` for production profile checks.

#### Clarifying questions asked and answers received
1. Scope path for changes?
   - Answer: allow `.github/` edits.
2. Missing-token workflow policy?
   - Answer: fail-fast.
3. Rewrite environment targeting?
   - Answer: yes, target rewrite mobile environments.
4. Validation depth?
   - Answer: run existing checks only.

#### Changed files (BF-04 v2)
- `ctf/packages/mobile/scripts/check-mobile-env.mjs`
- `.github/workflows/expo-preview.yml`
- `.github/workflows/expo-update.yml`
- `.github/workflows/expo-android-release.yml`
- `ctf/docs/mobile/EXPO_CLOUD_WORKFLOW.md`
- `ctf/docs/developer/EXPO_BASELINE_BF04.md`
- `ctf/docs/developer/BASELINE_HANDOFF_BF01_BF04.md`

#### Updated validation evidence
- `pnpm --filter @ctf/mobile run check:mobile-env` passed for simulated `preview` and `production`.
- `pnpm --filter @ctf/mobile run lint` passed.
- `pnpm --filter @ctf/mobile run typecheck` passed.
- `pnpm --filter @ctf/mobile run build` passed.

#### Remaining blockers
- Expo ownership/token alignment and deployed mobile endpoint reachability remain external configuration tasks.
- Owner/date: Platform Ops — 2026-03-09.

#### Completion recommendation
- **complete**

---

## Environment and Secret Isolation Guidance

Given legacy production is still live, do **not** mix rewrite deployment secrets into that legacy production environment.

### Recommended setup

1. Keep legacy production environment unchanged until rewrite cutover.
2. Create dedicated GitHub Environments for rewrite, for example:
   - `rewrite-railway-staging`
   - `rewrite-vercel-staging`
   - `rewrite-mobile-preview`
   - `rewrite-mobile-staging`
   - `rewrite-mobile-production` (only when ready)
3. Add rewrite-only variables/secrets to those rewrite environments (not legacy prod).
4. Use environment protection/approval rules before any production-grade rewrite release.

### About `EXPO_OWNER` and `EXPO_TOKEN`

- Yes, you should configure them for rewrite mobile workflows.
- No, do not place them in legacy production environment if that environment powers the live legacy app.
- Prefer environment-scoped secrets for rewrite workflows over broad repository-wide reuse.

---

## Stable Baseline Assumptions for Plugin Teams

- Web auth baseline is Clerk-first with server-side checks and deny taxonomy.
- Railway startup now enforces env/domain correctness before serving traffic.
- Vercel staging frontend integration is supported without moving backend ownership from Railway.
- Mobile preview/staging/production channels and build profiles now have deterministic config + preflight checks.

---

## Open Cross-Baseline Decisions

1. Final host canonicalization policy (`apex` only vs supporting `www`) across Railway + Clerk + redirects.
2. Timeline for promotion from rewrite staging to rewrite production and eventual legacy cutover.

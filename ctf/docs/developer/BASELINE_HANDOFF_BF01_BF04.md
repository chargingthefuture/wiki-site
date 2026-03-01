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

- Final role-claim source-of-truth shape in Clerk session claims.

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

1. Final naming convention preference for production Clerk key variables (`RAILWAY_PROD_*` vs unprefixed).
2. Final host canonicalization policy (`apex` only vs supporting `www`) across Railway + Clerk + redirects.
3. Timeline for promotion from rewrite staging to rewrite production and eventual legacy cutover.

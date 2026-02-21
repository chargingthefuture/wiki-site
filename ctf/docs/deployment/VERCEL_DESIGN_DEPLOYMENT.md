# Vercel Design Deployment (Separate Clerk Instance)

Purpose: Keep Vercel design deployments isolated from Railway/runtime auth by using a dedicated Clerk project (for example `vercel-staging-ctf`).

## Rules

- Vercel deploy configuration is environment-based, not branch-based.
- Vercel deploys always target Vercel production mode in this workflow.
- Clerk credentials used by Vercel must be separate from Railway/runtime credentials.

## 1) GitHub Actions environment

Use GitHub Actions environment:

- `vercel-design`

Configure these secrets in that environment:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

These must reference the Vercel project used for design iteration.

## 2) Vercel project environment variables

In the Vercel project referenced by `VERCEL_PROJECT_ID`, set Production environment variables to the dedicated Clerk instance values:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

The codebase also supports explicit Vercel-labeled aliases:

- `VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `VERCEL_CLERK_SECRET_KEY`

These aliases are applied only in Vercel execution context and do not replace Railway/mobile key conventions.

If used by your auth flow, also set:

- `CLERK_WEBHOOK_SECRET`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`

Do not reuse Railway/production runtime Clerk keys in this Vercel project.

## 3) Clerk dashboard setup (dedicated instance)

In the dedicated Clerk project (`vercel-staging-ctf`):

- Add the Vercel domain(s) under allowed/authorized domains.
- Add matching sign-in/sign-up redirect URLs.
- Keep this instance separate from runtime Railway domains.

## 4) Validation checklist

- Workflow uses GitHub environment `vercel-design`.
- Vercel deploy job succeeds with `--prod`.
- App loads with no Clerk key missing errors.
- Sign-in opens and completes on the Vercel domain.
- Session/auth behavior on Vercel does not affect Railway runtime Clerk instance.

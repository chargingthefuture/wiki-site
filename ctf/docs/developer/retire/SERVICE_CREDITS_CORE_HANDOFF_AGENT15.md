# Service Credits Core Handoff — Agent 15

Date: 2026-03-04

## Clarifying Decisions Applied

- Accounting scope for reclaim/ledger entries explicitly preserves non-GDP treatment.
- Formance ledger is required for Service Credits value-moving commands in Railway runtime.
- Core command coverage now includes escrow hold/release/refund, governance mint/burn, treasury fee collection, dispute adjustment, and internal deletion reclaim execution.

## Scope Completed

- Added migration-backed schema for wallets, ledger, transfers, escrow/disputes, treasury config, and audit trail.
- Added incremental Formance adapter schema for command idempotency, adapter outbox, governance/treasury/dispute adjustment entities, and deletion reclaim entities.
- Implemented wallet read, transfer create, dispute create, escrow lifecycle routes, governance routes, treasury routes, and internal deletion reclaim route.
- Added Formance self-host runbook and startup env validation wiring for Railway deploy path.
- Added plugin shell + admin page and route resolver integration.

## Changed Files

- `migrations/2026-03-04-service-credits-core-phase3.sql`
- `migrations/2026-03-04-service-credits-formance-adapter-phase3.sql`
- `docs/developer/FORMANCE_LEDGER_SELF_HOST_RUNBOOK.md`
- `packages/web/src/lib/service-credits/policy.ts`
- `packages/web/src/lib/service-credits/formance-ledger.ts`
- `packages/web/src/lib/service-credits/repository.ts`
- `packages/web/src/app/api/service-credits/_lib.ts`
- `packages/web/src/app/api/service-credits/wallet/route.ts`
- `packages/web/src/app/api/service-credits/transfers/route.ts`
- `packages/web/src/app/api/service-credits/disputes/route.ts`
- `packages/web/src/app/api/service-credits/escrows/route.ts`
- `packages/web/src/app/api/service-credits/escrows/[escrowId]/release/route.ts`
- `packages/web/src/app/api/service-credits/escrows/[escrowId]/refund/route.ts`
- `packages/web/src/app/api/service-credits/admin/governance/mint-grants/route.ts`
- `packages/web/src/app/api/service-credits/admin/governance/burns/route.ts`
- `packages/web/src/app/api/service-credits/admin/treasury/route.ts`
- `packages/web/src/app/api/service-credits/admin/treasury/fees/collect/route.ts`
- `packages/web/src/app/api/service-credits/admin/disputes/adjustments/route.ts`
- `packages/web/src/app/api/internal/service-credits/accounts/[accountId]/deletion-reclaims/[deletionRequestId]/execute/route.ts`
- `packages/web/scripts/check-formance-env.mjs`
- `packages/web/.env.local.example`
- `railway.toml`
- `package.json`
- `packages/web/src/components/service-credits/service-credits-shell.tsx`
- `packages/web/src/app/admin/service-credits/page.tsx`
- `packages/web/src/app/apps/[pluginSlug]/page.tsx`

## Accounting Verification Notes

- Ledger entries include `accounting_scope` and default to `service_credits_non_gdp` for transfer/deletion-reclaim-safe paths.
- Value-moving commands now require successful Formance posting before local completion.
- Deletion reclaim execution enforces 7-day eligibility window and active-escrow hold blocking before treasury reclaim finalization.
- Adapter outbox rows are written with delivered/failed status and provider transaction references per idempotency key.

## Open Adapter / Compliance Risks

- Outbox replay worker and dead-letter retry automation are not implemented yet.
- Reconciliation job between local command state and Formance transaction history is still pending.
- Railway service manifest for Formance runtime image/bootstrap remains an ops configuration step outside this codebase.

# Non-Plugin Rewrite Checklist

## Scope & Decisions

- [ ] Confirm ctf scope for non-plugin platform surfaces.
  - Acceptance criteria:
    - Includes: routing shell, auth/account lifecycle, onboarding/approval/terms gating, global admin core, shared skills/chat APIs, security/compliance middleware, observability/health, runtime/ops.
    - Excludes: plugin feature bodies tracked in plugin inventories.
- [ ] Freeze v1 parity scope for cross-cutting features.
  - Acceptance criteria:
    - Keep/defer/drop decision recorded for each cluster in `non-plugin-feature-inventory.md` matrix.
- [ ] Lock chat naming/contract policy to plugin context.
  - Acceptance criteria:
    - Generic chat semantics are resolved to ctf-compliant plugin contextualized contracts.
- [ ] Lock shared taxonomy ownership model.
  - Acceptance criteria:
    - Single shared service vs bounded projections is decided and documented.

## Phase Plan

- [ ] Phase 0: Contracts + architecture decisions.
  - Acceptance criteria:
    - Scope, ownership, and policy decisions approved with owner/date.
- [ ] Phase 1: Shared schema + migrations alignment.
  - Acceptance criteria:
    - Core entities/contracts for users/payments/admin/skills/chat are migration-safe.
- [ ] Phase 2: Server platform implementation.
  - Acceptance criteria:
    - Auth/account, admin core, shared APIs, security, and observability baselines are implemented.
- [ ] Phase 3: Web shell implementation.
  - Acceptance criteria:
    - Routing wrappers, gating flows, and cross-app UX primitives are contract-complete.
- [ ] Phase 4: Mobile/shared parity integration.
  - Acceptance criteria:
    - Shared contracts and policy controls are consistent between web/mobile where in scope.
- [ ] Phase 5: Hardening and rollout.
  - Acceptance criteria:
    - Security, accessibility, test reliability, and release gates are complete.

## Contracts Tasks

- [ ] Define routing/access wrapper contracts.
  - Acceptance criteria:
    - Protected/admin/conditional-room route behavior is deterministic and documented.
- [ ] Define auth/account lifecycle contracts.
  - Acceptance criteria:
    - User read, terms acceptance, account deletion, and profile update payloads/errors are versioned.
- [ ] Define global admin contracts.
  - Acceptance criteria:
    - Users/payments/pricing/activity/anti-scraping endpoints have explicit authz + CSRF requirements.
- [ ] Define shared skills taxonomy contracts.
  - Acceptance criteria:
    - Hierarchy/flattened/admin CRUD contracts are stable for downstream consumers.
- [ ] Define chat contracts under ctf naming constraints.
  - Acceptance criteria:
    - Route/domain naming and payload contracts align with plugin contextualization rule.
- [ ] Define health/observability contracts.
  - Acceptance criteria:
    - Health endpoint matrix, error envelopes, and operational metadata are documented.

## Server Tasks

- [ ] Implement shared middleware baseline.
  - Acceptance criteria:
    - Security headers, fingerprinting, anti-scraping, rate limiting, CSRF, and probe blocking are wired.
- [ ] Implement auth/account endpoints and policy checks.
  - Acceptance criteria:
    - Terms/account/profile/payment reads/writes are validated and auditable.
- [ ] Implement global admin endpoints with unified write policy.
  - Acceptance criteria:
    - All admin writes enforce the same authz + CSRF pattern.
- [ ] Implement shared skills and messaging services.
  - Acceptance criteria:
    - Backward-compatible read models and validated writes are available for approved consumers.
- [ ] Implement observability + health baseline.
  - Acceptance criteria:
    - Sentry/error capture + health endpoints are production-ready and monitored.

## Web Tasks

- [ ] Implement routing shell and wrapper parity.
  - Acceptance criteria:
    - Landing/root/protected/admin flows match approved behavior without route workaround regressions.
- [ ] Implement onboarding and safety gating UX.
  - Acceptance criteria:
    - Pending approval and terms acceptance blocking flows are stable and predictable.
- [ ] Implement cross-app external link primitive.
  - Acceptance criteria:
    - `useExternalLink` replacement supports confirm/copy/open and is reused in shell/admin surfaces.
- [ ] Implement global admin web surfaces.
  - Acceptance criteria:
    - Users/payments/pricing/activity workflows are operationally complete.

## Mobile/Shared Tasks

- [ ] Reuse shared contracts across web/mobile.
  - Acceptance criteria:
    - No client-specific schema forks for core non-plugin contracts.
- [ ] Decide mobile scope for global admin and shared ops surfaces.
  - Acceptance criteria:
    - Inclusion/exclusion decisions are explicit and reflected in navigation/permissions.

## Security & Policy Parity

- [ ] Enforce least-exposure privacy defaults.
  - Acceptance criteria:
    - Sensitive fields are minimized in logs, diagnostics, and public responses.
- [ ] Enforce trauma-informed and accessibility constraints.
  - Acceptance criteria:
    - Critical shell/account/admin flows meet agreed accessibility and predictable UX standards.
- [ ] Enforce unified irreversible-action safeguards.
  - Acceptance criteria:
    - Account deletion and other destructive actions require explicit confirmation.

## Testing & Validation

- [ ] Add contract tests for non-plugin APIs.
  - Acceptance criteria:
    - Success/validation/authz/forbidden/conflict/not-found paths are covered.
- [ ] Add integration tests for middleware + policy stack.
  - Acceptance criteria:
    - CSRF, rate limits, anti-scraping, and security headers are validated.
- [ ] Add web E2E coverage for core shell/admin/account flows.
  - Acceptance criteria:
    - Root/protected/admin/terms/account delete/external-link flows are stable.
- [ ] Remove test confidence gaps from legacy baseline.
  - Acceptance criteria:
    - ctf test:e2e path is active (not disabled) and skip density is within agreed threshold.

## Rollout

- [ ] Launch with staged enablement and fallback plan.
  - Acceptance criteria:
    - Operator verification and rollback steps are documented and tested.
- [ ] Publish non-plugin operational runbook.
  - Acceptance criteria:
    - Includes env contract, incident handling, and admin policy controls.
- [ ] Confirm production observability dashboards/alerts.
  - Acceptance criteria:
    - Error rates, auth/admin failures, and health degradations are visible.

## Open Decisions

- [ ] Final ctf strategy for generic chat API migration.
  - Acceptance criteria:
    - Decision captured with route/schema implications and rollout plan.
- [ ] Final external-link policy breadth.
  - Acceptance criteria:
    - Confirm-all-links vs external-only behavior is approved and tested.
- [ ] Final global admin v1 scope.
  - Acceptance criteria:
    - Must-have vs phase-2 screens are documented and owned.
- [ ] Final observability baseline depth.
  - Acceptance criteria:
    - Required Sentry/health/SLO controls for release are explicitly listed.

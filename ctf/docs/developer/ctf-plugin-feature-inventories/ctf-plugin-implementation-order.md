# CTF Plugin Implementation Order (Dependency-Driven)

Date: 2026-03-01

This order is based on explicit dependency and authority statements in plugin inventories/checklists, plus baseline platform constraints for auth and deployment.

## Dependency rules used

Hard or strong dependencies found in rules and inventory/checklist docs:

1. Baseline foundation must be established before plugin waves:
   - Clerk integration baseline,
   - Railway canonical deployment baseline,
   - Vercel staging frontend integration,
   - Expo Android deployment baseline.
2. `skills-taxonomy` is authoritative for sectors/job titles/skills and lists `directory` + `workforce` as downstream consumers.
3. `directory` is an upstream authority for:
   - `workforce` recruited-state inference,
   - `skills-hunt` ownership/policy lifecycle,
   - `foundation` provider discovery projections.
4. `feed` and `announcements` share one centralized admin surface (`/admin/feed-announcements`) and tightly coupled rendering/targeting behaviors.
5. `service-credits` has policy coupling to GDP semantics (non-GDP deletion reclaim accounting), but this is not a strict coding-start blocker.

Everything else is mostly independent at plugin-boundary level and can be parallelized once foundational dependencies are stable.

## Recommended implementation sequence

### Phase -1 — Baseline foundation (mandatory)

BF-01. `clerk-foundation`
BF-02. `railway-baseline`
BF-03. `vercel-integration`
BF-04. `expo-baseline`

Why first:

- This repository is being rebuilt from boilerplate and cannot assume prior auth/deployment stability.
- Plugin work should not begin until auth domains, runtime topology, and mobile release paths are known-good.

### Phase 0 — Core primitives for downstream plugins

0. `chyme`
1. `skills-taxonomy`
2. `directory`
3. `feed`
4. `announcements`

Why now:

- Chyme is a fresh implementation target in this reset.
- Taxonomy + Directory are upstream data authorities for multiple plugins.
- Feed + Announcements are operationally coupled and should avoid divergent contracts.

### Phase 1 — Direct downstream dependents

5. `workforce`
6. `skills-hunt`
7. `foundation`

Why now:

- `workforce` depends on Directory writes and should consume stabilized selector/taxonomy outputs.
- `skills-hunt` generates unclaimed Directory profiles and must honor Directory ownership policies.
- `foundation` explicitly reads Directory projections and enforces read-only boundary.

### Phase 2 — Independent product surfaces (parallel wave)

8. `lighthouse`
9. `socketrelay`
10. `trusttransport`
11. `peer-programming`
12. `mood`
13. `gentlepulse`
14. `weekly-performance`

Why now:

- No hard upstream plugin dependency is declared that blocks coding start.
- These can be dispatched to separate agents in parallel, with contract governance checks.

### Phase 3 — Finance/reporting coupling wave

15. `gross-domestic-product`
16. `service-credits`

Why last:

- GDP + Service Credits have policy/semantic coupling around accounting treatment.
- Sequencing them late reduces rework risk after upstream event/metric semantics settle.

## Agent dispatch packs (practical)

If you want high parallelism without violating dependencies:

- Pack BF (mandatory first): `clerk-foundation` → `railway-baseline` → `vercel-integration` → `expo-baseline`
- Pack A (start after Pack BF): `chyme`, `skills-taxonomy`, `directory`, `feed+announcements` (same stream)
- Pack B (start after Pack A contract lock): `workforce`, `skills-hunt`, `foundation`
- Pack C (parallel after Pack A): `lighthouse`, `socketrelay`, `trusttransport`, `peer-programming`, `mood`, `gentlepulse`, `weekly-performance`
- Pack D (after Pack B/C metric and event contracts stabilize): `gross-domestic-product`, `service-credits`

## Notes

- This order supersedes older assumptions that Chyme is already implemented.
- Missing command/access/audit YAML triplets are release-gate concerns, not coding-start blockers.
- Governance references should resolve through `index.mdc` and indexed rule modules only.

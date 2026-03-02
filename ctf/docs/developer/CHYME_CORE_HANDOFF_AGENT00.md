# Chyme Core Handoff (Agent 00)

Date: 2026-03-02  
Scope: `ctf/` only (web/API/deletion/audit hardening; Android parity remains deferred)

## Clarifying questions asked and answers received

1. Should this pass stay web-only with Android parity deferred?
   - Answer: Yes, web-only now.
2. Should a dedicated handoff document be created for Chyme closure?
   - Answer: Yes.
3. Validation depth?
   - Answer: Run existing checks only.

## Delta vs prior Chyme implementation

### What was incomplete / scaffold-like

1. Chyme call join flow returned successful Stream credentials, but room `call_active` state remained static (`false`) unless externally updated.
2. No dedicated Chyme closure handoff artifact existed to capture route/contract decisions, validation evidence, and unresolved debt ownership.
3. Checklist phase-4 lifecycle maintenance items remained open despite available evidence links.

### What is now closed

1. Successful `POST /api/chyme/join` now persists room call state (`call_active=true`) via repository transaction.
2. Web Chyme shell reflects joined call state immediately after successful join response.
3. Chyme inventory/checklist and assignment matrix are synchronized with current closure evidence.

## Contract and route decisions

1. Chyme remains web-complete in Phase 0; Android parity remains deferred with explicit owner/date.
2. Join semantics now include call activation persistence:
   - route: `POST /api/chyme/join`
   - repository method: `markRoomCallJoined(...)`
3. Existing command/access/audit contract triplet remains valid with this runtime change (no contract schema rename required).

## Changed files

- `ctf/packages/web/src/lib/chyme/repository.ts`
- `ctf/packages/web/src/app/api/chyme/join/route.ts`
- `ctf/packages/web/src/components/chyme/chyme-shell.tsx`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-chyme-rewrite-checklist.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-chyme-feature-inventory.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-plugin-agent-assignment-matrix.md`
- `ctf/docs/developer/CHYME_CORE_HANDOFF_AGENT00.md`

## Validation evidence (existing checks)

- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.

## Open gaps / debt with owner recommendation

1. Android parity implementation for Chyme room/chat/join/deletion flows.
   - Owner: `mobile-phase2-chyme`
   - Target milestone: 2026-04-15
   - Next action: implement mobile route parity and policy outcome checks.
2. Full-account orchestrator lifecycle completion beyond `requested` state.
   - Owner: Platform Ops
   - Target date: 2026-03-29
   - Next action: wire account deletion status transitions (`processing/completed/failed`) to global orchestrator callbacks.

## Completion recommendation

- **complete** for Chyme Phase-0 web baseline and second-pass de-scaffolding scope.

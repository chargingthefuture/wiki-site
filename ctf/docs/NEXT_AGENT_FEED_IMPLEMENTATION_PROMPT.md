# Next Agent Prompt: Implement Unified Feed

Use this file as the starting prompt for the next agent.

## Objective

Implement the remaining Feed work in `ctf/` based on the current approved artifacts.

This is a CTF-only feature. Do not use `platform/` for implementation.

## Critical Instruction

The files listed below are the single source of truth for Feed feature scope, contracts, parity, and governance.

You must treat those artifacts as authoritative over incomplete or older runtime code.

When the implementation is complete, delete this file:

- `ctf/docs/NEXT_AGENT_FEED_IMPLEMENTATION_PROMPT.md`

## What The Feature Is

Feed is the CTF homepage/plugin experience for survivor-facing timeline and discovery.

Feed is a unified three-channel surface:

1. Announcements
2. Questions with LLM-assisted answers
3. Community support

All Feed commands use the unified `feed.*` namespace.

Android parity is required before release.

## Current Reality

The artifacts now describe the correct intended architecture.

The current runtime implementation is still mostly announcements-focused.

That means your job is to bring implementation into alignment with the artifacts, not to infer product direction from existing partial code.

## Single Source Of Truth

Read these first and treat them as authoritative:

- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-feed-feature-inventory.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-feed-rewrite-checklist.md`
- `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-feed-android-parity-note.md`
- `ctf/docs/contracts/FEED_PLUGIN_COMMAND_CONTRACTS.yaml`
- `ctf/docs/contracts/FEED_PLUGIN_ACCESS_POLICY_CONTRACTS.yaml`
- `ctf/docs/contracts/FEED_PLUGIN_AUDIT_CONTRACTS.yaml`
- `ctf/config/canonical_metrics.yaml`
- `ctf/config/plugin-parity-contracts.json`

Supporting context:

- `ctf/docs/quota-impact/2026-03-02-feed-announcements-phase0.md`
- `ctf/schema.sql`

## Implementation Expectations

Implement the missing feature work required by the artifacts, including at minimum:

1. Questions channel runtime support
2. LLM-assisted answer flow
3. Community support channel runtime support
4. Feed homepage/plugin alignment with the documented three-channel model
5. Android parity work required by the artifacts and parity note

## Known Gap Between Docs And Runtime

The following areas are documented but not fully implemented yet:

- Questions channel schema, repository, API routes, and UI
- LLM inference integration and audit trail
- Community channel schema, repository, API routes, and UI
- Android implementation across all three channels

The current announcements-related runtime code under `ctf/packages/web` is only a partial implementation of the final feature.

## Runtime Areas Likely To Change

Start review in these implementation areas:

- `ctf/packages/web/app/page.tsx`
- `ctf/packages/web/app/apps/[pluginSlug]/page.tsx`
- `ctf/packages/web/components/feed/`
- `ctf/packages/web/app/api/feed/`
- `ctf/packages/web/lib/feed/`
- `ctf/packages/web/lib/auth/`
- `ctf/schema.sql`

If mobile code exists in the repo for parity work, trace it from the parity contracts and related mobile feature directories.

## Guardrails

1. Keep work inside `ctf/` unless a documented rule explicitly requires otherwise.
2. Do not treat deprecated standalone `ANNOUNCEMENTS_PLUGIN_*` files as authoritative.
3. Preserve unified `feed.*` command naming.
4. Follow the Feed contracts exactly for command, policy, and audit behavior.
5. Maintain PostgreSQL as canonical storage and Stream/GetStream as fan-out behavior, not source of truth.
6. Keep Android parity as required, not deferred.

## Validation Requirements

Before completion:

1. Run the relevant typecheck/build commands for affected packages.
2. Update any artifacts that become stale during implementation.
3. Verify runtime behavior matches the Feed contracts and checklist.
4. Delete this prompt file after the work is complete.

## Completion Definition

The task is complete only when:

- implementation matches the Feed artifacts,
- the three-channel Feed model is represented in runtime,
- required parity work is addressed or implemented per artifact scope,
- validation passes,
- and this handoff file is deleted.
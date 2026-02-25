# Platform Non-Plugin Feature Inventory (CTF Rewrite)

## Scope and Boundary

- Rewrite target only: `ctf/`
- Legacy `platform/` is reference-only and must not be modified.
- This document is the CTF rewrite parity inventory for app-wide non-plugin capabilities.
- Plugin-specific feature bodies remain tracked in plugin inventories under `ctf/docs/developer/ctf-plugin-feature-inventories/`.

Initial creation intent:

1. Start CTF non-plugin parity tracking with the first app-wide feature cluster.
2. Establish explicit ownership transfer for capabilities moved out of plugin scope.

---

## 1) App-Wide Feature Cluster: Settings and Accessibility Personalization

Ownership decision:

1. `Settings and Accessibility Personalization` is app-level non-plugin scope.
2. This capability is not owned by GentlePulse plugin in CTF rewrite.

### 1.1 Planned User Capabilities

1. App-level route/surface for personalization controls (shared, not plugin-local).
2. Persistent user preference storage via approved app-level settings contract.
3. Personalization controls include:
   - high contrast mode,
   - font size (`normal`, `large`, `extra-large`),
   - dyslexia-friendly font.
4. Runtime application of accessibility classes/tokens through shared app shell behavior.

### 1.2 Planned Cross-Plugin Consumption Contract

1. Plugins consume app-level settings/accessibility state as read-only dependency.
2. Plugins do not maintain separate settings keys for these controls.
3. Web and Android clients follow a shared behavioral contract for equivalent outcomes.

### 1.3 Explicit Exclusions

1. No plugin-local Settings page is required for GentlePulse in CTF parity scope.
2. No third-party admin tooling scope is tracked in this document.

## 2) Ownership Cross-References

1. GentlePulse CTF parity owner document:
   - `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-gentlepulse-feature-inventory.md`
2. Legacy non-plugin reference inventory:
   - `ctf/docs/developer/non-plugin-feature-inventory.md`

## 3) Gaps and Follow-Ups

1. Final app-level settings route/component ownership in `packages/web` and `packages/mobile` requires implementation-time assignment.
2. Shared schema/contract location for app-level accessibility preferences requires final lock.
3. Additional non-plugin capability clusters will be added in later iterations.

## 4) Change Log

- 2026-02-25: Created CTF non-plugin parity inventory starter; added `Settings and Accessibility Personalization` as first app-wide feature cluster and moved ownership out of GentlePulse plugin scope.

# CTF Non-Plugin Feature Inventory (CTF Rewrite)

## Scope and Boundary

- Rewrite target only: `ctf/`
- Legacy `platform/` is reference-only and must not be modified.
- This is the CTF rewrite non-plugin parity inventory for shared app capabilities that are not plugin-owned.
- Plugin-owned features are tracked only in plugin inventories under `ctf/docs/developer/ctf-plugin-feature-inventories/`.

---

## 1) Retained Non-Plugin Capability Clusters

### 1.1 Global Routing, App Shell, and Access Wrappers

1. Shared route-group composition for public, protected, and admin-capable shells.
2. Shared app-shell gating wrappers for authenticated access.
3. Shared approval and terms gating wrappers before app/plugin usage.
4. Shared access-denied and redirect behavior contracts across web and Android.

### 1.2 Auth and Account Lifecycle + Onboarding/Approval/Terms Gating

1. Authenticated current-user session retrieval and lifecycle checks.
2. Account lifecycle controls including logout and full-account deletion entry.
3. Onboarding and account-approval gating state handling.
4. Terms-acceptance requirement and persisted acceptance contract.

### 1.3 Pricing Tier and Payment Admin (API/Control Contract Only)

1. Pricing tier and payment administration remains a non-plugin backend contract area.
2. In-app admin panel parity is explicitly out of scope for CTF rewrite.
3. Operational control plane for pricing/payment admin is Retool-based, not CTF UI.
4. Required CTF scope is stable API/control contracts, policy checks, and audit evidence only.

### 1.4 External-Link Safety Primitive

1. Shared external-link confirmation and safe-open behavior remains app-level non-plugin scope.
2. Shared primitive is consumed by shell and plugin surfaces without duplicating logic.
3. Contract includes normalized URL handling, warning semantics, and explicit open/cancel actions.

### 1.5 Settings and Accessibility Personalization

1. App-level personalization surface remains shared non-plugin scope.
2. Persistent settings contract includes high contrast mode, font size (`normal`, `large`, `extra-large`), and dyslexia-friendly font.
3. Runtime accessibility token/class application remains app-shell-owned.
4. Plugins consume settings/accessibility state as read-only dependency and do not fork keys.

---

## 2) Explicit Exclusions from This Parity Inventory

1. Monitoring, telemetry, and service-status operations are out of this parity inventory.
2. Generic messaging/chat surface is not carried over.
3. Admin activity feed is not carried over as a CTF UI/API requirement.
4. Skills taxonomy is plugin-owned and tracked in its own plugin inventory.
5. Weekly performance is plugin-owned and tracked in its own plugin inventory.

### 2.1 Compliance Position for Admin Activity Feed Removal

1. No admin activity feed UI/API is required for parity if backend audit evidence paths remain enforced and documented.
2. Required controls remain: privileged-action attribution, allow/deny outcome capture, and immutable audit evidence retention per compliance rules.

---

## 3) Rule Alignment

1. `.claude/rules/index.mdc`
   - Keeps rewrite scope in `ctf/`, preserves plugin-first ownership boundaries, and treats legacy as reference-only.
2. `.claude/rules/120-plugin-feature-inventory-lifecycle-rules.mdc`
   - Requires plugin-owned capabilities (weekly-performance, skills-taxonomy) to move into dedicated plugin inventory/checklist docs.
   - This non-plugin inventory is explicitly exempt from Rule 120 plugin-required content sections and uses alternate non-plugin capability criteria.
3. `.claude/rules/004-authz-authn-and-admin-controls.mdc`
   - Requires server-side authz/authn hardening for retained non-plugin auth/account and privileged contract surfaces.
4. `.claude/rules/007-audit-logging-and-monitoring.mdc`
   - Allows admin feed removal while still requiring complete audit logging coverage and protected evidence paths.
5. `.claude/rules/014-compliance-rules-index.mdc`
   - Keeps compliance modules mandatory for retained non-plugin contracts and plugin-owned rewrites.

---

## 4) Legacy Evidence Pointers (Reference-Only)

1. `ctf/docs/developer/non-plugin-feature-inventory.md`
2. `ctf/docs/developer/skills-database-admin-feature-inventory.md`

---

## 6) Governance Note (Rule 120 Exemption)

1. Plugin-first ownership rules still apply to plugin-owned capabilities and must be implemented through plugin inventory/checklist artifacts.
2. This non-plugin inventory remains an exempt parity/governance document under alternate non-plugin capability criteria.
3. This document is not a blocker for plugin coding readiness when plugin-owned requirements are satisfied in their plugin inventories.

---

## 5) Change Log

- 2026-02-25: Expanded CTF non-plugin parity inventory to full retained/excluded scope; marked weekly performance and skills taxonomy as plugin-owned; removed generic chat/admin activity feed carryover requirements; documented compliance position for audit-evidence-first admin activity feed removal.
- 2026-02-25: Removed weekly-performance legacy-evidence pointer so weekly rewrite parity remains sourced from plugin-inventory documents.
- 2026-02-25: Added Rule 120 non-plugin exemption governance note and clarified non-blocking status for plugin coding readiness.

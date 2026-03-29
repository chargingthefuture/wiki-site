# CTF Non-Plugin Rewrite Checklist

## Scope (Settings + Accessibility Personalization Only)

- [ ] Confirm this checklist tracks only the app-level `Settings and Accessibility Personalization` cluster from `ctf-plugin-feature-inventories/ctf-non-plugin-feature-inventory.md`.
- [ ] Confirm work is limited to rewrite target (`ctf/`) and does not modify legacy `platform/`.

## App-Level User Capabilities

- [ ] Provide a shared app-level settings/personalization route or surface (not plugin-local).
- [ ] Persist user preferences through the approved app-level settings contract.
- [ ] Support personalization controls for:
  - [ ] High contrast mode
  - [ ] Font size: `normal`, `large`, `extra-large`
  - [ ] Dyslexia-friendly font
- [ ] Apply accessibility classes/tokens at runtime through shared app-shell behavior.

## Cross-Plugin Consumption Contract

- [ ] Ensure plugins consume settings/accessibility state as read-only.
- [ ] Prevent plugin-specific duplicate settings keys for these controls.
- [ ] Keep web and Android behavior aligned to the shared contract.

## Explicit Exclusions

- [ ] Do not add a GentlePulse plugin-local Settings page for CTF parity.
- [ ] Exclude third-party admin tooling from this checklist and implementation scope.

## Completion Gate

- [ ] Verify all checklist items map directly to Section 1 (1.1–1.3) of `ctf-plugin-feature-inventories/ctf-non-plugin-feature-inventory.md`.
- [ ] Record any out-of-scope requests as follow-ups rather than expanding this checklist.

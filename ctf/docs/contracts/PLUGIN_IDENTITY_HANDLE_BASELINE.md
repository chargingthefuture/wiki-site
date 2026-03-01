# Plugin Identity Handle Baseline (Clerk)

Status: Baseline decision for plugin contracts.

## Purpose

Define one canonical user handle source for all plugin surfaces that show a username or parse `@mention` text.

## Canonical Handle Source

- Source of truth: Clerk `username`.
- Scope: all plugins under `ctf/`.
- Display/mention token: `@{username}`.

## Contract Rules

1. Plugins must not create plugin-specific username fields as alternate identity handles.
2. When a plugin needs a username/handle, it must read from Clerk identity context (or canonical profile field mirrored from Clerk).
3. If a plugin persists identity snapshots for history/audit (for example chat message author fields), persisted handle values must originate from Clerk `username` at write time.
4. Plugins may keep display-name fields (for non-handle UX), but those are not treated as canonical handles and must not be used for mention resolution.

## Null/Unset Username Fallback

- If `username` is missing, plugin behavior must be deterministic:
  - show non-handle display fallback (for example first name / display name fallback),
  - do not mint synthetic `@username` values,
  - treat `@mention` targeting for that user as unavailable until Clerk `username` is set.

## Sign-up and Profile Governance

- Product should require Clerk username capture during sign-up/onboarding to maximize parity across plugins.
- If username changes are allowed in Clerk, downstream plugin reads must treat Clerk as current source of truth and avoid stale plugin-local username ownership models.

## Security and Compliance Notes

- Keep deny payloads and logs free of unnecessary identity attributes.
- Do not log raw message payloads solely for mention parsing diagnostics.

## Implementation Notes

- Web/mobile parity should consume the same handle contract.
- Any future migration that introduces canonical-profile mirroring must document sync direction and conflict policy (`Clerk -> canonical profile` expected baseline).

# Trust Plugin Feature Inventory (CTF Rewrite)

## Scope and Plugin Boundary
- Provides privacy-first trust evidence and verification for user profiles.
- No numeric trust scores; only evidence panels and verification status.
- Plugin extension only; no canonical profile duplication.

## Implemented User Features
- View trust evidence panel on profile and directory surfaces.
- Request verification or submit trust evidence (future phase).
- Control trust visibility (public/private/restricted).

## Implemented Admin Features
- Review trust evidence and verification requests.
- Update trust status (verified/unverified/flagged).
- Audit trail for all trust-related actions.

## API Surface and Route Map
- trust.summary.read
- trust.visibility.update
- trust.admin.verification.review
- trust.signal.snapshot.refresh

## Data Model and Storage Contracts
- trust_user_extension (user_id, trust_status, trust_evidence, trust_visibility, timestamps)
- trust_signal_snapshots (user_id, snapshot, snapshot_type, created_at)
- trust_admin_audit_trail (actor_user_id, command, policy_status, reason, target_user_id, request_id, metadata, created_at)

## Security/Compliance Controls
- Plugin-scoped deletion and audit compliance.
- No raw moderation evidence exposed to users.
- All actions gated by policy contracts.

## Seed Coverage Status
- Seed script: DEFERRED (to be implemented for plugin validation in dev environments)

## Gaps/Ambiguities and Known Technical Debt
- User-submitted trust evidence UI deferred to future phase.
- No automated trust signals in MVP; only manual/admin actions.
- No mobile implementation yet.

## Change Log
- 2026-03-25: Initial inventory created for Trust plugin rewrite MVP.

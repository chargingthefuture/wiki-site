# Plugin Auth Deny Taxonomy Baseline (BF-01)

Status: Baseline approved for plugin route consumption.

## Purpose

Provide a deterministic deny contract for plugin routes and APIs when authentication or authorization fails.

## Deny Responses

### 1) Unauthenticated

- HTTP status: `401`
- Code: `AUTH_UNAUTHORIZED`
- Reason: `no_active_session`
- Meaning: request has no valid authenticated session resolved by the active auth provider for the current domain.

### 2) Authenticated but missing role

- HTTP status: `403`
- Code: `AUTH_FORBIDDEN_ROLE`
- Reason: `missing_required_role`
- Meaning: user is signed in but does not satisfy required role policy.
- Payload extension: `requiredRoles: string[]`.

### 3) Authenticated but blocked by policy adapter

- HTTP status: `403`
- Code: `AUTH_FORBIDDEN_POLICY`
- Reason: `policy_denied` or `missing_username`
- Meaning: user is signed in but plugin policy adapter disallows operation.

`missing_username` baseline meaning:

- request is authenticated but route requires the canonical provider-backed `username` or equivalent handle and none is currently set.
- client guidance should direct user to the active auth/profile settings flow to complete the canonical handle.

## Baseline API Evidence

- API route: `GET /api/plugin/policy-probe`
- Optional query: `adminOnly=true`
- Returns deny payloads above, or allow payload:
  - `200 { allowed: true, userId, requiredRoles }`

## Consumer Guidance

- Plugin route handlers should return deny payloads exactly as specified.
- Client UI should branch by `status` and `code`, not free-form message text.
- Keep deny payload free of PII and internal policy details.

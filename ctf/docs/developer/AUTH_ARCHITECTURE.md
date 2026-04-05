# CTF Authentication Architecture

Date: 2026-04-05
Scope: `ctf/packages/web`

## Overview

Authentication in the CTF web package is a **future implementation**. A provider-agnostic
abstraction layer is in place so that any auth provider (Clerk, Auth0, a custom system, etc.)
can be plugged in without touching consuming components.

---

## Current State

Auth is a **no-op stub**. `isAuthenticated` is always `false` until a real provider is wired in.
Components that require authentication already guard their actions correctly — unauthenticated
users see "Sign in to …" prompts instead of action buttons.

---

## Files

| File                           | Purpose                                                                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `lib/auth/client-context.tsx`  | **The only file that changes when swapping providers.** Defines `AuthProvider`, `useAuth`, `AuthContextType`, and `AuthUser`.      |
| `hooks/useAuth.ts`             | Stable re-export path for all consumers (`@/hooks/useAuth`). Never changes.                                                        |
| `lib/auth/clerk-env.ts`        | Helper to read Clerk environment variables from multiple Railway/Vercel contexts. Only relevant when Clerk is the chosen provider. |
| `lib/auth/request-identity.ts` | Server-side identity resolver. Reads `x-ctf-user-*` headers and `ctf_*` cookies set by middleware.                                 |
| `lib/auth/server-authz.ts`     | Server-side authorization evaluator. Used in route handlers and Server Components.                                                 |

---

## Client-Side Usage

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={signIn}>Sign in</button>;
  }

  return <span>Hello, {user?.username}</span>;
}
```

`useAuth` must be called inside a component that is a descendant of `<AuthProvider>`.
The root `app/layout.tsx` should wrap the app in `<AuthProvider>` once a real provider
is configured. Until then, individual mockup components (e.g. `Chyme`) wrap themselves.

---

## Swapping Auth Providers

Only `lib/auth/client-context.tsx` needs to change. The contract it must satisfy:

```ts
interface AuthContextType {
  user: AuthUser | null; // null when not signed in
  isLoading: boolean; // true during provider initialization
  isAuthenticated: boolean;
  signIn: () => Promise<void> | void;
  signOut: () => Promise<void> | void;
}

interface AuthUser {
  id: string;
  username?: string | null;
  email?: string | null;
  isAdmin?: boolean;
  isApproved?: boolean;
}
```

**Steps to plug in Clerk:**

1. Install `@clerk/nextjs`.
2. Replace the `AuthProvider` body in `client-context.tsx` to use `<ClerkProvider>` and
   derive `AuthContextType` from `useUser()` / `useClerk()`.
3. Populate `clerk-env.ts` variables in the relevant `.env` file / Railway config.
4. Update `middleware.ts` to re-enable Clerk route protection (see `CLERK_FOUNDATION_BASELINE_BF01.md`).

No other files need to change.

---

## Server-Side Auth

Server Components and API route handlers use:

```ts
import { resolveRequestIdentity } from "@/lib/auth/request-identity";

const identity = await resolveRequestIdentity();
// identity.userId — 'local_user' when unauthenticated (dev default)
// identity.isApproved, identity.role, identity.unlockAccessTier
```

For access policy decisions:

```ts
import { evaluatePluginAccess } from "@/lib/auth/server-authz";

const decision = await evaluatePluginAccess({ requireApprovedUserOrAdmin: true });
if (!decision.allowed) redirect("/sign-in");
```

---

## Deprecated Patterns

| Pattern                            | Status      | Reason Removed                                                                                                                                                                           |
| ---------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_DISABLE_AUTH` env var | **Deleted** | Bypassed auth globally with a mock user, making it impossible to test real unauthenticated flows. The abstraction layer renders it unnecessary — the stub provider IS the no-auth state. |

---

## Related Documents

- `CLERK_FOUNDATION_BASELINE_BF01.md` — previous Clerk-specific baseline (reference only)
- `CLERK_USERNAME_ROLLOUT_PLAN.md` — Clerk username rollout plan (reference only)
- Rule `123-environment-configuration-rules.mdc` — environment variable contract

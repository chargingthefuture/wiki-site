---
title: Security fixes and plugin naming updates
date: "2026-06-26"
excerpt: Security updates, plugin naming consistency, Chyme guest-listen enforcement, and an early-access experiment for Commons.
category: Updates
slug: Product-Update-2026-06-26-Security-Fixes-Plugin-Naming
repo: chargingthefuture/chargingthefuture
---

# Product Update: June 26, 2026

## What Shipped

**Security hardening.** CSRF protection now runs before authentication in Foundation provider routes, catching invalid requests earlier. The level-up milestone validation endpoint also got CSRF header enforcement.

**Plugin naming consistency.** Renamed click-log and gentle-pulse to use hyphens instead of camelCase. These changes rolled out across the platform.

**Chyme improvements.** Guest listeners can no longer accidentally send audio or video—the server enforces listen-only mode directly, not just in the UI.

**Workforce dashboard fix.** The dashboard was returning too much data and timing out. Now it runs a lightweight summary instead, so you get your stats without the wait.

**PeerProgramming cohort pages.** Fixed a crash that happened when cohorts scaled up.

**Mood and pseudonymous accounts.** Decoupled mood tracking from your account pseudonym so mood data stays separate from your identity choices.

**Commons early access.** Running an experiment: some unverified Unlock members now get early access to the Commons to see what the shared community space looks like.

## Why It Matters

Security fixes close gaps in request validation so you control what data moves through the platform. Plugin naming consistency makes it easier to find tools and read documentation. Server-side enforcement for Chyme guest mode means you don't have to worry about accidental broadcast. Mood tracking staying separate from your pseudonym gives you one more layer of control over what stays private.

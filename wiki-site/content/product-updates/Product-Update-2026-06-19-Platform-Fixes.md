---
title: Fixes for Chyme, LightHouse, and plugin consistency
date: "2026-06-19"
excerpt: Chyme guest listening, LightHouse card cleanup, and plugin consistency fixes.
category: Updates
slug: Product-Update-2026-06-19-Platform-Fixes
repo: chargingthefuture/chargingthefuture
---

# Product Update — June 19, 2026

## What Shipped

**Chyme guest listening cleanup.** Visitors who aren't signed in can now listen to the live Chyme room without friction. We fixed the experience so the refresh button actually works, the interface stays readable on mobile, and token expiry is handled cleanly.

**LightHouse card polish.** Cards in the LightHouse listing now hide blank fields instead of showing empty spaces. This makes each match easier to scan.

**Plugin footer consistency.** Foundation's left rail now uses the same footer as every other plugin on the platform. Small change, but it makes the whole app feel more coherent.

**Directory and governance fixes.** Directory admins can now assign and update profiles without errors. Governance ticket IDs are stored correctly so automated mints don't fail. SocketRelay's chat panel is now dark-themed, and the share menu no longer clips off-screen.

**Unlock reward reliability.** If a reward gets stuck in pending state, our admin tools can now retry it, and the system will show you exactly why a mint failed. We also fixed a cron job that was preventing reconciliation.

## Why It Matters

These are all quiet improvements — nothing flashy. But they mean less confusion, fewer dead ends, and a platform that works the way you expect it to. You spend less time troubleshooting and more time using the tools that matter to you.

---

**Code:** https://github.com/chargingthefuture/chargingthefuture

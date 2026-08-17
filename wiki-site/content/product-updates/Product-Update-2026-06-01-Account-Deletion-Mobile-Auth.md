---
title: Account deletion, mobile improvements, and auth fixes
date: "2026-06-01"
excerpt: Account deletion, Android optimization, and authentication fixes ship this week to strengthen data control and platform reliability.
category: Updates
slug: Product-Update-2026-06-01-Account-Deletion-Mobile-Auth
repo: chargingthefuture/chargingthefuture
---

# Product Update: June 1, 2026

## What Shipped

This week we merged improvements across three core areas:

**Account Deletion Orchestrator**: You now have full control to delete your account and associated data from Charging the Future. The orchestrator ensures data removal is complete and reliable.

**Android Mobile Optimization**: We completed pixel-perfect rendering passes across Feed Announcements, Foundation, Directory, Clicklog, GDP, and Gentlepulse. These changes ensure the platform displays correctly and performs smoothly on Android devices.

**Authentication Fixes**: We resolved edge cases in how authentication environment variables are read, ensuring the publishable key is available where it's needed and clarified build-time behavior for public variables.

**Developer Experience**: We cleaned up obsolete mobile mocks, added comprehensive documentation to authentication helpers, and streamlined CI/CD to surface deployment status without false failures.

## Why It Matters

Account deletion reinforces a core value: you own your data. If you decide to leave, you can do so completely and confidently.

Mobile optimization means survivors using Android phones experience the same clarity and reliability as desktop users. This matters because access shouldn't depend on what device you carry.

Authentication stability removes friction from your login experience and gives our team confidence that security boundaries work as intended across all deployment environments.

These changes together signal our commitment to reliability, respect for your privacy choices, and a platform that works for everyone.

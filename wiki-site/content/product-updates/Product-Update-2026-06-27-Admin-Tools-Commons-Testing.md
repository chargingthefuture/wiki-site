---
title: Admin tools and Commons testing updates
date: "2026-06-27"
excerpt: Fixed payment address loading in admin profiles. Added Commons A/B test visibility. Improved issue queue selection.
category: Updates
slug: Product-Update-2026-06-27-Admin-Tools-Commons-Testing
repo: chargingthefuture/chargingthefuture
---

# Product Update: Admin Tools and Commons Testing — June 27, 2026

## What Shipped

Fixed a data bug where payment-address columns weren't loading in directory admin profile queries. This was silently failing; now it reports errors clearly so they don't go unnoticed.

Added early-Commons A/B experiment split visibility to the Unlock admin dashboard. You can now see which users are in the experiment and track how the two variations are performing.

Improved the code-review issue picker to select the truly oldest actionable issue instead of just the oldest one from a batch of 50. This makes the queue more predictable.

## Why It Matters

Admin tools need to be reliable. When data doesn't load, admins should know it right away—not discover it weeks later. Payment addresses are critical for how the platform connects survivors with economic opportunity, so getting them right matters.

The Commons is core to how survivors find each other and share resources. Tracking early experiment results helps confirm what actually works for real users, not just what looks good on paper.

Small fixes to process tooling add up: clearer error reporting and fairer issue selection mean the project moves faster and more fairly.

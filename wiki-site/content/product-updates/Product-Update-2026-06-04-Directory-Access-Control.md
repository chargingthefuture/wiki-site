---
title: Directory now shows your full network
date: "2026-06-04"
excerpt: Directory now displays all member profiles and gives you inline controls over your account visibility.
category: Updates
slug: Product-Update-2026-06-04-Directory-Access-Control
repo: chargingthefuture/chargingthefuture
---

# Product Update: Directory Access and Profile Control

**Date:** June 4, 2026

## What Shipped

We resolved two critical issues in the Directory:

1. **Full Member Visibility**: The Directory now correctly displays all member profiles to authenticated users. Previously, some profiles were hidden due to a gating error, limiting your ability to connect with other survivors in the network.

2. **Inline Account Control**: Profile managers can now adjust account attachment settings directly from the profile detail view, without navigating to separate settings. This puts control exactly where you need it.

## Why It Matters

The Directory is your bridge to a supportive community of survivors. When profiles are hidden or controls are buried in menus, you lose agency over your own visibility and connections. These fixes restore clarity and put you in charge of how you appear and interact within the network.

Clear access to community members—and transparent control over your own presence—builds trust. You can now browse with confidence, knowing you're seeing the full picture and that your preferences are respected.

## Technical Details

- Fixed directory browse access gating for member-level users
- Removed empty-state dead links that appeared when no profiles were loaded
- Added inline admin controls for account attachment configuration
- Improved database query consistency across directory views

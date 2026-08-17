---
title: Account deletion, Peer Programming rosters, and backend updates
date: "2026-06-23"
excerpt: Account deletion, Peer Programming rosters, and backend cleanup. June 23, 2026.
category: Updates
slug: Product-Update-2026-06-23-Account-Deletion-Peer-Programming
repo: chargingthefuture/chargingthefuture
---

# Product Update: June 23, 2026

## What Shipped

**Account deletion workflow.** You can now request to delete your account. The operator can process deletions through a manual workflow.

**Peer Programming cohort rosters.** Cohort owners can now see a list of all members in their group. This makes it easier to know who you're working with.

**Peer Programming membership fix.** Only unlocked members now get placed into cohorts. This makes sure everyone in a group has completed the unlock process.

**Backend maintenance.** Removed the CodeRabbit code review tool (replaced by a new code-review pipeline) and moved Supabase backups to a private repository. Fixed a dependency issue with hls.js so frozen installs work correctly. Ported legacy Quora verifications into the current unlock system.

## Why It Matters

Account deletion gives you control over your data and presence on the platform. You own your information, and you can choose to remove it.

Cohort rosters let you see who's in your Peer Programming group without guessing. This builds clarity when you're working together.

The membership fix makes sure cohorts run cleanly: everyone in your group has already completed their unlock, so you're all at the same starting point.

The backend updates keep the platform stable and remove tools we no longer need. The Supabase move protects financial data in a private repository.

## Get Started

To request account deletion, contact the operator through the Direct Line or the Commons.

Cohort owners: check your Peer Programming settings to see the updated member list.

---

Code lives at https://github.com/chargingthefuture/chargingthefuture

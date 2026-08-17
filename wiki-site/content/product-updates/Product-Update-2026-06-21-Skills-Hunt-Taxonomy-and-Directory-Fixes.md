---
title: Skills Hunt now pulls from live taxonomy
date: "2026-06-21"
excerpt: Skills Hunt now sources from live taxonomy and correctly syncs approved nominations to the directory.
category: Updates
slug: Product-Update-2026-06-21-Skills-Hunt-Taxonomy-and-Directory-Fixes
repo: chargingthefuture/chargingthefuture
---

# Skills Hunt Taxonomy and Directory Fixes

## What Shipped

Fixed several data-layer issues in Skills Hunt that were preventing nominations from linking correctly to the active taxonomy and directory.

**Taxonomy sourcing**: Skills Hunt's nomination picker now reads from the live taxonomy tables instead of an empty projection. This means when you propose a new skill or search existing ones, you see the current, complete list.

**Directory sync**: When a nomination gets approved, the system now correctly populates the Directory with the linked skill. Previously, some approvals didn't transfer the skill data forward.

**Profile labeling**: Community-generated profiles (those nominated through Skills Hunt) are now labeled as scout-generated in the Directory, so members can see where a profile came from.

**Validation improvements**: Fixed URL validation to accept valid Quora links, allow legacy directory columns without breaking the submission, and prevent date fields from overflowing on mobile screens.

**Error handling**: When proposing a skill triggers a taxonomy-promotion issue, the system now retries if filing fails, so your nomination doesn't get lost.

## Why It Matters

Skills Hunt works only if nominations connect to real, current data. These fixes close gaps between what the nomination interface shows and what the directory actually stores. The result is a nomination process that feels reliable—you submit a skill, it lands where it should, and the directory stays in sync.

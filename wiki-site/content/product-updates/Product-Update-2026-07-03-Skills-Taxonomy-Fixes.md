---
title: Skills taxonomy fixed and streamlined
date: "2026-07-03"
excerpt: Fixed skills taxonomy collision detection, audit tracking, and mobile display issues. Your profile data stays accurate.
category: Updates
slug: Product-Update-2026-07-03-Skills-Taxonomy-Fixes
repo: chargingthefuture/chargingthefuture
---

# Skills Taxonomy Fixes

## What Shipped

Fixed four issues in the skills taxonomy system:

- **Collision detection**: The system now checks for conflicts before applying skill changes, so duplicates don't slip through.
- **Audit records**: Legacy audit rows now stay untouched when the system validates them, preventing false corrections.
- **Change tracking**: Fixed how the system labels what changed — skill names, job titles, and other fields are now tagged correctly.
- **Skill consolidation**: Added a merge-aware operation that combines duplicate skills without losing data.

Also removed unused code in the governance and workforce sections, cleaned up the directory skills picker, and fixed display issues on mobile devices.

## Why It Matters

Your skills profile depends on clean data. These fixes make sure skills are tagged right, duplicates are caught early, and the audit trail stays honest. The system runs more predictably, and your profile information stays accurate as you add and update skills.

## Technical Details

Commits include:
- Merge-aware `consolidateSkill` operation (ops 26–33)
- Collision pre-flight with reparent correction rule
- `NOT VALID` audit-vocabulary checks to preserve legacy rows
- `target_type` and `action` constraint alignment
- Mobile viewport fixes for share popup, header, and hero sections

Code: https://github.com/chargingthefuture/chargingthefuture

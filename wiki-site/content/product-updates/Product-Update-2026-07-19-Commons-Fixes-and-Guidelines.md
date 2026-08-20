---
title: Small fixes and clarifications this week
date: "2026-07-19"
excerpt: Commons dedup fix, Workforce overview cleanup, public guidelines, and design polish.
category: Updates
slug: Product-Update-2026-07-19-Commons-Fixes-and-Guidelines
repo: chargingthefuture/chargingthefuture
---

# Product Update — July 19, 2026

## What Shipped

**Commons:** Posts no longer render twice right after you send them. The dedup key now uses the stable post ID instead of folding in timestamp formatting, so messages don't slip through when the publish time straddles a minute boundary.

**Workforce overview:** Removed a duplicate headcount card that was the same as the Workforce Total after sector rounding. The screen now shows Population, Workforce Total, and Recruited. Per-sector targets still appear in the Sectors view. The Recruitment Progress card now tracks the 2,000,000 recruitment goal — it shows your percent toward that goal, the count recruited so far, and how many remain to reach it (this updates as people are recruited). Android now matches web: the headcount tile is dropped and the subtitle reads '{recruited} recruited · {goal} goal'.

**Contributions:** On phones, the gift emoji reminder moved into the top bar between the TSE mark and the section tabs. The open fundraiser banner stays at the top; dismissing it hides the banner and shows the gift emoji in the bar instead.

**Beacon:** Beacon now appears in your app list. It was missing from the launcher because the database seed didn't include it — the in-code fallback had the entry, but it only applies when the table is empty.

**Beacon copy:** Broadcasts now say they're from Farah instead of "the team," since the platform has a single operator.

**Refresh button:** On phones, the Contributions refresh button moved into the header actions.

**Survivor Hub design:** Legibility and polish fixes across the Commons shell — timestamps and footnotes now use a readable color, hero stats got CSS class overrides so they work with the comic theme without leaking purple and cyan, the pending-review dots animate so the card doesn't read frozen, the top bar shows the TSE mark on phones, profile avatars match your Clerk photo, channel names come from displayName (or a title-cased slug as fallback) instead of raw slugs, and the app cards have a visible focus ring.

**Community guidelines:** Added a public guidelines page at /guidelines (sign-in-free, like /terms). It states the focus: real help, app questions, honest survivor conversation, and off-platform connection around a psyop-free life. It lists what doesn't belong: advocating violence or harm, perp/operation-focused threads, harassment, solicitation, doxxing, spam, impersonation, and describes enforcement: reminders first, then message removal, account restriction, channel revocation, and block/safety-report tools. Linked from /terms, the Commons footnote, and gated channel footers.

**PeerProgramming guide:** Clarified that any signed-in member can open another group read-only (listener access) but posting is membership-gated server-side. The guide now states this plainly instead of hedging.

**Foundation guide:** Corrected the provider-search scope: name, headline, bio, and offered skill only — no location, language, or trauma-informed filters.

## Why It Matters

Small clarity fixes and parity between Android and web make the platform work as intended. Removing duplicate cards reduces clutter. The recruitment goal card now tracks progress toward the actual goal. The community guidelines give you and members a citable policy for what discussions belong here.

---

The code lives at https://github.com/chargingthefuture/chargingthefuture

---
title: Edit messages in Commons, fix Chyme layout and notifications
date: "2026-07-22"
excerpt: Edit Commons messages, fixed Chyme layout, notifications jump to messages, Mutual Time audit and admin fixes.
category: Updates
slug: Product-Update-2026-07-22-Commons-Edit-Chyme-Layout-Notifications
repo: chargingthefuture/chargingthefuture
---

# Product Update — 2026-07-22

## What Shipped

**Edit button for Commons messages.** Members can now edit their own posts in the Commons (home and #contributors channels) by clicking Edit next to Delete. Clicking Edit loads your text back into the composer, deletes the original message, and focuses the compose box so you can type your correction. When you send, it posts as a new message with a new timestamp — no silent in-place rewrites. Admins still have delete-any for moderation, but cannot edit someone else's message.

**Chyme chat stays in place.** Chyme's room interface now uses a fixed-height layout like Commons, so new chat messages scroll within the chat panel instead of pushing the entire page taller. The controls bar (Mute, Unmute, Raise Hand, Audio, Leave) moved to the top of the room, above the stage and chat, so the mute toggle is always reachable without scrolling.

**In-app notifications jump to messages.** Tapping "Open" on a notification now scrolls to and highlights the message in the Commons instead of just opening the panel. If the message is older than the recent-messages page, the app loads the surrounding window so you see it in context.

**Web audio calls stay awake.** While you're in a Chyme audio call on the web, the browser holds a screen wake lock so the display doesn't sleep and drop your call, and publishes Media Session presence to the OS so audio stays treated as active. (Native Android keeps its own foreground service; this is web-client only.)

**Delete + repost is now the edit model everywhere.** Message editing in the shared Stream chat (used by Foundation, Lighthouse, SocketRelay, TrustTransport, and Beacon) is now delete + repost, matching Commons and Chyme. In-place edits have been removed from that chat panel.

**Mutual Time is in the admin grid.** The admin landing page now includes a Mutual Time row pointing to /apps/mutual-time, where admins can create and manage polls.

**Mutual Time code fixes.** Audit lines now carry the policy decision that unlocked them. The admin event list rejects cross-origin requests. Vote counts are computed in a single query instead of one per event. The public vote view updates from the saved state instead of the load-time snapshot. Vote payloads must be strings, and unknown slots are rejected separately from bad payloads.

**Test scripts updated.** Commons (feed) and contributor-access are now tracked in the manual test-script drift gate, so feature inventory changes require matching test-script updates.

**Username instructions clarified.** The banner telling you to set a username now walks through the actual steps: click the person icon at top right, then Manage account, then edit your username.

**Peer programming cohorts deduped.** Weekly cohort assignments no longer include duplicate user IDs, keeping audit counts consistent.

## Why It Matters

Editing is now consistent across the platform: a correction is always a fresh message with a new timestamp, so chat history stays honest and every change is visible and can be moderated. Chyme's layout fix makes audio calls less clumsy — you can mute without hunting for buttons. Notifications that actually jump to their target make the Commons easier to navigate. Small fixes to Mutual Time and the admin area remove friction from day-to-day use.

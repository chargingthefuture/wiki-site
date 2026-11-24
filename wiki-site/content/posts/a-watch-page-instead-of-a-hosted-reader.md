---
title: "A watch page instead of the hosted reader"
date: "2026-11-23"
excerpt: "The reader I hosted at rss.lagatos.com is closing. In its place is a free reader page with no sign-in: it starts with the blog, the demo videos and the recorded broadcasts, and you add the rest."
category: "Community"
teaser: "In September I started hosting an RSS feed reader you could sign into with your Skills Economy account. It is closing. It cost money every month, more each month, and I was the only person using it. In its place is a plain reader page anyone can open, with no sign-in and nothing for anybody to pay. It starts with the blog, the demo videos and the recorded broadcasts, you add whatever else you read, and a YouTube channel cut at your own date is still a thing you can ask for. The blog's own feed address has not changed and still needs nothing from me."
topics:
  - platform-independence
  - publishing
---

In September I wrote about [an RSS feed reader I host](https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/a-reader-nobody-can-close), at rss.lagatos.com, that you could sign into with your Skills Economy account. That post stays up as it was written. This one says what changed.

The hosted reader is closing. It cost a little over $7 last month, more than the month before, and I was the only person signed into it. That is a bill for one reader, and there are free ways to do the same thing.

## What does not change

The blog's feed address is the same, and it never depended on the hosted reader:

```
https://chargingthefuture.github.io/chargingthefuture/feed.xml
```

Paste it into any reader app you like and every post turns up on its own. Anything else you read that publishes a feed works the same way in that app.

## The reader page

In place of the hosted reader there is a reader page that needs no account and no app:

```
https://chargingthefuture.github.io/rss-feeds/read/
```

It starts with the same three things a new account on the hosted reader started with: this blog, my channel of demo videos of the app, and the recorded broadcasts. Posts open on the page, the broadcasts and videos play there, and nothing loads from YouTube until you press play: no thumbnails, no recommendations, nothing from elsewhere on the site.

Anything else you read, you add by pasting its address under Add a feed. Anything you do not want, those three included, you take off with Remove from my list on its page, and Put back brings it back. Each item has a Watched button, a feed reopens where you left it, you can save an item to come back to, and a Watched list keeps everything you have marked, the latest first. The page lives on GitHub's free hosting for public pages, so nobody pays for it.

Some sites do not let other web pages read their feed, and those cannot be added there. A reader app can still read them.

## No sign-in, so keep a backup

The page has no sign-in. Your list of feeds, what you mark watched and what you save are kept in the browser you used, and only there. They do not reach your phone if you marked them on a laptop, and they are gone if that browser's data is cleared.

To keep them, use Back up or restore at the bottom of the page and download a backup now and then. To move your list to another device, or to get it back, restore that backup there. The page says this in a box at the top, so nobody finds out the hard way.

## Asking for a channel

YouTube does not let other pages read its channels, so a YouTube address cannot be added by pasting it. Collected channels are the way around that: a channel's upload list gathered once and published as a feed of its own, cut at a date so nothing after it ever arrives. Those feeds live in their own repository, https://github.com/chargingthefuture/rss-feeds, and a channel being collected there says one person reads it, and nothing else. The repository has its own note on what a listing there does and does not mean: https://github.com/chargingthefuture/rss-feeds/blob/main/DISCLAIMER.md

If you want a channel collected, or cut at your own date, ask me in the [Skills Economy](https://app.lagatos.com) and give the channel address and the date. I collect it and send you its feed address, and you paste that under Add a feed.

The upload dates on a collected channel are worked out from labels like "2 years ago", so they are close rather than exact. Leave a month or two of margin either side of a cutoff that matters.

---
title: "A reader nobody can close"
date: "2026-09-23"
excerpt: "A feed reader I host, for people who would rather not run one themselves. Nothing sits between the list and you, and nothing decides what you see first."
category: "Community"
teaser: "The feed you read on a platform is arranged by somebody else, and what it puts in front of you is a decision you did not make. A reader takes that away: it fetches the same posts the site publishes, in the order they were written, and nothing ranks them. Reading this blog that way needs no account anywhere — any reader app and one address. For people who would rather not run one, there is now one I host: sign in with your Skills Economy account, and the feeds are yours alone, invisible to every other person on it. What it costs, and what gets a place on it withdrawn, is written below rather than left to be discovered."
topics:
  - platform-independence
  - publishing
---

The feed you read on a platform is arranged by somebody else. Not written by them — arranged. What is at the top, what is buried, what arrives the day it would land hardest. That is a decision, it is made about you, and you did not make it.

A reader takes the arranging away. It fetches what a site publishes, in the order it was published, and puts it in a list. Nothing ranks it. Nothing is inserted. Nothing knows what you opened.

## Two ways to use this

The first needs no account anywhere, and nothing from me. Any reader app, one address:

```
https://chargingthefuture.github.io/chargingthefuture/feed.xml
```

Paste that into whatever reader you like and every post here turns up on its own. Nobody sits in the middle of that — not me, not a company. It is the same mechanism every podcast runs on, so most people have used one without knowing.

The second is for people who would rather not install or configure anything. I now run a reader you can sign into, on a server I pay for:

```
https://rss.chargingthefuture.com
```

You sign in with the Skills Economy account you already have. This blog is in it already — that one feed, the address above, so the first screen is not empty. It is the only thing put there, and you can remove it. Everything else you read, you add yourself.

What each person subscribes to is theirs. There is no shared list, no comments, no way for one account to see another, and nothing any account does is visible to anybody else on it. It is a private reading list that happens to live on my machine rather than yours.

## Adding anything else you read

Most sites publish a feed and most people have never had a reason to look for one. Three steps:

1. Copy the address of the site you want. The ordinary address is usually enough — the reader looks for the feed itself.
2. Press the `+` beside "Subscriptions management".
3. Paste the address into the "Feed URL" field and submit.

If the reader comes back saying it found nothing, the site either publishes no feed or hides it. Look on the page for a link marked RSS; that address is the one to paste.

Categories are optional. A feed you do not file lands in "Uncategorized" and works the same.

## Reading only what came before a date you choose

This is the part I use most and it is the reason I wanted a reader at all.

Search a video site for something I need and the results are not neutral. A share of what comes back was put where I would find it, after the targeting started, by people who know what I am working on. So I search with a cutoff and read what was published before that date, when nobody was arranging anything for my benefit.

The reader does the same thing in its search box:

```
pubdate:/2024-12-31
```

Everything published before December 31, 2024. Turn it around for the other direction:

```
pubdate:2024-12-31/
```

Pick your own date — the one before which you are confident nobody was writing at you.

Then save it so you never type it again. FreshRSS calls a saved search a user query:

1. Type the search and run it.
2. Open the drop-down beside the read and favorite buttons in the header.
3. Press the bookmark action and give it a name.

It sits in that menu afterward and one press applies it. Only the search is stored, never a fixed set of articles, so it re-runs against whatever has arrived since.

## YouTube channels, where that filter has nothing to bite on

A YouTube channel does publish a feed, and it carries only the newest videos. So a cutoff finds nothing to work with: what you wanted was never delivered in the first place, and no filter reaches what never arrived.

The way around it is to collect the channel's upload list once and publish that as a feed of its own. I have the machinery for it, and the first channel is done. A collected feed carries the catalog rather than the last fortnight, so the cutoff above does what you asked it to.

If you want a channel collected, book me on [Foundation](https://app.chargingthefuture.com/apps/foundation) and put the channel address in the request. I run it and send you the feed address to paste in. It is a task like any other on there, which means it is recorded and settled the way the rest of them are.

One caveat, said plainly: the upload dates on a collected channel are worked out from labels like "2 years ago", so they are close rather than exact. Leave a month or two of margin either side of a cutoff that matters.

## What it does not do

It cannot reach back before you start. A feed carries only its most recent items, so what you get on day one is what is sitting in each feed that day, and everything after that accumulates. Nothing older was ever in anything my server saw, so no filter reaches it. The exception is a YouTube channel I have collected, above, where the catalog is put into the feed on purpose.

That matters less here than it sounds. Every post on this blog is on this blog, and the archive of what was posted elsewhere is here too. The reader is for going forward.

It also will not tell you when something arrives. It sits there until you open it. That is a feature if your phone already asks too much of you and a drawback if you want to be told — I am not going to pretend it is only the first.

## What it costs, and what gets a place withdrawn

I pay for this server. That is the entire economics of it and it is worth saying out loud rather than leaving somebody to find out.

A place on it is something you get by finishing the check on the app, or by contributing to what it costs. If the bill makes it necessary, places go to the people who did one of those. That is not a ban, and it is nothing to do with your account: nobody loses the app, or anything in it, over a reader.

Two things do get an account banned, and they are the same two the app already names: signing up to harass people here, including through the address an account signs up with, and running a second account when you already have one. A ban closes the account itself, so it closes this with it.

Not finishing the check on the app is not one of them, and never will be. You stay where you are, for as long as it takes.

I would rather write all of that on the day this opens than on the day I first use it.

## Why bother at all

Quora has erased my accounts fifty-three times. Not one of those erasures cost me a sentence — every post is in a repository I control. What they cost was people knowing where I had gone.

A feed cannot be closed that way. There is no account to suspend, no address I am holding, and no company standing between the list and the person reading it. That is true of the first option above whether or not I am still here, which is why the address is the thing worth keeping rather than any account of mine.

The reader I host is a convenience on top of that, and it is mine to lose. The address is not.

## Where to find it in the app

- [Foundation](https://app.chargingthefuture.com/apps/foundation) — [guide](https://app.chargingthefuture.com/guide#foundation)
- [Unlock](https://app.chargingthefuture.com/plugin/unlock) — [guide](https://app.chargingthefuture.com/guide#unlock)

To sign up: https://chargingthefuture.com. It is free, everyone is let in one at a time after a check, and you can use one part of it and ignore the rest.

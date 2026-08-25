---
title: "Looking Up This Blog in the Wayback Machine"
date: "2026-08-25"
excerpt: "A walkthrough. How to find a copy of any post on this blog that I did not make and cannot alter, and how to get the address yourself rather than taking mine."
category: "Community"
teaser: "How to Check Me said the Internet Archive holds copies of these posts and gave one address. This is the walkthrough: how to look up any post, how to find its address yourself in about twenty seconds, how to read the capture calendar, and how to compare an old copy against what is live now. It also covers the one thing that does not work and why, so you do not waste time on it."
topics:
  - publishing
  - platform-independence
---

An earlier post said the Internet Archive holds copies of what is written here, and that you should check rather than take my word for it. It gave one address as an example.

This is the rest of it. How to look up any post, how to find the address yourself, and how to read what comes back.

Nothing here needs an account or any tool beyond a browser.

## The one-minute version

Go to https://web.archive.org

Paste this into the search box and press enter:

```
https://raw.githubusercontent.com/chargingthefuture/wiki-site/main/wiki-site/content/posts/how-to-check-me.md
```

You will get a calendar of dates. Each highlighted date is a day the Internet Archive took a copy. Click one and you are reading that post exactly as its text stood on that date, from a copy I did not make and cannot edit.

That is the whole mechanism. Everything below is how to do it for any other post, and how to know what you are looking at.

## Two more you can try immediately

These are archived and were checked by hand:

```
https://raw.githubusercontent.com/chargingthefuture/wiki-site/main/wiki-site/content/archive/discourse/Home.md
https://raw.githubusercontent.com/chargingthefuture/wiki-site/main/wiki-site/content/archive/discourse/book-2-backyard-farming.md
```

And the blog's front page, which is a normal web page rather than a text file:

```
https://chargingthefuture.github.io/chargingthefuture/
```

## What you are actually looking at

The address above is not the page you read on the blog. It is the source file — the post as a plain text file, sitting in a public repository.

That is deliberate, and it is the better thing to check. The rendered page is a presentation of the text. The file is the text. If you want to know whether a sentence was there on a given date, the file answers it and the page only shows it to you.

It also means the copy is legible without any of my code running. Open a capture from six months from now, or from after this project has stopped existing, and it is still just words in a file.

## Finding the address of any post yourself

Three steps, and the third is a button.

**One.** Open the repository: https://github.com/chargingthefuture/wiki-site

**Two.** Navigate to the post. Posts live in `wiki-site/content/posts/`. Archived material from the old forum is in `wiki-site/content/archive/discourse/`, and archived Quora material will be in `wiki-site/content/archive/quora/`. The file names are readable — `how-to-check-me.md`, `a-safe-place-to-shower.md` — so you can usually find a post by its title.

**Three.** Open the file and click the **Raw** button, at the top right of the file view. The address bar now holds the raw address. Copy it, paste it into web.archive.org.

That is it. You never have to construct an address by hand.

### If you would rather build the address

The pattern is:

```
https://raw.githubusercontent.com/chargingthefuture/wiki-site/main/ + the file's path in the repository
```

One thing will trip you up, and it trips me up too. The repository is called `wiki-site`, and inside it there is also a folder called `wiki-site`. So the word appears twice in every address, and an address with only one of them will not work:

```
.../chargingthefuture/wiki-site/main/wiki-site/content/posts/how-to-check-me.md
                      ^^^^^^^^^      ^^^^^^^^^
                      repository     folder inside it
```

If a lookup returns nothing, check that first. It is almost always this.

## Reading the calendar

After you search an address, the Internet Archive shows a timeline of years and a calendar. Highlighted days are days it holds a capture. Hovering shows the times; clicking opens that copy.

A few things worth knowing so the result does not mislead you.

A post will usually have a capture from around the day it was published, because this blog submits pages to the Internet Archive automatically when it publishes.

Older posts may have fewer captures than recent ones. That is not a signal about the post. The automatic submission was fixed recently, and everything published before that was backfilled by hand afterward — so the dates cluster around when the backfill ran rather than when each post was written.

**A missing capture proves nothing.** The Internet Archive rate-limits, and refuses saves when it is busy. A page with no capture is a page whose submission did not get through, not a page that was hidden. Read absence as absence of evidence, not evidence of absence.

## Comparing a capture against now

This is the part that actually checks something.

Open the capture. Open the same address live in another tab — the raw address, not the blog page. Read both.

If the text is identical, the post has not changed since that date. If it differs, you are looking at exactly what changed, and the repository's history will tell you when and in which commit.

Two kinds of page here change on purpose, and you should expect them to differ: the Dictionary and the page tracking dead and current links are kept current rather than frozen. Everything else — the arguments, the announcements, the progress reports — is fixed once published. A difference in one of those is worth asking me about.

## The one thing that does not work

If you paste a normal article address into web.archive.org, like this one:

```
https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/how-to-check-me
```

you will find nothing. Not a gap — nothing, ever.

Here is why, plainly. This blog does not keep a separate file on the server for each post. It sends your browser a small program, and that program assembles the page in front of you from the text. When the Internet Archive's crawler asks the server for that address, the server has nothing at that address to hand over, so the capture fails every time.

The front page is different and does archive, because it is a real address the server answers.

So: front page and raw text files, yes. Article pages, no. That is not a limitation anyone chose, and the raw file is the better record anyway.

## What this proves, and what it does not

It proves a specific text existed at a specific address on a specific date, and that a third party with no relationship to me holds the copy.

It does not prove the text is true. A dated copy of a claim is still a claim.

The earlier post covers that boundary properly, along with the other ways to check this work — the repository's own history, the app's public code, and the numbered feed:

https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/how-to-check-me

To sign up: https://chargingthefuture.com. It is free, invite-only, and you can use one part of it and ignore the rest.

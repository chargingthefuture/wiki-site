---
title: "How to Check Me"
date: "2026-08-23"
excerpt: "Somebody said they would fact check before passing my writing on. Good. Here is every way to do it, including the ones that do not require taking my word for anything."
category: "Community"
teaser: "The blog is a public git repository, so every post is a file with a commit history: when it was written, what it said before, and what changed. The app is a public repository too, so a claim about what it does can be read against the code that does it. And on every publish the pages are submitted to the Wayback Machine, which timestamps them independently of me. Here is how to use all three, and what none of them prove."
topics:
  - publishing
  - platform-independence
---

Ione (https://www.quora.com/profile/Ione-40) replied to my last post saying they would pass the information on once they did their fact check.

![A post and comment on Quora. Kingmingling writes: Gn0b0dy Pneuma (https://www.quora.com/profile/Gn0b0dy-Pneuma) gave a good post on DEW and shielding. Finding writing like that on Quora is hard, and finding it again later is harder. So, a request. Consider lending your writing to the Knowledge Library. It is a private assistant inside the app, for Targeted Individuals only. You ask it a question and it answers from the writing of people who have lived this. Right now all of that writing is mine — more than 1,500 Quora posts feed every answer it gives. Underneath, in the comments, Ione writes: Not suicidal. If anyone needs help I will pass on this information, once I do my fact check.](images/ione-fact-check-comment-2026-08-24.png)

That is the correct instinct and I want to make it easy. Here is how to check me, in order of how little you have to trust me for each one to work.

## The blog keeps its own history, and anyone can read it

Every post here is a plain text file, stored somewhere public: https://github.com/chargingthefuture/wiki-site

The useful part is that every change to a post is recorded and dated. Not just when it was published — also the day a word in it changed three days later, and which word. Nothing can be altered quietly, because an edit records itself, and that record goes public the moment the edit does.

Posts come in two kinds and they age differently.

Most are fixed once published: arguments, announcements, the progress reports. Their numbers and wording are never touched afterward, because the point of a dated claim is that it shows what was said and when. A post whose figures look out of date is doing exactly what it should.

Two pages are the opposite, kept current on purpose and edited in place — the Dictionary, and the page tracking which of my links are dead. For those, the recorded history is the list of what changed. If you want to know what the Dictionary said last month, it is there.

## The app is a public repository too

The application itself is here: https://github.com/chargingthefuture/chargingthefuture

So a claim I make about what the app does is checkable against the thing that does it. When I write that the Knowledge Library keeps contributions in a searched table rather than training a model on them, that is not a promise you have to accept — the code that reads that table is in that repository, and so is the code that removes a row when somebody withdraws.

The same goes for what gets shared. When I write that the ClickLog trend report carries only a date, a rough area and the tags, the code that builds that report is readable, and you can check for yourself what it does and does not put in.

## The Wayback Machine has copies I did not make

Every time this blog publishes, an automated job submits pages to the Internet Archive at web.archive.org.

Two things archive: the site's front page, and the raw text file of the post exactly as it sits in the repository. So a copy of the words exists that I did not make and cannot alter, dated by an organization with no relationship to me.

The rendered page does not archive. This blog assembles each post in your browser rather than keeping one as a separate file on the server, so the Internet Archive's crawler asks for something the server does not have. The submission goes out every time and is refused every time. The raw text is the better record anyway — it is what the post says, rather than a picture of it.

To use it, paste the post's raw address into web.archive.org. That address is the repository path with raw.githubusercontent.com in front:

https://raw.githubusercontent.com/chargingthefuture/wiki-site/main/wiki-site/content/posts/how-to-check-me.md

Swap the last part for whichever post you want. Then compare the capture against what the file says today.

One honest caveat. That job is best-effort — it is allowed to fail without failing the deploy, because the Internet Archive rate-limits and sometimes refuses a save. So a missing snapshot means the submission did not go through, not that a page was hidden. The captures that exist are real; their absence proves nothing either way.

Correction, 2026-08-24: this section originally said the rendered article page archives alongside the raw text, and told you to paste the post's own address. Both were wrong. The rendered page has never archived successfully, and the raw address above is the one that works.

## The feed is numbered, and gaps would show

Every post, in one list, newest first, at https://chargingthefuture.com/feed

Each entry carries a number assigned by publication order, running from the oldest to the newest without a break. That numbering is not decorative — it means a removed post would leave a visible hole, and a backdated post would land out of sequence. The feed also prints which range of how many it is showing, so the total is on the screen rather than something you have to take from me.

## What about the Quora posts that no longer exist

Quora has erased seven of my accounts. Everything on them went with them, which means Quora is not a record of anything and cannot be used to check me.

What I do with those posts is restore them into this blog's archive, each one marked with the account it came from, the date it was originally posted, and a link to the original question where one still exists. Those archive entries are frozen at export, which is why an archived post keeps its original spelling and its original title even when they are wrong.

That is a provenance claim, and it is the weakest link in this whole list — you are trusting that the export matches what was posted. Where a question still exists on Quora you can check the entry against it. Where the account is gone, you can check the Wayback Machine for the original address. Where neither exists, you have my word and a file with a date on it, and you should weigh it accordingly.

## The posts are drafted with an AI assistant

I dictate and correct; an assistant drafts. The project's disclaimer says the same about the app repository — most development there is done by AI agents: https://github.com/chargingthefuture/chargingthefuture/blob/main/ctf/docs/DISCLAIMER.md

What that means for checking: errors get in that I have not caught yet. When one is found it gets corrected, the correction is dated, and the change sits in the record with everything else. All of this being public is the point, not a claim that nothing is ever wrong.

## What none of this proves

A timestamp proves when something was written. It does not make the thing true.

Public code proves what the app does. It proves nothing about whether any account of organized harassment is accurate, mine or anyone else's.

A Wayback capture proves a page existed in that form on that date. It does not prove the page was right.

This matters most where the numbers are. The ClickLog trend report says its own limits under its own figures: the entries are first-hand and unchecked against any outside source, the people logging chose to join and chose to share, so it is not a sample of anything wider and no rate can be calculated from it. That is the report's own text, not my summary of it, and it is there because a figure that hides what it cannot carry is worth less than one that admits it.

So the honest version of what verification gets you here is narrower than proof and more than nothing. You can establish that I said a specific thing on a specific date, that I did not change it later, that the code does what I said it does, and that a third party holds a copy. What happened to me, you cannot check from a repository. Nobody can hand you that.

## The short version

Four steps, if you want the method rather than the reasoning:

1. Open https://github.com/chargingthefuture/wiki-site and find the post in the `content` folder. Its recorded history shows when it was written and everything that changed since.
2. For any claim about the app, read the code at https://github.com/chargingthefuture/chargingthefuture.
3. Paste the post's raw address into web.archive.org — the form shown above — and compare a capture against what the file says now.
4. For anything originally posted to Quora, check the archive entry against the original question, or against a Wayback capture of the address, and treat what neither covers as unverified.

## Where to find it in the app

- [ClickLog](https://app.chargingthefuture.com/apps/click-log) — [guide](https://app.chargingthefuture.com/guide#click-log)
- [Knowledge Library](https://app.chargingthefuture.com/knowledge) — [guide](https://app.chargingthefuture.com/guide#knowledge)

To sign up: https://chargingthefuture.com. It is free, invite-only, and you can use one part of it and ignore the rest.

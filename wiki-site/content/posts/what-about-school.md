---
title: "What about school?"
date: "2026-08-28"
excerpt: "The community posts left out the children. Asking directly: is homeschooling what people want, and what should be built — inside this app, or as a separate tool entirely?"
category: "Community"
teaser: "Recent posts covered a survivor-only community and none mentioned school, though children come with the families. This app connects people; it is not where the work gets done, any more than it runs the inventory for a repair business. That split answers half the question: childcare is near babysitting, the app already handles that shape end to end, and the gap is people rather than software. Schooling is the harder half, and I do not know whether homeschooling is what people want."
topics:
  - community
  - education
---

The posts about a survivor community covered whether it is [possible and who could plan it](https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/a-gated-community-and-who-could-plan-it), that it [has a threat model like every community does](https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/every-community-has-a-threat-model), and [how few people it takes](https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/how-few-people-it-takes).

None of them mentioned school. Children come with the families, and I wrote [a whole post to parents](https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/your-children-can-have-an-option) about what a career could look like for a targeted child without once addressing how that child gets educated between now and then. The [two-generation goal](https://chargingthefuture.github.io/chargingthefuture/article/wiki-site/the-two-generation-goal) is measured in exactly the span where somebody's children grow up.

So this post asks rather than answers.

## The part I am not guessing about

The app is adults only. You have to be eighteen to hold an account, and that is in the terms, not a preference I could quietly relax. So a child is never a member here, never has a profile, and nothing built for education would put one in front of this app.

That is a constraint and it is also a clarifier. Anything built serves the parent who is doing the teaching — the same way the Directory serves an adult who can do a thing, not the person who benefits from it.

## This app connects people; it is not where the work gets done

The second thing I am not guessing about, and it changes what is worth building.

The app puts people in front of each other. The service itself happens between them, using whatever the provider uses. Somebody running a repair business off the Directory needs inventory management, and this app has none and should not have one — they run their own, and the app finished its job when the customer found them.

So a schooling tool does not have to be part of this app, and probably should not be. The app's job is connecting a family that needs teaching to the person who can teach. What that person uses to teach is theirs — a tool I build separately, a tool that already exists, or a notebook.

That splits the question in two, and the halves have different answers.

## Childcare is already answered

Worth separating out, because it is the easier one and it is nearly solved.

Childcare sits close to babysitting: one person doing something for another, for an afternoon or a day. That is the shape this app was built for, end to end. Somebody who does it is findable in the [Directory](https://app.chargingthefuture.com/apps/directory), the arrangement gets made through [Foundation](https://app.chargingthefuture.com/apps/foundation), it settles in [ServiceCredits](https://app.chargingthefuture.com/apps/service-credits), and standing comes from [Trust](https://app.chargingthefuture.com/apps/trust) — built out of participation that actually happened, not out of what anyone says about somebody.

So there is nothing to build for childcare. The gap is people: members who already do this and are not listed, and members willing to learn it.

That makes it a [SkillsHunt](https://app.chargingthefuture.com/apps/skills-hunt) problem, not a software one. SkillsHunt is how somebody gets found and added, and its missions name what the economy is short of — a mission to find a doctor is already on the board for exactly that reason. Childcare is the same kind of gap and the same kind of fix. [LevelUp](https://app.chargingthefuture.com/apps/level-up) is where somebody who wants the skill rather than already having it would pick it up.

If you can watch a child for an afternoon, or you know a survivor who can, that is the whole ask here. It needs no new tooling and it is available now.

## What I do not know

Whether homeschooling is what people are actually seeking.

I am not the person to assume from my own life. My targeting started at five and ran through school, and I would be building from that alone, which is one person's case and not a survey.

## What makes it hard, from both directions

School is where a child is away from the parent all day, in a place the parent does not control, among adults the parent did not choose. For a family that is being followed, that is a real exposure, and I understand why a parent would look at homeschooling.

Homeschooling costs the one thing the targeting takes first. It needs an adult present through the day, and the operation's whole method is to remove your income and your hours until neither exists. A parent already working three unstable arrangements to keep a roof does not have a school day to give. Telling that parent to homeschool is telling them to solve the problem by having more of the resource they are being drained of.

Both of those are true at once, and I do not think the answer is the same for every family.

Registration and legal requirements also differ by country and by state, sometimes sharply. Whatever gets built cannot assume one jurisdiction.

## What already exists that is close

Nothing here was built for schooling, but three things are adjacent enough to be worth naming, because they are machinery that already runs.

[LevelUp](https://app.chargingthefuture.com/apps/level-up) runs training cohorts: a curriculum, milestones that get validated, a trainer somebody claims, and credits released as milestones are met. That is structurally a course, and it is aimed at adults learning a trade.

[PeerProgramming](https://app.chargingthefuture.com/apps/peer-programming) puts people into small weekly groups with a room they can talk in. That is structurally a class of about twelve.

[Skills Taxonomy](https://app.chargingthefuture.com/apps/skills-taxonomy) is the catalog of sectors, job titles, and skills the whole app matches against. A parent who can teach mathematics is already describable in it.

## What could be built, on each side of the split

Concrete, so there is something to react to rather than an open question.

Connecting — this is the app's job, and these belong in it:

1. Matching a parent who can teach a subject with a family that needs it taught. The Directory pattern applied to teaching. The smallest useful thing on this page, and the only one that has to live here.
2. Describing teaching properly in the Skills Taxonomy, so a parent who can teach mathematics is findable as that and not buried under something else.
3. A shelf of what parents actually use — curricula, free programs, the ones that turned out to be bad. [WhatWorks](https://app.chargingthefuture.com/apps/what-works) is already one shared, survivor-verified list organized by problem, so this is a use of something that exists rather than a build.

Delivering — a separate tool, or somebody's existing one, or nothing:

4. A curriculum and records tool: what was covered, when, with the work kept. It matters if a child re-enters a school system or applies for anything later, and it is the part a family under pressure is least able to keep. This is the inventory-management case exactly — real need, wrong place for it here.
5. Shared preparation: one parent writes a unit, twenty use it. Given the hours problem above, this may matter more than anything else on the list.
6. A plain guide to the registration requirements where you are, written by people who have done it.

The split matters because it decides what I work on. Number 1 is a change to this app. Number 4 is a different piece of software with its own life, and building it inside here would make it worse at its job and this app worse at connecting.

## The answer might be none of them

Some parents will not want an app anywhere near their children, and after what surveillance has done to them that is a reasoned position rather than an objection to talk somebody out of. "Build nothing, this is not for software" is a real answer and I would rather hear it now than after building.

It is also possible the need is not schooling at all, but respite — an hour, or one other adult who can be trusted with a child for an afternoon. That is the childcare answer above, and it is already available. I would not know which of the two people actually want from where I sit, which is the point of asking.

## Where to send input

The group chat, [Commons](https://app.chargingthefuture.com). What you use now, what you tried that failed, which of the six is worth building, or that none of them are — and which side of the split your answer sits on, because a connecting problem and a delivering problem get solved in different places.

If you are already homeschooling, you know more about this than I do. Say what you actually do — that answer counts for more here than anything I worked out from the outside.

The same question applies past schooling. If you are providing anything in this economy and the tool you need to deliver it does not exist, say so. Inventory management was the example above because it is a real gap for anyone selling goods here, and it is not the only one.

## Where to find it in the app

- [Directory](https://app.chargingthefuture.com/apps/directory) — [guide](https://app.chargingthefuture.com/guide#directory)
- [Foundation](https://app.chargingthefuture.com/apps/foundation) — [guide](https://app.chargingthefuture.com/guide#foundation)
- [ServiceCredits](https://app.chargingthefuture.com/apps/service-credits) — [guide](https://app.chargingthefuture.com/guide#service-credits)
- [Trust](https://app.chargingthefuture.com/apps/trust) — [guide](https://app.chargingthefuture.com/guide#trust)
- [SkillsHunt](https://app.chargingthefuture.com/apps/skills-hunt) — [guide](https://app.chargingthefuture.com/guide#skills-hunt)
- [LevelUp](https://app.chargingthefuture.com/apps/level-up) — [guide](https://app.chargingthefuture.com/guide#level-up)
- [PeerProgramming](https://app.chargingthefuture.com/apps/peer-programming) — [guide](https://app.chargingthefuture.com/guide#peer-programming)
- [Skills Taxonomy](https://app.chargingthefuture.com/apps/skills-taxonomy) — [guide](https://app.chargingthefuture.com/guide#skills-taxonomy)
- [WhatWorks](https://app.chargingthefuture.com/apps/what-works) — [guide](https://app.chargingthefuture.com/guide#what-works)
- [Commons — the group chat](https://app.chargingthefuture.com) — [guide](https://app.chargingthefuture.com/guide#commons)

To sign up: https://chargingthefuture.com. It is free, invite-only, and you can use one part of it and ignore the rest.

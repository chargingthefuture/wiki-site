# Invite queue

An invite post is written for one person who is already listed in the Directory, and it names what
they actually do. Three have been published. This file tracks who is next, what has gone out, and
the two rules that keep the series readable.

The list of people comes from `/admin/directory/invite-queue` in the app — reachable from the
foot of `/admin/directory` and from the admin list at `/admin`. It shows every listed person with
their Quora address and their skills, minus the owner and minus anybody already written about, and
one control copies the whole thing as plain text. The same query is kept as
`ctf/scripts/sql/directory-invite-queue.sql` for anybody with a command line.

The copied list is not committed anywhere. A file of names, addresses, skills and locations is the
aggregation that put the Directory behind a sign-in in the first place, and a public repository is
the wrong place for it. It is pasted into a session when a post is being written, and that is all.

## Two rules

Never publish two invite posts in a row. A reader opening the feed and finding four consecutive
posts addressed to four strangers has nothing to read. Put at least one ordinary post between them —
a progress post, an argument, a product update, anything.

Never reuse the same angle twice in a row. Six angles are listed below. Rotate them.

## What an invite post looks like

`content/posts/an-invitation-to-janie.md` is the model, and the shape is worth keeping:

1. The reason this person, now. Usually a gap: a cohort with no trainer, a trade nobody on the map
   covers, a request that went up and went unanswered.
2. Who they are, in plain text with their Quora address beside the name, per the credit rule in
   `CLAUDE.md`. Their Directory profile link, and a screenshot of that profile with the skills in
   the alt text, so the credit survives the account being deleted.
3. How they came to be listed. Most were nominated rather than signed up, and saying so is honest
   and answers the question a reader is already asking.
4. The invitation itself, short, with what it would take and what it does not take.
5. That no is a complete answer and the listing can come down at any time.
6. That this does not run one way — the person being invited needs things too, and the list is how
   they find them.
7. The standard app-links section and the sign-up block.

Titles follow `An invitation to <first name>`, files follow `an-invitation-to-<name>.md`.

## Advocacy is a placeholder, not a profession

Some listings carry Advocacy as their only skill. That label was applied to people whose public
writing showed only that they speak up for Targeted Individuals — no trade was stated anywhere, so
the label stands in for one that is not known yet.

A post to one of those people is the general invitation. It can say their writing is about
Targeted Individuals, because that is what is on the record. It cannot say they are an advocate by
trade, cannot describe them as an organizer or a campaigner, and cannot decide what they are an
advocate for beyond what they wrote.

A post to somebody listed for plumbing is about plumbing. That is the difference the query's
`invite_kind` column marks, and it is the difference that makes the post accurate.

## Six angles

Rotate these. Each is a way into the same invitation; none of them is a template to fill in.

| Angle | What it argues | Best for |
|---|---|---|
| Two things have to be true | The harm runs through people who can be reached, and reaching them is the work | Somebody whose trade puts them near other people's daily needs |
| A working economy needs people who | The map covers a share of the occupations a community needs, and the gaps are named | Somebody in a sector the map is thin on |
| You do not have to agree with me | The case does not need agreement about what is being done to anybody | Somebody whose public writing avoids the subject or disagrees with parts of it |
| Estonia, 1991 | A country rebuilt with no money and no infrastructure, by people who were already there | Somebody skeptical that a small number of people can do anything |
| The labor movement, and King | Economic footing is what the movement understood and the psyop attacks | Somebody whose writing is about justice rather than a trade |
| You already have a profile | The listing exists, it is under their name, and it can come down at any time | Anybody who has not been told they are on the list |

## Published

| Person | Handle | Post | What the post was built on | Date |
|---|---|---|---|---|
| Janie Spears | Janie-Spears-7 | an-invitation-to-janie.md | The Cleaners / Janitorial cohort had no trainer and she manages cleaners | 2026-09-13 |
| J H B | J-H-B-7 | an-invitation-to-jhb.md | Nine specializations, medicine among them, against the shortage the economy feels most | 2026-08-28 |
| Steph Wo | Steph-Wo-1 | an-invitation-to-steph-wo.md | Their own bio, listing what the targeting interrupted, against the skills catalog | 2026-08-20 |
| Christy | None-Ya-970 | an-invitation-to-christy.md | Two whole trades on one listing — clinical care and structural work — against a catalog that is empty rather than competitive | 2026-09-17 |

When a post merges, add its row here and add the handle in two places in the product repository,
in the same piece of work: the `DIRECTORY_INVITE_ALREADY_WRITTEN` array in
`ctf/packages/web/lib/directory/invite-queue.ts`, which is what the screen reads, and the
`already_written` list in `ctf/scripts/sql/directory-invite-queue.sql`. Miss either one and the
person is offered up to be invited a second time.

## Queued

Read from the screen on 2026-09-17: 141 waiting — 89 with a skill to write about, 49 general, 3
with nothing recorded. These are the next few, with angles rotated so no two in a row repeat.

| Person | Handle | Skills | invite_kind | Angle | Status |
|---|---|---|---|---|---|
| Espada | ESPADA-18 | Plumbing, small engine repair, appliance repair, CCTV | skill-specific | A working economy needs people who | in PR |
| Dayna | Dayna-388 | Inventory, demand forecasting, route planning, last-mile delivery; offering soap and candles | skill-specific | You already have a profile | queued |
| Syah | Syah-Neal-AdoreTM | Garment construction, fit and sizing, textile sourcing | skill-specific | Estonia, 1991 | queued |
| Gn0b0dy Pneuma | Gn0b0dy-Pneuma | Advocacy placeholder only | advocacy-only | You do not have to agree with me | queued |
| Tommy | Tommy-Gumbert | Mechanical and electrical repair, HVAC | skill-specific | A working economy needs people who | queued |

Dayna's entry says on her own listing that she is open to supplying soap and scented candles to the
community. That is somebody already offering rather than being asked, which is the post.

Status is one of: `queued`, `drafted`, `in PR`, `published`, `skipped`. A skipped row keeps its
reason in the notes column so nobody re-queues it a month later.

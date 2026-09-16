# Invite queue

An invite post is written for one person who is already listed in the Directory, and it names what
they actually do. Three have been published. This file tracks who is next, what has gone out, and
the two rules that keep the series readable.

The list of people comes from `ctf/scripts/sql/directory-invite-queue.sql` in the product
repository, run against production. It returns every listed person with their Quora address and
their skills, minus the owner and minus anybody already written about.

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

When a post merges, add its row here and add the handle to the `already_written` array in
`ctf/scripts/sql/directory-invite-queue.sql`, in the same commit.

## Queued

Nothing is queued yet. The query has not been run against production.

| Person | Handle | Skills | invite_kind | Angle | Status |
|---|---|---|---|---|---|

Status is one of: `queued`, `drafted`, `in PR`, `published`, `skipped`. A skipped row keeps its
reason in the notes column so nobody re-queues it a month later.

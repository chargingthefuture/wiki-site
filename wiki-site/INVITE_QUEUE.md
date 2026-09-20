# Invite queue

An invite post is written for one person who is already listed in the Directory, and it names what
they actually do. Three have been published. This file tracks who is next, what has gone out, and
the two rules that keep the series readable.

The list of people comes from `/admin/directory/invite-queue` in the app — reachable from the
foot of `/admin/directory` and from the admin list at `/admin`. It shows every listed person with
their Quora address and their skills, minus the owner and minus anybody already written about, and
one control copies all of it as plain text. The same query is kept as
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
7. The standing note headed "Who is on the list", verbatim from any published invite (owner
   directive, 2026-09-20): everyone in the series is a self-identified Targeted Individual, the
   post is not a vouch for anybody, the owner is not responsible for what a listed person does or
   says, the app's Unlock gate is the closest anyone gets to a real one, and nothing is a hundred
   percent. It exists because some people on the list will turn out to be operators, and a blog
   post carries the owner's name in a way a Quora invite does not. Placed immediately before the
   app-links section, and Unlock is in that section's list.
8. The standard app-links section and the sign-up block.

Titles follow `An invitation to <first name>`, files follow `an-invitation-to-<name>.md`.

The title is also what the build reads. `pnpm wiki:invites` collects every listed post whose title
has that shape into `invites.json`, and the row of invite cards at the top of `/feed` and the home
page, on the app's signed-out pages, and on the landing page all render from it. A post that
merges with the right title appears in the row on the next deploy with nothing else to do; a post
with a different title does not appear at all.

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
| Christy | None-Ya-970 | an-invitation-to-christy.md | Two full trades on one listing — clinical care and structural work — against a catalog that is empty rather than competitive | 2026-09-17 |
| Espada | ESPADA-18 | an-invitation-to-espada.md | Five kinds of work in their own words — plumber's apprentice, small engine repair, appliance repair, handyman, CCTV — across five planning teams, against sectors the map holds three skills of | 2026-09-18 |
| Syah | Syah-Neal-AdoreTM | an-invitation-to-syah.md | Three specializations read as one chain — textile selection and sourcing, garment construction, fit and sizing — against Estonia in 1991, where the people who could do things were already there | 2026-09-19 |
| Gn0b0dy Pneuma | Gn0b0dy-Pneuma | an-invitation-to-gn0b0dy-pneuma.md | The three places the blog already credits them, against the fact that the list has never needed anybody to agree with the owner about what this is | 2026-09-19 |
| Tommy | Tommy-Gumbert | an-invitation-to-tommy.md | Mechanical and electrical repair and HVAC, against the housing answer that only holds while the heat works, and two of the thirteen jobs | 2026-09-20 |

When a post merges, add its row here and add the handle in two places in the product repository,
in the same piece of work: the `DIRECTORY_INVITE_ALREADY_WRITTEN` array in
`ctf/packages/web/lib/directory/invite-queue.ts`, which is what the screen reads, and the
`already_written` list in `ctf/scripts/sql/directory-invite-queue.sql`. Miss either one and the
person is offered up to be invited a second time.

## Queued

Read again from the screen on 2026-09-20, after Tommy's post went up. These are the next few, with
angles rotated so no two in a row repeat. The screen is the source; this table holds only what is
needed to write the next posts, because the copied list itself is never committed.

| Person | Handle | Skills | invite_kind | Angle | Status |
|---|---|---|---|---|---|
| Dayna | Dayna-388 | Inventory, demand forecasting, route planning, last-mile delivery; offering soap and candles | skill-specific | You already have a profile | skipped — owner decision, 2026-09-19. Not to be written unless the owner says so. The row stays so nobody re-queues it. |
| Mary Harris | Mary-T-I-1 | — | — | — | skipped — owner decision, 2026-09-20. Not to be written unless the owner says so. She does not appear on the invite queue screen, so this row is the only record of the skip. |
| Alphelus Allen | Alphelus-Allen | System design and architecture, frequency and voltage control, power systems design, building design, construction documentation, electrical, wiring and circuit installation; San Francisco | skill-specific | Two things have to be true | queued |
| Lorraine Valente | lorraine-valente | Ten clinical skills on one listing — clinical supervision, cognitive behavioral therapy, crisis intervention, diagnosis and treatment planning, evidence-based therapeutic interventions, group therapy facilitation, neuropsychological assessment, psychological assessment and testing, research and data analysis, trauma therapy and EMDR | skill-specific | You already have a profile | queued |
| Krissyy | Krissyy-2 | Legal research and drafting; Minneapolis | skill-specific | The labor movement, and King | queued |

Status is one of: `queued`, `drafted`, `in PR`, `published`, `skipped`. A skipped row keeps its
reason in the notes column so nobody re-queues it a month later.

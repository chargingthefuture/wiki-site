# Invite queue

An invite post is written for one person who is already listed in the Directory, and it names what
they actually do. Eighteen have been published. This file tracks who is next, what has gone out, and
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

The owner keeps that alternation by reading each post and merging them one at a time, an invite
every other merge, on purpose. The order they merge in is the order, and the feed has to show it.
So date a post by the Eastern-time day it goes live, not the day it was drafted: same-day posts are
ordered by when their files were first committed, and a post dated earlier than it went live slides
down into an older day and lands next to the wrong neighbor (owner report, 2026-10-01: Sherri's
invite, drafted September 29 and merged October 1, sat beside the Matthew invite). After a stacked
post merges, read the top of `/feed` (or the registry order `wiki:sync` writes) and fix the date
before the next merge if two invites touch. Never rebuild or reorder a stacked post to go out ahead
of another one without saying so first.

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
| Alphelus Allen | Alphelus-Allen | an-invitation-to-alphelus.md | Seven specializations running from power systems design to wiring and circuit installation, against the two things that have to be true for the targeting to work | 2026-09-21 |
| Lorraine Valente | lorraine-valente | an-invitation-to-lorraine.md | Ten clinical specializations read as one trade, against the listing already existing before anybody was asked, and health and wellbeing as one of the thirteen jobs | 2026-09-22 |
| Krissyy | Krissyy-2 | an-invitation-to-krissyy.md | Legal research and drafting, the only listing of 163 that carries it, against the Memphis strike ending in terms somebody had to write down | 2026-09-28 |
| Jessica Goodwin | Jessica-Goodwin-229 | an-invitation-to-jessica.md | Advocacy placeholder, after answering their question about where to report it; what the list can do for them | 2026-09-28 |
| Zack Tom | Zack-Tom-4 | an-invitation-to-zack.md | Five environmental skills against Environmental and Waste Management at 6 of 25 and Water and Sanitation at 3 of 19 | 2026-09-28 |
| Jerrod Fredrick | Jerrod-Fredrick | an-invitation-to-jerrod.md | Advocacy placeholder, after answering their question about how anybody could help; the Commons for somebody to talk to | 2026-09-28 |
| Eli Paniagua | Eli-Paniagua-1 | an-invitation-to-eli.md | Advocacy placeholder, after answering their question about who teaches the young people who take part | 2026-09-28 |
| Brecht Corbeel | Brecht-Corbeel | an-invitation-to-brecht.md | Five visual skills, from drawing an idea to keeping a brand recognizable; their Quora account already banned | 2026-09-28 |
| Matthew A Davis | Matthew-A-Davis-1 | an-invitation-to-matthew-a-davis.md | Emergency Support Function coordination against Emergency and Reserve Roles at 2 of 21 | 2026-09-29 |
| Sherri Jenkins | Sherri-Jenkins-12 | an-invitation-to-sherri.md | Security procedures, and the answer already credited in best-description-i-have-read.md | 2026-09-29 |

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
| Lorraine Valente | lorraine-valente | Ten clinical skills on one listing — clinical supervision, cognitive behavioral therapy, crisis intervention, diagnosis and treatment planning, evidence-based therapeutic interventions, group therapy facilitation, neuropsychological assessment, psychological assessment and testing, research and data analysis, trauma therapy and EMDR | skill-specific | You already have a profile | published |
| Krissyy | Krissyy-2 | Legal research and drafting; Minneapolis | skill-specific | The labor movement, and King | published |
| Jessica Goodwin | Jessica-Goodwin-229 | Advocacy (placeholder); United States | advocacy-only | You already have a profile | published |
| Zack Tom | Zack-Tom-4 | Biodiversity monitoring and habitat assessment; community outreach and stewardship; enforcement actions and corrective plans; pollution control system design; waste-flow modeling and policy evaluation; Denmark | skill-specific | A working economy needs people who | published |
| Jerrod Fredrick | Jerrod-Fredrick | Advocacy (placeholder); United States | advocacy-only | You already have a profile | published |
| Eli Paniagua | Eli-Paniagua-1 | Advocacy (placeholder); United States | advocacy-only | Two things have to be true | published |
| Brecht Corbeel | Brecht-Corbeel | Brand management; branding and identity systems; visual design and interaction patterns; visual concept development; illustration and concept art; Antwerp | skill-specific | You do not have to agree with me | published |
| Matthew A Davis | Matthew-A-Davis-1 | Advocacy; Emergency Support Function (ESF) coordination; Zephyrhills, Florida | skill-specific | A working economy needs people who | published |
| Sherri Jenkins | Sherri-Jenkins-12 | Security procedures; Oklahoma City | skill-specific | Two things have to be true | published |
| Aaron Wheeler | Wheeler-Aaron | Advocacy (placeholder); United States | advocacy-only | You already have a profile | published — owner decision, 2026-10-01, after answering their question in where-to-go-for-help.md |
| Jane Doe | Jane-Doe-11966 | Case preparation and negotiation; contract and statutory interpretation; legal advocacy and advice; United States | skill-specific | You do not have to agree with me | published — owner decision, 2026-10-01, after answering their question in proving-it-and-taking-your-accounts-back.md; Public Safety & Justice held 1 of 22 on the October 1 read |
| Julie | Julie-6645 | Child development and classroom management; Tennessee | skill-specific | A working economy needs people who | published — owner decision, 2026-10-01; Education held 4 of 39 that day. Waits for an ordinary post to go out after Sherri's invite |
| Holly | Holly-D-192 | Financial planning and budgeting; financial modeling and cashflow management; Atlanta | skill-specific | Estonia, 1991 | published — owner decision, 2026-10-01; Finance and Public Administration held 6 of 34 that day. Waits for an ordinary post after Julie's invite |
| Nikki Martindale | Nikki-Martindale-9 | Business administration; Nebraska | skill-specific | A working economy needs people who | published — owner decision, 2026-10-01, after answering their question in why-nobody-does-anything.md. Waits for an ordinary post after Holly's invite. |
| No Name Individual | No-Name-Individual | Advocacy (placeholder); United States | advocacy-only | You already have a profile | published — owner decision, 2026-10-01, after answering their question in what-jobs-a-targeted-individual-can-get.md. Waits for an ordinary post after Nikki's invite. |
| Indiko | Indiko-1 | Business-plan development and market analysis; business modeling and financial case building; Australia | skill-specific | A working economy needs people who | in PR — after their 2025 Quora post asking to find other Australians; Microfinance and SME Support held 4 of 24 on 2026-10-07; business-plan development sits under Business Development Officers / SME Advisors in Skills Taxonomy; business modeling and financial case building sits under Management Consultants in Professional & Business Services (17 of 52) |
| Marilyn | Marilyn-1921 | Laboratory safety and SOP adherence; laboratory testing (basic); packaging and labeling; United States | skill-specific | Two things have to be true | in PR — on 2026-10-08 packaging and labeling sat under Food-Processing Workers in Food & Agriculture (6 of 49) and laboratory safety under Lab Technicians in R&D & High-Tech (21 of 41). Laboratory testing (basic) was filed under Water & Sanitation; the post treats it as general, since it is not known which sector Marilyn works in. Waits for an ordinary post to merge after Indiko's invite |

Status is one of: `queued`, `drafted`, `in PR`, `published`, `skipped`. A skipped row keeps its
reason in the notes column so nobody re-queues it a month later.

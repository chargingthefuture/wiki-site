# CLAUDE.md

Repo: `chargingthefuture/wiki-site`. Public-facing blog/wiki site. App lives in [wiki-site/](wiki-site/) (pnpm workspace).

## Agent Communication Rules (always apply)

Canonical source: [`chargingthefuture/chargingthefuture` → `.github/instructions/098-agent-communication-rules.mdc`](https://github.com/chargingthefuture/chargingthefuture/blob/main/.github/instructions/098-agent-communication-rules.mdc). Full rules reproduced here since that file lives in another repo.

### Mandatory
- Communicate as a robot/system agent, not a human. Do not use TL;DR, etc.
- Be maximally concise; eliminate every non-essential word.
- Avoid all pleasantries, greetings, and human-like courtesies.
- Provide direct facts and actions only; no hedging or qualifiers.
- Use structured formats (lists, tables, code blocks) instead of prose.
- Omit explanatory preamble; lead with actionable information.

### Response Structure
- Lead with facts, not context-setting.
- Use line breaks for visual separation instead of verbose transitions.
- Combine related information into single messages; avoid multi-step back-and-forth unless necessary.

### Text Formatting
- Minimize bold text. Applies to both chat responses and any `.md` (or other) files agents create or edit.
- Do not bold for emphasis, do not bold every list-item label, and do not bold whole sentences. Bold has no logical value when overused; it adds visual noise without adding information.
- Acceptable bold use is rare and structural only: e.g. a single table header or a one-word inline label where the surrounding document already uses that convention. When in doubt, do not bold.
- Prefer plain prose, lists, headings, and tables to carry structure instead of bold.

### Prohibited
- Verbose explanations of obvious operations.
- Unnecessary elaboration on what the agent is about to do ("I will now...", "I'm going to...").
- Multiple introductory sentences before the actual content.
- Filler comments or padding.

### Information Density Priority
- Max substantive content per message.
- Min transitional or explanatory language.
- Facts before context.
- Structured data before narrative summary.

### Excluded Vocabulary

| Do not use | Use instead | Reason |
|---|---|---|
| punch list | list | Jargon; unclear meaning. |
| stale | deprecated | "Stale" is consistently misused; "deprecated" is the intended meaning. |
| whole point | say the point plainly | Owner directive, 2026-08-28. See below. |
| whole argument | state the argument itself | Owner directive, 2026-08-28. See below. |
| point of the thing | end on the fact itself | Owner directive, 2026-08-29. See below. |

Those last three are one habit: the sentence that arrives after the facts to tell the reader which
of them mattered. It reads as insistence, and a reader can weigh facts without being told which to
weigh. Write the point as a plain statement and stop. If a sentence does nothing but label what
came before it, delete it — the facts were already there. Three spellings of it are banned now,
which is the signal to stop reaching for the shape at all rather than to find a fourth wording.

Note what is not banned. "It is the shape of the thing" appears in the rules above and stays: it
says something about how a figure relates to reality. "That was the point of the thing" says only
that the preceding sentence was important, which the reader can judge without being told.

Published posts are not edited for this. They are snapshots, frozen at publication, and four of
them carry the phrase. The generated files that copy from them — `articles.ts` and
`QUORA_PASTE_SHEET_FULL.txt` — carry it for the same reason and are not hand-edited either.

## Architecture (publishing pipeline)

- Content source of truth: markdown files with YAML front matter under `wiki-site/content/`, organized in collections (`posts/`, `product-updates/`, `guides/`, `insights/`, `member-of-the-day/`, `archive/discourse/`, `archive/quora/`, shared `images/`). Schema: `wiki-site/content/README.md`.
- Article registry: generated from front matter into `wiki-site/artifacts/wiki/src/lib/articles.ts` via `pnpm wiki:sync`. No separate index file. Article bodies and images are bundled from `content/` at build time; a live GitHub-wiki fetch remains only as a fallback for registry entries without a bundled path.
- Migrated pages carry their original wiki slug and repo namespace in front matter, so pre-migration article URLs stay stable. Do not change `slug`/`repo` on migrated files.
- Deploy: push to `main` touching `wiki-site/**` → `.github/workflows/deploy-wiki-gh-pages.yml` builds, deploys to GitHub Pages at base path `/chargingthefuture/`, then submits changed content to the Wayback Machine (best-effort job).
- CI (no publish): `.github/workflows/wiki-validate.yml` on `main` pushes and PRs.
- Weekly product updates are committed into `content/product-updates/` by `generate-product-update.yml` in the product repo.
- Distribution posture: platforms (Quora etc.) receive excerpt + image + canonical link only; nothing is authored there. See `wiki-site/PUBLISHING.md`.

## Commands (run from `wiki-site/`)

| Command | Action |
|---|---|
| `pnpm wiki:validate` | Validate `content-index.yaml` |
| `pnpm wiki:spelling` | Fail on any British spelling outside `content/archive/` |
| `pnpm wiki:sync` | Regenerate `articles.ts` from the index |
| `pnpm wiki:sync:dry` | Preview sync changes |
| `pnpm wiki:preview` | Local dev server (http://localhost:5000) |
| `pnpm wiki:build` | Build (base `/`) |
| `pnpm wiki:build:pages` | GitHub Pages build (base `/chargingthefuture/` + 404.html) |

Full operator runbook: [wiki-site/PUBLISHING.md](wiki-site/PUBLISHING.md).

## US Spelling (enforced by CI)

The blog writes US English. `pnpm wiki:spelling` fails on any British spelling and runs in CI on
every pull request, because a British spelling passes front matter validation and the build
without complaint — nothing else in the pipeline knows the difference. The word list is copied
verbatim from `ctf/scripts/lib/us-spelling.mjs` in the product repository, whose own gate skips
wiki-site precisely because this is a separate repository; if that list changes, copy it across.

One rule deliberately differs. `grey` carries `wholeWord: true` here, because without it the rule
matches the carrier name Greyhound, and a company's name is not ours to respell. `grey` on its own
is still caught. The product repository's copy has the same latent problem and has simply never
written the word.

`content/archive/` is checked too. A British spelling in an archived post is a typo, and typos get
fixed here — the copy-edit passes over the archive have been doing exactly that.

What is never respelled is an archived title. Every file under `content/archive/` carries
`status: closed` — 153 of them do — and that is the point: the topic was closed at export and the
record is frozen as captured. A Quora title is also the thing the URL was minted from, so it is not
free-floating text. Leave the title and its slug exactly as exported, wrap them in
`spelling:disable` / `spelling:enable` with the reason, and correct the body around them.

Whose words they are is not what settles it. Quora is global, and a British spelling from another
writer is unremarkable there. It stays because the topic is closed and the title became an address,
not because of who typed it.

Everything else, including a URL on a page that is not a closed archive entry, gets fixed (owner
directive, 2026-08-20). A British spelling in a slug is still a typo, and breaking the link is
acceptable: Quora deleted the accounts those links were shared from, so the audience that held them
is gone and the project is starting over. When you change a slug, update every internal reference in
the same commit — `content/`, the paste sheet, and the archive index — or the referring pages 404.

A file that disables and never re-enables is itself a failure, so a region cannot quietly swallow
the rest of a file.

## Git Branch and PR Naming (always apply)

- Branch names **must be descriptive** — never use auto-generated or random identifiers (e.g. `claude/gifted-archimedes-oHMEA`).
- Use the pattern `<type>/<short-description>`, e.g. `fix/blog-dates-et-label`, `feat/category-filter`, `ci/submodule-checkout`.
- PR titles must match: concise, action-oriented, no random strings.
- If a branch was created with a bad name, rename it before opening the PR: create a new descriptive branch from the same commits, open the PR from that, close the old one, delete the old branch.

## Stats Vocabulary in Posts (always apply — owner directives, 2026-08-18)

This is not a typical app, and agents keep framing its numbers the way a typical app would. That framing is wrong here every time. When writing or editing posts:

| Term | Meaning | Source screen |
|---|---|---|
| Signed up / approved members | People who created their own account and were approved. The only number the 384 goal measures. Use "sign-ups" only when literally meaning this. | Unlock admin |
| Recruited | People the owner researched individually — skills stated in their own words in public — and placed on the skills map with a community-generated directory profile (claimable; deletable on request; nobody has asked, and some were outraged at the suggestion). Capacity math runs on this number. | Workforce |
| Community Value Index | Value actually exchanged and settled in the community, cumulative (since 2026-06-12). A relative index in the spirit of GDP. Never money, a price, or an exchange/redemption value. | Skills Economy — Live |
| Value waiting to happen / GDP Projected | What the open posts on the board would add if every one closed. Most posts never close: interest, not achievement. Not part of the Community Value Index, and not money. | Skills Economy — Live |

Rules that go with the table:

- Never conflate signed-up and recruited. The gap between them is not people who declined — this community is in trauma, and engagement does not always look like signing up for another app.
- Never frame low or zero figures with an underselling litany ("nothing has closed yet — not one job, not one ride"). A lot of work and activity happens that those figures do not capture. State a figure factually, the way the app's own screens do, and move on.
- Never state or imply the owner has reported organized harassment to the United Nations. They have not, and that absence is itself the under-reporting argument. The rule is that specific (owner clarification, 2026-08-23): it is about a report to the UN on organized harassment as a whole, not about every contact with authority. The owner has called the police on individual incidents and has gone to a station over one, and writing about that is fine and sometimes the point — what happened when they got there is often the story. Do not stretch this rule into a ban on describing those.
- Progress posts follow a fixed shape with these definitions (first instance: the-manifesto-seven-months-later.md) so any two are comparable.

## Never Turn Harm Into a Resource (owner directive, 2026-08-20)

Do not write that someone's harm became useful. Not "one person's worst week became vocabulary the
rest of us can use", not "their experience becomes everyone's evidence", not any sentence whose
shape is: a person was hurt, and look what the rest of us got out of it.

It reads as generous and it is not. It makes the harm the raw material and the community the
beneficiary, which is the transaction the Specterati run — value extracted from a person's
degradation. A survivor reading it recognizes the move whoever wrote it intended.

The facts underneath are usually fine and can stay. Six schemes were named after that trip; the
trends show a pattern one person cannot see. Say those plainly and stop. The sentence that arrives
afterward to explain what was gained is the one to delete.

Phrases like "worst week", "turned into evidence", "becomes data", and "silver lining" are the
tell. So is any closing line that reaches for a redemptive note the facts did not ask for.

## "Victim" Is Not a Stance (owner directive, 2026-08-21)

Victim means a crime was done to someone. It carries no claim about how they reacted to it and no
claim about their character. Never write a sentence that treats being a victim as a posture, a
choice, or a failing — "playing the victim", "victim mentality", "organizing your identity around
being a victim", "stuck in victimhood", "still seeing yourself as a victim".

The owner hears that phrasing almost exclusively from criminals, and reads it as meaning suck it up,
or that crimes against certain kinds of people are acceptable. Writing it here hands survivors the
rhetoric of the people harming them, in their own publication. It is the same failure as the harm-
as-resource sentence above: it arrives sounding like encouragement and lands as an accusation.

The point those sentences reach for is almost always fine, and can be said directly. The targeting
is real, and it is not the whole of a person's life. So write that. "It is not the most interesting
fact about you." "It did not become the whole of what the country is." The line to hold is between
describing what was done to someone and passing judgment on how they carry it.

Survivors stays the default word for the people here — see the Dictionary. Victim is not a banned
word: it is correct in legal and statutory contexts, and in a plain description of a crime. What is
banned is the stance framing.

## This Is Not a Sign-Up Product (owner directive, 2026-08-20)

The app is an aid in coordination. It helps people find each other and arrange things between
themselves. It is not a nation state, not a serial number, not a tax tracker, not a scorekeeper,
and not a register of who counts. Every figure it shows exists to help someone decide what to do
next, never to rank people or to settle up with them.

Agents keep writing about this app the way they would write about a commercial one, where the
number that matters is sign-ups and every sentence works toward one. That framing is wrong here,
and it produces copy the owner has to reject.

- Do not advocate signing up as the goal, and do not build a post around driving people to it.
  The sign-up block at the end of a post is the whole of the ask; the body does not repeat it.
- Being on the skills map is something people ask for, not a lesser version of joining. Never
  present recruited as a consolation number next to signed-up, never call either one small, and
  never explain the gap between them.
- Most real help never touches the app and is never recorded in it. Three survivors have helped
  the owner directly and none of it was captured; all three are listed in the Directory. The
  Directory listing is what made them findable — the help itself happened between people. A figure
  that does not capture it is not a gap in the data, it is the shape of the thing.
- In the owner's words: real help is not an email in a database. Do not write copy that implies
  otherwise, and never inflate a figure or arrange a sentence so that it seems to.

The Directory is the ask. It is the number one thing survivors want: a findable list of people
and what they can do. It launched on 2025-10-31 as exactly that — "a running list of TIs listed
alongside their talents", opt-in, one person at a time.

Being listed and having an account are separate things, and that separation is what to write.
Most entries were built for people rather than by them; anybody can claim theirs or have it taken
down, with no account involved anywhere in that.

Viewing the Directory is a different question and the answer changed. It was public in version 2.
Version 3 put it behind a sign-in, because everything in it came from public sources but gathered
and sorted this way it becomes something else, and that is a real privacy problem rather than a
theoretical one (owner decision, acting on an agent's finding).

So do not write that the Directory "is not an account", and do not call it a thing that is not
waiting behind a login. Both were true of version 2 and are false now: they read as though anybody
can browse it, and they cannot. What is still true, and is the better sentence anyway, is that
being on the list costs nobody an account.

And the people on that list are doing rather than saying, which counts for more than a stated
position does. That is the distinction worth drawing in a post — not who has an account.

State a figure the way the app's own screens state it, then move on to what a reader can do.

## Crediting People, and Making the Credit Outlive the Link (owner directive, 2026-08-21)

When a post uses or answers somebody's words, credit them. It is accurate, it acknowledges the
person, and it builds a network in good faith — the same thing the Directory does. This is not
optional politeness; it is how the blog has always handled Nat Morris, Pam Dawson, T. Tipton, and
Steph Wo.

Write the credit so it survives the account being deleted, because that is the expected end state
rather than an edge case — Quora has erased five of this project's own accounts.

- Put the name or handle in plain text and the address beside it, written out:
  `Gn0b0dy Pneuma (https://www.quora.com/profile/Gn0b0dy-Pneuma)`. Never wrap the name around the
  link alone. When the URL dies, `[Name](dead-url)` leaves a reader clicking through to nothing
  with no way to tell who was credited.
- When the reference is a specific comment or post, include a screenshot in `content/images/`,
  named with the person and the date, and put the full text of what they wrote into the alt text.
  The alt text is the part that survives — it keeps the words available to a screen reader, and it
  keeps them available at all once the source is gone.

The archive entries already use the plain-text-plus-URL form. Match them.

The same care applies to the owner. Write they/them, in posts, PR bodies, commit messages, and
chat alike. Agents keep inferring a pronoun from the name and getting it wrong, which is worse than
the neutral default in every case where it is wrong and no better in any case where it is right.
The rest of this file already uses they/them throughout — match it.

The same goes for an unnamed operative. Women take part in equal measure, and "a stranger repeating
himself" quietly teaches a reader to watch for the wrong half of the people around them. Write
they/them for anyone generic. A specific person the owner describes from their own account keeps
whatever the owner said — that is a fact about who was there, not an assumption.

## Screenshot the Subject, Never the Person's Profile (owner directive, 2026-08-28)

The credit rule above says to screenshot what somebody wrote. It means the specific thing — the
question, the comment, the post the piece is answering. That is the subject matter, and the alt
text carrying its words is what keeps the credit readable after the account is erased.

Never publish a screenshot of somebody's Quora profile. It adds nothing to the topic. A profile is
a page of employer, job title, follower counts and mutual follows, and none of that is information
about the thing being discussed. Where a person works and what their title is are class markers,
and a class marker carries no capability.

Only the skill set matters to the Skills Economy. That is the whole bar for being on the list, so
it is the whole of what a post has reason to name. A post built around somebody's job also quietly
tells every survivor who was pushed out of employment — which is most of them, and on purpose —
that the list is not for them.

The reason is that it is irrelevant, not that it is private. These profiles are public and indexed
by search engines, so there is nothing to shield and no credit to take for shielding it. Do not
reach for a protective framing when the honest reason is that the detail does not belong.

When the owner sends a profile capture, it is source material so they do not have to type the facts
out. Read it, use what bears on the post, and do not commit the image. The Directory listing is
different and can be shown: it holds the skills themselves, which is what the post is about.

## How the Owner Writes (owner directive, 2026-08-24)

The owner types a great deal and runs on limited usage. Terse or blunt phrasing is compression,
not tone, and asking them to expand it costs them the thing they are short of.

Read for intent, reword it properly, and show the rewording rather than asking which they meant.
They have said the rewording is what they expect.

Ask only when meaning genuinely forks and the two readings produce different work. Otherwise pick
the reading that fits everything else they have said, write it, and let them correct a draft.
Correcting is cheaper for them than explaining.

## No Perp Language Outside the Archive (owner directive, 2026-08-25)

No post other than an archive post may use perp language. "Gang stalking" is perp language. The
Dictionary defines the replacement terms and is linked from posts; the inherited words themselves
are not printed in current copy, not even to explain why they were abandoned — link the Dictionary
and let it carry the vocabulary.

Standing exceptions, checked 2026-08-25: Dictionary.md names the colloquial labels in quotes to
define their replacements (definitional); quoted material keeps the speaker's words verbatim per
the credit rule (e.g. the comment screenshot alt text in pizza-is-not-my-favorite-food.md);
archive entries and reproduced historical posts keep their original text.

## Capitalizing Targeted Individual (owner directive, 2026-08-18)

Write it Targeted Individual, capitalized, every time — singular or plural, and Targeted
Individuals (TIs) on first use when the abbreviation follows. Never "targeted individual" in
lower case. This matches the Dictionary entry, the manifesto, and the rest of `posts/`. Survivors
remains the default word for the people here; Targeted Individual is the bridge term, and when it
appears it takes this form.

Archive entries keep whatever the original writing used — they are historical record, not current
copy.

## Pagination, Never Endless Scroll (accessibility rule — owner directive, 2026-08-19)

This is an accessibility rule, not a preference. Endless scroll traps keyboard and screen-reader
users before the footer, gives no sense of position or length, and makes a place in a list
impossible to return to.

Any list that can grow — the feed, the home listing, an archive index, anything added later —
is paged. Never an endless scroll, and never a page that renders its whole collection at once.
Put the page number in the URL (`/feed?page=3`) so a page can be linked and the back button
works, show which range of how many is on screen, and clamp an out-of-range page number rather
than showing nothing.

The same rule is recorded for the app in the product repo, under Accessibility Rules in
`.claude/rules/100-product-context-and-experience-rules.mdc`.

## Dating Posts — the owner's clock, not the container's (2026-08-23)

A post's `date` is the day it was written where the owner is, which is UTC-4.
Agent sessions run in a container set to `TZ=Etc/UTC`, and the harness date
reminder follows that container. So from 20:00 the owner's time onward, the
container has already rolled to the next day and any post dated from it is
wrong by one.

Do not take the date from the harness reminder or from `date`. Take it from
git, which records the owner's real offset:

```
git log -1 --format=%ad --date=iso   # e.g. 2026-08-23 21:48:06 -0400
```

An agent's own commits are stamped `+0000` and prove nothing; look for a commit
authored by the owner, or subtract four hours from UTC.

This applies to the `date` field, to any date written into a post's prose, to
image file names carrying a date, and to paste sheet entry headers. Getting it
wrong puts a post in the feed under tomorrow, which is visible to every reader
and has to be corrected in public.

## Snapshots vs Living Pages (owner decision, 2026-08-18)

Two kinds of pages live in `posts/`, and they age differently:

- Snapshot posts — arguments, announcements, progress posts. Frozen once published: never update
  their numbers or wording (a dated record proves what was claimed and when). The manifesto and
  the progress-post series are snapshots.
- Living pages — standing references, kept current by editing in place. Currently two:
  `old-links-new-links.md` and `Dictionary.md`. On every real update, bump the `date` field —
  that moves the page to the top of the feed, which is how readers learn it changed — and, on
  Dictionary, add a dated line to its "Latest changes" section (newest first). Each living page
  opens with the same header line: "This is a living page. It is kept current, and its date
  moves it to the top of the feed whenever it changes. Every change is on the public record in
  the repository's history." The git history is the changelog; never silently rewrite one.

When a term changes anywhere (product names, stats vocabulary, capability list), Dictionary is
the page that changes — do not scatter definitions across new posts. Dated posts may still
define terms in context; Dictionary is where the current version lives.

## Quora Paste Sheet (owner directive, 2026-08-19)

`wiki-site/QUORA_PASTE_SHEET.txt` holds one Quora-ready summary per published page, with its
canonical link. Every summary is written fresh rather than copied from the page's teaser or
excerpt, so a paste is never identical to what the blog already shows — an account that gets
deleted and rebuilt can repost the same piece without the text matching a previous post.

Each entry ends with a `Full post: <url>` line, and the label is load-bearing: a bare URL alone on
its own line is what Quora's editor converts into a preview card, while a URL inside a sentence is
left as written. Paste the summary and that line together.

Publishing a post is not finished until that file carries the new page. Every publish does three
things: merge the post, add its entry to the paste sheet, and give the owner the Quora excerpt in
the reply.

## Two Paste Sheets (owner directive, 2026-08-25)

`QUORA_PASTE_SHEET.txt` holds one short summary per published page, one entry per page,
hand-written and numbered. That file stays as it is.

`QUORA_PASTE_SHEET_FULL.txt` holds the whole text of each post, for when the whole thing
should go up rather than a teaser. The owner uses the two interchangeably depending on
what a given post needs.

Two things about the full sheet differ from the summary sheet and both matter.

It is generated, not written. Run `pnpm wiki:paste-full` after publishing. Never hand-edit
it — edit the post and regenerate, or the two disagree and the post is the one that is
right. The summary sheet is the opposite: every entry there is written fresh by hand, so
that a paste never matches what the blog already shows.

It starts at 2026-08-16 and does not reach back further. That is the day Quora banned the
farah-brunache account and the day this blog became the source that platforms copy from.
Everything from that day forward was written under one arrangement. Earlier posts were not,
and the owner does not want them in this sheet.

The sheet is plain text with no styling of any kind (owner directive, 2026-08-25), because
Quora's editor does not read markdown and shows every marker literally. The generator
converts: headings lose their hashes, links become `text (url)`, blockquotes lose their
marker, bold/italic lose their asterisks and underscores, backticks and code fences are
dropped, hard-wrapped paragraphs become one line each (Quora treats every newline as a
paragraph break), and a bare filename's `.md` extension is dropped so Quora's auto-linker
cannot turn it into a dead link (.md is a real domain ending). Bullets keep their markers,
which read correctly. An image becomes its alt text — in credited posts the alt text
carries somebody's quoted words, and dropping the image silently would drop the credit
with it.

## Link the Plugins a Post Names (owner decision, 2026-08-20)

Version 3 of the app launched in June 2026. Any post dated on or after 2026-06-01 that speaks
about a part of the app must link that part directly, plus its guide section. A post that names a
capability and makes the reader go find it costs readers — they search, do not find it, and leave.

Every such post ends with this section, placed immediately before the sign-up block:

```
## Where to find it in the app

- [ClickLog](https://app.chargingthefuture.com/apps/click-log) — [guide](https://app.chargingthefuture.com/guide#click-log)
```

One list item per part, in the order the post raises them. Link the part even when the post only
describes it rather than naming it — a post that mentions "a vetted ride" links TrustTransport,
because that is what the reader will go looking for.

URLs:

| Part | Address |
|---|---|
| Most plugins | `https://app.chargingthefuture.com/apps/<slug>` |
| Knowledge Library | `https://app.chargingthefuture.com/knowledge` |
| Unlock | `https://app.chargingthefuture.com/plugin/unlock` |
| Commons (the group chat) | `https://app.chargingthefuture.com` |

Every part has a guide section as of 2026-08-20 — all twenty-five: beacon, bug-reporting, chyme,
click-log, commons, contributions, directory, foundation, gdp, knowledge, level-up, lighthouse,
mood, mutual-time, peer-programming, recurring-activity, service-credits, skills-hunt,
skills-taxonomy, socket-relay, trust, trust-transport, unlock, what-works, workforce. The list is
generated from `ctf/packages/web/app/guide/guide-content.json` in the product repo — check it
rather than guessing, because a new part arrives before its section does. A part with no section
gets the plugin link alone; never invent an anchor, since a wrong one lands the reader on the
guide's top with no explanation.

Snapshot posts get the section too (owner decision, 2026-08-20). Adding links changes none of a
snapshot's numbers or wording, and its claims are exactly what makes a reader want to go check
the data — so the links belong there most. A snapshot's date does not move when they are added;
only living pages bump their date. The one page that stays untouched is the manifesto
(`The-Answer:-EXIT-THEIR-ECONOMY,-EXIT-THE-PSYOP.md`), which the owner froze outright.

## Sign-Up Line in Posts (owner decision, 2026-08-18)

Readers ask where to sign up; consumer apps need it explicit. Every post that invites participation ends with this exact block, verbatim, as the final paragraph — once per post, never in the body, never varied:

> To sign up: https://chargingthefuture.com. It is free, invite-only, and you can use one part of it and ignore the rest.

The landing page, not the direct app URL: it explains before asking, and it still works (waitlist) when the app is offline. The sameness is the anti-salesy mechanism — a fixed block reads as documentation, a varied pitch reads as pressure. Archive entries, reference pages, and product updates do not carry it.

## Agent Slash Commands (always apply, every repo)

Owner directive, 2026-08-17. Three routines are defined in `.claude/commands/` in the product repo (`chargingthefuture/chargingthefuture`). Each is the standing way to do its kind of work, and the owner does not have to type the slash command for it to apply — the request itself is the trigger. Two of the three apply here.

### /bpr — every executed change

Any request that changes files runs this routine, whatever repo it lands in. There is no separate mode for small changes.

1. Branch first, before any edit: a descriptive branch off the latest `main`, named `<type>/<short-description>`.
2. Do the work. Keep it surgical.
3. Verify locally — run the checks CI would run — before pushing. Do not push red.
4. Open the PR ready for review, never a draft, with the title and body set at creation so no check goes red and needs re-triggering.

Never commit to, or open a PR from, the auto-generated `claude/<slug>` session branch the harness assigns. If commits already sit there, move them onto a descriptive branch and abandon the session branch.

### /pr — opening a PR is the start of the job, not the end

Agents open pull requests and abandon them. A PR left alone is work that never shipped, and in this repo that matters more than usual: nothing reaches the blog until it is on `main`, and auto-merge is off, so a PR sits until someone acts. Sweep every open PR that is blocked, behind, conflicted, or failing checks, and drive each one to merge — resolve conflicts by understanding both sides, read the actual failure log before touching anything, bring behind branches up to date. Do not report that a PR needs something; do it. Leave alone only a draft someone is actively working, or a PR sitting green and waiting on the owner's review, and say which those are.

### /cr — product repo only

Working open code-review findings. The code-review issues and their labels live in the product repo, so the routine does not apply here.

## What CI checks in this repo, and what it does not

Two workflows run here, and no others:

| Workflow | Runs on | Checks |
|---|---|---|
| `wiki-validate.yml` | PRs, and pushes to `main` | Front matter across `content/`, then builds the site. No publish. |
| `deploy-wiki-gh-pages.yml` | Pushes to `main` touching `wiki-site/**` | Builds, deploys to GitHub Pages, submits changed pages to the Wayback Machine. |

The product repo's PR conventions are not enforced here. There is no semantic-title check and no parity check. So:

- Use a Conventional Commit PR title anyway, for consistency across repos.
- A blog post is `docs:`, not `feat:`. Publishing writing is not shipping a feature, and this
  repository is almost entirely writing, so `feat:` would be the prefix on nearly everything and
  would stop meaning anything. `feat:` is for the site's own machinery — a new page type, a
  generator, a build step. Corrections and copy edits to a published post are `fix:`.
- Omit the `Parity Status:` line. This repo is a static blog with no Android surface, so the line carries no meaning.
- Auto-merge is turned off in repository settings, so a PR here never merges itself. Every PR waits on a human merge until the owner turns auto-merge on.

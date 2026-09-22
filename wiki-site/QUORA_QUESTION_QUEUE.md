# Quora question queue

48 questions that were opened as Quora answer drafts and never written. Quora recorded the
question and nothing else — every one of these drafts is completely empty, so there is no earlier
text to recover. They are a list of questions to answer, not drafts to finish.

They are not archive or Record material. Nothing was posted, so nothing was deleted. Each becomes
a new post in `content/posts/`.

This file is the queue because this repository has issues disabled. It works the same way a
tracking issue would, and it has one advantage: the tick and the post land in the same commit, so
the queue can never disagree with what is published.

## How this runs

- One pull request per post. It adds the post and ticks that line below, in the same commit.
- The agent takes the next unticked line. Say "next", or "next three" — never which one.
- Auto-merge is off in this repository, so each pull request waits on a human merge before the
  post is live.

## Conventions

Proposed, not settled. Correct them on the first post rather than in the abstract.

- The question is quoted verbatim in a blockquote, credited as asked on Quora. Quoted material
  keeps the speaker's words; the answer body uses the Dictionary's vocabulary and links it.
- The question's Quora address is printed in the post, in plain text, beside the quote. Crediting
  the asker is how this writing reaches the people already asking, and a plain-text address
  survives the page being taken down in a way a wrapped link does not. The export never recorded
  who asked, only what they asked, so the credit names the question and its address and says
  plainly that the author is unknown. Derive the address with `quoraQuestionUrl` in
  `scripts/src/import-quora-export.ts` rather than writing one by hand — Quora mints it from the
  question's own words. Three things the derivation cannot know, so an address is opened and
  checked before a post prints it: where two questions share wording Quora appends `-1` or `-2`;
  a question nobody has answered is served under an `/unanswered/` prefix, which drops as soon as somebody answers, so a post prints both forms and says which is which; and a slash in the
  question becomes a hyphen in the address rather than disappearing, which the function got wrong
  until question 4 came back dead.
- Open that address and credit the asker by handle, plain text with the profile address beside it,
  the way every other credit on this blog is written. The export recorded what was asked and not
  who asked it, but the question page still names them, so the asker is knowable even though the
  export cannot supply them. Credit the question alone only when the page no longer resolves.
- Check who asked before writing. Quora runs a bot, Quora Prompt Generator, that adds questions
  nobody asked, and the export cannot tell its questions from a person's. Prefer questions from
  people. A bot's question is answered only when people have been asking the same thing in their
  own words, which `QUORA_INSPIRATION_QUEUE.md` shows, and the post then says plainly that a bot
  added it (owner directive, 2026-09-19, after question 2 turned out to be one).
- The post is dated the day it is written, not the date the draft was opened. The draft date goes
  in the post only if it earns its place there.
- A question can be skipped. The line is marked `[–]` with the reason and the date, in the same
  place a tick would go, so the next "next" moves past it and nobody re-queues it later. A
  question is skipped when it is not about organized stalking, when the asker's page gives no
  context to answer from, or when answering it would mean giving legal advice (owner decisions,
  2026-09-21, on questions 5, 6 and 7). The legal-advice reason covers a question about what to do
  when the police will not act, not only one that names the law.
- The queues are the owner's working files, not something a reader knows about. A post never
  refers to this queue, the next question in it, or what a later post will cover (owner directive,
  2026-09-19).
- Each publish carries the standard tail: the "Where to find it in the app" section for any part
  the post names, the sign-up block if the post invites participation, a hand-written
  `QUORA_PASTE_SHEET.txt` entry, and a regenerated `QUORA_PASTE_SHEET_FULL.txt`.
- Before drafting, grep `QUORA_INSPIRATION_QUEUE.md` for the subject and read what is already
  saved on it, so the post cites the reading rather than starting cold. Tick there whatever the
  post ends up using, in the same commit as the post. A question here is a post to write; a line
  there is something to write it from.

## The queue

Ordered by the date the draft was opened. The account is the one it sat under.


<!-- spelling:disable — every line below is somebody else's question, quoted verbatim from the Quora export; respelling one would misquote the person who asked it. -->

- [x] 1. `2025-08-06` · pedigree101 — How do I overcome a gangstalker's false narrative? How can I distract myself from their tactics?
- [x] 2. `2025-08-06` · pedigree101 — Is it possible for targeted individuals to stop being harassed by gang stalkers? If so, what methods have been successful in stopping the harassment? (added by Quora Prompt Generator, a bot; answered because people keep asking the same thing)
- [x] 3. `2025-08-08` · pedigree101 — Have any Targeted Individuals tried moving to a different country? I'm in the US and am considering a move to Mexico to see if the RNM and V2K stop.
- [x] 4. `2025-08-09` · pedigree101 — As organized/community stalking number of victims increase, what do you think could happen to society as a whole?
- [–] 5. `2025-08-09` · pedigree101 — How do you get over being stalked if you can't prove who is doing it? (skipped — owner decision, 2026-09-21: the question is about regular stalking, not organized stalking, and the asker's page shows no Targeted Individual writing, so there is not enough context to answer it. Not a post.)
- [–] 6. `2025-08-10` · pedigree101 — What is the best way to deal with gang stalking and/or mobbing without any legal actions being taken against you? (skipped — owner decision, 2026-09-21: it asks how to act without legal action being taken against you, which is legal advice this blog does not give, and there is not enough context to answer it. Quora Prompt Generator, a bot, added it, which is a second reason. Not a post.)
- [–] 7. `2025-08-10` · pedigree101 — What steps can a victim of gang stalking take if the police refuse to investigate their case? (skipped — owner decision, 2026-09-21: answering it would mean advising somebody what to do about a police force that will not take their case, which is legal advice this blog does not give. Quora Prompt Generator, a bot, added it, which is a second reason. Not a post.)
- [x] 8. `2025-08-12` · pedigree101 — Are gang stalkers psychic? (asked by Scott Rowell on 2024-11-24; answered in they-are-not-psychic.md)
- [ ] 9. `2025-08-12` · pedigree101 — What is gang stalking and what are some common methods used by gang stalkers?
- [ ] 10. `2025-08-13` · pedigree101 — How can moving help someone who is being seriously gang stalked?
- [ ] 11. `2025-08-13` · pedigree101 — How important is it to stay positive when dealing with gang stalking, and what mindset shifts can help maintain a sense of control?
- [ ] 12. `2025-08-13` · pedigree101 — What are some ways for a person to recover from being a victim of gang stalking and return to a normal life?
- [ ] 13. `2025-08-13` · pedigree101 — Who should I report my gang stalking to?
- [ ] 14. `2025-08-14` · pedigree101 — What is the longest period of time someone has been a target of gang stalking?
- [ ] 15. `2025-08-17` · pedigree101 — Can gang stalking occur in professional or work settings?
- [ ] 16. `2025-08-18` · pedigree101 — How can I build a support network to help me manage the stress and fear associated with feeling gang stalked?
- [ ] 17. `2025-08-18` · pedigree101 — How can someone identify if they are being targeted by "gang-stalkers"? What steps should they take if they suspect they are being followed or watched by strangers?
- [ ] 18. `2025-08-18` · pedigree101 — How can you help me? I'm a victim of gang stalking and I know some of who are involved.
- [ ] 19. `2025-08-18` · pedigree101 — I notice a lot of high school kids as gang stalkers or recruits that have quite a bit of knowledge in that area. Is it most likely their parents are GSS and teach them? If not, who teaches them?
- [ ] 20. `2025-08-18` · pedigree101 — I've been a victim of gang stalking for almost decade…I'm rather clever, smart, observant and highly angry instead of scared. Despite my efforts, the damage/stress and heartache is killing me. I need help desperately. Where to go for help?
- [ ] 21. `2025-08-20` · pedigree101 — This whole gang stalking thing has come on now. It has to end as I know who started it and sadly, it's a low life ex. How do you prove it and unhack everything? Talk about an invasion of privacy.
- [ ] 22. `2025-08-21` · pedigree101 — What are the consequences for gang stalkers if they tell their target that they are being stalked?
- [ ] 23. `2025-08-22` · pedigree101 — Do you feel sympathy for gang stalkers?
- [ ] 24. `2025-08-25` · pedigree101 — What do people who have confessed to gang stalking say about how it all started and who is involved?
- [ ] 25. `2025-08-25` · pedigree101 — What jobs can a targeted individual get?
- [ ] 26. `2025-08-28` · pedigree101 — How can targeted individuals unite to expose and combat the systematic gang stalking and harassment they face, including government complicity and directed energy weapons?
- [ ] 27. `2025-08-28` · pedigree101 — I have a question for the perps on the stalking side of organized stalking. If your son or your daughter was put on the terror watch list and became a target, would that change anything for you or would it just be another day at the office?
- [ ] 28. `2025-08-31` · pedigree101 — If so many people are aware that gang stalking is going on, then why isn't anyone doing anything about it? They have destroyed me and I'm so at my breaking point. It's so unfair.
- [ ] 29. `2025-08-31` · pedigree101 — Why do some people quit being involved in gang stalking, and what consequences do they face for leaving?
- [ ] 30. `2025-09-01` · pedigree101 — How do you guys protect yourself against energy weapons and frequency?
- [ ] 31. `2025-09-03` · pedigree101 — Are there any online communities or forums for victims of gang stalking to connect and share their experiences? If yes, what are some examples of these websites?
- [ ] 32. `2025-09-03` · pedigree101 — How many people out there suffer from gang stalking, electronic harassment and/or organized stalking?
- [ ] 33. `2025-09-03` · pedigree101 — Is there a place where I can move to get away from gang stalking?
- [ ] 34. `2025-09-03` · pedigree101 — What is the most effective strategy for verifying the authenticity of new members in the TI skills Network?
- [ ] 35. `2025-09-03` · pedigree101 — What is the most unexpected item you regularly carry to deal with gang stalking?
- [ ] 36. `2025-09-05` · pedigree101 — Are their groups of TIs that meet like maybe Alcoholics Anonymous does? I need support n have nowhere to turn?
- [ ] 37. `2025-09-08` · pedigree101 — I've been targeted for twenty years and my parents have total faith in our corrupt government. How do I make them understand somewhat that I don't deserve arrests and mental health treatment?
- [ ] 38. `2025-09-10` · pedigree101 — How do I overcome homelessness as a targeted individual? I currently live in my car and it's getting very cold out as I'm in Michigan.
- [ ] 39. `2025-09-18` · pedigree101 — How do prove I'm being gangstalked?
- [ ] 40. `2025-09-25` · pedigree101 — What is the best way to deal with organized stalking/gang stalking/electronic harassment?
- [ ] 41. `2025-09-26` · pedigree101 — Where can I get help as a targeted individual?
- [ ] 42. `2025-10-31` · farah-brunache — Who pays the gang stalkers to stalk and harass you and why don't the police want to help?
- [ ] 43. `2025-11-01` · farah-brunache — Do Targeted Individuals get harassed more around Halloween? About half the TI's ive read believe there's a spiritual element to gangstalking. I've especially noticed more stalking on election years this time of year.
- [ ] 44. `2025-11-01` · farah-brunache — Do gangstalkers know that they're putting their children in harms way when harassing targeted individuals?
- [ ] 45. `2025-11-01` · farah-brunache — Do perps drive white sedans and white construction Vehicles that follow targeted individuals?
- [ ] 46. `2025-11-01` · farah-brunache — Do perps use the same make models and colors of the vehicles that targets drive to harass their targets?
- [ ] 47. `2025-11-01` · farah-brunache — Does gang stalking go after your kids?
- [ ] 48. `2026-08-14` · farah-brunache — What is a person called that accuses innocent strangers of pedophilia in every one of their comments on here, are they a danger and should they be banned?

<!-- spelling:enable -->

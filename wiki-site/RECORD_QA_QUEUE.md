# Record QA queue

Every entry on The Record, in the Record's own order, newest first, one line per entry — the working list for
the manual review pass. 632 entries; nobody does that in one sitting, and this file is how a
sitting ends cleanly and the next one starts where it left off.

## What reviewing one entry means

1. Read the text. It is raw export conversion; fix what the conversion mangled by editing the
   entry's file directly under `content/archive/quora/`.
2. Check the printed original address. Lines marked `derived` carry an address computed from the
   question text rather than captured from the export — 215 of them — and those are the
   ones most worth verifying. A wrong one is fixed in the entry's `original_url` field.
3. Add the picture where one exists: `screenshot` (file in `content/images/`, named with the
   person and the date), `screenshot_alt` (the pictured words in full — validation requires it),
   and `screenshot_credit` (name and address, the visible line). An entry with nothing worth
   picturing skips this; skipping is not a reason to leave the line unticked.
4. Tick the line, in the same commit as any fixes it produced.

## How the sittings work

- One pull request per sitting, however many entries it covered. The ticks and the fixes travel
  together, so this file can never disagree with what was reviewed.
- The `Record page N` headers below match the pages of `/record` exactly, 25 entries each, so
  "I finished page 7" means the same thing here and on the site. Both run newest first since
  2026-10-14, so page 1 is the newest 25. The entry numbers stay chronological, No. 1 the oldest,
  and did not change when the pages were regrouped.
- After editing any entry file, run `pnpm wiki:validate` and `pnpm wiki:sync` (with
  `git fetch --unshallow` first in a fresh clone), and commit the regenerated `articles.ts`.
- The set is fixed at the 632 entries imported on 2026-08-26. If a later import adds
  entries, append them; never renumber the existing lines.

Screenshots already in place when this queue was written: 1.

## The queue


<!-- spelling:disable — every line below carries an entry's slug, which is its address and is not free-floating text; the titles inside them are other people's words and the original writing's words, kept as exported. -->


### Record page 1

- [ ] 632. `2026-08-14` · answer-comment · `farah-brunache/how-do-i-stop-v2k-and-rnm-i-m-being-set-up-as-schizophrenic-3`
- [ ] 631. `2026-08-13` · post-comment · `farah-brunache/i-am-slowly-building-up-a-call-to-march-on-the-attorney-general-s-offi-4`
- [ ] 630. `2026-08-12` · post-comment · `farah-brunache/i-am-slowly-building-up-a-call-to-march-on-the-attorney-general-s-offi-3`
- [ ] 629. `2026-08-10` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-th-4`
- [ ] 628. `2026-08-10` · post-comment · `farah-brunache/i-am-slowly-building-up-a-call-to-march-on-the-attorney-general-s-offi-2`
- [ ] 627. `2026-07-28` · answer-comment · `farah-brunache/could-a-targeted-individual-be-also-active-in-gang-stalking-5`
- [ ] 626. `2026-07-27` · answer · `farah-brunache/have-most-ai-like-claude-shown-to-be-openly-disbelieving-in-anything-s` — derived
- [ ] 625. `2026-07-27` · answer-draft · `farah-brunache/have-most-ai-like-claude-shown-to-be-openly-disbelieving-in-anything-s-2` — derived
- [ ] 624. `2026-07-27` · answer · `farah-brunache/if-a-t-i-has-no-flaws-insecurities-and-they-re-considered-perfect-how` — derived
- [ ] 623. `2026-07-27` · question-comment · `farah-brunache/information-is-available-about-how-ai-works-and-it-is-right-that-a-cha` — derived
- [ ] 622. `2026-07-26` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-he`
- [ ] 621. `2026-07-26` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-th-3`
- [ ] 620. `2026-07-26` · post-comment · `farah-brunache/i-am-slowly-building-up-a-call-to-march-on-the-attorney-general-s-offi`
- [ ] 619. `2026-07-18` · post-comment · `farah-brunache/why-do-my-stalkers-find-it-funny-to-harrass-me-all-day-even-though-its`
- [ ] 618. `2026-07-14` · post-comment · `farah-brunache/hi-farah-i-discovered-ti-skills-network-via-another-tis-comment-on-my-2`
- [ ] 617. `2026-07-12` · answer-comment · `farah-brunache/are-there-actual-physical-communities-of-targeted-individuals-living-t-5`
- [ ] 616. `2026-07-12` · post-comment · `farah-brunache/does-anyone-know-how-to-unlock-a-website-domain`
- [ ] 615. `2026-07-11` · post-comment · `farah-brunache/so-i-had-a-nightmare-that-their-was-a-terrible-accident-on-my-street-c`
- [ ] 614. `2026-07-09` · answer-comment · `farah-brunache/are-there-actual-physical-communities-of-targeted-individuals-living-t`
- [ ] 613. `2026-07-09` · answer-comment · `farah-brunache/are-there-actual-physical-communities-of-targeted-individuals-living-t-2`
- [ ] 612. `2026-07-09` · answer-comment · `farah-brunache/are-there-actual-physical-communities-of-targeted-individuals-living-t-3`
- [ ] 611. `2026-07-09` · answer-comment · `farah-brunache/are-there-actual-physical-communities-of-targeted-individuals-living-t-4`
- [ ] 610. `2026-07-09` · post-comment · `farah-brunache/i-so-wish-there-was-a-way-for-a-large-number-of-us-ti-s-to-come-togeth-4`
- [ ] 609. `2026-06-28` · answer · `farah-brunache/how-do-gang-stalkers-know-your-whereabouts-all-the-time` — derived
- [ ] 608. `2026-05-26` · post-comment · `farah-brunache/https-tiskillsnetwork-quora-com-c-elizabeth-p-p-https-www-quora-com-pr`

### Record page 2

- [ ] 607. `2026-05-22` · post-comment · `farah-brunache/hey-lately-my-program-has-intensified-i-feel-vibrations-through-my-bed`
- [ ] 606. `2026-04-21` · post-comment · `farah-brunache/what-should-i-do-if-my-perps-are-not-allowing-me-to-make-money-and-tak`
- [ ] 605. `2026-04-16` · post-comment · `farah-brunache/does-anyone-know-of-a-good-place-to-live-where-being-a-targeted-indivi`
- [ ] 604. `2026-04-14` · post-comment · `farah-brunache/need-someone-that-can-install-a-thermostat-on-a-honda-accord-ex-in-the`
- [ ] 603. `2026-04-14` · answer-comment · `farah-brunache/what-do-people-who-believe-theyre-targeted-individuals-say-about-exper`
- [ ] 602. `2026-02-27` · question-comment · `farah-brunache/i-do-not-know-also-do-not-see-how-this-question-relates-to-the-ti-skil` — derived
- [ ] 601. `2026-02-27` · answer · `farah-brunache/what-does-it-mean-when-a-racist-lying-theiving-corrupt-governor-blocks` — derived
- [ ] 600. `2026-02-25` · post-comment · `farah-brunache/where-do-you-live-i-ve-spent-270g-traveled-400k-and-have-looked-to-reh`
- [ ] 599. `2026-02-19` · answer · `farah-brunache/farah-hey-its-paul-i-have-beem-absent-lately-am-i-still-a-candidate-fo` — derived
- [ ] 598. `2026-02-16` · answer-draft · `farah-brunache/what-resources-or-support-systems-exist-for-people-who-are-being-pushe` — derived
- [ ] 597. `2026-02-10` · answer-comment · `farah-brunache/what-s-a-conspiracy-theory-you-have-about-your-own-everyday-life-2`
- [ ] 596. `2026-02-10` · answer-comment · `farah-brunache/what-s-a-conspiracy-theory-you-have-about-your-own-everyday-life-3`
- [ ] 595. `2026-02-10` · answer-comment · `farah-brunache/what-s-a-conspiracy-theory-you-have-about-your-own-everyday-life-4`
- [ ] 594. `2026-02-10` · answer-comment · `farah-brunache/what-s-a-conspiracy-theory-you-have-about-your-own-everyday-life-5`
- [ ] 593. `2026-02-08` · answer-comment · `farah-brunache/are-there-support-groups-for-targeted-individuals-in-austin-texas-gang`
- [ ] 592. `2026-02-05` · answer · `farah-brunache/how-do-i-get-my-gang-stalkers-to-reveal-themselves-especially-possible-3` — derived
- [ ] 591. `2026-02-04` · answer-comment · `farah-brunache/how-do-i-get-my-gang-stalkers-to-reveal-themselves-especially-possible`
- [ ] 590. `2026-02-04` · answer-comment · `farah-brunache/how-do-i-get-my-gang-stalkers-to-reveal-themselves-especially-possible-2`
- [ ] 589. `2026-02-02` · post-comment · `farah-brunache/i-feel-i-have-gangstalkers-tracking-me-in-a-very-scary-way-i-feel-they-3`
- [ ] 588. `2026-02-02` · post-comment · `farah-brunache/i-feel-i-have-gangstalkers-tracking-me-in-a-very-scary-way-i-feel-they-4`
- [ ] 587. `2026-01-31` · post-comment · `farah-brunache/i-feel-i-have-gangstalkers-tracking-me-in-a-very-scary-way-i-feel-they`
- [ ] 586. `2026-01-31` · post-comment · `farah-brunache/i-feel-i-have-gangstalkers-tracking-me-in-a-very-scary-way-i-feel-they-2`
- [ ] 585. `2026-01-30` · answer · `farah-brunache/what-are-the-best-hardwired-security-systems-i-m-a-tech-novice-and-wan` — derived
- [ ] 584. `2026-01-23` · answer-comment · `farah-brunache/what-s-a-conspiracy-theory-you-have-about-your-own-everyday-life`
- [ ] 583. `2026-01-22` · answer · `farah-brunache/is-moving-away-an-effective-way-to-stop-gang-stalking` — derived

### Record page 3

- [ ] 582. `2026-01-21` · answer · `farah-brunache/are-there-any-targeted-individuals-living-in-columbia-sc` — derived
- [ ] 581. `2026-01-19` · answer · `farah-brunache/how-do-these-low-level-gang-stalkers-get-paid` — derived
- [ ] 580. `2026-01-17` · post-comment · `farah-brunache/how-do-ya-ll-avoid-their-illegal-music-abuse-if-not-your-time-erase-me`
- [ ] 579. `2026-01-17` · post-comment · `farah-brunache/how-do-ya-ll-avoid-their-illegal-music-abuse-if-not-your-time-erase-me-2`
- [ ] 578. `2026-01-17` · post-comment · `farah-brunache/how-do-ya-ll-avoid-their-illegal-music-abuse-if-not-your-time-erase-me-3`
- [ ] 577. `2026-01-15` · space-submission · `farah-brunache/how-can-i-be-add-to-the-list-of-ti-s-i-live-in-perth-western-australia` — derived
- [ ] 576. `2026-01-14` · answer-comment · `farah-brunache/how-do-i-stop-v2k-and-rnm-i-m-being-set-up-as-schizophrenic`
- [ ] 575. `2026-01-14` · answer-comment · `farah-brunache/how-do-i-stop-v2k-and-rnm-i-m-being-set-up-as-schizophrenic-2`
- [ ] 574. `2026-01-09` · post-comment · `farah-brunache/farah-thank-you-for-your-a-true-blessing-from-god-almighty-everyone-ha`
- [ ] 573. `2026-01-09` · post-comment · `farah-brunache/https-www-quora-com-how-can-targeted-individuals-unite-expose-gang-sta`
- [ ] 572. `2026-01-08` · answer · `farah-brunache/does-rnm-always-require-a-chip-or-implant-on-the-person` — derived
- [ ] 571. `2026-01-07` · answer · `farah-brunache/i-have-a-question-the-people-that-s-gs-me-are-always-talking-about-the` — derived
- [ ] 570. `2026-01-06` · answer · `farah-brunache/do-you-have-any-theories-about-why-gang-stalkers-would-put-something-i` — derived
- [ ] 569. `2026-01-06` · answer · `farah-brunache/how-do-i-expose-v2k-and-rnm` — derived
- [ ] 568. `2026-01-06` · answer · `farah-brunache/how-do-i-stop-v2k-and-rnm-stalkers-from-controlling-my-life` — derived
- [ ] 567. `2026-01-05` · post-comment · `farah-brunache/how-many-victims-of-tis-live-here-in-az-and-is-there-any-groups-that-g`
- [ ] 566. `2026-01-04` · space-post · `farah-brunache/in-the-context-of-being-a-ti-are-there-better-geographical-regions-tha-2`
- [ ] 565. `2026-01-04` · answer-comment · `farah-brunache/what-is-the-best-way-to-start-anti-gangstalking-the-people-that-have-b`
- [ ] 564. `2026-01-04` · space-submission · `farah-brunache/why-do-targeted-individuals-act-as-if-they-know-the-gangstalking-will` — derived
- [ ] 563. `2026-01-03` · answer · `farah-brunache/are-there-any-targeted-people-living-in-jacksonville-florida` — derived
- [ ] 562. `2026-01-03` · post-comment · `farah-brunache/i-so-wish-there-was-a-way-for-a-large-number-of-us-ti-s-to-come-togeth-3`
- [ ] 561. `2026-01-02` · answer · `farah-brunache/i-want-to-join-the-illuminati-can-you-help-me-without-paying` — derived
- [ ] 560. `2026-01-02` · space-submission · `farah-brunache/in-the-context-of-being-a-ti-are-there-better-geographical-regions-tha` — no address
- [ ] 559. `2025-12-31` · post-comment · `farah-brunache/i-so-wish-there-was-a-way-for-a-large-number-of-us-ti-s-to-come-togeth`
- [ ] 558. `2025-12-31` · post-comment · `farah-brunache/i-so-wish-there-was-a-way-for-a-large-number-of-us-ti-s-to-come-togeth-2`

### Record page 4

- [ ] 557. `2025-12-31` · post-comment · `farah-brunache/please-respond-https-gangstalkingquestionsandanswers-quora-com-i-so-wi`
- [ ] 556. `2025-12-31` · post-comment · `farah-brunache/quora-is-most-def-infiltrated-and-controlled-by-them-i-didnt-know-that-2`
- [ ] 555. `2025-12-30` · question · `farah-brunache/i-met-a-fake-ti-from-quora-damon-mayle-he-has-since-deleted-his-profil` — derived
- [ ] 554. `2025-12-30` · space-submission · `farah-brunache/i-met-a-fake-ti-from-quora-one-thing-he-tried-to-do-was-to-get-me-to-g` — no address
- [ ] 553. `2025-12-30` · answer-comment · `farah-brunache/is-it-safe-for-targeted-individuals-of-remote-neural-monitoring-to-con`
- [ ] 552. `2025-12-28` · post-comment · `farah-brunache/https-www-quora-com-profile-james-mccarthy-512-how-do-you-stay-calm-wh`
- [ ] 551. `2025-12-23` · space-submission · `farah-brunache/if-i-discovered-the-sim-card-in-my-cell-phone-isn-t-the-same-one-i-put` — derived
- [ ] 550. `2025-12-22` · answer-comment · `farah-brunache/are-most-targeted-individuals-employed`
- [ ] 549. `2025-12-22` · answer-comment · `farah-brunache/how-do-i-find-other-targeted-individuals-in-oc`
- [ ] 548. `2025-12-22` · post-comment · `farah-brunache/quora-is-most-def-infiltrated-and-controlled-by-them-i-didnt-know-that`
- [ ] 547. `2025-12-22` · answer · `farah-brunache/some-say-some-gangstalkers-think-they-re-targeting-people-for-their-cr` — derived
- [ ] 546. `2025-12-20` · answer · `farah-brunache/any-people-in-the-ohio-area-being-gangstalked-who-want-to-team-up-with` — derived
- [ ] 545. `2025-12-20` · answer-comment · `farah-brunache/what-is-it-like-to-be-a-targeted-individual-of-gangstalking`
- [ ] 544. `2025-12-20` · answer · `farah-brunache/who-can-you-turn-to-about-gang-stalking-this-has-been-happening-for-ov` — derived
- [ ] 543. `2025-12-18` · post-comment · `farah-brunache/being-a-targeted-individual-i-got-locked-up-in-a-mental-institution-th`
- [ ] 542. `2025-12-18` · post-comment · `farah-brunache/hi-farah-i-discovered-ti-skills-network-via-another-tis-comment-on-my`
- [ ] 541. `2025-12-18` · answer-comment · `farah-brunache/what-happens-when-a-targeted-individual-goes-to-jail-or-is-put-into-a`
- [ ] 540. `2025-12-17` · answer · `farah-brunache/if-you-are-gangstalked-and-living-in-california-will-all-of-california` — derived
- [ ] 539. `2025-12-14` · answer · `farah-brunache/did-my-gang-stalking-start-13-years-ago-when-i-ordered-drugs-off-the-d` — derived
- [ ] 538. `2025-12-14` · answer · `farah-brunache/have-you-ever-managed-to-make-a-gangstalker-understand-that-he-s-being` — derived
- [ ] 537. `2025-12-14` · answer · `farah-brunache/i-said-to-an-other-ti-of-gangstalking-i-am-exasperated-and-see-no-way` — derived
- [ ] 536. `2025-12-14` · answer · `farah-brunache/why-do-gangstalkers-recruit-their-own-children-to-molest-strangers-don` — derived
- [ ] 535. `2025-12-13` · answer · `farah-brunache/have-i-made-the-ti-list-yet` — derived
- [ ] 534. `2025-12-13` · post-comment · `farah-brunache/i-have-started-using-the-word-zersetzung-psychology-instead-of-gangsta`
- [ ] 533. `2025-12-13` · answer · `farah-brunache/is-there-any-place-in-san-diego-were-there-are-groups-or-resources-for-2` — derived

### Record page 5

- [ ] 532. `2025-12-13` · answer · `farah-brunache/my-gang-stalkers-are-always-interested-in-knowing-if-i-have-a-fever` — derived
- [ ] 531. `2025-12-13` · post-comment · `farah-brunache/this-has-been-heavy-on-my-heart-for-a-long-time-and-i-wanted-to-say-wh`
- [ ] 530. `2025-12-12` · post-comment · `farah-brunache/hello-im-a-ti-since-2002-03-im-62-live-in-florida-also-glad-to-find-th`
- [ ] 529. `2025-12-12` · post-comment · `farah-brunache/hello-im-a-ti-since-2002-03-im-62-live-in-florida-also-glad-to-find-th-2`
- [ ] 528. `2025-12-10` · post-comment · `farah-brunache/i-have-a-nonverbal-low-functioning-autistic-son-that-is-being-messed-w`
- [ ] 527. `2025-12-10` · post-comment · `farah-brunache/its-been-13-years-for-me-now-the-same-happens-to-me-there-is-no-such-t`
- [ ] 526. `2025-12-08` · post-comment · `farah-brunache/keep-a-diary-days-time-whatever-they-r-doing-if-u-have-close-friend-st`
- [ ] 525. `2025-12-04` · answer · `farah-brunache/can-spreading-positivity-and-maintaining-a-strong-moral-stance-genuine` — derived
- [ ] 524. `2025-11-20` · answer-draft · `farah-brunache/how-do-you-know-ppl-that-are-on-this-page-aren-t-the-gs-instead-of-the` — derived
- [ ] 523. `2025-11-19` · post-comment · `farah-brunache/idea-bit-bored-today-so-tried-chatgpt-instead-of-us-looking-for-the-an-2`
- [ ] 522. `2025-11-15` · answer · `farah-brunache/is-gang-stalking-the-end-to-a-target-s-life` — derived
- [ ] 521. `2025-11-13` · answer · `farah-brunache/do-perps-use-the-same-make-models-and-colors-of-the-vehicles-that-targ` — derived
- [ ] 520. `2025-11-10` · answer · `farah-brunache/would-your-partner-to-your-kids-join-gang-stalking-to-target-you` — derived
- [ ] 519. `2025-11-06` · post-comment · `farah-brunache/hi-im-pat-brownlee-ive-been-stalked-for-over-a-year-now-it-started-in`
- [ ] 518. `2025-11-02` · answer · `farah-brunache/i-ve-been-doing-much-better-and-haven-t-seen-as-many-gangstalkers` — derived
- [ ] 517. `2025-11-01` · answer · `farah-brunache/are-county-workers-involved-in-gangstalking` — derived
- [ ] 516. `2025-10-31` · answer-comment · `farah-brunache/im-a-ti-i-really-need-someone-to-talk-to-is-anyone-willing`
- [ ] 515. `2025-10-27` · question-comment · `farah-brunache/would-you-like-to-be-matched-with-other-tis-monthly-for-emotional-or-a` — derived
- [ ] 514. `2025-10-25` · post-comment · `farah-brunache/https-targetedindividualssurvey-quora-com-targeted-individuals-survey`
- [ ] 513. `2025-10-23` · post-comment · `farah-brunache/this-is-the-type-of-gangstalker-you-often-encounter-on-the-street-acco-3`
- [ ] 512. `2025-10-23` · post-comment · `farah-brunache/this-is-the-type-of-gangstalker-you-often-encounter-on-the-street-acco-4`
- [ ] 511. `2025-10-22` · answer · `farah-brunache/are-gaslighting-and-gang-stalking-demonic` — derived
- [ ] 510. `2025-10-22` · post-comment · `farah-brunache/most-of-the-people-who-engage-in-daily-psychological-harassment-are-un`
- [ ] 509. `2025-10-22` · post-comment · `farah-brunache/not-all-spiritual-gangstackers-know-thier-stocking-innocent-people-in`
- [ ] 508. `2025-10-20` · post-comment · `farah-brunache/im-struggling-right-now-because-im-trying-to-put-my-life-back-together`

### Record page 6

- [ ] 507. `2025-10-20` · post-comment · `farah-brunache/this-is-the-type-of-gangstalker-you-often-encounter-on-the-street-acco-2`
- [ ] 506. `2025-10-20` · post-comment · `farah-brunache/this-person-felix-emanon-decided-to-dm-me-then-wont-let-me-reply`
- [ ] 505. `2025-10-20` · post-comment · `farah-brunache/this-person-felix-emanon-decided-to-dm-me-then-wont-let-me-reply-2`
- [ ] 504. `2025-10-11` · answer-comment · `farah-brunache/any-gang-stalking-experiences-in-texas-is-texas-a-good-place-to-reloca-4`
- [ ] 503. `2025-10-11` · answer · `farah-brunache/are-people-that-deny-gang-stalking-actually-gang-stalkers` — derived
- [ ] 502. `2025-10-11` · answer · `farah-brunache/can-gang-stalkers-keep-you-from-getting-a-job` — derived
- [ ] 501. `2025-10-11` · answer-comment · `farah-brunache/could-a-targeted-individual-be-also-active-in-gang-stalking-2`
- [ ] 500. `2025-10-11` · answer-comment · `farah-brunache/could-a-targeted-individual-be-also-active-in-gang-stalking-3`
- [ ] 499. `2025-10-11` · answer-comment · `farah-brunache/could-a-targeted-individual-be-also-active-in-gang-stalking-4`
- [ ] 498. `2025-10-11` · answer · `farah-brunache/did-targeted-individuals-know-that-gang-stalkers-are-told-they-are-sta` — derived
- [ ] 497. `2025-10-11` · answer-comment · `farah-brunache/does-being-gang-stalked-make-you-feel-ashamed`
- [ ] 496. `2025-10-11` · answer-comment · `farah-brunache/how-do-i-get-a-job-as-a-gang-stalker-i-see-thousands-of-people-claimin`
- [ ] 495. `2025-10-11` · answer · `farah-brunache/if-you-are-a-targeted-individual-and-being-gang-stalked-can-you-get-a` — derived
- [ ] 494. `2025-10-11` · answer · `farah-brunache/is-it-possible-i-ve-always-been-stalked-but-just-didn-t-notice-till-6` — derived
- [ ] 493. `2025-10-11` · post-comment · `farah-brunache/ti-survey-question-104-what-type-of-harassment-do-you-experience-and-f`
- [ ] 492. `2025-10-11` · answer-comment · `farah-brunache/what-are-the-consequences-for-gang-stalkers-if-they-tell-their-target`
- [ ] 491. `2025-10-11` · answer-comment · `farah-brunache/what-are-the-most-surprising-reasons-people-have-given-for-participati`
- [ ] 490. `2025-10-11` · answer · `farah-brunache/what-do-gang-stalkers-say-about-targeted-people-that-isn-t-true` — derived
- [ ] 489. `2025-10-11` · answer · `farah-brunache/what-has-helped-you-slow-down-being-gang-stalked` — derived
- [ ] 488. `2025-10-11` · answer · `farah-brunache/what-other-names-do-gang-stalkers-use-to-describe-themselves-asides-fr` — derived
- [ ] 487. `2025-10-11` · answer · `farah-brunache/what-resources-are-available-to-victims-of-gang-stalking-can-you-trust` — derived
- [ ] 486. `2025-10-11` · answer · `farah-brunache/what-s-the-best-life-strategy-to-live-with-being-gang-stalked-with-wor` — derived
- [ ] 485. `2025-10-11` · answer · `farah-brunache/what-unifies-gang-stalkers-and-gang-stalking` — derived
- [ ] 484. `2025-10-07` · answer-comment · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets-10`
- [ ] 483. `2025-10-07` · answer-comment · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets-9`

### Record page 7

- [ ] 482. `2025-10-06` · answer · `farah-brunache/are-people-who-harass-and-gang-stalk-others-mentally-ill` — derived
- [ ] 481. `2025-10-06` · answer · `farah-brunache/could-these-people-convinced-they-are-christian-warriors-be-stalking-m` — derived
- [ ] 480. `2025-10-06` · answer-comment · `farah-brunache/do-you-want-to-join-a-network-to-list-what-each-ti-is-skilled-in-i-am-2`
- [ ] 479. `2025-10-06` · answer-comment · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets-5`
- [ ] 478. `2025-10-06` · answer-comment · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets-6`
- [ ] 477. `2025-10-06` · answer-comment · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets-7`
- [ ] 476. `2025-10-06` · answer-comment · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets-8`
- [ ] 475. `2025-10-06` · answer · `farah-brunache/given-your-belief-that-gang-stalkers-have-taken-over-how-do-you-decide` — derived
- [ ] 474. `2025-10-06` · answer · `farah-brunache/how-do-i-drown-out-noise-from-multiple-stalkers` — derived
- [ ] 473. `2025-10-06` · answer · `farah-brunache/how-do-you-effectively-vet-new-members-for-your-ti-circular-economy-wh` — derived
- [ ] 472. `2025-10-06` · answer · `farah-brunache/what-are-the-worst-states-for-gang-stalking` — derived
- [ ] 471. `2025-10-06` · answer-comment · `farah-brunache/whats-the-end-game-of-a-gang-stalker-upvoting-our-quora-posts-i-have-s-2`
- [ ] 470. `2025-10-06` · answer · `farah-brunache/when-you-are-gang-stalked-community-stalked-are-there-hidden-cameras-i` — derived
- [ ] 469. `2025-10-06` · answer · `farah-brunache/where-can-i-find-people-to-join-my-gang-stalking-sub-reddit` — derived
- [ ] 468. `2025-10-06` · answer-comment · `farah-brunache/youve-suggested-that-gang-stalking-is-all-about-the-data-what-specific`
- [ ] 467. `2025-10-05` · answer · `farah-brunache/can-electronic-harassment-send-specific-dreams-while-you-sleep` — derived
- [ ] 466. `2025-10-05` · answer · `farah-brunache/how-do-my-creepy-neighbors-who-have-hacked-my-cell-phone-change-what-t` — derived
- [ ] 465. `2025-10-03` · answer · `farah-brunache/after-14-years-homeless-and-3-targeted-dovother-targeted-individuals-a` — derived
- [ ] 464. `2025-10-02` · answer · `farah-brunache/are-gangstalkers-protected-by-real-investigators` — derived
- [ ] 463. `2025-10-02` · space-submission · `farah-brunache/are-there-any-tis-in-the-myrtle-beach-area` — derived
- [ ] 462. `2025-10-02` · answer · `farah-brunache/do-gang-stalkers-steal` — derived
- [ ] 461. `2025-10-02` · answer · `farah-brunache/have-you-ever-felt-like-life-is-rigged-against-you-watched-blocked-or` — derived
- [ ] 460. `2025-10-02` · answer · `farah-brunache/how-can-i-distinguish-between-real-threats-and-feelings-of-being-targe` — derived
- [ ] 459. `2025-10-02` · answer · `farah-brunache/how-do-gang-stalkers-recruit` — derived
- [ ] 458. `2025-10-02` · answer · `farah-brunache/how-do-you-communicate-to-tormentors-that-the-real-underlying-reason-t` — derived

### Record page 8

- [ ] 457. `2025-10-02` · answer · `farah-brunache/how-exactly-do-gang-stalkers-monitor-your-computer-activity-and-steal` — derived
- [ ] 456. `2025-10-02` · answer · `farah-brunache/i-know-this-sounds-far-fetched-but-do-gang-stalkers-have-devices-that` — derived
- [ ] 455. `2025-10-02` · post-comment · `farah-brunache/just-when-you-dont-think-life-can-suck-more-than-one-can-possibly-imag`
- [ ] 454. `2025-10-02` · answer · `farah-brunache/lots-of-people-on-here-recommend-praying-how-can-there-be-a-god-with-a` — derived
- [ ] 453. `2025-10-02` · answer · `farah-brunache/were-gang-stalkers-ever-stalked-themselves` — derived
- [ ] 452. `2025-10-02` · post-comment · `farah-brunache/what-bothers-me-the-most-about-what-i-read-on-here-is-how-how-many-of`
- [ ] 451. `2025-10-02` · answer · `farah-brunache/what-do-i-do-to-make-it-easier-as-a-ti-i-m-evicted-from-my-home-have-h` — derived
- [ ] 450. `2025-10-02` · answer · `farah-brunache/what-is-the-very-first-thing-you-advise-a-ti-to-do-after-realizing-the` — derived
- [ ] 449. `2025-10-02` · answer · `farah-brunache/who-is-being-gangstalked-in-chico-ca` — derived
- [ ] 448. `2025-10-02` · answer · `farah-brunache/why-would-gang-stalkers-let-you-know-where-they-live-and-even-invite-y` — derived
- [ ] 447. `2025-09-29` · answer · `farah-brunache/given-the-challenge-of-infiltration-what-unique-strategies-do-you-use` — derived
- [ ] 446. `2025-09-23` · post-comment · `farah-brunache/this-one-is-a-heads-up-to-all-the-creators-of-pages-dedicated-to-expos-2`
- [ ] 445. `2025-09-23` · post-comment · `farah-brunache/this-one-is-a-heads-up-to-all-the-creators-of-pages-dedicated-to-expos-3`
- [ ] 444. `2025-09-22` · answer-comment · `farah-brunache/so-the-word-cancer-has-been-brought-up-here-and-there-throughout-my-ta-3`
- [ ] 443. `2025-09-22` · post-comment · `farah-brunache/this-one-is-a-heads-up-to-all-the-creators-of-pages-dedicated-to-expos`
- [ ] 442. `2025-09-21` · answer · `farah-brunache/do-gang-stalkers-move-up-in-rank` — derived
- [ ] 441. `2025-09-21` · answer · `farah-brunache/has-anyone-had-a-real-attempt-at-their-life-by-gang-stalkers` — derived
- [ ] 440. `2025-09-21` · answer-comment · `farah-brunache/how-do-gang-stalkers-get-you-imprisoned-if-that-is-one-of-their-goals-2`
- [ ] 439. `2025-09-21` · post-comment · `farah-brunache/i-am-a-targeted-individual-because-i-follow-jesus-christ-and-the-devil`
- [ ] 438. `2025-09-21` · answer · `farah-brunache/i-ve-been-gangstalked-since-2016-today-i-no-going-to-keep-fighting-any` — derived
- [ ] 437. `2025-09-21` · answer · `farah-brunache/is-there-a-good-form-of-gang-stalking` — derived
- [ ] 436. `2025-09-21` · answer-comment · `farah-brunache/so-the-word-cancer-has-been-brought-up-here-and-there-throughout-my-ta-2`
- [ ] 435. `2025-09-21` · answer · `farah-brunache/what-psychological-profiles-do-gang-stalking-handlers-target` — derived
- [ ] 434. `2025-09-20` · answer · `farah-brunache/am-i-getting-gangstalked-why-do-i-hear-a-motor-passing-by-whenever-i-f` — derived
- [ ] 433. `2025-09-20` · answer · `farah-brunache/how-can-we-get-the-most-out-of-our-lives-being-a-gang-stalking-victim` — derived

### Record page 9

- [ ] 432. `2025-09-20` · answer · `farah-brunache/how-can-you-tell-if-someone-involved-in-gang-stalking-is-doing-it-out` — derived
- [ ] 431. `2025-09-20` · answer-comment · `farah-brunache/how-do-gang-stalkers-get-you-imprisoned-if-that-is-one-of-their-goals`
- [ ] 430. `2025-09-20` · answer · `farah-brunache/how-do-you-maintain-regular-employment-while-experiencing-gang-stalkin` — derived
- [ ] 429. `2025-09-20` · post-comment · `farah-brunache/https-targetedindividuals1-quora-com-this-article-is-very-interesting`
- [ ] 428. `2025-09-20` · answer · `farah-brunache/if-you-think-you-ve-been-targeted-or-gangstalked-at-work-what-steps-di` — derived
- [ ] 427. `2025-09-20` · post-comment · `farah-brunache/its-such-total-bullshit-that-i-have-to-live-in-constant-severe-pain-fr`
- [ ] 426. `2025-09-20` · post-comment · `farah-brunache/its-such-total-bullshit-that-i-have-to-live-in-constant-severe-pain-fr-2`
- [ ] 425. `2025-09-20` · post-comment · `farah-brunache/its-such-total-bullshit-that-i-have-to-live-in-constant-severe-pain-fr-3`
- [ ] 424. `2025-09-20` · post-comment · `farah-brunache/its-such-total-bullshit-that-i-have-to-live-in-constant-severe-pain-fr-4`
- [ ] 423. `2025-09-20` · post-comment · `farah-brunache/typically-they-will-aggravate-you-to-the-point-where-you-hit-someone-a`
- [ ] 422. `2025-09-20` · answer · `farah-brunache/what-measures-can-the-government-take-to-prevent-gang-stalking` — derived
- [ ] 421. `2025-09-20` · answer · `farah-brunache/what-s-one-practical-skill-or-insight-you-ve-learned-from-being-gang-s` — derived
- [ ] 420. `2025-09-20` · answer · `farah-brunache/what-s-the-one-thing-with-gang-stalking-that-helped-you-the-most-when` — derived
- [ ] 419. `2025-09-20` · answer · `farah-brunache/why-do-targeted-individuals-often-report-financial-sabotage-and-what-c` — derived
- [ ] 418. `2025-09-19` · answer-comment · `farah-brunache/are-there-any-targeted-individuals-in-oakland-ca-that-are-currently-be`
- [ ] 417. `2025-09-19` · post-comment · `farah-brunache/hello-i-need-some-support-thru-this-gangstalking-nonsence-anybody-wann`
- [ ] 416. `2025-09-19` · space-submission · `farah-brunache/where-do-gang-stalking-victims-run-for-refuge` — derived
- [ ] 415. `2025-09-18` · answer · `farah-brunache/could-a-targeted-individual-be-also-active-in-gang-stalking` — derived
- [ ] 414. `2025-09-18` · answer · `farah-brunache/how-would-i-feel-better-about-being-gang-stalked` — derived
- [ ] 413. `2025-09-18` · answer · `farah-brunache/i-m-a-targeted-individual-by-gang-stalking-why-won-t-anyone-help-me` — derived
- [ ] 412. `2025-09-18` · post-comment · `farah-brunache/the-trolls-are-preventing-me-from-speaking-truth-here-on-quora-by-cons-2`
- [ ] 411. `2025-09-17` · answer · `farah-brunache/what-are-some-common-misconceptions-about-gang-stalking-and-why-do-peo` — derived
- [ ] 410. `2025-09-17` · post-comment · `farah-brunache/what-is-the-criteria-by-which-targeted-individuals-are-chosen-i-am-a-m-2`
- [ ] 409. `2025-09-17` · answer · `farah-brunache/why-do-many-victims-not-speak-up` — derived
- [ ] 408. `2025-09-16` · answer-comment · `farah-brunache/would-gang-stalkers-set-someone-up-to-go-to-prison-2`

### Record page 10

- [ ] 407. `2025-09-15` · post-comment · `farah-brunache/it-seems-to-me-that-whenever-i-try-to-post-to-a-quora-space-it-doesnt`
- [ ] 406. `2025-09-15` · post-comment · `farah-brunache/the-trolls-are-preventing-me-from-speaking-truth-here-on-quora-by-cons`
- [ ] 405. `2025-09-15` · post-comment · `farah-brunache/trying-to-connect-with-some-aussies-who-have-been-dealing-with-an-extr`
- [ ] 404. `2025-09-15` · post-comment · `farah-brunache/trying-to-connect-with-some-aussies-who-have-been-dealing-with-an-extr-2`
- [ ] 403. `2025-09-13` · answer · `pedigree101/how-do-you-know-if-you-re-being-gang-stalked` — derived
- [ ] 402. `2025-09-13` · space-submission · `pedigree101/what-do-gang-stalkers-say-about-targeted-people-that-isn-t-true-2` — derived
- [ ] 401. `2025-09-12` · post-comment · `pedigree101/ti-survey-question-104-what-type-of-harassment-do-you-experience-and-f-8`
- [ ] 400. `2025-09-11` · answer · `pedigree101/what-other-names-do-gang-stalkers-use-to-describe-themselves-asides-fr-2` — derived
- [ ] 399. `2025-09-11` · answer-comment · `pedigree101/would-a-gang-stalking-program-target-my-child-too`
- [ ] 398. `2025-09-09` · answer · `pedigree101/if-you-are-a-targeted-individual-and-being-gang-stalked-can-you-get-a-2` — derived
- [ ] 397. `2025-09-09` · post-comment · `pedigree101/ti-survey-question-104-what-type-of-harassment-do-you-experience-and-f-7`
- [ ] 396. `2025-09-09` · answer · `pedigree101/what-resources-are-available-to-victims-of-gang-stalking-can-you-trust-2` — derived
- [ ] 395. `2025-09-08` · space-submission · `pedigree101/what-has-helped-you-slow-down-being-gang-stalked-2` — derived
- [ ] 394. `2025-09-08` · answer-comment · `pedigree101/what-steps-have-you-taken-to-stop-being-a-targeted-individual-by-gang`
- [ ] 393. `2025-09-08` · answer-comment · `pedigree101/what-steps-have-you-taken-to-stop-being-a-targeted-individual-by-gang-2`
- [ ] 392. `2025-09-07` · answer · `pedigree101/is-it-possible-i-ve-always-been-stalked-but-just-didn-t-notice-till-6-2` — derived
- [ ] 391. `2025-09-06` · post-comment · `pedigree101/ti-survey-question-104-what-type-of-harassment-do-you-experience-and-f-3`
- [ ] 390. `2025-09-06` · post-comment · `pedigree101/ti-survey-question-104-what-type-of-harassment-do-you-experience-and-f-4`
- [ ] 389. `2025-09-06` · post-comment · `pedigree101/ti-survey-question-104-what-type-of-harassment-do-you-experience-and-f-5`
- [ ] 388. `2025-09-06` · post-comment · `pedigree101/ti-survey-question-104-what-type-of-harassment-do-you-experience-and-f-6`
- [ ] 387. `2025-09-06` · post-comment · `pedigree101/to-get-things-started-list-your-top-three-skills-or-services-you-can-p-3`
- [ ] 386. `2025-09-06` · answer · `pedigree101/when-you-are-gang-stalked-community-stalked-are-there-hidden-cameras-i-2` — derived
- [ ] 385. `2025-09-06` · answer-comment · `pedigree101/when-you-are-gang-stalked-community-stalked-are-there-hidden-cameras-i-3`
- [ ] 384. `2025-09-05` · answer-comment · `pedigree101/does-being-gang-stalked-make-you-feel-ashamed-3`
- [ ] 383. `2025-09-05` · answer · `pedigree101/given-your-belief-that-gang-stalkers-have-taken-over-how-do-you-decide-2` — derived

### Record page 11

- [ ] 382. `2025-09-05` · post-comment · `pedigree101/i-have-very-clear-opinions-about-the-so-called-tis-and-conspiracy-theo`
- [ ] 381. `2025-09-05` · post-comment · `pedigree101/i-no-longer-follow-or-read-posts-from-targeted-individuals-gangstalkin`
- [ ] 380. `2025-09-05` · post-comment · `pedigree101/there-are-many-reasons-i-was-trespassed-and-stopped-from-swimming-its`
- [ ] 379. `2025-09-05` · post-comment · `pedigree101/ti-survey-question-104-what-type-of-harassment-do-you-experience-and-f-2`
- [ ] 378. `2025-09-05` · post-comment · `pedigree101/to-get-things-started-list-your-top-three-skills-or-services-you-can-p-2`
- [ ] 377. `2025-09-04` · post-comment · `pedigree101/i-hope-everyone-is-doing-well-holding-on`
- [ ] 376. `2025-09-04` · answer-comment · `pedigree101/what-do-you-want-people-to-know-about-gang-stalking`
- [ ] 375. `2025-09-03` · answer · `pedigree101/are-people-who-harass-and-gang-stalk-others-mentally-ill-2` — derived
- [ ] 374. `2025-09-03` · answer · `pedigree101/could-these-people-convinced-they-are-christian-warriors-be-stalking-m-2` — derived
- [ ] 373. `2025-09-03` · post-comment · `pedigree101/hello-i-need-some-support-thru-this-gangstalking-nonsence-anybody-wann-2`
- [ ] 372. `2025-09-03` · answer · `pedigree101/how-do-i-drown-out-noise-from-multiple-stalkers-2` — derived
- [ ] 371. `2025-09-03` · answer · `pedigree101/how-do-you-effectively-vet-new-members-for-your-ti-circular-economy-wh-2` — derived
- [ ] 370. `2025-09-03` · question-comment · `pedigree101/i-am-recently-active-on-quora-was-this-question-asked-anonymously` — derived
- [ ] 369. `2025-09-03` · answer · `pedigree101/what-are-the-worst-states-for-gang-stalking-2` — derived
- [ ] 368. `2025-09-03` · answer-comment · `pedigree101/what-is-the-best-advice-for-someone-who-is-currently-being-gang-stalke`
- [ ] 367. `2025-09-03` · answer-comment · `pedigree101/what-is-the-best-advice-for-someone-who-is-currently-being-gang-stalke-2`
- [ ] 366. `2025-09-03` · answer-comment · `pedigree101/whats-the-one-thing-with-gang-stalking-that-helped-you-the-most-when-y`
- [ ] 365. `2025-09-03` · answer · `pedigree101/where-can-i-find-people-to-join-my-gang-stalking-sub-reddit-2` — derived
- [ ] 364. `2025-09-02` · post-comment · `pedigree101/im-a-targeted-individual-why-do-my-handlers-put-these-frequency-in-my`
- [ ] 363. `2025-09-02` · space-submission · `pedigree101/what-s-the-best-life-strategy-to-live-with-being-gang-stalked-with-wor-2` — derived
- [ ] 362. `2025-09-01` · space-post · `pedigree101/any-tis-in-florida-that-would-like-to-meet-up-i-am-in-daytona-now-orla-3`
- [ ] 361. `2025-09-01` · post-comment · `pedigree101/hey-guys-i-am-a-target-individual-it-started-when-i-was-18-now-i-m-22`
- [ ] 360. `2025-09-01` · answer-comment · `pedigree101/how-can-workplace-mobbing-organized-stalking-and-gang-stalking-harassm-2`
- [ ] 359. `2025-09-01` · answer-comment · `pedigree101/what-are-the-signs-if-you-are-being-community-stalked`
- [ ] 358. `2025-09-01` · answer-comment · `pedigree101/what-should-i-do-if-i-know-i-am-being-gangstalked-nobody-will-listen-t`

### Record page 12

- [ ] 357. `2025-09-01` · answer-comment · `pedigree101/what-should-i-do-if-i-know-i-am-being-gangstalked-nobody-will-listen-t-2`
- [ ] 356. `2025-09-01` · answer-comment · `pedigree101/what-should-i-do-if-i-know-i-am-being-gangstalked-nobody-will-listen-t-3`
- [ ] 355. `2025-09-01` · answer-comment · `pedigree101/what-should-i-do-if-i-know-i-am-being-gangstalked-nobody-will-listen-t-4`
- [ ] 354. `2025-08-31` · answer · `farah-brunache/how-many-tis-are-in-pennsylvania-or-the-tri-state-area-3` — derived
- [ ] 353. `2025-08-31` · answer · `pedigree101/how-do-my-creepy-neighbors-who-have-hacked-my-cell-phone-change-what-t-2` — derived
- [ ] 352. `2025-08-31` · answer-comment · `pedigree101/only-problem-is-when-they-workplace-mob-you-out-of-work-make-you-unhou`
- [ ] 351. `2025-08-30` · space-post · `pedigree101/any-tis-in-florida-that-would-like-to-meet-up-i-am-in-daytona-now-orla-2`
- [ ] 350. `2025-08-30` · answer · `pedigree101/can-electronic-harassment-send-specific-dreams-while-you-sleep-2` — derived
- [ ] 349. `2025-08-30` · space-submission · `pedigree101/how-involved-do-you-think-churches-are-in-making-people-targeted-indiv` — derived
- [ ] 348. `2025-08-30` · answer · `pedigree101/i-know-this-sounds-far-fetched-but-do-gang-stalkers-have-devices-that-2` — derived
- [ ] 347. `2025-08-29` · space-submission · `pedigree101/any-tis-in-florida-that-would-like-to-meet-up-i-am-in-daytona-beach-no` — no address
- [ ] 346. `2025-08-29` · space-submission · `pedigree101/any-tis-in-florida-that-would-like-to-meet-up-i-am-in-daytona-beach-no-2` — no address
- [ ] 345. `2025-08-29` · space-submission · `pedigree101/any-tis-in-florida-that-would-like-to-meet-up-i-am-in-daytona-beach-no-3` — no address
- [ ] 344. `2025-08-29` · space-submission · `pedigree101/any-tis-in-florida-that-would-like-to-meet-up-i-am-in-daytona-beach-no-4` — no address
- [ ] 343. `2025-08-29` · space-submission · `pedigree101/any-tis-in-florida-that-would-like-to-meet-up-i-am-in-daytona-beach-no-5` — no address
- [ ] 342. `2025-08-29` · space-submission · `pedigree101/any-tis-in-florida-that-would-like-to-meet-up-i-am-in-daytona-beach-no-6` — no address
- [ ] 341. `2025-08-29` · space-post · `pedigree101/any-tis-in-florida-that-would-like-to-meet-up-i-am-in-daytona-now-orla`
- [ ] 340. `2025-08-29` · answer · `pedigree101/are-gangstalkers-protected-by-real-investigators-2` — derived
- [ ] 339. `2025-08-29` · answer-comment · `pedigree101/how-are-gang-stalkers-watching-me-live-in-real-time-in-my-apartment`
- [ ] 338. `2025-08-29` · post-comment · `pedigree101/how-can-a-19-year-old-boy-in-the-sense-of-targeted-individual-ensure-p-3`
- [ ] 337. `2025-08-29` · post-comment · `pedigree101/how-can-a-19-year-old-boy-in-the-sense-of-targeted-individual-ensure-p-4`
- [ ] 336. `2025-08-29` · answer-comment · `pedigree101/how-do-you-feel-about-the-whole-gang-stalking-thing`
- [ ] 335. `2025-08-28` · post-comment · `pedigree101/how-can-a-19-year-old-boy-in-the-sense-of-targeted-individual-ensure-p-2`
- [ ] 334. `2025-08-27` · post-comment · `farah-brunache/do-you-agree-with-kayla-davis-comment-i-agree-with-it-houses-are-easy-2`
- [ ] 333. `2025-08-27` · post-comment · `farah-brunache/do-you-agree-with-kayla-davis-comment-i-agree-with-it-houses-are-easy-3`

### Record page 13

- [ ] 332. `2025-08-27` · space-submission · `farah-brunache/how-many-ti-s-are-in-western-australia` — derived
- [ ] 331. `2025-08-27` · question-comment · `farah-brunache/i-do-not-know-but-check-out-the-ti-map-original-postmatthew-cappadocia` — derived
- [ ] 330. `2025-08-27` · post-comment · `pedigree101/cosmic-warrior-please-forgive-me-could-you-explain-a-circular-economy`
- [ ] 329. `2025-08-27` · post-comment · `pedigree101/i-dont-know-whether-i-am-afraid-to-talk-about-it-or-if-i-am-just-sick`
- [ ] 328. `2025-08-27` · post-comment · `pedigree101/thats-why-you-must-never-stop-reporting-what-they-do-to-you-to-the-con`
- [ ] 327. `2025-08-26` · space-submission · `farah-brunache/do-other-ti-s-believe-that-once-their-numbers-are-so-large-that-the-us` — derived
- [ ] 326. `2025-08-26` · post-comment · `farah-brunache/do-you-agree-with-kayla-davis-comment-i-agree-with-it-houses-are-easy`
- [ ] 325. `2025-08-26` · answer-comment · `farah-brunache/have-any-gang-stalkers-been-caught-and-convicted`
- [ ] 324. `2025-08-26` · post-comment · `pedigree101/gang-stalking-and-the-us-government-ive-been-tortured-for-7-yrs-it-con`
- [ ] 323. `2025-08-25` · answer-comment · `farah-brunache/how-many-tis-are-in-pennsylvania-or-the-tri-state-area-2`
- [ ] 322. `2025-08-25` · space-submission · `farah-brunache/if-you-are-gangstalked-what-is-your-city` — derived
- [ ] 321. `2025-08-25` · post-comment · `farah-brunache/im-getting-so-fuckin-tired-of-these-idiots-taking-my-stuff-this-week-i`
- [ ] 320. `2025-08-25` · answer · `pedigree101/how-do-you-communicate-to-tormentors-that-the-real-underlying-reason-t-2` — derived
- [ ] 319. `2025-08-25` · post-comment · `pedigree101/https-www-quora-com-how-long-is-a-targeted-individual-gangstalked-does-3`
- [ ] 318. `2025-08-25` · space-submission · `pedigree101/what-do-i-do-as-a-black-a-senior-disabled-and-targeted-by-peace-office` — derived
- [ ] 317. `2025-08-25` · answer · `pedigree101/what-do-i-do-to-make-it-easier-as-a-ti-i-m-evicted-from-my-home-have-h-2` — derived
- [ ] 316. `2025-08-25` · answer-draft · `pedigree101/what-do-you-do-when-people-in-your-community-are-led-to-believe-they-m` — derived
- [ ] 315. `2025-08-24` · space-submission · `pedigree101/a-youtuber-is-doxxing-me-posting-my-picture-and-telling-people-to-wish` — derived
- [ ] 314. `2025-08-24` · answer · `pedigree101/have-you-ever-felt-like-life-is-rigged-against-you-watched-blocked-or-2` — derived
- [ ] 313. `2025-08-24` · answer-comment · `pedigree101/how-are-targeted-individuals-chosen-and-why`
- [ ] 312. `2025-08-24` · answer-comment · `pedigree101/how-can-workplace-mobbing-organized-stalking-and-gang-stalking-harassm`
- [ ] 311. `2025-08-24` · space-submission · `pedigree101/if-your-friends-or-family-are-gang-stalkers-and-when-confronted-they-w` — derived
- [ ] 310. `2025-08-24` · answer-comment · `pedigree101/is-it-possible-to-survive-the-final-stage-of-gang-stalking`
- [ ] 309. `2025-08-23` · answer · `pedigree101/after-14-years-homeless-and-3-targeted-dovother-targeted-individuals-a-2` — derived
- [ ] 308. `2025-08-23` · answer · `pedigree101/why-would-gang-stalkers-let-you-know-where-they-live-and-even-invite-y-2` — derived

### Record page 14

- [ ] 307. `2025-08-22` · answer · `pedigree101/were-gang-stalkers-ever-stalked-themselves-2` — derived
- [ ] 306. `2025-08-21` · post-comment · `pedigree101/may-i-ask-where-do-yoh-know-these-people-from-https-www-quora-com-prof`
- [ ] 305. `2025-08-21` · answer-comment · `pedigree101/what-are-the-consequences-for-gang-stalkers-if-they-tell-their-target-2`
- [ ] 304. `2025-08-21` · answer-comment · `pedigree101/what-are-the-consequences-for-gang-stalkers-if-they-tell-their-target-3`
- [ ] 303. `2025-08-21` · answer-comment · `pedigree101/what-techniques-does-gang-stalking-use-on-tis`
- [ ] 302. `2025-08-20` · answer-comment · `pedigree101/can-gang-stalkers-keep-you-from-getting-a-job-2`
- [ ] 301. `2025-08-20` · post-comment · `pedigree101/haha-black-people-think-its-cool-and-fun-fucking-with-someone-just-you`
- [ ] 300. `2025-08-20` · answer-comment · `pedigree101/how-do-i-get-a-job-as-a-gang-stalker-i-see-thousands-of-people-claimin-2`
- [ ] 299. `2025-08-20` · answer-comment · `pedigree101/this-whole-gang-stalking-thing-has-come-on-now-it-has-to-end-as-i-know`
- [ ] 298. `2025-08-20` · answer · `pedigree101/who-is-being-gangstalked-in-chico-ca-2` — derived
- [ ] 297. `2025-08-19` · answer · `pedigree101/how-do-gang-stalkers-recruit-2` — derived
- [ ] 296. `2025-08-19` · post-comment · `pedigree101/im-a-ti-and-and-im-temporarily-staying-with-my-gs-uncle-anf-his-gs-roo-3`
- [ ] 295. `2025-08-19` · answer · `pedigree101/lots-of-people-on-here-recommend-praying-how-can-there-be-a-god-with-a-2` — derived
- [ ] 294. `2025-08-18` · answer · `pedigree101/do-gang-stalkers-steal-2` — derived
- [ ] 293. `2025-08-18` · answer · `pedigree101/has-anyone-had-a-real-attempt-at-their-life-by-gang-stalkers-2` — derived
- [ ] 292. `2025-08-18` · answer · `pedigree101/how-can-i-distinguish-between-real-threats-and-feelings-of-being-targe-2` — derived
- [ ] 291. `2025-08-18` · space-submission · `pedigree101/what-words-of-encouragement-would-you-give-to-someone-who-has-found-ou` — derived
- [ ] 290. `2025-08-18` · space-submission · `pedigree101/who-believes-this-app-is-just-fishing-for-the-awake-targeted-individua` — derived
- [ ] 289. `2025-08-16` · post-comment · `pedigree101/https-www-quora-com-how-long-is-a-targeted-individual-gangstalked-does-2`
- [ ] 288. `2025-08-16` · answer · `pedigree101/i-ve-been-gangstalked-since-2016-today-i-no-going-to-keep-fighting-any-2` — derived
- [ ] 287. `2025-08-16` · answer · `pedigree101/is-there-a-good-form-of-gang-stalking-2` — derived
- [ ] 286. `2025-08-15` · answer-comment · `pedigree101/are-the-families-of-targeted-individuals-forced-by-gang-stalkers-to-ha`
- [ ] 285. `2025-08-15` · answer-comment · `pedigree101/does-being-gang-stalked-make-you-feel-ashamed-2`
- [ ] 284. `2025-08-15` · post-comment · `pedigree101/https-www-quora-com-how-long-is-a-targeted-individual-gangstalked-does`
- [ ] 283. `2025-08-15` · answer-comment · `pedigree101/if-youre-a-gang-stalker-can-you-get-away-with-murder`

### Record page 15

- [ ] 282. `2025-08-15` · answer · `pedigree101/what-psychological-profiles-do-gang-stalking-handlers-target-2` — derived
- [ ] 281. `2025-08-14` · post-comment · `pedigree101/quora-will-not-allow-me-to-post-maps-4`
- [ ] 280. `2025-08-14` · answer · `pedigree101/what-are-some-common-misconceptions-about-gang-stalking-and-why-do-peo-2` — derived
- [ ] 279. `2025-08-13` · answer · `pedigree101/am-i-getting-gangstalked-why-do-i-hear-a-motor-passing-by-whenever-i-f-2` — derived
- [ ] 278. `2025-08-13` · answer-comment · `pedigree101/how-can-we-prevent-gang-stalking`
- [ ] 277. `2025-08-13` · answer-comment · `pedigree101/how-should-one-handle-a-situation-where-their-neighbors-are-involved-i`
- [ ] 276. `2025-08-13` · answer · `pedigree101/what-measures-can-the-government-take-to-prevent-gang-stalking-2` — derived
- [ ] 275. `2025-08-13` · answer · `pedigree101/what-s-one-practical-skill-or-insight-you-ve-learned-from-being-gang-s-2` — derived
- [ ] 274. `2025-08-12` · answer · `pedigree101/how-can-we-get-the-most-out-of-our-lives-being-a-gang-stalking-victim-2` — derived
- [ ] 273. `2025-08-12` · post-comment · `pedigree101/quora-will-not-allow-me-to-post-maps-3`
- [ ] 272. `2025-08-12` · answer · `pedigree101/what-s-the-one-thing-with-gang-stalking-that-helped-you-the-most-when-2` — derived
- [ ] 271. `2025-08-11` · space-post · `pedigree101/a-third-initiative-has-been-added-today-check-the-updated-post-https-t`
- [ ] 270. `2025-08-11` · answer-comment · `pedigree101/is-organized-stalking-a-real-government-program-that-targets-individua`
- [ ] 269. `2025-08-11` · answer-comment · `pedigree101/is-organized-stalking-a-real-government-program-that-targets-individua-2`
- [ ] 268. `2025-08-11` · post-comment · `pedigree101/quora-will-not-allow-me-to-post-maps-2`
- [ ] 267. `2025-08-11` · answer-comment · `pedigree101/what-are-the-effects-of-gang-stalking-on-the-victim`
- [ ] 266. `2025-08-11` · answer-comment · `pedigree101/what-is-the-percentage-of-people-who-have-been-targeted-for-gang-stalk`
- [ ] 265. `2025-08-10` · answer-comment · `pedigree101/how-can-someone-prove-they-are-being-targeted-by-gang-stalking-or-some`
- [ ] 264. `2025-08-10` · answer · `pedigree101/how-do-you-maintain-regular-employment-while-experiencing-gang-stalkin-2` — derived
- [ ] 263. `2025-08-10` · answer-comment · `pedigree101/what-steps-can-a-victim-of-gang-stalking-take-if-the-police-refuse-to`
- [ ] 262. `2025-08-09` · answer · `pedigree101/how-can-you-tell-if-someone-involved-in-gang-stalking-is-doing-it-out-2` — derived
- [ ] 261. `2025-08-09` · post-comment · `pedigree101/so-i-finally-get-it-the-link-between-my-indian-middle-eastern-stalkers-2`
- [ ] 260. `2025-08-09` · answer-comment · `pedigree101/what-are-the-most-surprising-reasons-people-have-given-for-participati-2`
- [ ] 259. `2025-08-09` · answer-comment · `pedigree101/what-are-the-most-surprising-reasons-people-have-given-for-participati-3`
- [ ] 258. `2025-08-09` · answer-comment · `pedigree101/what-do-you-do-when-you-are-being-stalked-but-you-cant-prove-it`

### Record page 16

- [ ] 257. `2025-08-09` · answer-comment · `pedigree101/what-is-the-best-way-to-deal-with-gang-stalking-and-or-mobbing-without`
- [ ] 256. `2025-08-08` · post-comment · `pedigree101/so-i-finally-get-it-the-link-between-my-indian-middle-eastern-stalkers`
- [ ] 255. `2025-08-07` · answer-comment · `pedigree101/how-do-gang-stalkers-become-gang-stalkers`
- [ ] 254. `2025-08-07` · post-comment · `pedigree101/im-a-ti-and-and-im-temporarily-staying-with-my-gs-uncle-anf-his-gs-roo`
- [ ] 253. `2025-08-07` · post-comment · `pedigree101/im-a-ti-and-and-im-temporarily-staying-with-my-gs-uncle-anf-his-gs-roo-2`
- [ ] 252. `2025-08-07` · post-comment · `pedigree101/question-102-results-where-have-you-experienced-stalking-and-harassmen-3`
- [ ] 251. `2025-08-07` · post-comment · `pedigree101/quora-will-not-allow-me-to-post-maps`
- [ ] 250. `2025-08-07` · post-comment · `pedigree101/where-have-you-experienced-stalking-and-harassment-city-state-country-3`
- [ ] 249. `2025-08-06` · answer · `pedigree101/how-would-i-feel-better-about-being-gang-stalked-2` — derived
- [ ] 248. `2025-08-06` · post-comment · `pedigree101/i-am-looking-to-purchase-a-house-with-ti-s-we-will-come-together-and-u`
- [ ] 247. `2025-08-06` · post-comment · `pedigree101/i-am-looking-to-purchase-a-house-with-ti-s-we-will-come-together-and-u-2`
- [ ] 246. `2025-08-06` · post-comment · `pedigree101/i-am-looking-to-purchase-a-house-with-ti-s-we-will-come-together-and-u-3`
- [ ] 245. `2025-08-06` · answer · `pedigree101/i-m-a-targeted-individual-by-gang-stalking-why-won-t-anyone-help-me-2` — derived
- [ ] 244. `2025-08-06` · credential · `pedigree101/profile-credential`
- [ ] 243. `2025-08-06` · post-comment · `pedigree101/to-get-things-started-list-your-top-three-skills-or-services-you-can-p`
- [ ] 242. `2025-08-05` · post-comment · `pedigree101/i-invited-someone-to-this-new-space-i-created-and-they-interpreted-it`
- [ ] 241. `2025-08-05` · post-comment · `pedigree101/i-invited-someone-to-this-new-space-i-created-and-they-interpreted-it-2`
- [ ] 240. `2025-08-04` · answer-comment · `farah-brunache/any-gang-stalking-experiences-in-texas-is-texas-a-good-place-to-reloca-2`
- [ ] 239. `2025-08-04` · answer-comment · `farah-brunache/any-gang-stalking-experiences-in-texas-is-texas-a-good-place-to-reloca-3`
- [ ] 238. `2025-08-04` · answer-comment · `farah-brunache/can-you-describe-some-of-the-games-perps-play-with-you-if-you-are-tis`
- [ ] 237. `2025-08-04` · answer-comment · `farah-brunache/can-you-describe-some-of-the-games-perps-play-with-you-if-you-are-tis-2`
- [ ] 236. `2025-08-04` · answer-comment · `farah-brunache/for-tis-how-did-you-find-out-what-exact-lies-were-being-said-to-get-yo-2`
- [ ] 235. `2025-08-04` · post-comment · `farah-brunache/hello-how-do-i-get-in-touch-https-tiskillsnetwork-quora-com-welcome-to`
- [ ] 234. `2025-08-04` · answer-comment · `farah-brunache/is-gang-stalking-scary`
- [ ] 233. `2025-08-04` · answer-comment · `farah-brunache/is-gang-stalking-scary-2`

### Record page 17

- [ ] 232. `2025-08-04` · answer-comment · `farah-brunache/is-gang-stalking-scary-3`
- [ ] 231. `2025-08-04` · answer-comment · `farah-brunache/is-gang-stalking-scary-4`
- [ ] 230. `2025-08-04` · answer-comment · `farah-brunache/is-gang-stalking-scary-5`
- [ ] 229. `2025-08-04` · answer-comment · `farah-brunache/is-gang-stalking-scary-6`
- [ ] 228. `2025-08-04` · answer-comment · `farah-brunache/is-gang-stalking-scary-7`
- [ ] 227. `2025-08-04` · answer-comment · `farah-brunache/is-gang-stalking-scary-8`
- [ ] 226. `2025-08-04` · answer-comment · `farah-brunache/is-gang-stalking-scary-9`
- [ ] 225. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-10`
- [ ] 224. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-11`
- [ ] 223. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-12`
- [ ] 222. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-13`
- [ ] 221. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-2`
- [ ] 220. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-3`
- [ ] 219. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-4`
- [ ] 218. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-5`
- [ ] 217. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-6`
- [ ] 216. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-7`
- [ ] 215. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-8`
- [ ] 214. `2025-08-04` · answer-comment · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro-9`
- [ ] 213. `2025-08-03` · post-comment · `farah-brunache/another-fucking-observation-ive-noted-and-have-been-invited-to-join-fo`
- [ ] 212. `2025-08-03` · answer-comment · `farah-brunache/are-there-any-apps-that-can-help-identify-people-with-bad-reputations`
- [ ] 211. `2025-08-03` · post-comment · `farah-brunache/brothers-and-sisters-learn-to-use-this-space-to-articulate-how-you-fee`
- [ ] 210. `2025-08-03` · answer-comment · `farah-brunache/do-gang-stalkers-want-to-fight-you-they-try-to-be-intimidating-it-s-si`
- [ ] 209. `2025-08-03` · question · `farah-brunache/do-you-want-to-join-a-network-to-list-what-each-ti-is-skilled-in-i-am` — derived
- [ ] 208. `2025-08-03` · answer-comment · `farah-brunache/has-anyone-tried-medication-to-help-with-the-stress-of-gang-stalking-d-2`

### Record page 18

- [ ] 207. `2025-08-03` · space-submission · `farah-brunache/how-can-a-19-year-old-boy-in-the-sense-of-targeted-individual-ensure-p` — derived
- [ ] 206. `2025-08-03` · answer-comment · `farah-brunache/how-can-i-stop-24-7-v2k-electronic-harassment`
- [ ] 205. `2025-08-03` · answer-comment · `farah-brunache/how-is-it-possible-that-all-over-the-world-there-are-ti-targeted-indiv`
- [ ] 204. `2025-08-03` · space-submission · `farah-brunache/how-many-tis-are-in-pennsylvania-or-the-tri-state-area` — derived
- [ ] 203. `2025-08-03` · post-comment · `farah-brunache/https-electronicharassment-quora-com-call-a-perp-a-perp-and-they-cry-l`
- [ ] 202. `2025-08-03` · post-comment · `farah-brunache/https-www-quora-com-can-i-turn-a-gang-stalker-into-a-friend-and-get-th`
- [ ] 201. `2025-08-03` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-p-2`
- [ ] 200. `2025-08-03` · post-comment · `farah-brunache/https-www-quora-com-what-is-gang-stalking-is-it-real-im-asking-because`
- [ ] 199. `2025-08-03` · post-comment · `farah-brunache/https-www-quora-com-why-are-so-many-senior-citizens-involved-in-organi-3`
- [ ] 198. `2025-08-03` · post-comment · `farah-brunache/https-www-quora-com-you-have-a-lot-of-helpful-information-but-what-hop`
- [ ] 197. `2025-08-03` · post-comment · `farah-brunache/https-www-quora-com-you-have-a-lot-of-helpful-information-but-what-hop-2`
- [ ] 196. `2025-08-03` · post-comment · `farah-brunache/idea-bit-bored-today-so-tried-chatgpt-instead-of-us-looking-for-the-an`
- [ ] 195. `2025-08-03` · answer-comment · `farah-brunache/is-there-any-place-in-san-diego-were-there-are-groups-or-resources-for`
- [ ] 194. `2025-08-03` · answer-comment · `farah-brunache/please-joinhttps-tiskillsnetwork-quora-com`
- [ ] 193. `2025-08-03` · post-comment · `farah-brunache/take-the-pain-we-have-been-hostage-and-captive-to-these-individuals-fo`
- [ ] 192. `2025-08-03` · post-comment · `farah-brunache/to-all-my-true-ti-friends-i-am-experiencing-severe-trembling-under-my`
- [ ] 191. `2025-08-03` · post-comment · `farah-brunache/to-all-my-true-ti-friends-i-am-experiencing-severe-trembling-under-my-2`
- [ ] 190. `2025-08-03` · post-comment · `farah-brunache/weird-things-are-happening-some-posts-are-up-some-have-been-removed-so-3`
- [ ] 189. `2025-08-03` · post-comment · `farah-brunache/weird-things-are-happening-some-posts-are-up-some-have-been-removed-so-4`
- [ ] 188. `2025-08-03` · post-comment · `farah-brunache/weird-things-are-happening-some-posts-are-up-some-have-been-removed-so-5`
- [ ] 187. `2025-08-03` · answer-comment · `farah-brunache/what-are-gang-stalkers-why-are-they-following-you-and-showing-up-where`
- [ ] 186. `2025-08-03` · answer-comment · `farah-brunache/what-are-gang-stalkers-why-are-they-following-you-and-showing-up-where-2`
- [ ] 185. `2025-08-03` · answer-comment · `farah-brunache/what-are-gang-stalkers-why-are-they-following-you-and-showing-up-where-3`
- [ ] 184. `2025-08-03` · answer-comment · `farah-brunache/what-are-some-activist-organizations-against-gang-stalking-if-one-want`
- [ ] 183. `2025-08-03` · answer-comment · `farah-brunache/what-do-your-gang-stalkers-say-to-you-through-your-v2k`

### Record page 19

- [ ] 182. `2025-08-03` · answer-comment · `farah-brunache/what-exactly-do-gang-stalkers-want-from-me`
- [ ] 181. `2025-08-03` · answer-comment · `farah-brunache/what-exactly-do-gang-stalkers-want-from-me-2`
- [ ] 180. `2025-08-03` · answer-comment · `farah-brunache/what-exactly-do-gang-stalkers-want-from-me-3`
- [ ] 179. `2025-08-03` · answer-comment · `farah-brunache/what-exactly-do-gang-stalkers-want-from-me-4`
- [ ] 178. `2025-08-03` · answer-comment · `farah-brunache/what-exactly-do-gang-stalkers-want-from-me-5`
- [ ] 177. `2025-08-03` · answer-comment · `farah-brunache/what-exactly-do-gang-stalkers-want-from-me-6`
- [ ] 176. `2025-08-03` · answer-comment · `farah-brunache/what-is-gang-stalking-3`
- [ ] 175. `2025-08-03` · answer-comment · `farah-brunache/what-is-gang-stalking-4`
- [ ] 174. `2025-08-03` · answer-comment · `farah-brunache/what-is-gang-stalking-5`
- [ ] 173. `2025-08-03` · answer-comment · `farah-brunache/when-did-you-find-out-you-are-a-targeted-individual`
- [ ] 172. `2025-08-03` · space-submission · `farah-brunache/which-support-organizations-specialize-in-helping-targeted-individuals` — derived
- [ ] 171. `2025-08-03` · answer-comment · `farah-brunache/why-are-targeted-individuals-treated-so-badly`
- [ ] 170. `2025-08-03` · answer-comment · `farah-brunache/why-are-targeted-individuals-treated-so-badly-2`
- [ ] 169. `2025-08-03` · answer-comment · `farah-brunache/why-does-it-take-so-many-years-to-get-a-targeted-individual-to-admit-t`
- [ ] 168. `2025-08-03` · answer-comment · `farah-brunache/why-does-it-take-so-many-years-to-get-a-targeted-individual-to-admit-t-2`
- [ ] 167. `2025-08-03` · answer-comment · `farah-brunache/why-does-it-take-so-many-years-to-get-a-targeted-individual-to-admit-t-3`
- [ ] 166. `2025-08-03` · answer-comment · `farah-brunache/why-does-it-take-so-many-years-to-get-a-targeted-individual-to-admit-t-4`
- [ ] 165. `2025-08-03` · answer-comment · `farah-brunache/why-does-it-take-so-many-years-to-get-a-targeted-individual-to-admit-t-5`
- [ ] 164. `2025-08-03` · answer-comment · `farah-brunache/why-dont-targeted-individuals-just-admit-the-crimes-they-committed-and`
- [ ] 163. `2025-08-03` · answer-comment · `farah-brunache/why-dont-targeted-individuals-just-admit-the-crimes-they-committed-and-2`
- [ ] 162. `2025-08-03` · answer-comment · `farah-brunache/why-dont-targeted-individuals-just-admit-the-crimes-they-committed-and-3`
- [ ] 161. `2025-08-03` · answer-comment · `farah-brunache/why-dont-targeted-individuals-just-admit-the-crimes-they-committed-and-4`
- [ ] 160. `2025-08-03` · answer-comment · `farah-brunache/why-dont-targeted-individuals-just-admit-the-crimes-they-committed-and-5`
- [ ] 159. `2025-08-03` · question · `farah-brunache/will-you-consider-joining-me-https-tiskillsnetwork-quora-com` — derived
- [ ] 158. `2025-08-03` · question · `farah-brunache/will-you-consider-joining-me-https-tiskillsnetwork-quora-com-2` — derived

### Record page 20

- [ ] 157. `2025-08-02` · answer-comment · `farah-brunache/any-gang-stalking-experiences-in-texas-is-texas-a-good-place-to-reloca`
- [ ] 156. `2025-08-02` · post-comment · `farah-brunache/https-targetedindividualssurvey-quora-com-i-was-banned-again-for-14-da`
- [ ] 155. `2025-08-02` · post-comment · `farah-brunache/i-am-able-to-post-but-am-being-prevented-from-adding-links-and-am-unab`
- [ ] 154. `2025-08-02` · post-comment · `farah-brunache/i-was-banned-again-for-14-days-not-by-stalkers-but-rather-they-are-get`
- [ ] 153. `2025-08-02` · post-comment · `farah-brunache/i-was-banned-again-for-14-days-not-by-stalkers-but-rather-they-are-get-2`
- [ ] 152. `2025-08-02` · post-comment · `farah-brunache/question-102-results-where-have-you-experienced-stalking-and-harassmen`
- [ ] 151. `2025-08-02` · post-comment · `farah-brunache/question-102-results-where-have-you-experienced-stalking-and-harassmen-2`
- [ ] 150. `2025-08-02` · post-comment · `farah-brunache/weird-things-are-happening-some-posts-are-up-some-have-been-removed-so`
- [ ] 149. `2025-08-02` · post-comment · `farah-brunache/weird-things-are-happening-some-posts-are-up-some-have-been-removed-so-2`
- [ ] 148. `2025-08-01` · answer-comment · `farah-brunache/polling-question-which-police-depts-in-your-hometown-are-complicit-in-2`
- [ ] 147. `2025-07-30` · space-submission · `farah-brunache/for-tis-how-did-you-find-out-what-exact-lies-were-being-said-to-get-yo` — derived
- [ ] 146. `2025-07-28` · space-submission · `farah-brunache/do-you-think-gang-stalkers-try-to-hurt-your-friends-that-won-t-listen` — derived
- [ ] 145. `2025-07-28` · post-comment · `farah-brunache/where-have-you-experienced-stalking-and-harassment-city-state-country-2`
- [ ] 144. `2025-07-28` · space-submission · `farah-brunache/why-do-perps-always-follow-me-to-the-dumpster-at-my-apartment-complex` — derived
- [ ] 143. `2025-07-26` · space-submission · `farah-brunache/has-anyone-met-with-another-ti-and-noticed-the-harassing` — derived
- [ ] 142. `2025-07-26` · post-comment · `farah-brunache/where-have-you-experienced-stalking-and-harassment-city-state-country`
- [ ] 141. `2025-07-25` · answer · `farah-brunache/is-there-a-legitimate-reason-an-app-can-t-give-you-the-option-to-add-c` — derived
- [ ] 140. `2025-07-15` · answer · `farah-brunache/has-anyone-else-experienced-them-disabling-fundraisers-you-make` — derived
- [ ] 139. `2025-07-13` · post-comment · `farah-brunache/actually-im-a-criminal-and-im-being-targeted-i-dont-think-being-a-crim`
- [ ] 138. `2025-07-13` · answer · `farah-brunache/assuming-gangstalking-was-real-what-could-happen-to-an-individual-who` — derived
- [ ] 137. `2025-07-13` · post-comment · `farah-brunache/ti-survey-question-101-how-old-are-you-welcome-to-my-new-approach-at-f`
- [ ] 136. `2025-07-13` · post-comment · `farah-brunache/ti-survey-question-101-how-old-are-you-welcome-to-my-new-approach-at-f-2`
- [ ] 135. `2025-07-11` · answer · `farah-brunache/has-gang-stalking-made-you-homeless` — derived
- [ ] 134. `2025-07-11` · answer · `farah-brunache/is-most-of-our-homeless-problem-due-to-gang-stalking-community-harassm` — derived
- [ ] 133. `2025-07-11` · space-submission · `farah-brunache/polling-question-which-police-depts-in-your-hometown-are-complicit-in` — derived

### Record page 21

- [ ] 132. `2025-07-09` · answer-comment · `farah-brunache/has-anyone-tried-medication-to-help-with-the-stress-of-gang-stalking-d`
- [ ] 131. `2025-07-09` · post-comment · `farah-brunache/the-comment-by-dario-is-propaganda-for-a-false-hope-solution-called-ed-2`
- [ ] 130. `2025-07-08` · space-submission · `farah-brunache/has-anyone-ever-gotten-their-family-back-after-the-character-assassina` — derived
- [ ] 129. `2025-07-08` · space-submission · `farah-brunache/how-do-the-people-following-me-as-a-targeted-individual-read-my-mind` — derived
- [ ] 128. `2025-07-08` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-p`
- [ ] 127. `2025-07-08` · answer-comment · `farah-brunache/what-the-fk-is-a-ti`
- [ ] 126. `2025-07-07` · post-comment · `farah-brunache/how-do-you-get-gang-stalkers-to-stop-following-you-across-states-they-7`
- [ ] 125. `2025-07-07` · post-comment · `farah-brunache/the-comment-by-dario-is-propaganda-for-a-false-hope-solution-called-ed`
- [ ] 124. `2025-07-04` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-ho-3`
- [ ] 123. `2025-07-04` · post-comment · `farah-brunache/ive-had-my-ups-and-downs-but-gangstalkers-are-not-bad-people-itll-hone`
- [ ] 122. `2025-07-03` · post-comment · `farah-brunache/how-do-you-get-gang-stalkers-to-stop-following-you-across-states-they-6`
- [ ] 121. `2025-07-03` · post-comment · `farah-brunache/i-really-need-help-my-brother-has-schizoaffective-disorder-severe-he-s`
- [ ] 120. `2025-07-02` · answer · `farah-brunache/has-anyone-had-the-gang-stalkers-want-to-be-your-friend` — derived
- [ ] 119. `2025-07-02` · answer · `farah-brunache/has-anyone-noticed-disappearing-post-i-ve-seen-a-few-people-talk-about` — derived
- [ ] 118. `2025-07-02` · post-comment · `farah-brunache/i-was-thinking-this-evening-i-have-not-met-one-other-person-who-is-exp`
- [ ] 117. `2025-07-02` · answer · `farah-brunache/those-that-have-auditory-harassment-have-you-tried-recording-those-voi` — derived
- [ ] 116. `2025-06-30` · post-comment · `farah-brunache/how-do-you-get-gang-stalkers-to-stop-following-you-across-states-they`
- [ ] 115. `2025-06-30` · post-comment · `farah-brunache/how-do-you-get-gang-stalkers-to-stop-following-you-across-states-they-2`
- [ ] 114. `2025-06-30` · post-comment · `farah-brunache/how-do-you-get-gang-stalkers-to-stop-following-you-across-states-they-3`
- [ ] 113. `2025-06-30` · post-comment · `farah-brunache/how-do-you-get-gang-stalkers-to-stop-following-you-across-states-they-4`
- [ ] 112. `2025-06-30` · post-comment · `farah-brunache/how-do-you-get-gang-stalkers-to-stop-following-you-across-states-they-5`
- [ ] 111. `2025-06-30` · post-comment · `farah-brunache/this-is-the-type-of-gangstalker-you-often-encounter-on-the-street-acco`
- [ ] 110. `2025-06-29` · space-submission · `farah-brunache/have-any-other-targeted-individuals-wondered-if-they-re-targeted-for-s` — derived
- [ ] 109. `2025-06-29` · space-submission · `farah-brunache/this-whole-gang-stalking-thing-has-come-on-now` — derived
- [ ] 108. `2025-06-27` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-ho-2`

### Record page 22

- [ ] 107. `2025-06-26` · post-comment · `farah-brunache/https-www-quora-com-why-would-a-paranoid-gangstalking-supervisor-creat`
- [ ] 106. `2025-06-26` · post-comment · `farah-brunache/what-is-the-criteria-by-which-targeted-individuals-are-chosen-i-am-a-m`
- [ ] 105. `2025-06-25` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-ho`
- [ ] 104. `2025-06-16` · answer-comment · `farah-brunache/you-have-a-lot-of-helpful-information-but-what-hope-do-you-offer-to-ta`
- [ ] 103. `2025-06-11` · post-comment · `farah-brunache/ive-been-doing-some-research-into-voice-2-skull-i-just-read-an-article`
- [ ] 102. `2025-06-08` · answer-comment · `farah-brunache/do-targeted-individuals-ever-become-gang-stalkers-6`
- [ ] 101. `2025-06-08` · answer-comment · `farah-brunache/how-do-you-find-housing-as-a-target`
- [ ] 100. `2025-06-06` · answer-comment · `farah-brunache/do-targeted-individuals-ever-become-gang-stalkers-3`
- [ ] 99. `2025-06-06` · answer-comment · `farah-brunache/do-targeted-individuals-ever-become-gang-stalkers-4`
- [ ] 98. `2025-06-06` · answer-comment · `farah-brunache/do-targeted-individuals-ever-become-gang-stalkers-5`
- [ ] 97. `2025-06-06` · answer · `farah-brunache/what-are-the-consequences-for-someone-who-does-not-comply-with-the-pro` — derived
- [ ] 96. `2025-06-06` · answer · `farah-brunache/why-are-they-so-numerous-i-live-in-oceanside-not-too-far-from-where-yo` — derived
- [ ] 95. `2025-06-05` · answer-comment · `farah-brunache/do-targeted-individuals-ever-become-gang-stalkers-2`
- [ ] 94. `2025-06-04` · answer-comment · `farah-brunache/do-targeted-individuals-ever-become-gang-stalkers`
- [ ] 93. `2025-06-04` · question · `farah-brunache/do-you-get-gang-stalked-by-musicians-influencers-celebrities` — derived
- [ ] 92. `2025-06-04` · answer-comment · `farah-brunache/has-anyone-ever-experienced-gang-stalking`
- [ ] 91. `2025-06-04` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-ni`
- [ ] 90. `2025-06-04` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-ni-2`
- [ ] 89. `2025-06-04` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-th-2`
- [ ] 88. `2025-06-04` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-wh-2`
- [ ] 87. `2025-06-04` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-wh-3`
- [ ] 86. `2025-06-04` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-wh-4`
- [ ] 85. `2025-06-04` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-wh-5`
- [ ] 84. `2025-06-01` · answer-comment · `farah-brunache/are-business-owners-aware-that-gangstalkers-are-harassing-their-custom-2`
- [ ] 83. `2025-05-26` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-so`

### Record page 23

- [ ] 82. `2025-05-26` · question · `farah-brunache/the-gang-stalkers-are-always-starting-physical-fights-with-me-on-the-s-4` — derived
- [ ] 81. `2025-05-23` · answer · `pedigree101/could-a-targeted-individual-be-also-active-in-gang-stalking-6` — derived
- [ ] 80. `2025-05-23` · answer-comment · `pedigree101/could-a-targeted-individual-be-also-active-in-gang-stalking-7`
- [ ] 79. `2025-05-21` · question · `farah-brunache/the-gang-stalkers-are-always-starting-physical-fights-with-me-on-the-s-3` — derived
- [ ] 78. `2025-05-21` · question · `pedigree101/as-a-ti-the-more-i-ignore-gs-the-more-violent-they-get-any-advice` — derived
- [ ] 77. `2025-05-20` · question · `farah-brunache/the-gang-stalkers-are-always-starting-physical-fights-with-me-on-the-s` — derived
- [ ] 76. `2025-05-20` · question · `farah-brunache/the-gang-stalkers-are-always-starting-physical-fights-with-me-on-the-s-2` — derived
- [ ] 75. `2025-05-19` · question · `farah-brunache/today-i-had-to-push-a-gstalker-off-of-me-as-they-were-threatening-to-h` — derived
- [ ] 74. `2025-05-10` · answer · `farah-brunache/are-business-owners-aware-that-gangstalkers-are-harassing-their-custom` — derived
- [ ] 73. `2025-05-06` · space-post · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets-4`
- [ ] 72. `2025-05-03` · answer-comment · `farah-brunache/what-is-a-honeypot-in-regards-to-gang-stalking`
- [ ] 71. `2025-05-02` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-te`
- [ ] 70. `2025-04-29` · space-post · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets-3`
- [ ] 69. `2025-04-28` · question · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets` — derived
- [ ] 68. `2025-04-28` · space-post · `farah-brunache/gang-stalkers-have-blocked-me-for-several-months-in-buying-bus-tickets-2`
- [ ] 67. `2025-04-28` · post-comment · `farah-brunache/https-www-quora-com-why-are-so-many-senior-citizens-involved-in-organi-2`
- [ ] 66. `2025-04-20` · answer · `farah-brunache/why-have-people-disappeared-or-been-murdered-trying-to-prove-aliens-or` — derived
- [ ] 65. `2025-04-16` · post-comment · `farah-brunache/https-www-quora-com-in-which-country-is-there-not-gang-stalking-answer`
- [ ] 64. `2025-04-16` · post-comment · `farah-brunache/https-www-quora-com-why-are-so-many-senior-citizens-involved-in-organi`
- [ ] 63. `2025-03-10` · answer · `farah-brunache/do-stalkers-set-you-up-in-housing-properties-that-seem-to-be-full-of-t` — derived
- [ ] 62. `2025-03-05` · answer · `farah-brunache/do-fat-people-with-low-self-esteem-target-people-and-gang-stalk-more-f` — derived
- [ ] 61. `2025-03-05` · answer-comment · `farah-brunache/whats-the-end-game-of-a-gang-stalker-upvoting-our-quora-posts-i-have-s`
- [ ] 60. `2025-03-04` · answer-comment · `farah-brunache/how-can-targeted-individuals-tis-protect-themselves-from-gangstalkers`
- [ ] 59. `2025-03-04` · answer · `farah-brunache/how-do-we-us-ti-s-know-that-there-aren-t-any-gangstalkers-that-have-jo` — derived
- [ ] 58. `2025-03-04` · space-submission · `farah-brunache/i-am-experiencing-gang-stalking-what-can-i-do-about-it` — derived

### Record page 24

- [ ] 57. `2025-03-04` · space-submission · `farah-brunache/what-are-the-various-circumstances-which-put-ordinary-civilians-at-ris-3` — derived
- [ ] 56. `2025-03-01` · answer-comment · `farah-brunache/how-long-is-a-targeted-individual-gangstalked-does-the-gangstalking-ev`
- [ ] 55. `2025-03-01` · answer-comment · `farah-brunache/what-percentage-of-tis-on-here-do-you-think-are-real-and-what-do-you-t`
- [ ] 54. `2025-02-24` · question · `farah-brunache/what-s-the-end-game-of-a-gang-stalker-upvoting-our-quora-posts-4` — derived
- [ ] 53. `2025-02-24` · question · `farah-brunache/what-s-the-end-game-of-a-gang-stalker-upvoting-our-quora-posts-5` — derived
- [ ] 52. `2025-02-24` · question · `farah-brunache/what-s-the-end-game-of-a-gang-stalker-upvoting-our-quora-posts-6` — derived
- [ ] 51. `2025-02-23` · question · `farah-brunache/what-s-the-end-game-of-a-gang-stalker-upvoting-our-quora-posts` — derived
- [ ] 50. `2025-02-23` · question · `farah-brunache/what-s-the-end-game-of-a-gang-stalker-upvoting-our-quora-posts-2` — derived
- [ ] 49. `2025-02-23` · question · `farah-brunache/what-s-the-end-game-of-a-gang-stalker-upvoting-our-quora-posts-3` — derived
- [ ] 48. `2025-01-07` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-th`
- [ ] 47. `2025-01-05` · space-submission · `farah-brunache/is-it-worth-it-to-respond-to-a-vigilante-s-email-after-receiving-the-b` — no address
- [ ] 46. `2025-01-05` · space-submission · `farah-brunache/is-it-worth-it-to-respond-to-a-vigilante-s-email-after-receiving-the-b-2` — no address
- [ ] 45. `2025-01-05` · space-submission · `farah-brunache/is-it-worth-it-to-respond-to-a-vigilante-s-email-after-receiving-the-b-3` — no address
- [ ] 44. `2025-01-05` · space-submission · `farah-brunache/is-it-worth-it-to-respond-to-a-vigilante-s-email-after-receiving-the-b-4` — no address
- [ ] 43. `2025-01-05` · space-submission · `farah-brunache/is-it-worth-it-to-respond-to-a-vigilante-s-email-after-receiving-the-b-5` — no address
- [ ] 42. `2025-01-04` · answer · `farah-brunache/what-happens-when-gang-stalkers-family-or-friends-see-what-they-are-do` — derived
- [ ] 41. `2024-12-31` · post-comment · `farah-brunache/just-fyi-lately-i-have-been-trolled-on-quora-by-2-groups-of-people-tar`
- [ ] 40. `2024-12-25` · answer-comment · `farah-brunache/what-are-the-various-circumstances-which-put-ordinary-civilians-at-ris`
- [ ] 39. `2024-12-25` · answer-comment · `farah-brunache/what-are-the-various-circumstances-which-put-ordinary-civilians-at-ris-2`
- [ ] 38. `2024-12-21` · post-comment · `farah-brunache/https-www-quora-com-can-you-turn-an-ex-stalker-or-stalker-into-a-frien`
- [ ] 37. `2024-12-19` · post-comment · `farah-brunache/freemason-mind-controlled-perp-confesses-and-speaks-on-targeted-indivi`
- [ ] 36. `2024-12-19` · post-comment · `farah-brunache/freemason-mind-controlled-perp-confesses-and-speaks-on-targeted-indivi-2`
- [ ] 35. `2024-12-19` · post-comment · `farah-brunache/so-many-questions-here-some-of-them-sound-crazy-as-hell-but-at-this-po`
- [ ] 34. `2024-12-17` · answer-comment · `farah-brunache/if-the-purpose-of-gang-stalking-is-to-ruin-the-victim-financially-psyc`
- [ ] 33. `2024-12-16` · answer-comment · `farah-brunache/what-is-gang-stalking-2`

### Record page 25

- [ ] 32. `2024-12-15` · post-comment · `farah-brunache/was-walking-today-minding-my-own-business-when-this-random-lady-i-have`
- [ ] 31. `2024-12-15` · answer · `farah-brunache/what-do-gang-stalkers-do-when-they-can-t-successfully-and-covertly-con` — derived
- [ ] 30. `2024-12-15` · answer-comment · `farah-brunache/what-do-gang-stalkers-do-when-they-cant-successfully-and-covertly-conv`
- [ ] 29. `2024-12-15` · answer · `farah-brunache/what-is-gang-stalking` — derived
- [ ] 28. `2024-12-14` · space-submission · `farah-brunache/this-is-tragic-at-age-26-and-unsurprisingly-he-was-discovered-after-so` — no address
- [ ] 27. `2024-12-13` · answer-comment · `farah-brunache/would-gang-stalkers-set-someone-up-to-go-to-prison`
- [ ] 26. `2024-12-12` · answer-comment · `farah-brunache/why-don-t-targeted-individuals-come-together-and-fight-against-gang-st`
- [ ] 25. `2024-12-11` · answer · `farah-brunache/do-gang-stalkers-speak-to-one-another-on-quora-and-other-platforms-in` — derived
- [ ] 24. `2024-12-11` · answer-comment · `farah-brunache/how-do-you-know-if-you-are-a-targeted-individual`
- [ ] 23. `2024-12-11` · answer-comment · `farah-brunache/how-do-you-know-if-you-are-a-targeted-individual-2`
- [ ] 22. `2024-12-11` · answer-comment · `farah-brunache/now-i-have-an-extensive-knowledge-of-gangstalker-techniques-but-what-i-3`
- [ ] 21. `2024-12-10` · answer · `farah-brunache/now-i-have-an-extensive-knowledge-of-gangstalker-techniques-but-what-i` — derived
- [ ] 20. `2024-12-10` · answer-comment · `farah-brunache/now-i-have-an-extensive-knowledge-of-gangstalker-techniques-but-what-i-2`
- [ ] 19. `2024-12-07` · question-comment · `farah-brunache/for-me-it-is-kidney-disease-looks-like-another-physiological-game` — derived
- [ ] 18. `2024-12-07` · post-comment · `farah-brunache/https-www-quora-com-what-are-the-various-circumstances-which-put-ordin`
- [ ] 17. `2024-12-07` · answer-comment · `farah-brunache/so-the-word-cancer-has-been-brought-up-here-and-there-throughout-my-ta`
- [ ] 16. `2024-12-06` · post-comment · `farah-brunache/https-www-quora-com-profile-matthew-cappadocia-aka-the-wizard-of-oz-wh`
- [ ] 15. `2024-12-03` · answer-comment · `farah-brunache/what-could-be-the-reasons-for-someone-being-targeted-by-organized-stal`
- [ ] 14. `2024-12-02` · answer-comment · `farah-brunache/if-i-could-upvote-this-a-thousand-times-i-would`
- [ ] 13. `2024-12-02` · answer-comment · `farah-brunache/in-my-experience-the-intensity-was-in-fact-differenet-at-different-sta`
- [ ] 12. `2024-12-02` · answer-comment · `farah-brunache/their-a-perp-there-is-no-removing-your-name`
- [ ] 11. `2024-12-02` · answer-comment · `farah-brunache/you-are-correct-it-is-the-government-as-well`
- [ ] 10. `2024-11-17` · answer-comment · `farah-brunache/do-targeted-individuals-really-believe-that-the-fbi-is-too-niave-to-be`
- [ ] 9. `2024-11-17` · post-comment · `farah-brunache/https-www-quora-com-do-targeted-individuals-really-believe-that-the-fb`
- [ ] 8. `2024-10-31` · answer-comment · `farah-brunache/are-gang-stalkers-on-average-narcissists-or-do-they-just-have-an-insat`

### Record page 26

- [ ] 7. `2024-10-31` · post-comment · `farah-brunache/https-www-quora-com-is-it-true-that-there-is-100-gang-stalkers-for-eve`
- [ ] 6. `2024-10-31` · space-post · `farah-brunache/matthew-cappadocia-aka-the-wizard-of-oz-https-www-quora-com-profile-ma`
- [ ] 5. `2024-10-31` · space-submission · `farah-brunache/matthew-cappadocia-aka-the-wizard-of-oz-your-byline-changed` — derived
- [x] 4. `2024-10-31` · space-submission · `farah-brunache/matthew-cappadocia-aka-the-wizard-of-oz-your-byline-changed-is-the-dif` — derived
- [x] 3. `2024-10-29` · answer-comment · `farah-brunache/how-often-are-the-victims-of-gang-stalking-organized-stalking-or-mobbi` — has screenshot
- [x] 2. `2024-10-29` · answer-comment · `farah-brunache/where-can-targeted-individuals-find-help-how-can-i-find-others-in-my-a` — has screenshot
- [x] 1. `2024-10-12` · question · `farah-brunache/when-gang-stalkers-text-my-phone-is-it-installing-spyware` — derived

<!-- spelling:enable -->

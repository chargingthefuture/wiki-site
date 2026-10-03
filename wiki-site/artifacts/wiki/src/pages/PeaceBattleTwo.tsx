import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Calculator, Phone, Target, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Pb2ShareMessage } from "@/components/Pb2ShareMessage";

/**
 * The Peace Battle 2 page: /peace-battle-2, with /pb2 resolving to it.
 *
 * This is the one page on the blog that is not a post. It is the standing reference for a protest
 * that runs for years, so it has no date on it and it is not in the feed — a reader arrives here
 * from a link somebody handed them, not from catching up.
 *
 * Every link on it goes straight to the thing it names. A page that tells somebody to open an app
 * and scroll sideways to find a tab has sent them hunting, and most people do not go.
 */

// Friday 18 September 2026, 7:00 PM Eastern. Eastern is UTC-4 in September, so this is the instant
// in UTC. The time zone carries no meaning beyond where the organizer happens to be.
const START = Date.UTC(2026, 8, 18, 23, 0, 0);

// The instant the goal was reached, once it is. Null until then, and the clock keeps running.
//
// There is no figure to read this from. Whether a survivor can get nearly everything they need from
// other survivors is a judgment somebody makes by looking, not a number a screen can total up, so it
// is set here by hand on the day and the clock stops at whatever it read.
const REACHED: number | null = null;

const APP = "https://app.chargingthefuture.com";
const LINKS = {
  onePercent: `${APP}/apps/workforce?view=one-percent`,
  goals: `${APP}/apps/peer-programming?tab=goals`,
  workforce: `${APP}/apps/workforce`,
  paidTier: "https://farahbrunache.com",
  game: "https://chargingthefuture.github.io/offline-os/apps/peace-battle-2/",
};

// The reached date, written in Eastern so it matches the start line above it. Taken from the
// timestamp rather than typed by hand, so setting REACHED is the only edit the day needs.
function easternDate(ms: number): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ms));
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/**
 * Elapsed time since the start, as complete calendar years plus the remainder.
 *
 * Years are counted by moving the start date forward a year at a time rather than dividing by a
 * fixed number of days, so a leap year does not put the figure a day out. Years are only reported
 * once there is at least one, which keeps the row the same four cells it was during the countdown
 * for all of the first year.
 */
function elapsed(from: number, to: number) {
  const start = new Date(from);
  let years = 0;
  let mark = from;
  for (;;) {
    const next = Date.UTC(
      start.getUTCFullYear() + years + 1,
      start.getUTCMonth(),
      start.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes(),
      start.getUTCSeconds(),
    );
    if (next > to) break;
    mark = next;
    years += 1;
  }
  return { years, ...parts(to - mark) };
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-black border-4 border-primary comic-shadow-sm px-3 py-3 sm:px-6 sm:py-4 text-center min-w-[72px] sm:min-w-[110px]">
      <div className="font-display text-3xl sm:text-5xl text-white tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </div>
      <div className="font-heading text-[10px] sm:text-xs uppercase tracking-widest text-primary mt-1">{label}</div>
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (REACHED !== null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Three states, one row of cells. Before the start it counts down to it; after the start it counts
  // up from it, which is the figure the page exists to carry — how long this took. When the goal is
  // reached the same row freezes at the time it took and stops ticking.
  //
  // The current date and time are deliberately not printed. Every device already shows them, a second
  // clock is one more thing that can read wrong to somebody outside Eastern, and the elapsed figure
  // is the only one that answers the question. The start date sits underneath as fixed text instead,
  // which anchors the number without moving.
  if (now >= START) {
    const stopped = REACHED !== null;
    const { years, days, hours, minutes, seconds } = elapsed(START, stopped ? (REACHED as number) : now);
    return (
      <div>
        <div className="font-heading text-center uppercase tracking-widest text-sm text-primary mb-3">
          {stopped ? "It took" : "Since it started"}
        </div>
        <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
          {years > 0 && <Cell value={years} label={years === 1 ? "Year" : "Years"} />}
          <Cell value={days} label="Days" />
          <Cell value={hours} label="Hours" />
          <Cell value={minutes} label="Minutes" />
          <Cell value={seconds} label="Seconds" />
        </div>
        <p className="font-heading text-center uppercase tracking-widest text-sm text-gray-400 mt-4">
          Started Friday, September 18, 2026 · 7:00 PM Eastern
          {stopped ? ` · reached ${easternDate(REACHED as number)}` : ""}
        </p>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = parts(START - now);
  return (
    <div>
      <div className="font-heading text-center uppercase tracking-widest text-sm text-primary mb-3">
        Until it starts
      </div>
      <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
        <Cell value={days} label="Days" />
        <Cell value={hours} label="Hours" />
        <Cell value={minutes} label="Minutes" />
        <Cell value={seconds} label="Seconds" />
      </div>
      <p className="font-heading text-center uppercase tracking-widest text-sm text-gray-400 mt-4">
        Starts Friday, September 18, 2026 · 7:00 PM Eastern
      </p>
    </div>
  );
}

function Step({
  icon,
  n,
  title,
  href,
  cta,
  children,
}: {
  icon: React.ReactNode;
  n: number;
  title: string;
  href: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border-4 border-black comic-shadow-sm p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-display text-4xl text-primary leading-none">{n}</span>
        <span className="text-primary">{icon}</span>
        <h3 className="font-heading text-2xl uppercase font-bold">{title}</h3>
      </div>
      <div className="font-sans text-gray-300 space-y-3 mb-5">{children}</div>
      <a
        href={href}
        className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-wider border-4 border-black comic-shadow-sm px-5 py-3 hover:-translate-y-0.5 hover:-translate-x-0.5 transition-transform"
      >
        {cta} <ArrowRight size={18} />
      </a>
      <p className="font-mono text-xs text-gray-500 mt-3 break-all">{href}</p>
    </div>
  );
}

export default function PeaceBattleTwo() {
  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-heading font-bold uppercase tracking-widest border-2 border-black mb-6 comic-shadow-sm transform -rotate-1">
          <span>A distributed protest</span>
        </div>

        <h1
          className="font-display text-5xl sm:text-7xl text-white leading-none mb-4"
          style={{ WebkitTextStroke: "2px var(--color-black)", textShadow: "4px 4px 0 var(--color-black)" }}
        >
          PEACE BATTLE 2
        </h1>

        <p className="font-sans text-xl text-gray-300 mb-10 border-l-4 border-primary pl-4">
          A protest you take part in from a phone, because the people it is for are spread across the
          world and most of them cannot travel to stand anywhere.
        </p>

        <div className="mb-14">
          <Countdown />
        </div>

        <h2 className="font-heading text-3xl uppercase font-bold text-primary mb-4">Why it has a name</h2>
        <div className="font-sans text-lg text-gray-300 space-y-4 mb-12">
          <p>
            In 1903 W. E. B. Du Bois looked back at what the people who founded the colleges had done
            after the Civil War — 2,000 trained, who trained 50,000, who taught nine millions — and
            called it <em>the most wonderful peace-battle of the 19th century</em>. It was a battle
            fought with teaching and with work, and it was won.
          </p>
          <p>
            Movements get names. The Civil Rights Movement had one. This has been going on without
            one, which makes it hard to point at and easy to deny. So it gets a name, and the name
            says which lineage it belongs to. This is the second one.
          </p>
          <p>
            It is organized, not led. Survivors are a distributed group and nobody speaks for them.
            The person calling the date is doing it because somebody has to call a date.
          </p>
        </div>

        <h2 className="font-heading text-3xl uppercase font-bold text-primary mb-4">Envision</h2>
        <p className="font-sans text-lg text-gray-300 mb-6">
          Two sets of figures to read before you do anything. Both take a couple of minutes and
          neither asks anything of you.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {/* This was presented as a game and it is not one: it is the arithmetic with rounds on
              it. Saying so is better than selling it — somebody who arrives expecting a game closes
              it, and somebody who wants to check the numbers now knows where they are. The card
              names what it does and the link says see the math. */}
          <div className="bg-card border-4 border-black comic-shadow-sm p-6">
            <h3 className="font-heading text-xl uppercase font-bold mb-2">What reaching 300 billion looks like</h3>
            {/* For somebody who lands here first, with no other page behind them. 300 billion is the
                Community Value Index goal in the app's GDP plugin. The post it links carries the definition. */}
            <p className="font-sans text-gray-300 mb-4">
              300 billion is the goal for the{" "}
              <Link
                href="/article/wiki-site/what-the-community-value-index-counts"
                className="text-primary font-bold hover:text-white"
              >
                Community Value Index
              </Link>
              , in the spirit of GDP: a running count of the help survivors trade with each other,
              such as a repair, a ride or a lesson. It is the figure set for an economy of five
              million survivors.
            </p>
            <p className="font-sans text-gray-300 mb-4">
              This shows the way there, one round at a time. You start with the 147 people on the
              Directory today and a list of 657 skills an economy needs. Each round you choose how much
              goes to teaching skills and how much to doing the work, then see where that leads in two
              generations. It is free, it needs no account, and it works offline once it opens.
            </p>
            <a href={LINKS.game} className="font-heading font-bold uppercase text-primary hover:text-white inline-flex items-center gap-2">
              See the math <ArrowRight size={16} />
            </a>
            <p className="font-mono text-xs text-gray-500 mt-2 break-all">{LINKS.game}</p>
          </div>
          <div className="bg-card border-4 border-black comic-shadow-sm p-6">
            <h3 className="font-heading text-xl uppercase font-bold mb-2">What's your 1%?</h3>
            <p className="font-sans text-gray-300 mb-4">
              The 300 billion is made of single people doing their own work, and you are one of them.
              Serve one percent of those five million survivors and that is 50,000 people. This works
              back from those 50,000 to you, starting from your own trade, and shows what a year of
              serving them would add to the Community Value Index.
            </p>
            <a href={LINKS.onePercent} className="font-heading font-bold uppercase text-primary hover:text-white inline-flex items-center gap-2">
              Open your figures <ArrowRight size={16} />
            </a>
            <p className="font-mono text-xs text-gray-500 mt-2 break-all">{LINKS.onePercent}</p>
          </div>
        </div>

        <h2 className="font-heading text-3xl uppercase font-bold text-primary mb-4">Enact</h2>
        <p className="font-sans text-lg text-gray-300 mb-6">
          Three steps, in the order they come. The first two are free and self-service, and they stay
          that way. The third is paid, and only for somebody who wants to take it further.
        </p>

        {/* Three steps and one subject: your 1%. Fireside and TI Radio used to sit here and both
            still exist in the app. They came out because every extra ask on this page is one more
            thing a reader has to decide about before doing any of them. */}
        <div className="space-y-6 mb-12">
          <Step
            n={1}
            icon={<Calculator size={22} />}
            title="See your 1%"
            href={LINKS.onePercent}
            cta="Open Workforce"
          >
            <p>
              Workforce runs the arithmetic from 50,000 people back to you, weighted to your own
              trade, and shows what serving them would be worth in a year. That figure is your 1%.
            </p>
          </Step>

          <Step
            n={2}
            icon={<Target size={22} />}
            title="Start on it in PeerProgramming"
            href={LINKS.goals}
            cta="Open the goal board"
          >
            <p>
              Most of a day here goes to the attacks and to what they force, and what is left might
              be five percent. Five percent is not enough to reach a personal goal alone, because a
              goal is a chain of small steps and the attacks land on the chain. It is enough when it
              is not all one person&rsquo;s: twenty members with five percent of a day each is a full
              working day.
            </p>
            <p>
              That is what the goal board runs on. Post a personal goal with a finish line and break
              it into tasks small enough to do from a phone in under half an hour: find three yards
              hiring near Dallas, ask one dealer whether they finance with no credit check. Then take
              any one card from anybody else&rsquo;s goal, do it, and post what you found. A bad day
              now costs nothing: take a card when you have the half hour, and not when you do not.
              And others do the same.
            </p>
            <p>
              The board is in PeerProgramming, alongside an optional chat and calls.{" "}
              <Link
                href="/article/wiki-site/show-up-with-your-percent"
                className="text-primary font-bold hover:text-white"
              >
                Show up with your percent
              </Link>{" "}
              says how it works and why it is shaped this way.
            </p>
            <img
              src={`${import.meta.env.BASE_URL}images/pb2-goal-board.png`}
              alt="The PeerProgramming goal board on a phone. 0 cards done in the last 24 hours. Grab any one card, do it from your phone, and post what you found. One card is plenty. Your goal: Get a yard jockey job, 0 of 2 cards done, with buttons Add card, Reached it and Take it down. Up for grabs, 2 cards: Find five places in Houston Texas that have full-time yard jockey roles for recent CDL graduates. Find one TI in Houston Texas to host a room."
              className="w-full max-w-sm mx-auto border-4 border-black comic-shadow-sm"
              loading="lazy"
            />
          </Step>

          <Step
            n={3}
            icon={<Phone size={22} />}
            title="Take it further with One Percent"
            href={LINKS.paidTier}
            cta="Open One Percent"
          >
            <p>
              Naming your next customer is the easy part. One Percent is a half hour, in your
              browser, on what comes after that: the figure your trade produces, the first customer
              behind it, and coaching and recommendations, optional, for the road from destitution to
              an autonomous life with the targeting behind you. Each person who makes that road is
              one more citizen of the &ldquo;
              <Link
                href="/article/wiki-site/the-two-generation-goal"
                className="text-primary font-bold hover:text-white"
              >
                Estonia
              </Link>
              &rdquo; of Targeted Individuals.
            </p>
            <p>
              <Link
                href="/article/wiki-site/start-with-socks"
                className="text-primary font-bold hover:text-white"
              >
                Start with socks
              </Link>{" "}
              shows the range: the smallest version is a living, and the ambitious version is a
              company. Aiming for the smallest and staying there is a complete answer.
            </p>
          </Step>
        </div>

        {/* Not a fourth thing to do. Posting about the app is where people stop, and the reason is
            that they do not want to write one. So the words are already written, and
            they are about the app rather than about the argument — somebody who supports this and
            disagrees with the organizer on something else can still post these without speaking for
            anybody. Posts from this blog are not in the pool for that reason. */}
        <h2 className="font-heading text-3xl uppercase font-bold text-primary mb-4">If you do not want to write one</h2>
        <Pb2ShareMessage />

        <h2 className="font-heading text-3xl uppercase font-bold text-primary mb-4">What winning looks like</h2>
        <div className="font-sans text-lg text-gray-300 space-y-4 mb-12">
          <p>
            Peace Battle 2 is finished when a survivor can get 99% of what they need — housing,
            transportation, goods, services — from other survivors.
          </p>
          <p>
            Not 100%. A phone and a vehicle need supply chains no community this size can run, and
            saying otherwise would be a lie. Nearly everything else can be grown, made, taught,
            driven, repaired or arranged by somebody already on the list.
          </p>
          <p>
            That is what exiting the psyop means in practice. Not leaving the global economy — being
            able to come and go from it by choice, because what you need is available from people who
            are not part of what is being done to you.
          </p>
          <p>
            The nearer marker is 384 approved members working with each other at any given time. It is
            expected to take a generation. It will probably take two.
          </p>
        </div>

        <h2 className="font-heading text-3xl uppercase font-bold text-primary mb-4">Why it is virtual</h2>
        <div className="font-sans text-lg text-gray-300 space-y-4 mb-12">
          <p>
            A protest is normally bodies in one place. Survivors have tried that and turned up alone,
            because a protest in a place assumes neighbors, money for travel, and a day that can be
            given up. Most people this is for have none of the three.
          </p>
          <p>
            That is not an accident of who they are. Targeting is spread deliberately across every
            country, race, class and religion, which makes the people it happens to hard to connect to
            each other and easy to describe as unrelated individuals with unrelated problems. The
            slander shifts with the audience for the same reason.
          </p>
          <p>
            So this one is distributed too, because the thing being answered is distributed. It runs
            for years, which a protest in a physical place cannot do, and it costs nothing but the
            minutes you give it.
          </p>
        </div>

        <div className="bg-black border-4 border-primary comic-shadow-sm p-8 mb-10">
          <h2 className="font-heading text-2xl uppercase font-bold text-primary mb-3">
            If you think none of this will work
          </h2>
          <p className="font-sans text-lg text-gray-300 mb-3">
            Take part anyway, and here is the honest reason. Nothing in it harms anybody. Five million
            people leaving the global economy would not dent it — and the people doing this already
            keep survivors from earning, which tells you they do not want that participation either.
          </p>
          <p className="font-sans text-lg text-gray-300">
            So the cost of being wrong about this is a minute of your time. The cost of being right
            and doing nothing is another generation.
          </p>
        </div>

        <div className="border-t-4 border-black pt-8">
          <p className="font-sans text-lg text-gray-300 mb-4">
            To sign up: <a href="https://chargingthefuture.com" className="text-primary font-bold hover:text-white">https://chargingthefuture.com</a>.
            It is free, everyone is let in one at a time after a check, and you can use one part of it and ignore the rest.
          </p>
          <Link href="/" className="font-heading font-bold uppercase text-gray-400 hover:text-primary inline-flex items-center gap-2">
            Read the posts <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}

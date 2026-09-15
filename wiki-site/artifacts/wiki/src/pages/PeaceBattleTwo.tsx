import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Radio, MessageSquare, Calculator, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";

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

const APP = "https://app.chargingthefuture.com";
const LINKS = {
  tiRadio: `${APP}/ti-radio`,
  fireside: `${APP}/apps/fireside`,
  onePercent: `${APP}/apps/workforce?view=one-percent`,
  workforce: `${APP}/apps/workforce`,
  game: "https://chargingthefuture.github.io/offline-os/apps/peace-battle-2/",
};

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
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
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now >= START) {
    const days = Math.floor((now - START) / 86400000);
    return (
      <div className="border-4 border-primary bg-black comic-shadow-sm px-6 py-6 text-center">
        <div className="font-heading text-sm uppercase tracking-widest text-primary mb-2">Under way</div>
        <div className="font-display text-3xl sm:text-5xl text-white leading-tight">
          Day {days + 1}
        </div>
        <p className="font-sans text-gray-400 mt-3">
          Peace Battle 2 started on Friday, September 18, 2026 at 7:00 PM Eastern. It is running now.
        </p>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = parts(START - now);
  return (
    <div>
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
          style={{ WebkitTextStroke: "2px black", textShadow: "4px 4px 0 #000" }}
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
          Two things to look at before you do anything. Both take a couple of minutes and neither asks
          anything of you.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border-4 border-black comic-shadow-sm p-6">
            <h3 className="font-heading text-xl uppercase font-bold mb-2">What reaching 300 billion looks like</h3>
            <p className="font-sans text-gray-300 mb-4">
              A game you play in a browser. It starts from the 147 people on the Directory today and
              asks you to fill a catalog of 657 skills inside two generations. It is free, it needs no
              account, and it runs offline once it opens.
            </p>
            <a href={LINKS.game} className="font-heading font-bold uppercase text-primary hover:text-white inline-flex items-center gap-2">
              Play it <ArrowRight size={16} />
            </a>
            <p className="font-mono text-xs text-gray-500 mt-2 break-all">{LINKS.game}</p>
          </div>
          <div className="bg-card border-4 border-black comic-shadow-sm p-6">
            <h3 className="font-heading text-xl uppercase font-bold mb-2">What's your 1%?</h3>
            <p className="font-sans text-gray-300 mb-4">
              One percent of five million survivors is 50,000 people. This runs the arithmetic
              backwards from there to you, weighted to your own trade, and tells you what serving that
              many people would be worth in a year.
            </p>
            <a href={LINKS.onePercent} className="font-heading font-bold uppercase text-primary hover:text-white inline-flex items-center gap-2">
              Open your figures <ArrowRight size={16} />
            </a>
            <p className="font-mono text-xs text-gray-500 mt-2 break-all">{LINKS.onePercent}</p>
          </div>
        </div>

        <h2 className="font-heading text-3xl uppercase font-bold text-primary mb-4">Enact</h2>
        <p className="font-sans text-lg text-gray-300 mb-6">
          Three things. Not more, because more than three is how a protest turns into homework. Do one
          of them and you are taking part.
        </p>

        <div className="space-y-6 mb-12">
          <Step
            n={1}
            icon={<MessageSquare size={22} />}
            title="Say something under a post"
            href={LINKS.fireside}
            cta="Open Fireside"
          >
            <p>
              Read any post on this blog and leave a comment or a reaction under it. That is the whole
              action. Reading the conversation needs no account at all.
            </p>
            <p>
              This is the one that answers Quora directly. Eleven times an account of this project
              has been erased there, and every comment under it went too — including other people's.
              A comment here has an address and can be found again.
            </p>
            <p>
              The dated record of those erasures is on{" "}
              <Link
                href="/article/wiki-site/old-links-new-links"
                className="text-primary font-bold hover:text-white"
              >
                old links, new links
              </Link>
              .
            </p>
          </Step>

          <Step
            n={2}
            icon={<Radio size={22} />}
            title="Take a slot on TI Radio"
            href={LINKS.tiRadio}
            cta="See the schedule"
          >
            <p>
              A published week of live audio rooms. Take an open time, write a line about what it is
              about, and turn up. It does not have to be about being targeted — it can be about
              anything.
            </p>
            <p>
              The aim is a schedule with somebody in it as often as possible. Listening needs no
              account; speaking does. A slot is taken, not granted, so a name on the schedule is not
              an endorsement.
            </p>
          </Step>

          <Step
            n={3}
            icon={<Calculator size={22} />}
            title="Post your 1%"
            href={LINKS.onePercent}
            cta="Open your figures"
          >
            <p>
              Open your own figures, adjust them to what you would actually charge, and put the
              screenshot somewhere people will see it. It costs a minute and it argues with nothing
              but arithmetic.
            </p>
            <p>
              If you would rather act than post, do the other version: use the app to offer or ask for
              something real, and the figure stops being a projection.
            </p>
          </Step>
        </div>

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
            It is free, invite-only, and you can use one part of it and ignore the rest.
          </p>
          <Link href="/" className="font-heading font-bold uppercase text-gray-400 hover:text-primary inline-flex items-center gap-2">
            Read the posts <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}

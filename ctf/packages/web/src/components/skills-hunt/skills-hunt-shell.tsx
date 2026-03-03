import Link from 'next/link';
import {
  getFeatureRewardCard,
  listAchievements,
  listLeaderboard,
  listNotifications,
  listRounds,
  listSubmissions,
} from '@/src/lib/skills-hunt/repository';

type SkillsHuntShellProps = {
  userId: string;
  isAdmin: boolean;
  isModerator: boolean;
};

export async function SkillsHuntShell({ userId, isAdmin, isModerator }: SkillsHuntShellProps) {
  const rounds = await listRounds(null);
  const activeRound = rounds.find((round) => round.status === 'active') ?? rounds[0] ?? null;

  const [card, achievements, notifications, ownSubmissions, leaderboard] = await Promise.all([
    getFeatureRewardCard(),
    listAchievements(userId),
    listNotifications(userId, false),
    activeRound
      ? listSubmissions(activeRound.id, null, { page: 1, pageSize: 5 }, { userId, isModeratorOrAdmin: false })
      : Promise.resolve({ items: [], pagination: { page: 1, pageSize: 5 }, total: 0 }),
    activeRound ? listLeaderboard(activeRound.id, 'individual') : Promise.resolve([]),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Skills Hunt</h1>
        <p className="text-sm text-muted-foreground">
          Round-based skill discovery with moderation scoring, leaderboards, achievements, notifications, and governed unclaimed Directory profile generation.
        </p>
      </header>

      {card ? (
        <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
          <h2 className="text-lg font-medium">Feature reward card</h2>
          <p className="font-medium">{card.title}</p>
          <p className="text-muted-foreground">{card.description}</p>
          <p>
            <Link className="underline underline-offset-4" href={card.ctaUrl}>{card.ctaLabel}</Link>
          </p>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Rounds</h2>
          <ul className="space-y-2 text-sm">
            {rounds.map((round) => (
              <li key={round.id} className="rounded border p-2">
                <p className="font-medium">{round.name}</p>
                <p className="text-muted-foreground">{round.status} · {round.startsAtIso} → {round.endsAtIso}</p>
              </li>
            ))}
            {rounds.length === 0 ? <li className="text-muted-foreground">No rounds configured.</li> : null}
          </ul>
        </article>

        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Leaderboard (individual)</h2>
          <ul className="space-y-2 text-sm">
            {leaderboard.slice(0, 8).map((entry) => (
              <li key={`${entry.rank}-${entry.userId ?? 'anon'}`} className="rounded border p-2 flex justify-between gap-2">
                <span>#{entry.rank} {entry.usernameSnapshot ?? entry.userId ?? 'unknown'}</span>
                <span className="text-muted-foreground">{entry.score} pts</span>
              </li>
            ))}
            {leaderboard.length === 0 ? <li className="text-muted-foreground">No accepted submissions yet.</li> : null}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Your recent submissions</h2>
          <ul className="space-y-2 text-sm">
            {ownSubmissions.items.map((submission) => (
              <li key={submission.id} className="rounded border p-2">
                <p className="font-medium">{submission.displayName}</p>
                <p className="text-muted-foreground">{submission.status} · {submission.pointsAwarded} points</p>
              </li>
            ))}
            {ownSubmissions.items.length === 0 ? <li className="text-muted-foreground">No submissions yet.</li> : null}
          </ul>
        </article>

        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Achievements</h2>
          <ul className="space-y-2 text-sm">
            {achievements.slice(0, 8).map((achievement) => (
              <li key={achievement.id} className="rounded border p-2">
                <p className="font-medium">{achievement.title}</p>
                <p className="text-muted-foreground">{achievement.description}</p>
              </li>
            ))}
            {achievements.length === 0 ? <li className="text-muted-foreground">No achievements yet.</li> : null}
          </ul>
        </article>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Notifications</h2>
        <ul className="space-y-2">
          {notifications.slice(0, 6).map((notification) => (
            <li key={notification.id} className="rounded border p-2">
              <p className="font-medium">{notification.title}</p>
              <p className="text-muted-foreground">{notification.body}</p>
            </li>
          ))}
          {notifications.length === 0 ? <li className="text-muted-foreground">No notifications.</li> : null}
        </ul>
      </section>

      {(isAdmin || isModerator) ? (
        <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
          <h2 className="text-lg font-medium">Moderation/Admin controls</h2>
          <p className="text-muted-foreground">
            Use Skills Hunt admin APIs for rounds, review decisions, reward-card governance, and Directory profile projection generation.
          </p>
          {isAdmin ? (
            <p>
              <Link className="underline underline-offset-4" href="/admin/skills-hunt">Open /admin/skills-hunt</Link>
            </p>
          ) : null}
        </section>
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

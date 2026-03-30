import Link from 'next/link';
import { redirect } from 'next/navigation';
import { evaluatePluginAccess } from '../lib/auth/server-authz';
import { getFeatureRewardCard, getSkillsHuntDashboard, listRounds } from '../lib/skills-hunt/repository';

export default async function SkillsHuntAdminPage() {
  const access = await evaluatePluginAccess({ requireUsername: false });
  if (!access.allowed || !access.isAdmin) {
    redirect('/apps/skills-hunt');
  }

  const [dashboard, card, rounds] = await Promise.all([
    getSkillsHuntDashboard(),
    getFeatureRewardCard(),
    listRounds(null),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Skills Hunt Admin</h1>
        <p className="text-sm text-muted-foreground">
          Round governance, moderation/review controls, reward-card configuration, and governed Directory projection operations.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Dashboard snapshot</h2>
        <p>Rounds total: {dashboard.roundsTotal}</p>
        <p>Submissions total: {dashboard.submissionsTotal}</p>
        <p>Accepted submissions: {dashboard.acceptedTotal}</p>
        <p>Generated Directory profiles: {dashboard.generatedProfilesTotal}</p>
        <p className="text-muted-foreground">Generated at: {dashboard.generatedAtIso}</p>
      </section>

      {card ? (
        <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
          <h2 className="text-lg font-medium">Feature reward card</h2>
          <p className="font-medium">{card.title}</p>
          <p className="text-muted-foreground">{card.description}</p>
          <p>Active: {card.isActive ? 'yes' : 'no'}</p>
        </section>
      ) : null}

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Current rounds</h2>
        <ul className="list-disc pl-5 space-y-1">
          {rounds.map((round) => (
            <li key={round.id}>{round.name} ({round.status})</li>
          ))}
          {rounds.length === 0 ? <li>No rounds configured.</li> : null}
        </ul>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Admin API endpoints</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><code>GET/POST /api/skills-hunt/admin/rounds</code></li>
          <li><code>PUT /api/skills-hunt/admin/rounds/:roundId</code></li>
          <li><code>GET /api/skills-hunt/admin/rounds/:roundId/submissions</code></li>
          <li><code>POST /api/skills-hunt/admin/submissions/:submissionId/review</code></li>
          <li><code>PUT /api/skills-hunt/admin/feature-reward-card</code></li>
          <li><code>POST /api/skills-hunt/admin/submissions/:submissionId/generate-directory-profile</code></li>
          <li><code>GET /api/skills-hunt/admin/audit-events</code></li>
        </ul>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/apps/skills-hunt">Open skills-hunt plugin view</Link>
      </p>
    </main>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { evaluatePluginAccess } from '@/src/lib/auth/server-authz';
import { getAdminPanelData } from '@/src/lib/levelup/repository';

export default async function LevelupAdminPage() {
  const decision = await evaluatePluginAccess({ requireApprovedUserOrAdmin: true, requireUsername: false });
  if (!decision.allowed || !decision.isAdmin) {
    redirect('/apps/levelup');
  }

  const panel = await getAdminPanelData();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">LevelUp Admin</h1>
        <p className="text-sm text-muted-foreground">Cohort policy controls, credit adjustments, and KPI visibility.</p>
      </header>

      <section className="rounded-lg border bg-card p-5 text-sm grid gap-3 md:grid-cols-3">
        <article className="rounded border p-3">
          <p className="text-xs text-muted-foreground">Enrollments</p>
          <p className="text-lg font-semibold">{panel.kpis.enrollments}</p>
        </article>
        <article className="rounded border p-3">
          <p className="text-xs text-muted-foreground">Completions</p>
          <p className="text-lg font-semibold">{panel.kpis.completions}</p>
        </article>
        <article className="rounded border p-3">
          <p className="text-xs text-muted-foreground">Avg days to first trainer payout</p>
          <p className="text-lg font-semibold">{panel.kpis.avgDaysToFirstTrainerPayout} days</p>
        </article>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/apps/levelup">Open plugin shell</Link>
      </p>
    </main>
  );
}

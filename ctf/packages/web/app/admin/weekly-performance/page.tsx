import Link from 'next/link';
import { redirect } from 'next/navigation';
import { evaluatePluginAccess } from '../lib/auth/server-authz';
import { getCurrentWeek, listWeeks } from '../lib/weekly-performance/repository';

export default async function WeeklyPerformanceAdminPage() {
  const decision = await evaluatePluginAccess({ requireApprovedUserOrAdmin: true, requireUsername: false });
  if (!decision.allowed || !decision.isAdmin) {
    redirect('/apps/weekly-performance');
  }

  const [currentWeek, weeks] = await Promise.all([getCurrentWeek(), listWeeks()]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Weekly Performance Admin</h1>
        <p className="text-sm text-muted-foreground">Week selection, guardrails, and export gate administration.</p>
      </header>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <p>Current week: {currentWeek?.weekStartDate ?? 'n/a'}</p>
        <p>Tracked weeks: {weeks.length}</p>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/apps/weekly-performance">Open plugin shell</Link>
      </p>
    </main>
  );
}

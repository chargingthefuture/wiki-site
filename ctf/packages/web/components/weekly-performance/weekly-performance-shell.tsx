import Link from 'next/link';
import { getCurrentWeek, listWeeks } from '../lib/weekly-performance/repository';

type WeeklyPerformanceShellProps = {
  isAdmin: boolean;
};

export async function WeeklyPerformanceShell({ isAdmin }: WeeklyPerformanceShellProps) {
  const [currentWeek, weeks] = await Promise.all([getCurrentWeek(), listWeeks()]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Weekly Performance</h1>
        <p className="text-sm text-muted-foreground">
          Week navigation guardrails with non-financial metrics, comparison routes, and gated export behavior.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-5 space-y-2 text-sm">
        <h2 className="text-lg font-medium">Current week</h2>
        <p>Start: {currentWeek?.weekStartDate ?? 'n/a'}</p>
        <p>End: {currentWeek?.weekEndDate ?? 'n/a'}</p>
        <p>Status: {currentWeek?.status ?? 'n/a'}</p>
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-2 text-sm">
        <h2 className="text-lg font-medium">Recent weeks</h2>
        <p>Total tracked weeks: {weeks.length}</p>
      </section>

      {isAdmin ? (
        <p className="text-sm">
          <Link className="underline underline-offset-4" href="/admin/weekly-performance">Open /admin/weekly-performance</Link>
        </p>
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

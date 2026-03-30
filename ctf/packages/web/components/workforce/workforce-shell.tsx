import Link from 'next/link';
import {
  fetchSectorReport,
  fetchSkillLevelReport,
  fetchSummaryReport,
  getDashboard,
  listAnnouncements,
  listOccupations,
} from '../lib/workforce/repository';

type WorkforceShellProps = {
  isAdmin: boolean;
};

export async function WorkforceShell({ isAdmin }: WorkforceShellProps) {
  const [dashboard, summary, occupations, announcements, skillReport, sectorReport] = await Promise.all([
    getDashboard(),
    fetchSummaryReport(),
    listOccupations({ page: 1, pageSize: 6 }, false),
    listAnnouncements(true),
    fetchSkillLevelReport(),
    fetchSectorReport(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Workforce</h1>
        <p className="text-sm text-muted-foreground">
          Dashboard/reporting surface with recruited-state derivation from Directory upstream records.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Workforce total</p>
          <p className="text-2xl font-semibold">{dashboard.workforceTotal}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Recruited total</p>
          <p className="text-2xl font-semibold">{dashboard.recruitedTotal}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Occupations</p>
          <p className="text-2xl font-semibold">{dashboard.occupationsTotal}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Active announcements</p>
          <p className="text-2xl font-semibold">{dashboard.activeAnnouncementsTotal}</p>
        </article>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm">
        <h2 className="text-lg font-medium">Summary report</h2>
        <p className="text-muted-foreground mt-1">Generated at {summary.generatedAtIso}</p>
        <p className="mt-2">Current recruited share: {summary.workforceTotal > 0 ? Math.round((summary.recruitedTotal / summary.workforceTotal) * 100) : 0}%</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Skill-level report</h2>
          <ul className="space-y-2 text-sm">
            {skillReport.map((item) => (
              <li key={item.bucket} className="rounded border p-2 flex justify-between gap-2">
                <span>{item.bucket}</span>
                <span className="text-muted-foreground">{item.recruitedTotal}/{item.workforceTotal}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Sector report</h2>
          <ul className="space-y-2 text-sm">
            {sectorReport.map((item) => (
              <li key={item.bucket} className="rounded border p-2 flex justify-between gap-2">
                <span>{item.bucket}</span>
                <span className="text-muted-foreground">{item.recruitedTotal}/{item.workforceTotal}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Occupations</h2>
          <ul className="space-y-2 text-sm">
            {occupations.items.map((occupation) => (
              <li key={occupation.id} className="rounded border p-2">
                <p className="font-medium">{occupation.name}</p>
                <p className="text-muted-foreground">{occupation.sector ?? 'unassigned sector'}</p>
              </li>
            ))}
            {occupations.items.length === 0 ? <li className="text-muted-foreground">No occupations yet.</li> : null}
          </ul>
        </article>

        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Announcements</h2>
          <ul className="space-y-2 text-sm">
            {announcements.slice(0, 6).map((announcement) => (
              <li key={announcement.id} className="rounded border p-2">
                <p className="font-medium">{announcement.title}</p>
                <p className="text-muted-foreground">{announcement.body}</p>
              </li>
            ))}
            {announcements.length === 0 ? <li className="text-muted-foreground">No active announcements.</li> : null}
          </ul>
        </article>
      </section>

      {isAdmin ? (
        <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
          <h2 className="text-lg font-medium">Admin Controls</h2>
          <p className="text-muted-foreground">
            Use workforce admin API routes for config, occupations, announcements, recompute, and audit events.
          </p>
          <p>
            <Link className="underline underline-offset-4" href="/admin/workforce">Open /admin/workforce</Link>
          </p>
        </section>
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

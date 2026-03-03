import Link from 'next/link';
import { redirect } from 'next/navigation';
import { evaluatePluginAccess } from '@/src/lib/auth/server-authz';
import { getDashboard, getWorkforceConfig } from '@/src/lib/workforce/repository';

export default async function WorkforceAdminPage() {
  const access = await evaluatePluginAccess({ requireUsername: false });
  if (!access.allowed) {
    redirect('/plugin?plugin=workforce');
  }

  if (!access.isAdmin) {
    redirect('/plugin?plugin=workforce');
  }

  const [dashboard, config] = await Promise.all([
    getDashboard(),
    getWorkforceConfig(),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Workforce Admin</h1>
        <p className="text-sm text-muted-foreground">
          Workforce operational controls for config, recompute, occupations, announcements, and audit monitoring.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Current config</h2>
        <p>Exports enabled: {config.exportsEnabled ? 'yes' : 'no'} (export execution remains deferred in phase-1)</p>
        <p>Kill switch: {config.killSwitchEnabled ? 'enabled' : 'disabled'}</p>
        <p>Report timezone: {config.reportWeekTimezone}</p>
        <p>Week start DOW: {config.reportWeekStartDow}</p>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Dashboard snapshot</h2>
        <p>Workforce total: {dashboard.workforceTotal}</p>
        <p>Recruited total: {dashboard.recruitedTotal}</p>
        <p>Occupations total: {dashboard.occupationsTotal}</p>
        <p>Active announcements: {dashboard.activeAnnouncementsTotal}</p>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Admin API endpoints</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><code>GET/PUT /api/workforce/admin/config</code></li>
          <li><code>GET/POST /api/workforce/admin/occupations</code></li>
          <li><code>PUT/DELETE /api/workforce/admin/occupations/:id</code></li>
          <li><code>GET/POST /api/workforce/admin/announcements</code></li>
          <li><code>PUT/DELETE /api/workforce/admin/announcements/:id</code></li>
          <li><code>POST /api/workforce/admin/sync</code></li>
          <li><code>POST /api/workforce/admin/recompute</code></li>
          <li><code>GET /api/workforce/admin/audit-events</code></li>
        </ul>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/plugin?plugin=workforce">Open workforce plugin view</Link>
      </p>
    </main>
  );
}

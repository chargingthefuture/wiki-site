import Link from 'next/link';
import { redirect } from 'next/navigation';
import { evaluatePluginAccess } from '@/src/lib/auth/server-authz';
import { getCapacityPolicy, getFoundationDashboard } from '@/src/lib/foundation/repository';

export default async function FoundationAdminPage() {
  const access = await evaluatePluginAccess({ requireUsername: false });
  if (!access.allowed || !access.isAdmin) {
    redirect('/plugin?plugin=foundation');
  }

  const [dashboard, policy] = await Promise.all([
    getFoundationDashboard(),
    getCapacityPolicy(),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Foundation Admin</h1>
        <p className="text-sm text-muted-foreground">
          Capacity policy controls, rate-limit safeguard operations, and audit visibility for Foundation communication workflows.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Dashboard snapshot</h2>
        <p>Provider projections: {dashboard.providersTotal}</p>
        <p>Threads total: {dashboard.threadsTotal}</p>
        <p>Quote requests total: {dashboard.quotesTotal}</p>
        <p>Active/created calls: {dashboard.activeCallsTotal}</p>
        <p>Pending notifications: {dashboard.pendingNotificationsTotal}</p>
        <p className="text-muted-foreground">Generated at: {dashboard.generatedAtIso}</p>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Capacity policy</h2>
        <p>Quota state: {policy.quotaState}</p>
        <p>Kill switch: {policy.killSwitchEnabled ? 'enabled' : 'disabled'}</p>
        <p>Max active threads per user: {policy.maxActiveThreadsPerUser}</p>
        <p>Max messages/min: {policy.maxMessagesPerMinute}</p>
        <p>Max searches/min: {policy.maxSearchesPerMinute}</p>
        <p>Max quote transitions/min: {policy.maxQuoteTransitionsPerMinute}</p>
        <p>Max call duration (minutes): {policy.maxCallDurationMinutes}</p>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Admin API endpoints</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><code>GET/PUT /api/foundation/admin/capacity-policy</code></li>
          <li><code>POST /api/foundation/admin/rate-limits/evaluate</code></li>
          <li><code>GET /api/foundation/admin/audit-events</code></li>
        </ul>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/plugin?plugin=foundation">Open foundation plugin view</Link>
      </p>
    </main>
  );
}

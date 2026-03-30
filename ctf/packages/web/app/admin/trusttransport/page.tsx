import Link from 'next/link';
import { redirect } from 'next/navigation';
import { evaluatePluginAccess } from '../lib/auth/server-authz';
import { getMarketConfig, listAuditEvents, listIncidents } from '../lib/trusttransport/repository';

export default async function TrustTransportAdminPage() {
  const access = await evaluatePluginAccess({ requireUsername: false });
  if (!access.allowed || !access.isAdmin) {
    redirect('/apps/trusttransport');
  }

  const [incidents, marketConfig, auditEvents] = await Promise.all([
    listIncidents(),
    getMarketConfig(),
    listAuditEvents(),
  ]);

  const openIncidents = incidents.filter((item) => item.status === 'open').length;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">TrustTransport Admin</h1>
        <p className="text-sm text-muted-foreground">
          Safety operations surface for incidents, account restrictions, market controls, and admin audit visibility.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Incidents (recent)</p>
          <p className="text-2xl font-semibold">{incidents.length}</p>
        </article>
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Open incidents</p>
          <p className="text-2xl font-semibold">{openIncidents}</p>
        </article>
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Audit events (recent)</p>
          <p className="text-2xl font-semibold">{auditEvents.length}</p>
        </article>
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Max concurrent trips</p>
          <p className="text-2xl font-semibold">{marketConfig.maxConcurrentTrips}</p>
        </article>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Admin API endpoints</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><code>GET /api/trusttransport/admin/incidents</code></li>
          <li><code>POST /api/trusttransport/admin/incidents/:incidentId/resolve</code></li>
          <li><code>POST /api/trusttransport/admin/accounts/:userId/restrict</code></li>
          <li><code>POST /api/trusttransport/admin/accounts/:userId/restore</code></li>
          <li><code>GET/PUT /api/trusttransport/admin/market-config</code></li>
          <li><code>GET /api/trusttransport/admin/audit-events</code></li>
        </ul>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/apps/trusttransport">Open trusttransport plugin view</Link>
      </p>
    </main>
  );
}

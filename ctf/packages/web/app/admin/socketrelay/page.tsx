import Link from 'next/link';
import { redirect } from 'next/navigation';
import { evaluatePluginAccess } from 'lib/auth/server-authz';

export const dynamic = 'force-dynamic';
import {
  listAdminFulfillments,
  listAdminRequests,
  listSocketRelayAdminAnnouncements,
} from 'lib/socketrelay/repository';

export default async function SocketRelayAdminPage() {
  const access = await evaluatePluginAccess({ requireUsername: false });
  if (!access.allowed || !access.isAdmin) {
    redirect('/apps/socketrelay');
  }

  const [requests, fulfillments, announcements] = await Promise.all([
    listAdminRequests({ page: 1, pageSize: 100 }),
    listAdminFulfillments(),
    listSocketRelayAdminAnnouncements(),
  ]);

  const openRequests = requests.items.filter((item) => item.status === 'open').length;
  const activeFulfillments = fulfillments.filter((item) => item.status === 'active').length;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">SocketRelay Admin</h1>
        <p className="text-sm text-muted-foreground">
          Admin oversight surface for request lifecycle, fulfillment moderation, and plugin-targeted announcements.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Requests</p>
          <p className="text-2xl font-semibold">{requests.total}</p>
        </article>
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Open requests</p>
          <p className="text-2xl font-semibold">{openRequests}</p>
        </article>
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Fulfillments</p>
          <p className="text-2xl font-semibold">{fulfillments.length}</p>
        </article>
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Active fulfillments</p>
          <p className="text-2xl font-semibold">{activeFulfillments}</p>
        </article>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Dataset snapshot</h2>
        <p>Request rows loaded: {requests.items.length}</p>
        <p>Fulfillment rows loaded: {fulfillments.length}</p>
        <p>Announcement rows loaded: {announcements.length}</p>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Admin API endpoints</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><code>GET /api/socketrelay/admin/requests</code></li>
          <li><code>DELETE /api/socketrelay/admin/requests/:id</code></li>
          <li><code>GET /api/socketrelay/admin/fulfillments</code></li>
          <li><code>GET/POST /api/socketrelay/admin/announcements</code></li>
          <li><code>PUT/DELETE /api/socketrelay/admin/announcements/:id</code></li>
        </ul>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/apps/socketrelay">Open socketrelay plugin view</Link>
      </p>
    </main>
  );
}

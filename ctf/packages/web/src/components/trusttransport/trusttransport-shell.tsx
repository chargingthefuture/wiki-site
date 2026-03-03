import Link from 'next/link';
import { getMarketConfig, listIncidents, listMyPayouts, listRequests } from '@/src/lib/trusttransport/repository';

type TrustTransportShellProps = {
  userId: string;
  isAdmin: boolean;
};

export async function TrustTransportShell({ userId, isAdmin }: TrustTransportShellProps) {
  const [myRequests, payouts, incidents, config] = await Promise.all([
    listRequests({ page: 1, pageSize: 8, requesterUserId: userId }),
    listMyPayouts(userId),
    isAdmin ? listIncidents() : Promise.resolve([]),
    getMarketConfig(),
  ]);

  const activeRequests = myRequests.items.filter((item) => item.status === 'open' || item.status === 'in_progress').length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">TrustTransport</h1>
        <p className="text-sm text-muted-foreground">
          Ride/package/food request-and-fulfillment with safety-first emergency controls and dispute visibility.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">My requests</p>
          <p className="text-2xl font-semibold">{myRequests.total}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Active requests</p>
          <p className="text-2xl font-semibold">{activeRequests}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Payout requests</p>
          <p className="text-2xl font-semibold">{payouts.length}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 space-y-3 text-sm">
          <h2 className="text-lg font-medium">Recent requests</h2>
          <ul className="space-y-2">
            {myRequests.items.map((item) => (
              <li key={item.id} className="rounded border p-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground">{item.mode} · {item.status}</p>
              </li>
            ))}
            {myRequests.items.length === 0 ? <li className="text-muted-foreground">No requests yet.</li> : null}
          </ul>
        </article>

        <article className="rounded-lg border bg-card p-5 space-y-3 text-sm">
          <h2 className="text-lg font-medium">Market config snapshot</h2>
          <p>Max concurrent trips: {config.maxConcurrentTrips}</p>
          <p>Require proof on delivery: {config.requireProofOnDelivery ? 'yes' : 'no'}</p>
          <p>Emergency freeze enabled: {config.emergencyFreezeEnabled ? 'yes' : 'no'}</p>
        </article>
      </section>

      {isAdmin ? (
        <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
          <h2 className="text-lg font-medium">Admin incident snapshot</h2>
          <p>Open incidents (recent): {incidents.filter((item) => item.status === 'open').length}</p>
          <p>Total incidents (recent): {incidents.length}</p>
          <p>
            <Link className="underline underline-offset-4" href="/admin/trusttransport">Open /admin/trusttransport</Link>
          </p>
        </section>
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

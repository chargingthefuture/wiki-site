import Link from 'next/link';
import {
  getCapacityPolicy,
  listConnectionHistory,
  listNotificationEvents,
  listQuoteHistory,
  searchProviders,
} from '@/src/lib/foundation/repository';

type FoundationShellProps = {
  userId: string;
  isAdmin: boolean;
};

export async function FoundationShell({ userId, isAdmin }: FoundationShellProps) {
  const [providers, connectionHistory, quoteHistory, notifications, policy] = await Promise.all([
    searchProviders({ query: '', page: 1, pageSize: 8 }),
    listConnectionHistory({ actorUserId: userId, includeMessages: true, includeCalls: true, page: 1, pageSize: 6 }),
    listQuoteHistory({ actorUserId: userId, page: 1, pageSize: 6 }),
    listNotificationEvents(userId, false),
    getCapacityPolicy(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Foundation</h1>
        <p className="text-sm text-muted-foreground">
          Survivor-provider connection flows with Directory read-only search, 1:1 thread messaging/calls, quote lifecycle, and notification controls.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Providers indexed</p>
          <p className="text-2xl font-semibold">{providers.total}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Your threads</p>
          <p className="text-2xl font-semibold">{connectionHistory.threads.length}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Your quote requests</p>
          <p className="text-2xl font-semibold">{quoteHistory.total}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Unacked notifications</p>
          <p className="text-2xl font-semibold">{notifications.filter((item) => !item.isAcknowledged).length}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Provider discovery</h2>
          <ul className="space-y-2 text-sm">
            {providers.items.map((provider) => (
              <li key={provider.profileId} className="rounded border p-2">
                <p className="font-medium">{provider.displayName}</p>
                <p className="text-muted-foreground">{provider.headline ?? 'No headline'}</p>
              </li>
            ))}
            {providers.items.length === 0 ? <li className="text-muted-foreground">No provider projections available.</li> : null}
          </ul>
        </article>

        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Connection history</h2>
          <ul className="space-y-2 text-sm">
            {connectionHistory.threads.map((thread) => (
              <li key={thread.id} className="rounded border p-2">
                <p className="font-medium">Thread {thread.id.slice(0, 8)}…</p>
                <p className="text-muted-foreground">{thread.status} · stream channel {thread.streamChannelId}</p>
              </li>
            ))}
            {connectionHistory.threads.length === 0 ? <li className="text-muted-foreground">No connection threads yet.</li> : null}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Quote lifecycle</h2>
          <ul className="space-y-2 text-sm">
            {quoteHistory.items.map((quote) => (
              <li key={quote.id} className="rounded border p-2">
                <p className="font-medium">{quote.serviceType}</p>
                <p className="text-muted-foreground">State: {quote.lifecycleState}</p>
              </li>
            ))}
            {quoteHistory.items.length === 0 ? <li className="text-muted-foreground">No quote requests yet.</li> : null}
          </ul>
        </article>

        <article className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-lg font-medium">Notifications</h2>
          <ul className="space-y-2 text-sm">
            {notifications.slice(0, 8).map((notification) => (
              <li key={notification.id} className="rounded border p-2">
                <p className="font-medium">{notification.title}</p>
                <p className="text-muted-foreground">{notification.body}</p>
              </li>
            ))}
            {notifications.length === 0 ? <li className="text-muted-foreground">No notifications.</li> : null}
          </ul>
        </article>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Capacity and safeguards snapshot</h2>
        <p>Quota state: {policy.quotaState}</p>
        <p>Kill switch: {policy.killSwitchEnabled ? 'enabled' : 'disabled'}</p>
        <p>Message rate: {policy.maxMessagesPerMinute}/min</p>
      </section>

      {isAdmin ? (
        <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
          <h2 className="text-lg font-medium">Admin controls</h2>
          <p className="text-muted-foreground">Use Foundation admin APIs for capacity policy, rate-limit evaluation, and audit monitoring.</p>
          <p>
            <Link className="underline underline-offset-4" href="/admin/foundation">Open /admin/foundation</Link>
          </p>
        </section>
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

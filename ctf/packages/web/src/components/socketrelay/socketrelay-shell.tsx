import Link from 'next/link';
import {
  getProfile,
  listAnnouncementsForSocketRelayUser,
  listMyFulfillments,
  listRequests,
} from '@/src/lib/socketrelay/repository';

type SocketRelayShellProps = {
  userId: string;
  role: string | null;
  isAdmin: boolean;
};

export async function SocketRelayShell({ userId, role, isAdmin }: SocketRelayShellProps) {
  const [profile, myRequests, myFulfillments, announcements] = await Promise.all([
    getProfile(userId),
    listRequests({ page: 1, pageSize: 8, ownerUserId: userId }),
    listMyFulfillments(userId),
    listAnnouncementsForSocketRelayUser({ userId, role, page: 1, pageSize: 8 }),
  ]);

  const activeFulfillments = myFulfillments.filter((item) => item.status === 'active').length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">SocketRelay</h1>
        <p className="text-sm text-muted-foreground">
          Request-and-fulfillment lifecycle with participant chat, announcement visibility, and public sharing controls.
        </p>
      </header>

      {/* Service Credits Section */}
      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Send Service Credits</h2>
        <form
          className="space-y-2"
          action="/api/socketrelay/service-credits"
          method="POST"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const toUserId = form.toUserId.value;
            const amount = Number(form.amount.value);
            const reason = form.reason.value;
            const res = await fetch('/api/socketrelay/service-credits', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ toUserId, amount, reason }),
            });
            if (res.ok) {
              alert('Service credits sent!');
              form.reset();
            } else {
              const data = await res.json();
              alert(data.message || 'Failed to send service credits.');
            }
          }}
        >
          <div>
            <label htmlFor="toUserId" className="block font-medium">Recipient User ID</label>
            <input name="toUserId" id="toUserId" required className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label htmlFor="amount" className="block font-medium">Amount</label>
            <input name="amount" id="amount" type="number" min="1" required className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label htmlFor="reason" className="block font-medium">Reason (optional)</label>
            <input name="reason" id="reason" className="border rounded px-2 py-1 w-full" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        </form>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">My requests</p>
          <p className="text-2xl font-semibold">{myRequests.total}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">My fulfillments</p>
          <p className="text-2xl font-semibold">{myFulfillments.length}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Active fulfillments</p>
          <p className="text-2xl font-semibold">{activeFulfillments}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 space-y-3 text-sm">
          <h2 className="text-lg font-medium">My profile</h2>
          {profile ? (
            <>
              <p>Display name: {profile.displayName ?? 'not set'}</p>
              <p>Presence opt-in: {profile.presenceOptIn ? 'yes' : 'no'}</p>
              <p className="text-muted-foreground">{profile.bio ?? 'No bio set.'}</p>
            </>
          ) : (
            <p className="text-muted-foreground">No profile created yet.</p>
          )}
        </article>

        <article className="rounded-lg border bg-card p-5 space-y-3 text-sm">
          <h2 className="text-lg font-medium">Announcements</h2>
          <ul className="space-y-2">
            {announcements.items.map((item) => (
              <li key={item.id} className="rounded border p-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground">{item.body}</p>
              </li>
            ))}
            {announcements.items.length === 0 ? <li className="text-muted-foreground">No announcements.</li> : null}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 space-y-3 text-sm">
          <h2 className="text-lg font-medium">Recent requests</h2>
          <ul className="space-y-2">
            {myRequests.items.map((item) => (
              <li key={item.id} className="rounded border p-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground">Status: {item.status}</p>
              </li>
            ))}
            {myRequests.items.length === 0 ? <li className="text-muted-foreground">No requests yet.</li> : null}
          </ul>
        </article>

        <article className="rounded-lg border bg-card p-5 space-y-3 text-sm">
          <h2 className="text-lg font-medium">Recent fulfillments</h2>
          <ul className="space-y-2">
            {myFulfillments.slice(0, 8).map((item) => (
              <li key={item.id} className="rounded border p-2">
                <p className="font-medium">Fulfillment {item.id.slice(0, 8)}…</p>
                <p className="text-muted-foreground">Status: {item.status}</p>
              </li>
            ))}
            {myFulfillments.length === 0 ? <li className="text-muted-foreground">No fulfillments yet.</li> : null}
          </ul>
        </article>
      </section>

      {isAdmin ? (
        <p className="text-sm">
          <Link className="underline underline-offset-4" href="/admin/socketrelay">Open /admin/socketrelay</Link>
        </p>
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

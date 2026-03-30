import { evaluatePluginAccess } from '../lib/auth/server-authz';
import { getUnlockDashboardSnapshot, listUnlockSubmissions } from '../lib/unlock/repository';
import { redirect } from 'next/navigation';

export default async function UnlockAdminPage() {
  const access = await evaluatePluginAccess({ requiredRoles: ['admin'], requireUsername: false });
  if (!access.allowed) {
    redirect('/');
  }

  const [dashboard, queue] = await Promise.all([
    getUnlockDashboardSnapshot(),
    listUnlockSubmissions({ reviewStatus: 'pending', limit: 20 }),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Unlock Admin</h1>
        <p className="text-sm text-muted-foreground">
          Internal verification queue for staged unlock orchestration. This plugin remains hidden from end-user app listings.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-1">
        <h2 className="text-lg font-medium">Queue snapshot</h2>
        <p>Pending reviews: {dashboard.pendingCount}</p>
        <p>Approved: {dashboard.approvedCount}</p>
        <p>Rejected: {dashboard.rejectedCount}</p>
        <p>Spam: {dashboard.spamCount}</p>
        <p>Support-only locked: {dashboard.lockedSupportOnlyCount}</p>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-3">
        <h2 className="text-lg font-medium">Pending submissions</h2>
        {queue.length === 0 ? <p>No pending submissions.</p> : null}
        {queue.map((submission) => (
          <article key={submission.id} className="rounded border p-3 space-y-1">
            <p className="font-medium">Submission #{submission.id}</p>
            <p>User: {submission.userId}</p>
            <p>URL: {submission.quoraProfileUrl}</p>
            <p>Window expires: {new Date(submission.unlockWindowExpiresAt).toISOString()}</p>
            <p>Status: {submission.reviewStatus}</p>
            <p>Tier: {submission.accessTier}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-1">
        <h2 className="text-lg font-medium">Retool API bootstrap</h2>
        <p>GET /api/unlock/admin/submissions</p>
        <p>POST /api/unlock/admin/submissions/:submissionId/review</p>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { evaluatePluginAccess } from 'lib/auth/server-authz';

export const dynamic = 'force-dynamic';
import { getTreasuryConfig } from 'lib/service-credits/repository';

export default async function ServiceCreditsAdminPage() {
  const decision = await evaluatePluginAccess({ requireApprovedUserOrAdmin: true, requireUsername: false });
  if (!decision.allowed || !decision.isAdmin) {
    redirect('/apps/service-credits');
  }

  const treasuryConfig = await getTreasuryConfig();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Service Credits Admin</h1>
        <p className="text-sm text-muted-foreground">Treasury governance, disputes, and adapter/accounting controls.</p>
      </header>

      <section className="rounded-lg border bg-card p-5 text-sm">
        <p>Treasury policy keys: {Object.keys(treasuryConfig).length}</p>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/apps/service-credits">Open plugin shell</Link>
      </p>
    </main>
  );
}

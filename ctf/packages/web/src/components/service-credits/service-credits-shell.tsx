import Link from 'next/link';
import { getOrCreateWallet, getTreasuryConfig } from '@/src/lib/service-credits/repository';

type ServiceCreditsShellProps = {
  userId: string;
  isAdmin: boolean;
};

export async function ServiceCreditsShell({ userId, isAdmin }: ServiceCreditsShellProps) {
  const [wallet, treasuryConfig] = await Promise.all([
    getOrCreateWallet(userId),
    isAdmin ? getTreasuryConfig() : Promise.resolve(null),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Service Credits</h1>
        <p className="text-sm text-muted-foreground">
          Wallet, transfer, dispute, treasury, and deletion-reclaim accounting with non-GDP treatment controls.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Available balance</p>
          <p className="text-xl font-semibold">{wallet.availableBalance.toFixed(2)}</p>
        </article>
        <article className="rounded-lg border bg-card p-4 text-sm">
          <p className="text-xs text-muted-foreground">Escrow balance</p>
          <p className="text-xl font-semibold">{wallet.escrowBalance.toFixed(2)}</p>
        </article>
      </section>

      {isAdmin ? (
        <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
          <p>Treasury policy loaded: {treasuryConfig ? 'yes' : 'no'}</p>
          <p>
            <Link className="underline underline-offset-4" href="/admin/service-credits">Open /admin/service-credits</Link>
          </p>
        </section>
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

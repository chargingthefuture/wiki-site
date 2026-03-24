type UserDashboardProps = {
  wallet: {
    availableBalance: number;
    walletEscrowBalance: number;
    levelupEscrowedBalance: number;
  };
  activeEnrollments: Array<{ id: string; title: string; track: string; status: string; progress: number }>;
  recentTransactions: Array<{ id: string; type: string; amount: number; referenceType: string; createdAtIso: string }>;
};

export function UserDashboard({ wallet, activeEnrollments, recentTransactions }: UserDashboardProps) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="text-lg font-medium">User Dashboard</h2>

      <div className="grid gap-3 md:grid-cols-3 text-sm">
        <article className="rounded border p-3">
          <p className="text-xs text-muted-foreground">Available credits</p>
          <p className="text-lg font-semibold">{wallet.availableBalance.toFixed(2)}</p>
        </article>
        <article className="rounded border p-3">
          <p className="text-xs text-muted-foreground">Wallet escrow</p>
          <p className="text-lg font-semibold">{wallet.walletEscrowBalance.toFixed(2)}</p>
        </article>
        <article className="rounded border p-3">
          <p className="text-xs text-muted-foreground">LevelUp escrowed</p>
          <p className="text-lg font-semibold">{wallet.levelupEscrowedBalance.toFixed(2)}</p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2 text-sm">
        <article className="space-y-2">
          <h3 className="font-medium">Active enrollments</h3>
          <ul className="space-y-2">
            {activeEnrollments.map((enrollment) => (
              <li key={enrollment.id} className="rounded border p-2">
                <p className="font-medium">{enrollment.title}</p>
                <p className="text-muted-foreground">{enrollment.track} · {enrollment.status} · {enrollment.progress}%</p>
              </li>
            ))}
            {activeEnrollments.length === 0 ? <li className="text-muted-foreground">No enrollments yet.</li> : null}
          </ul>
        </article>

        <article className="space-y-2">
          <h3 className="font-medium">Recent transactions</h3>
          <ul className="space-y-2">
            {recentTransactions.map((entry) => (
              <li key={entry.id} className="rounded border p-2">
                <p className="font-medium">{entry.type} · {entry.amount.toFixed(2)}</p>
                <p className="text-muted-foreground">{entry.referenceType} · {new Date(entry.createdAtIso).toLocaleString()}</p>
              </li>
            ))}
            {recentTransactions.length === 0 ? <li className="text-muted-foreground">No transactions yet.</li> : null}
          </ul>
        </article>
      </div>
    </section>
  );
}

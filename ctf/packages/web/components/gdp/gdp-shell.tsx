import Link from 'next/link';
import { getLatestPublication } from '../lib/gdp/repository';

type GdpShellProps = {
  isAdmin: boolean;
};

export async function GdpShell({ isAdmin }: GdpShellProps) {
  const report = await getLatestPublication();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">GDP</h1>
        <p className="text-sm text-muted-foreground">
          Aggregate transparency and publish workflow with lawful-basis and DP suppression metadata.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">Current publication</h2>
        <p>Title: {report?.publication.title ?? 'No published report'}</p>
        <p>Week: {report?.publication.weekStartDate ?? 'n/a'}</p>
        <p>Metrics: {report?.metrics.length ?? 0}</p>
      </section>

      {isAdmin ? (
        <p className="text-sm">
          <Link className="underline underline-offset-4" href="/admin/gdp">Open /admin/gdp</Link>
        </p>
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

import Link from 'next/link';

export function MoodShell() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Mood</h1>
        <p className="text-sm text-muted-foreground">
          Authenticated mood check flow with anonymous clientId persistence and 7-day cooldown eligibility.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-5 space-y-2 text-sm">
        <h2 className="text-lg font-medium">API surface</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><code>GET /api/mood/eligibility?clientId=...</code></li>
          <li><code>POST /api/mood/submissions</code></li>
        </ul>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

import Link from 'next/link';
import { listLibraryItems } from '@/src/lib/gentlepulse/repository';

export async function GentlePulseShell() {
  const items = await listLibraryItems();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">GentlePulse</h1>
        <p className="text-sm text-muted-foreground">
          Library listing/detail/play with ratings and favorites. Excluded: plugin admin routes, announcements, and progress endpoints.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-5 space-y-3 text-sm">
        <h2 className="text-lg font-medium">Library</h2>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded border p-2">
              <p className="font-medium">{item.title}</p>
              <p className="text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

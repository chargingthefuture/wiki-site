import Link from 'next/link';

const plugins = [
  { slug: 'chyme', name: 'Chyme' },
  { slug: 'skills-hunt', name: 'Skills Hunt' },
  { slug: 'foundation', name: 'Foundation' },
  { slug: 'lighthouse', name: 'LightHouse' },
  { slug: 'socketrelay', name: 'SocketRelay' },
  { slug: 'trusttransport', name: 'TrustTransport' },
  { slug: 'directory', name: 'Directory' },
  { slug: 'service-credits', name: 'Service Credits' },
  { slug: 'levelup', name: 'LevelUp' },
];

export default function AppsIndexPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Plugin Apps</h1>
      <p className="text-muted-foreground text-sm">Select a plugin to open its UI. All plugin routes are under <code>/apps/[pluginSlug]</code>.</p>
      <ul className="space-y-3 mt-6">
        {plugins.map((plugin) => (
          <li key={plugin.slug}>
            <Link href={`/apps/${plugin.slug}`} className="underline text-blue-600 hover:text-blue-800">
              {plugin.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

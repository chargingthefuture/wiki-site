import Link from 'next/link';
import { getFlattened, getHierarchy } from 'lib/skills-taxonomy/repository';

type SkillsTaxonomyShellProps = {
  isAdmin: boolean;
};

export async function SkillsTaxonomyShell({ isAdmin }: SkillsTaxonomyShellProps) {
  const [hierarchy, flattened] = await Promise.all([
    getHierarchy(false),
    getFlattened(false, true),
  ]);

  const sectorCount = hierarchy.length;
  const jobTitleCount = hierarchy.reduce((acc, sector) => acc + sector.jobTitles.length, 0);
  const skillCount = flattened.length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Skills Taxonomy</h1>
        <p className="text-sm text-muted-foreground">
          Hierarchy and flattened projections for sectors, job titles, and skills, with admin mutation surfaces.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Sectors</p>
          <p className="text-2xl font-semibold">{sectorCount}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Job titles</p>
          <p className="text-2xl font-semibold">{jobTitleCount}</p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Skills</p>
          <p className="text-2xl font-semibold">{skillCount}</p>
        </article>
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-lg font-medium">Hierarchy snapshot</h2>
        <ul className="space-y-3 text-sm">
          {hierarchy.slice(0, 6).map((sector) => (
            <li key={sector.id} className="rounded border p-3">
              <p className="font-medium">{sector.name}</p>
              <p className="text-muted-foreground">
                {sector.jobTitles.length} job titles
              </p>
            </li>
          ))}
          {hierarchy.length === 0 ? <li className="text-muted-foreground">No sectors available.</li> : null}
        </ul>
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-lg font-medium">Flattened projection snapshot</h2>
        <ul className="space-y-2 text-sm">
          {flattened.slice(0, 10).map((item) => (
            <li key={item.skillId} className="rounded border p-2">
              <p className="font-medium">{item.skillName}</p>
              <p className="text-muted-foreground">{item.sectorName} · {item.jobTitleName}</p>
            </li>
          ))}
          {flattened.length === 0 ? <li className="text-muted-foreground">No flattened taxonomy records available.</li> : null}
        </ul>
      </section>

      <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
        <h2 className="text-lg font-medium">API surface</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><code>GET /api/skills-taxonomy/hierarchy</code></li>
          <li><code>GET /api/skills-taxonomy/flattened</code></li>
          {isAdmin ? (
            <>
              <li><code>POST /api/skills-taxonomy/admin/sectors</code></li>
              <li><code>POST /api/skills-taxonomy/admin/job-titles</code></li>
              <li><code>POST /api/skills-taxonomy/admin/skills</code></li>
            </>
          ) : null}
        </ul>
      </section>

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

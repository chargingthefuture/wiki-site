import Link from 'next/link';

type CohortListItem = {
  id: string;
  title: string;
  track: string;
  status: string;
  startDate: string;
  seatsAvailable: number;
  requiredCredits: number;
};

type CohortListProps = {
  cohorts: CohortListItem[];
  activeCohortId: string | null;
};

export function CohortList({ cohorts, activeCohortId }: CohortListProps) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="text-lg font-medium">Cohorts</h2>
      <ul className="space-y-2 text-sm">
        {cohorts.map((cohort) => (
          <li key={cohort.id} className={`rounded border p-3 ${activeCohortId === cohort.id ? 'border-blue-500' : ''}`}>
            <p className="font-medium">{cohort.title}</p>
            <p className="text-muted-foreground">
              {cohort.track} · {cohort.status} · starts {cohort.startDate}
            </p>
            <p className="text-muted-foreground">Seats available: {cohort.seatsAvailable} · Required credits: {cohort.requiredCredits.toFixed(2)}</p>
            <p>
              <Link className="underline underline-offset-4" href={`/apps/levelup?cohortId=${encodeURIComponent(cohort.id)}`}>
                View cohort detail
              </Link>
            </p>
          </li>
        ))}
        {cohorts.length === 0 ? <li className="text-muted-foreground">No cohorts match current filters.</li> : null}
      </ul>
    </section>
  );
}

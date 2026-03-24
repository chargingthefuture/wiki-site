type CohortDetailProps = {
  cohort: {
    id: string;
    title: string;
    description: string;
    track: string;
    status: string;
    startDate: string;
    endDate: string;
    requiredCredits: number;
    materialsCost: number;
    deviceSupport: boolean;
    allowNoDeposit: boolean;
    trainerSplitPercent: number;
    completionBonusCredits: number;
    curriculum: Array<{ id: string; title: string; description: string; sequenceNo: number }>;
    milestones: Array<{ id: string; name: string; percentRelease: number; requiredTask: string; sequenceNo: number }>;
  };
};

export function CohortDetail({ cohort }: CohortDetailProps) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-4">
      <header>
        <h2 className="text-lg font-medium">{cohort.title}</h2>
        <p className="text-sm text-muted-foreground">{cohort.track} · {cohort.status} · {cohort.startDate} to {cohort.endDate}</p>
      </header>

      <p className="text-sm">{cohort.description}</p>

      <dl className="grid gap-2 text-sm md:grid-cols-2">
        <div className="rounded border p-2">
          <dt className="font-medium">Required credits</dt>
          <dd>{cohort.requiredCredits.toFixed(2)}</dd>
        </div>
        <div className="rounded border p-2">
          <dt className="font-medium">Materials cost</dt>
          <dd>{cohort.materialsCost.toFixed(2)}</dd>
        </div>
        <div className="rounded border p-2">
          <dt className="font-medium">Device support</dt>
          <dd>{cohort.deviceSupport ? 'Included' : 'Not included'}</dd>
        </div>
        <div className="rounded border p-2">
          <dt className="font-medium">Deposit policy</dt>
          <dd>{cohort.allowNoDeposit ? 'Deposit optional' : 'Deposit required'}</dd>
        </div>
        <div className="rounded border p-2">
          <dt className="font-medium">Trainer split</dt>
          <dd>{cohort.trainerSplitPercent}%</dd>
        </div>
        <div className="rounded border p-2">
          <dt className="font-medium">Completion bonus</dt>
          <dd>{cohort.completionBonusCredits.toFixed(2)}</dd>
        </div>
      </dl>

      <section className="space-y-2 text-sm">
        <h3 className="font-medium">Curriculum</h3>
        <ul className="space-y-2">
          {cohort.curriculum.map((item) => (
            <li key={item.id} className="rounded border p-2">
              <p className="font-medium">{item.sequenceNo}. {item.title}</p>
              <p className="text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h3 className="font-medium">Milestones</h3>
        <ul className="space-y-2">
          {cohort.milestones.map((milestone) => (
            <li key={milestone.id} className="rounded border p-2">
              <p className="font-medium">{milestone.sequenceNo}. {milestone.name}</p>
              <p className="text-muted-foreground">{milestone.requiredTask}</p>
              <p className="text-muted-foreground">Release: {milestone.percentRelease}%</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

type TrainerDashboardProps = {
  cohorts: Array<{ id: string; title: string; status: string; track: string }>;
  pendingValidations: Array<{ enrollmentId: string; milestoneId: string; title: string; milestoneName: string; validatedAtIso: string }>;
  trainees: Array<{ enrollmentId: string; userId: string; cohortTitle: string; status: string; progress: number }>;
  payoutLedger: Array<{ id: string; amount: number; createdAtIso: string }>;
};

export function TrainerDashboard({ cohorts, pendingValidations, trainees, payoutLedger }: TrainerDashboardProps) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="text-lg font-medium">Trainer Dashboard</h2>

      <div className="grid gap-4 lg:grid-cols-2 text-sm">
        <article className="space-y-2">
          <h3 className="font-medium">Cohorts created</h3>
          <ul className="space-y-2">
            {cohorts.map((cohort) => (
              <li key={cohort.id} className="rounded border p-2">
                <p className="font-medium">{cohort.title}</p>
                <p className="text-muted-foreground">{cohort.track} · {cohort.status}</p>
              </li>
            ))}
            {cohorts.length === 0 ? <li className="text-muted-foreground">No cohorts created.</li> : null}
          </ul>
        </article>

        <article className="space-y-2">
          <h3 className="font-medium">Pending validations</h3>
          <ul className="space-y-2">
            {pendingValidations.map((item) => (
              <li key={`${item.enrollmentId}:${item.milestoneId}`} className="rounded border p-2">
                <p className="font-medium">{item.title} · {item.milestoneName}</p>
                <p className="text-muted-foreground">Validated at {new Date(item.validatedAtIso).toLocaleString()}</p>
              </li>
            ))}
            {pendingValidations.length === 0 ? <li className="text-muted-foreground">No pending milestone validations.</li> : null}
          </ul>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 text-sm">
        <article className="space-y-2">
          <h3 className="font-medium">Trainee list</h3>
          <ul className="space-y-2">
            {trainees.map((trainee) => (
              <li key={trainee.enrollmentId} className="rounded border p-2">
                <p className="font-medium">{trainee.userId}</p>
                <p className="text-muted-foreground">{trainee.cohortTitle} · {trainee.status} · {trainee.progress}%</p>
              </li>
            ))}
            {trainees.length === 0 ? <li className="text-muted-foreground">No trainees assigned.</li> : null}
          </ul>
        </article>

        <article className="space-y-2">
          <h3 className="font-medium">Payout ledger</h3>
          <ul className="space-y-2">
            {payoutLedger.map((entry) => (
              <li key={entry.id} className="rounded border p-2">
                <p className="font-medium">{entry.amount.toFixed(2)} credits</p>
                <p className="text-muted-foreground">{new Date(entry.createdAtIso).toLocaleString()}</p>
              </li>
            ))}
            {payoutLedger.length === 0 ? <li className="text-muted-foreground">No trainer payouts yet.</li> : null}
          </ul>
        </article>
      </div>
    </section>
  );
}

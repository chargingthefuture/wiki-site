import Link from 'next/link';
import { AdminPanel } from '@/src/components/levelup/AdminPanel';
import { CohortDetail } from '@/src/components/levelup/CohortDetail';
import { CohortList } from '@/src/components/levelup/CohortList';
import { EnrollModal } from '@/src/components/levelup/EnrollModal';
import { TrainerDashboard } from '@/src/components/levelup/TrainerDashboard';
import { UserDashboard } from '@/src/components/levelup/UserDashboard';
import { getAdminPanelData, getCohortDetail, getTrainerDashboardData, getUserDashboardData, listCohorts } from '@/src/lib/levelup/repository';

type LevelupShellProps = {
  userId: string;
  isAdmin: boolean;
  query?: {
    track?: string;
    status?: string;
    startDate?: string;
    cohortId?: string;
  };
};

export async function LevelupShell({ userId, isAdmin, query }: LevelupShellProps) {
  const cohorts = await listCohorts({
    track: query?.track,
    status: query?.status,
    startDate: query?.startDate,
    seatsAvailableOnly: false,
  });

  const selectedCohortId = query?.cohortId ?? cohorts[0]?.id ?? null;

  const [selectedCohort, userDashboard, trainerDashboard, adminPanel] = await Promise.all([
    selectedCohortId ? getCohortDetail(selectedCohortId).catch(() => null) : Promise.resolve(null),
    getUserDashboardData(userId),
    getTrainerDashboardData(userId),
    isAdmin ? getAdminPanelData() : Promise.resolve(null),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">LevelUp</h1>
        <p className="text-sm text-muted-foreground">
          Survivor training cohorts with milestone escrow release, trainer payouts, stipends, and dispute handling.
        </p>
      </header>

      <form className="rounded-lg border bg-card p-4 text-sm grid gap-3 md:grid-cols-4">
        <label className="space-y-1">
          <span>Track</span>
          <input name="track" defaultValue={query?.track ?? ''} className="w-full rounded border px-2 py-1" placeholder="Remote Dev" />
        </label>
        <label className="space-y-1">
          <span>Status</span>
          <input name="status" defaultValue={query?.status ?? ''} className="w-full rounded border px-2 py-1" placeholder="open" />
        </label>
        <label className="space-y-1">
          <span>Start date</span>
          <input name="startDate" type="date" defaultValue={query?.startDate ?? ''} className="w-full rounded border px-2 py-1" />
        </label>
        <div className="flex items-end">
          <button type="submit" className="rounded border px-3 py-2">Apply filters</button>
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        <CohortList cohorts={cohorts} activeCohortId={selectedCohortId} />

        {selectedCohort ? (
          <div className="space-y-3">
            <CohortDetail cohort={selectedCohort} />
            <EnrollModal
              cohortId={selectedCohort.id}
              requiredCredits={selectedCohort.requiredCredits}
              allowNoDeposit={selectedCohort.allowNoDeposit}
            />
          </div>
        ) : (
          <section className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">Select a cohort to view details.</section>
        )}
      </div>

      <UserDashboard
        wallet={userDashboard.wallet}
        activeEnrollments={userDashboard.activeEnrollments}
        recentTransactions={userDashboard.recentTransactions}
      />

      <TrainerDashboard
        cohorts={trainerDashboard.cohorts}
        pendingValidations={trainerDashboard.pendingValidations}
        trainees={trainerDashboard.trainees}
        payoutLedger={trainerDashboard.payoutLedger}
      />

      {isAdmin && adminPanel ? <AdminPanel kpis={adminPanel.kpis} /> : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}

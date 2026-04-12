// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cronTasks: any[] = [];
let cronInitialized = false;

export async function initializeCronJobs(): Promise<void> {
  // Guard: Only initialize once, only in nodejs runtime (not edge)
  if (cronInitialized || process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (
    process.env.NEXT_PHASE === 'phase-production-build'
    || process.env.CTF_SKIP_SENTRY_NEXTJS === '1'
  ) {
    return;
  }

  cronInitialized = true;

  try {
    console.log('[Cron] Initializing cron jobs...');

    // Only initialize cron jobs if CRON_SECRET is configured
    if (!process.env.CRON_SECRET || process.env.CRON_SECRET.trim().length === 0) {
      console.warn('[Cron] CRON_SECRET not configured; cron jobs disabled');
      return;
    }

    const { scheduleWorkforceSyncCron } = await import('./workforce-sync');
    const workforceSyncTask = await scheduleWorkforceSyncCron();
    cronTasks.push(workforceSyncTask);

    console.log('[Cron] Cron jobs initialized successfully');
  } catch (error) {
    console.error('[Cron] Failed to initialize cron jobs:', error);
    // Don't throw - allow server to start even if cron setup fails
  }
}

export function stopCronJobs(): void {
  for (const task of cronTasks) {
    task.stop();
  }
  cronTasks = [];
  cronInitialized = false;
}

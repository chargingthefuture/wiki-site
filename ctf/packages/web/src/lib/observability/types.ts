export type ObservabilityProvider = 'sentry' | 'noop';

export type CronCheckInStatus = 'in_progress' | 'ok' | 'error';

export type CronCheckInInput = {
  monitorSlug: string;
  status: CronCheckInStatus;
  checkInId?: string;
};

export type ObservabilityReporter = {
  captureCronCheckIn(input: CronCheckInInput): Promise<string | undefined>;
};

import type { CronCheckInInput, ObservabilityReporter } from './types';
import { resolveWebSentryDsn } from './sentry-config';

type SentryModule = {
  init: (options: Record<string, unknown>) => void;
  captureCheckIn: (checkIn: {
    monitorSlug: string;
    status: 'in_progress' | 'ok' | 'error';
    checkInId?: string;
  }) => string;
};

let sentryModulePromise: Promise<SentryModule | null> | null = null;

async function getSentryModule(): Promise<SentryModule | null> {
  if (!sentryModulePromise) {
    sentryModulePromise = import('@sentry/nextjs')
      .then((module) => module as unknown as SentryModule)
      .catch(() => null);
  }

  return sentryModulePromise;
}

export function createSentryReporter(): ObservabilityReporter {
  return {
    async captureCronCheckIn(input: CronCheckInInput): Promise<string | undefined> {
      try {
        if (!resolveWebSentryDsn()) {
          return undefined;
        }

        const sentrySdk = await getSentryModule();
        if (!sentrySdk) {
          return undefined;
        }

        return sentrySdk.captureCheckIn({
          monitorSlug: input.monitorSlug,
          status: input.status,
          checkInId: input.checkInId,
        });
      } catch {
        return undefined;
      }
    },
  };
}

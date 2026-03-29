import { createNoopReporter } from './noop-reporter';
import { createSentryReporter } from './sentry-reporter.server';
import type { ObservabilityProvider, ObservabilityReporter } from './types';

let reporterInstance: ObservabilityReporter | null = null;

function resolveProvider(): ObservabilityProvider {
  const raw = (process.env.OBSERVABILITY_PROVIDER ?? '').trim().toLowerCase();
  return raw === 'sentry' ? 'sentry' : 'noop';
}

export function getObservabilityReporter(): ObservabilityReporter {
  if (reporterInstance) {
    return reporterInstance;
  }

  reporterInstance = resolveProvider() === 'sentry'
    ? createSentryReporter()
    : createNoopReporter();

  return reporterInstance;
}

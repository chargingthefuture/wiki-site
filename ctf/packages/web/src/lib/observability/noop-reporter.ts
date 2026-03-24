import type { ObservabilityReporter } from './types';

const noopReporter: ObservabilityReporter = {
  async captureCronCheckIn(): Promise<string | undefined> {
    return undefined;
  },
};

export function createNoopReporter(): ObservabilityReporter {
  return noopReporter;
}

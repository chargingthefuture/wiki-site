import {
  createErrorReporter,
  createNoopErrorReporter,
  resolveObservabilityProvider,
} from "./errorReporter";
import { createSentryReporter } from "./sentryReporter";
import { createSignozReporter } from "./signozReporter";

export const createRuntimeErrorReporter = (rawProvider: string | undefined) => {
  return createErrorReporter(resolveObservabilityProvider(rawProvider), {
    sentry: createSentryReporter,
    signoz: createSignozReporter,
    noop: createNoopErrorReporter,
  });
};

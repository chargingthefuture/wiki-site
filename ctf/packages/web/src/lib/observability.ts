import {
  createErrorReporter,
  createNoopErrorReporter,
  createSentryReporter,
  createSignozReporter,
  resolveObservabilityProvider,
} from "@ctf/shared";
import * as Sentry from "@sentry/nextjs";

const rawProvider =
  process.env.NEXT_PUBLIC_OBSERVABILITY_PROVIDER ?? process.env.OBSERVABILITY_PROVIDER;

export const webObservabilityProvider = resolveObservabilityProvider(rawProvider);

export const webErrorReporter = createErrorReporter(webObservabilityProvider, {
  sentry: () =>
    createSentryReporter((event) => {
      Sentry.captureMessage(event.message, {
        level: event.level,
        tags: event.tags,
        contexts: event.context ? { custom: event.context } : undefined,
        fingerprint: event.fingerprint,
      });
    }),
  signoz: () => createSignozReporter(),
  noop: () => createNoopErrorReporter(),
});

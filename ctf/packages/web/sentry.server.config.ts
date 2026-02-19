import * as Sentry from "@sentry/nextjs";
import {
  createSentryNoiseFilterOptions,
  shouldDropSentryEvent,
  shouldDropTransaction,
} from "./src/lib/sentryNoiseFilter";

const filterOptions = createSentryNoiseFilterOptions({
  allowlistMode: process.env.SENTRY_ROUTE_ALLOWLIST_MODE,
  allowedRoutePrefixes: process.env.SENTRY_ALLOWED_ROUTE_PREFIXES,
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.02"),
  sendDefaultPii: false,
  beforeSend: (event) => {
    if (shouldDropSentryEvent(event, filterOptions)) {
      return null;
    }

    return event;
  },
  tracesSampler: (samplingContext) => {
    if (
      shouldDropTransaction({
        name: samplingContext.name,
        attributes: samplingContext.attributes,
      }, filterOptions)
    ) {
      return 0;
    }

    return Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.02");
  },
});

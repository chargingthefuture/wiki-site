import * as Sentry from "@sentry/nextjs";
import { createSentryNoiseFilterOptions, shouldDropSentryEvent } from "./src/lib/sentryNoiseFilter";

const filterOptions = createSentryNoiseFilterOptions({
  allowlistMode: process.env.NEXT_PUBLIC_SENTRY_ROUTE_ALLOWLIST_MODE,
  allowedRoutePrefixes: process.env.NEXT_PUBLIC_SENTRY_ALLOWED_ROUTE_PREFIXES,
});

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.02"),
  sendDefaultPii: false,
  beforeSend: (event) => {
    if (shouldDropSentryEvent(event, filterOptions)) {
      return null;
    }

    return event;
  },
});

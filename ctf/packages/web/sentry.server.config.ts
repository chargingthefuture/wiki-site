import * as Sentry from '@sentry/nextjs';
import { resolveWebSentryDsn } from 'lib/observability/sentry-config';

const dsn = resolveWebSentryDsn();

if (dsn) {
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    environment: process.env.NODE_ENV,
  });
}

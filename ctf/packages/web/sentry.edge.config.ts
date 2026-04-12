import * as Sentry from '@sentry/nextjs';
import { resolveWebSentryDsn } from './lib/observability/sentry-config';

const dsn = resolveWebSentryDsn();
const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;

if (dsn) {
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    environment: nodeEnv,
  });
}

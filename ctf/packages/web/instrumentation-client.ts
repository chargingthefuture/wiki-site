
import * as Sentry from '@sentry/nextjs';

// Sentry navigation instrumentation for Next.js 15+
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;


// Sentry client config (migrated from sentry.client.config.ts)
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
// ...existing code...

// Optionally, you can export other hooks or setup as needed

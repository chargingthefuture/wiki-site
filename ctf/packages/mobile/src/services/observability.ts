import {
	createErrorReporter,
	createNoopErrorReporter,
	createSentryReporter,
	createSignozReporter,
	resolveObservabilityProvider,
} from "@ctf/shared";
import * as Sentry from "@sentry/react-native";

const rawProvider = process.env.EXPO_PUBLIC_OBSERVABILITY_PROVIDER;

export const mobileObservabilityProvider = resolveObservabilityProvider(rawProvider);

if (mobileObservabilityProvider === "sentry") {
	Sentry.init({
		dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
		tracesSampleRate: 0.1,
		sendDefaultPii: false,
	});
}

export const mobileErrorReporter = createErrorReporter(mobileObservabilityProvider, {
	sentry: () =>
		createSentryReporter((event) => {
			Sentry.captureMessage(event.message, {
				level: event.level,
			});
		}),
	signoz: () => createSignozReporter(),
	noop: () => createNoopErrorReporter(),
});

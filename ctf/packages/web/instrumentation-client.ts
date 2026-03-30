import * as Sentry from '@sentry/nextjs';

// Instrument the onRequestError hook for Sentry per Next.js 15+ requirements
export function onRequestError(error: unknown, context: any) {
  Sentry.captureException(error, {
    mechanism: {
      handled: false,
      type: 'auto.function.nextjs.on_request_error',
    },
    extra: context,
  });
}

// Optionally, you can export other hooks or setup as needed

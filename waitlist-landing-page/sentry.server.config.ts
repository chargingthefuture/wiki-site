import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0, // Adjust for production needs
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
})

export function resolveWebSentryDsn(): string {
  return (process.env.RAILWAY_SENTRY_DSN ?? process.env.VERCEL_SENTRY_DSN ?? '').trim();
}

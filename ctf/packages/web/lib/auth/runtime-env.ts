type MaybeEnv = string | undefined;

function firstNonEmpty(...values: MaybeEnv[]): string | undefined {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim();
}

function toAbsoluteUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `https://${value}`;
}

export function getAppUrl(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.RAILWAY_NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
    toAbsoluteUrl(process.env.RAILWAY_PUBLIC_DOMAIN),
    toAbsoluteUrl(process.env.VERCEL_URL),
  );
}

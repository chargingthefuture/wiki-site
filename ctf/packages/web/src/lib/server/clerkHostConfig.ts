export interface ClerkRuntimeConfig {
  host: string;
  publishableKey: string;
  secretKey: string;
  signInUrl: string;
}

type HeaderReader = Pick<Headers, "get">;

const normalizeHost = (input: string | null | undefined): string | null => {
  if (!input) {
    return null;
  }

  const first = input.split(",")[0]?.trim().toLowerCase();
  if (!first) {
    return null;
  }

  if (first.startsWith("[")) {
    const ipv6End = first.indexOf("]");
    return ipv6End > -1 ? first.slice(0, ipv6End + 1) : first;
  }

  const colonIndex = first.indexOf(":");
  return colonIndex > -1 ? first.slice(0, colonIndex) : first;
};

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`${name} is not configured`);
  }

  return value.trim();
};

const resolveHostFromHeaders = (reader: HeaderReader): string | null => {
  const forwardedHost = normalizeHost(reader.get("x-forwarded-host"));
  if (forwardedHost) {
    return forwardedHost;
  }

  return normalizeHost(reader.get("host"));
};

const resolveHostEnvNames = (host: string | null): {
  publishableKeyEnv: string;
  secretKeyEnv: string;
  signInUrlEnv: string;
} => {
  if (!host) {
    throw new Error("Unable to resolve request host for Clerk configuration.");
  }

  if (host === "the-comic.net") {
    return {
      publishableKeyEnv: "VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      secretKeyEnv: "VERCEL_CLERK_SECRET_KEY",
      signInUrlEnv: "VERCEL_CLERK_SIGN_IN_URL",
    };
  }

  if (host === "the-comic.com") {
    return {
      publishableKeyEnv: "RAILWAY_STAGING_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      secretKeyEnv: "RAILWAY_STAGING_CLERK_SECRET_KEY",
      signInUrlEnv: "RAILWAY_STAGING_CLERK_SIGN_IN_URL",
    };
  }

  if (host === "chargingthefuture.com") {
    return {
      publishableKeyEnv: "RAILWAY_PROD_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      secretKeyEnv: "RAILWAY_PROD_CLERK_SECRET_KEY",
      signInUrlEnv: "RAILWAY_PROD_CLERK_SIGN_IN_URL",
    };
  }

  throw new Error(`Clerk host mapping is not configured for host: ${host}`);
};

export const resolveClerkRuntimeConfig = (reader: HeaderReader): ClerkRuntimeConfig => {
  const host = resolveHostFromHeaders(reader);
  const envNames = resolveHostEnvNames(host);

  return {
    host: host ?? "",
    publishableKey: getRequiredEnv(envNames.publishableKeyEnv),
    secretKey: getRequiredEnv(envNames.secretKeyEnv),
    signInUrl: getRequiredEnv(envNames.signInUrlEnv),
  };
};

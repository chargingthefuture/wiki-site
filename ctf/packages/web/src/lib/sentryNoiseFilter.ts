const scannerPathPattern =
  /(wp-admin|wp-login|xmlrpc\.php|phpmyadmin|\.env|\.git|cgi-bin|boaform|hnap1|vendor\/phpunit|\.aws|id_rsa|autodiscover|\.svn|\.DS_Store|\.well-known\/acme-challenge|\.php$|\.asp$|\.aspx$)/i;

const botUserAgentPattern =
  /(python-requests|curl|wget|sqlmap|nikto|nmap|masscan|zgrab|go-http-client|httpclient|scrapy|crawler|scanner|bot)/i;

const clientNoisePattern =
  /(chrome-extension:|moz-extension:|safari-extension:|ResizeObserver loop limit exceeded|Non-Error promise rejection captured)/i;

export interface SentryNoiseFilterOptions {
  routeAllowlistMode: boolean;
  allowedRoutePrefixes: string[];
}

export const createSentryNoiseFilterOptions = (input: {
  allowlistMode?: string;
  allowedRoutePrefixes?: string;
}): SentryNoiseFilterOptions => {
  const routeAllowlistMode = String(input.allowlistMode ?? "false").toLowerCase() === "true";
  const allowedRoutePrefixes = String(input.allowedRoutePrefixes ?? "/,/api,/auth")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return {
    routeAllowlistMode,
    allowedRoutePrefixes,
  };
};

const getHeader = (headers: Record<string, string> | undefined, key: string): string => {
  if (!headers) {
    return "";
  }

  const lowerKey = key.toLowerCase();
  const exact = headers[key] ?? headers[lowerKey];
  if (exact) {
    return exact;
  }

  for (const [headerKey, value] of Object.entries(headers)) {
    if (headerKey.toLowerCase() === lowerKey) {
      return value;
    }
  }

  return "";
};

export const isScannerRequest = (
  url: string | undefined,
  userAgent: string | undefined,
): boolean => {
  const safeUrl = url ?? "";
  const safeAgent = userAgent ?? "";

  return scannerPathPattern.test(safeUrl) || botUserAgentPattern.test(safeAgent);
};

const normalizeRoute = (rawUrl: string | undefined): string => {
  if (!rawUrl) {
    return "";
  }

  const tokenized = rawUrl.trim().split(" ");
  const candidate = tokenized.length > 1 ? tokenized[tokenized.length - 1] : rawUrl.trim();

  try {
    return new URL(candidate, "http://placeholder.local").pathname;
  } catch {
    return candidate;
  }
};

const isOutsideAllowlist = (
  rawUrl: string | undefined,
  options: SentryNoiseFilterOptions,
): boolean => {
  if (!options.routeAllowlistMode) {
    return false;
  }

  const route = normalizeRoute(rawUrl);
  if (!route) {
    return true;
  }

  return !options.allowedRoutePrefixes.some((prefix) => route.startsWith(prefix));
};

export const shouldDropSentryEvent = (event: {
  request?: { url?: string; headers?: Record<string, string> };
  exception?: { values?: Array<{ value?: string; type?: string }> };
  message?: string;
}, options: SentryNoiseFilterOptions): boolean => {
  const url = event.request?.url;
  const userAgent = getHeader(event.request?.headers, "user-agent");

  if (isScannerRequest(url, userAgent)) {
    return true;
  }

  if (isOutsideAllowlist(url, options)) {
    return true;
  }

  const exceptionSummary = (event.exception?.values ?? [])
    .map((value) => `${value.type ?? ""} ${value.value ?? ""}`)
    .join(" ");

  if (clientNoisePattern.test(exceptionSummary) || clientNoisePattern.test(event.message ?? "")) {
    return true;
  }

  return false;
};

export const shouldDropTransaction = (context: {
  name?: string;
  attributes?: Record<string, string | number | boolean | undefined>;
}, options: SentryNoiseFilterOptions): boolean => {
  const routeName = context.name ?? "";
  const userAgent = String(context.attributes?.["http.user_agent"] ?? "");

  if (isOutsideAllowlist(routeName, options)) {
    return true;
  }

  return isScannerRequest(routeName, userAgent);
};

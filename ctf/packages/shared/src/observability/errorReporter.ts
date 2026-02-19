export type ErrorLevel = "debug" | "info" | "warning" | "error" | "fatal";
export type ObservabilityProvider = "sentry" | "signoz" | "noop";

export interface ErrorEvent {
  message: string;
  level: ErrorLevel;
  tags?: Record<string, string>;
  context?: Record<string, unknown>;
  fingerprint?: string[];
  timestampIso: string;
}

export interface ErrorReporter {
  capture(event: ErrorEvent): void;
}

export const createNoopErrorReporter = (): ErrorReporter => {
  return {
    capture: () => {
      return;
    },
  };
};

export interface ErrorReporterFactory {
  sentry: () => ErrorReporter;
  signoz: () => ErrorReporter;
  noop: () => ErrorReporter;
}

export const createErrorReporter = (
  provider: ObservabilityProvider,
  factory: ErrorReporterFactory,
): ErrorReporter => {
  switch (provider) {
    case "sentry":
      return factory.sentry();
    case "signoz":
      return factory.signoz();
    default:
      return factory.noop();
  }
};

export const resolveObservabilityProvider = (
  rawProvider: string | undefined,
): ObservabilityProvider => {
  const normalized = (rawProvider ?? "noop").trim().toLowerCase();

  if (normalized === "sentry") {
    return "sentry";
  }

  if (normalized === "signoz") {
    return "signoz";
  }

  return "noop";
};

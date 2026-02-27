import type { ErrorEvent, ErrorReporter } from "./errorReporter";

export const createSentryReporter = (
  capture: (event: ErrorEvent) => void = (event) => {
    // Fallback capture implementation
  },
): ErrorReporter => {
  return {
    capture: (event: ErrorEvent) => {
      capture(event);
    },
  };
};

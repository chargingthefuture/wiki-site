import type { ErrorEvent, ErrorReporter } from "./errorReporter";

export const createSignozReporter = (
  capture: (event: ErrorEvent) => void = (event) => {
    console.error("Signoz reporter capture", event);
  },
): ErrorReporter => {
  return {
    capture: (event: ErrorEvent) => {
      capture(event);
    },
  };
};

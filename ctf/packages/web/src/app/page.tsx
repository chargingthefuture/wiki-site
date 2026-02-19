import { defaultMakerTierBudget } from "@ctf/shared";
import { webErrorReporter, webObservabilityProvider } from "../lib/observability";

webErrorReporter.capture({
  message: "web_bootstrap_initialized",
  level: "info",
  tags: {
    runtime: "web",
  },
  timestampIso: new Date().toISOString(),
});

export default function HomePage() {
  return (
    <main>
      <h1>TI Skills Economy</h1>
      <p>Chat-first survivor support platform scaffold.</p>
      <p>Stream Chat MAU budget: {defaultMakerTierBudget.monthlyChatMauLimit}</p>
      <p>Observability provider: {webObservabilityProvider}</p>
    </main>
  );
}

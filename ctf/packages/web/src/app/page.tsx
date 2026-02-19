import { defaultMakerTierBudget } from "@ctf/shared";
import { AppShell } from "../components/layout/AppShell";
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
    <AppShell
      streamChatMauLimit={defaultMakerTierBudget.monthlyChatMauLimit}
      observabilityProvider={webObservabilityProvider}
    />
  );
}

import { defaultMakerTierBudget } from "@ctf/shared";
import {
  mobileErrorReporter,
  mobileObservabilityProvider,
} from "./src/services/observability";
import { SafeAreaView, Text } from "react-native";

mobileErrorReporter.capture({
  message: "mobile_bootstrap_initialized",
  level: "info",
  tags: {
    runtime: "mobile",
  },
  timestampIso: new Date().toISOString(),
});

export default function App() {
  return (
    <SafeAreaView>
      <Text>TI Skills Economy</Text>
      <Text>React Native Android scaffold</Text>
      <Text>Stream Chat MAU budget: {defaultMakerTierBudget.monthlyChatMauLimit}</Text>
      <Text>Observability provider: {mobileObservabilityProvider}</Text>
    </SafeAreaView>
  );
}

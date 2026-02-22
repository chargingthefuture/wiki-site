import { defaultMakerTierBudget } from "@ctf/shared";
import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import {
  mobileErrorReporter,
} from "./src/services/observability";
import { useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { InviteOnlyView } from "./src/screens/InviteOnlyScreen";
import { SignedOutView } from "./src/screens/SignedOutView";

mobileErrorReporter.capture({
  message: "mobile_bootstrap_initialized",
  level: "info",
  tags: {
    runtime: "mobile",
  },
  timestampIso: new Date().toISOString(),
});

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

export default function App() {
  const buildProfile = process.env.EAS_BUILD_PROFILE?.trim().toLowerCase();
  const shouldUseProductionKey = buildProfile === "production" || (!buildProfile && !__DEV__);
  const keySource = shouldUseProductionKey ? "railway-prod" : "railway-staging";
  const publishableKey = shouldUseProductionKey
    ? process.env.RAILWAY_PROD_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : process.env.RAILWAY_STAGING_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const didReportClerkConfigRef = useRef(false);

  useEffect(() => {
    if (didReportClerkConfigRef.current) {
      return;
    }

    mobileErrorReporter.capture({
      message: "mobile_clerk_runtime_key_selected",
      level: "info",
      tags: {
        runtime: "mobile",
        keySource,
        keyConfigured: publishableKey ? "true" : "false",
      },
      timestampIso: new Date().toISOString(),
    });

    didReportClerkConfigRef.current = true;
  }, [keySource, publishableKey]);

  if (!publishableKey) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>TI Skills Economy</Text>
          <Text style={styles.error}>
            Set RAILWAY_STAGING_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or RAILWAY_PROD_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY for mobile runtime.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <SignedOut>
          <SignedOutView />
        </SignedOut>
        <SignedIn>
          <InviteOnlyView
            streamChatMauLimit={defaultMakerTierBudget.monthlyChatMauLimit}
          />
        </SignedIn>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f7",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9d9dc",
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1b1b1d",
  },
  error: {
    color: "#8f1f1f",
  },
});

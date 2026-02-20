import { defaultMakerTierBudget } from "@ctf/shared";
import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
  useAuth,
  useClerk,
  useSignIn,
  useUser,
} from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  mobileErrorReporter,
  mobileObservabilityProvider,
} from "./src/services/observability";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

mobileErrorReporter.capture({
  message: "mobile_bootstrap_initialized",
  level: "info",
  tags: {
    runtime: "mobile",
  },
  timestampIso: new Date().toISOString(),
});

const QUORA_PROFILE_PREFIX = "https://quora.com/profile/";

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

interface AccessStatus {
  userId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  quoraProfileUrl: string | null;
  isApproved: boolean;
  isAdmin: boolean;
}

const extractHandle = (url: string | null | undefined): string => {
  if (!url) {
    return "";
  }

  return url
    .replace(/^https?:\/\/(www\.)?quora\.com\/profile\//i, "")
    .replace(/^\//, "")
    .trim();
};

const buildQuoraUrl = (handle: string): string | null => {
  const cleaned = handle
    .trim()
    .replace(/^https?:\/\/(www\.)?quora\.com\/profile\//i, "")
    .replace(/^\//, "");

  if (!cleaned) {
    return null;
  }

  return `${QUORA_PROFILE_PREFIX}${cleaned}`;
};

const getMobileAppUrl = (): string | null => {
  const configured = process.env.MOBILE_APP_URL?.trim();
  if (!configured) {
    return null;
  }

  return configured.endsWith("/") ? configured.slice(0, -1) : configured;
};

function InviteOnlyApp() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [accessStatus, setAccessStatus] = useState<AccessStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [quoraHandle, setQuoraHandle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const appUrl = getMobileAppUrl();

  const loadStatus = useCallback(async () => {
    if (!appUrl) {
      setStatusError("MOBILE_APP_URL is missing.");
      return;
    }

    setIsLoading(true);
    setStatusError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Unable to obtain Clerk session token.");
      }

      const response = await fetch(`${appUrl}/api/account/access-status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Access status request failed (${response.status}).`);
      }

      const payload = (await response.json()) as AccessStatus;
      setAccessStatus(payload);
      setQuoraHandle(extractHandle(payload.quoraProfileUrl));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load access status.";
      setStatusError(message);
      setAccessStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [appUrl, getToken]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (!accessStatus || accessStatus.isApproved || accessStatus.isAdmin) {
      return;
    }

    const timer = setInterval(() => {
      void loadStatus();
    }, 30000);

    return () => clearInterval(timer);
  }, [accessStatus, loadStatus]);

  const saveQuoraUrl = async () => {
    const quoraProfileUrl = buildQuoraUrl(quoraHandle);

    if (!appUrl) {
      setStatusError("MOBILE_APP_URL is missing.");
      return;
    }

    if (!quoraProfileUrl) {
      setStatusError("Please enter your Quora profile handle.");
      return;
    }

    setIsSaving(true);
    setStatusError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Unable to obtain Clerk session token.");
      }

      const response = await fetch(`${appUrl}/api/account/quora-profile-url`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quoraProfileUrl }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to save Quora profile URL.");
      }

      const payload = (await response.json()) as AccessStatus;
      setAccessStatus(payload);
      setQuoraHandle(extractHandle(payload.quoraProfileUrl));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save Quora profile URL.";
      setStatusError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName =
    user?.firstName ??
    user?.username ??
    accessStatus?.firstName ??
    accessStatus?.email ??
    "Member";

  const needsApproval = Boolean(accessStatus && !accessStatus.isApproved && !accessStatus.isAdmin);
  const hasQuoraProfile = Boolean(accessStatus?.quoraProfileUrl);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>TI Skills Economy</Text>
          <Pressable onPress={() => void signOut()}>
            <Text style={styles.link}>Sign out</Text>
          </Pressable>
        </View>

        {!appUrl ? <Text style={styles.error}>Set MOBILE_APP_URL to enable API access.</Text> : null}

        {isLoading ? <ActivityIndicator /> : null}
        {statusError ? <Text style={styles.error}>{statusError}</Text> : null}

        {!isLoading && !accessStatus ? (
          <Pressable style={styles.button} onPress={() => void loadStatus()}>
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        ) : null}

        {needsApproval && !hasQuoraProfile ? (
          <>
            <Text style={styles.subtitle}>Welcome {displayName}. Enter your Quora profile URL for approval.</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputPrefix}>{QUORA_PROFILE_PREFIX}</Text>
              <TextInput
                value={quoraHandle}
                onChangeText={setQuoraHandle}
                placeholder="farah-brunache"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Pressable style={styles.button} onPress={() => void saveQuoraUrl()} disabled={isSaving}>
              <Text style={styles.buttonText}>{isSaving ? "Saving..." : "Save Quora URL"}</Text>
            </Pressable>
          </>
        ) : null}

        {needsApproval && hasQuoraProfile ? (
          <>
            <Text style={styles.subtitle}>Your account is pending admin approval.</Text>
            <Text style={styles.secondaryText}>{accessStatus?.quoraProfileUrl}</Text>
            <Pressable style={styles.button} onPress={() => void loadStatus()}>
              <Text style={styles.buttonText}>Refresh status</Text>
            </Pressable>
          </>
        ) : null}

        {!needsApproval && accessStatus ? (
          <>
            <Text style={styles.subtitle}>Access approved</Text>
            <Text>Stream Chat MAU budget: {defaultMakerTierBudget.monthlyChatMauLimit}</Text>
            <Text>Observability provider: {mobileObservabilityProvider}</Text>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function SignedOutView() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    setSignInError(null);
    setIsSubmitting(true);

    try {
      const attempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId });
        return;
      }

      setSignInError("Sign-in is incomplete. Please finish required verification in Clerk.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      setSignInError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>TI Skills Economy</Text>
        <Text style={styles.subtitle}>Sign in to request invite-only access.</Text>
        <TextInput
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="Email"
          style={styles.plainInput}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          style={styles.plainInput}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        {signInError ? <Text style={styles.error}>{signInError}</Text> : null}
        <Pressable style={styles.button} onPress={() => void onSignInPress()} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? "Signing in..." : "Sign in"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const publishableKey = process.env.MOBILE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>TI Skills Economy</Text>
          <Text style={styles.error}>Set MOBILE_CLERK_PUBLISHABLE_KEY for mobile authentication.</Text>
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
          <InviteOnlyApp />
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1b1b1d",
  },
  subtitle: {
    fontSize: 15,
    color: "#4b4b55",
  },
  secondaryText: {
    fontSize: 13,
    color: "#4b4b55",
  },
  link: {
    color: "#1f1f24",
    textDecorationLine: "underline",
  },
  error: {
    color: "#8f1f1f",
  },
  inputRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d9d9dc",
    borderRadius: 8,
    overflow: "hidden",
  },
  inputPrefix: {
    backgroundColor: "#f0f0f2",
    color: "#4b4b55",
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1b1b1d",
  },
  plainInput: {
    borderWidth: 1,
    borderColor: "#d9d9dc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1b1b1d",
  },
  button: {
    backgroundColor: "#1f1f24",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

import { useAuth, useClerk, useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

import { inviteOnlyStyles as styles } from "./InviteOnlyStyles";

const QUORA_PROFILE_PREFIX = "https://quora.com/profile/";

interface AccessStatus {
  userId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  quoraProfileUrl: string | null;
  isApproved: boolean;
  isAdmin: boolean;
}

interface InviteOnlyViewProps {}

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
  const configured = process.env.RAILWAY_NEXT_PUBLIC_APP_URL?.trim();
  if (!configured) {
    return null;
  }

  return configured.endsWith("/") ? configured.slice(0, -1) : configured;
};

export function InviteOnlyView(props: InviteOnlyViewProps) {
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
      setStatusError("RAILWAY_NEXT_PUBLIC_APP_URL is missing.");
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
      setStatusError("RAILWAY_NEXT_PUBLIC_APP_URL is missing.");
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
    user?.firstName ?? user?.username ?? accessStatus?.firstName ?? accessStatus?.email ?? "Member";

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

        {!appUrl ? <Text style={styles.error}>Set RAILWAY_NEXT_PUBLIC_APP_URL to enable API access.</Text> : null}

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
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "../layout/AppShell";

interface AccessGateProps {
  streamChatMauLimit: number;
  observabilityProvider: string;
}

interface AccessUser {
  userId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  quoraProfileUrl: string | null;
  isApproved: boolean;
  isAdmin: boolean;
}

const QUORA_PROFILE_PREFIX = "https://quora.com/profile/";

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
  const cleanHandle = handle
    .trim()
    .replace(/^https?:\/\/(www\.)?quora\.com\/profile\//i, "")
    .replace(/^\//, "");

  if (!cleanHandle) {
    return null;
  }

  return `${QUORA_PROFILE_PREFIX}${cleanHandle}`;
};

export function AccessGate(props: AccessGateProps) {
  return <AccessGateWithClerk {...props} />;
}

function AccessGateWithClerk(props: AccessGateProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const [accessUser, setAccessUser] = useState<AccessUser | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [quoraHandle, setQuoraHandle] = useState("");

  const loadAccessStatus = useCallback(async () => {
    setIsFetching(true);
    setStatusError(null);

    try {
      const response = await fetch("/api/account/access-status", { method: "GET" });
      if (!response.ok) {
        throw new Error("Unable to load access status.");
      }

      const payload = (await response.json()) as AccessUser;
      setAccessUser(payload);
      setQuoraHandle(extractHandle(payload.quoraProfileUrl));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load access status.";
      setStatusError(message);
      setAccessUser(null);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void loadAccessStatus();
      return;
    }

    setAccessUser(null);
    setQuoraHandle("");
    setStatusError(null);
  }, [isLoaded, isSignedIn, loadAccessStatus]);

  useEffect(() => {
    if (!accessUser || accessUser.isApproved || accessUser.isAdmin) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadAccessStatus();
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [accessUser, loadAccessStatus]);

  const displayName = useMemo(() => {
    if (!accessUser) {
      return "Member";
    }

    const firstName = accessUser.firstName?.trim() ?? "";
    const lastName = accessUser.lastName?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || accessUser.email || "Member";
  }, [accessUser]);

  const saveQuoraProfile = async () => {
    setSaveError(null);
    const quoraProfileUrl = buildQuoraUrl(quoraHandle);

    if (!quoraProfileUrl) {
      setSaveError("Please enter your Quora profile handle.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/account/quora-profile-url", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quoraProfileUrl }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to save Quora profile URL.");
      }

      const updated = (await response.json()) as AccessUser;
      setAccessUser(updated);
      setQuoraHandle(extractHandle(updated.quoraProfileUrl));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save Quora profile URL.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <main className="access-center" aria-label="Loading authentication">
        <div className="access-card">
          <h1>Loading</h1>
          <p>Checking your sign-in status.</p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="access-center" aria-label="Invite-only sign in">
        <div className="access-card">
          <h1>TI Skills Economy</h1>
          <p>This platform is invite-only. Sign in to request access and submit your Quora profile URL.</p>
          <SignInButton mode="modal">
            <button type="button" className="access-primary-button">
              Sign in with Clerk
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  if (isFetching && !accessUser) {
    return (
      <main className="access-center" aria-label="Loading account access status">
        <div className="access-card">
          <h1>Loading</h1>
          <p>Preparing your account access status.</p>
        </div>
      </main>
    );
  }

  if (!accessUser) {
    return (
      <main className="access-center" aria-label="Access status error">
        <div className="access-card">
          <h1>Access check failed</h1>
          <p>{statusError ?? "We could not load your account access status."}</p>
          <button type="button" className="access-primary-button" onClick={() => void loadAccessStatus()}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  const needsApproval = !accessUser.isApproved && !accessUser.isAdmin;
  const hasQuoraProfile = Boolean(accessUser.quoraProfileUrl);

  if (needsApproval && !hasQuoraProfile) {
    return (
      <main className="access-center" aria-label="Submit Quora profile URL">
        <div className="access-card">
          <div className="access-header-row">
            <h1>Complete access request</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <p>
            Hi {displayName}. Submit your Quora profile URL so an administrator can review and approve your
            account.
          </p>
          <label htmlFor="quora-handle">Quora profile URL</label>
          <div className="access-input-row">
            <span>{QUORA_PROFILE_PREFIX}</span>
            <input
              id="quora-handle"
              type="text"
              value={quoraHandle}
              placeholder="farah-brunache"
              onChange={(event) => setQuoraHandle(event.target.value)}
            />
          </div>
          {saveError ? <p className="access-error">{saveError}</p> : null}
          <button type="button" className="access-primary-button" onClick={saveQuoraProfile} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Quora profile URL"}
          </button>
        </div>
      </main>
    );
  }

  if (needsApproval) {
    return (
      <main className="access-center" aria-label="Pending approval">
        <div className="access-card">
          <div className="access-header-row">
            <h1>Access pending approval</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <p>
            Your account request is pending administrator approval. You already submitted:
            <br />
            <strong>{accessUser.quoraProfileUrl}</strong>
          </p>
          <button type="button" className="access-primary-button" onClick={() => void loadAccessStatus()}>
            Refresh status
          </button>
          <p className="access-footnote">This page refreshes automatically every 30 seconds.</p>
        </div>
      </main>
    );
  }

  return (
    <AppShell
      streamChatMauLimit={props.streamChatMauLimit}
      observabilityProvider={props.observabilityProvider}
      isAdmin={accessUser.isAdmin}
    />
  );
}

"use client";

export const dynamic = "force-dynamic";

import { UserButton } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

interface AccessUser {
  userId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  quoraProfileUrl: string | null;
  isApproved: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface AccessStatus {
  userId: string;
  isAdmin: boolean;
}

const displayNameFor = (user: AccessUser): string => {
  const firstName = user.firstName?.trim() ?? "";
  const lastName = user.lastName?.trim() ?? "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || user.email || user.userId;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AccessUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const checkAdminAccess = useCallback(async () => {
    setIsCheckingAccess(true);
    setError(null);

    try {
      const response = await fetch("/api/account/access-status", { method: "GET" });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to access the admin page.");
        }
        throw new Error("Unable to verify admin access.");
      }

      const payload = (await response.json()) as AccessStatus;
      setIsAdminUser(Boolean(payload.isAdmin));
    } catch (checkError) {
      const message = checkError instanceof Error ? checkError.message : "Unable to verify admin access.";
      setError(message);
      setIsAdminUser(false);
    } finally {
      setIsCheckingAccess(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    if (!isAdminUser) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", { method: "GET" });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Admin access is required for this page.");
        }
        throw new Error("Unable to load users.");
      }

      const payload = (await response.json()) as AccessUser[];
      setUsers(payload);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load users.";
      setError(message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAdminUser]);

  useEffect(() => {
    void checkAdminAccess();
  }, [checkAdminAccess]);

  useEffect(() => {
    if (isCheckingAccess || !isAdminUser) {
      return;
    }

    void loadUsers();
  }, [isCheckingAccess, isAdminUser, loadUsers]);

  const toggleApproval = async (user: AccessUser) => {
    setSavingUserId(user.userId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(user.userId)}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isApproved: !user.isApproved }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to update approval.");
      }

      const updated = (await response.json()) as AccessUser;
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.userId === updated.userId ? updated : currentUser,
        ),
      );
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to update approval.";
      setError(message);
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <main className="admin-users-page" aria-label="Admin user approvals">
      <header className="admin-users-header">
        <div>
          <p className="admin-users-kicker">Admin</p>
          <h1>User approvals</h1>
          <p>Review Quora profile URLs and approve accounts for full platform access.</p>
        </div>
        <div className="admin-users-actions">
          <a href="/" className="admin-link-button">
            Back to app
          </a>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {isCheckingAccess ? <p>Checking admin access...</p> : null}
      {!isCheckingAccess && !error && !isAdminUser ? (
        <p className="access-error">Admin access is required for this page.</p>
      ) : null}
      {isAdminUser && isLoading ? <p>Loading users...</p> : null}
      {error ? <p className="access-error">{error}</p> : null}

      {isAdminUser && !isLoading && !error ? (
        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Quora profile</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>{displayNameFor(user)}</td>
                  <td>{user.email ?? "—"}</td>
                  <td>
                    {user.quoraProfileUrl ? (
                      <a href={user.quoraProfileUrl} target="_blank" rel="noreferrer">
                        {user.quoraProfileUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{user.isApproved ? "Approved" : "Pending"}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      type="button"
                      className="admin-approve-button"
                      onClick={() => void toggleApproval(user)}
                      disabled={savingUserId === user.userId}
                    >
                      {savingUserId === user.userId
                        ? "Saving..."
                        : user.isApproved
                          ? "Revoke"
                          : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}

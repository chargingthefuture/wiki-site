'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';

/**
 * Provider-agnostic authentication context and types.
 * This abstraction allows swapping auth providers (Clerk, Auth0, custom, etc.)
 * without breaking dependent components.
 */

export interface AuthUser {
  id: string;
  username?: string | null;
  email?: string | null;
  isAdmin?: boolean;
  isApproved?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void> | void;
  signOut: () => Promise<void> | void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Default no-op auth provider for local/unauthenticated development.
 * Replace with actual provider (Clerk, Auth0, etc.) as needed.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Future: Initialize auth from headers/cookies set by server
    // For now, assume no user (local_user by default on server)
    setUser(null);
    setIsLoading(false);
  }, []);

  const handleSignIn = async () => {
    // Future: Implement actual sign-in flow based on chosen provider
    // For now, this is a no-op
    console.warn('Sign-in not yet implemented. Choose and configure an auth provider.');
  };

  const handleSignOut = async () => {
    // Future: Implement actual sign-out flow
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context.
 * Provider-agnostic: works with any auth provider implementation.
 *
 * @throws {Error} if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, signIn } = useAuth();
 *
 * if (!isAuthenticated) {
 *   return <button onClick={signIn}>Sign In</button>;
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Re-export the useAuth hook from the client context.
 * This file provides a standard import path for the authentication hook.
 */
export { useAuth, AuthProvider } from '@/lib/auth/client-context';
export type { AuthContextType, AuthUser, AuthProviderProps } from '@/lib/auth/client-context';

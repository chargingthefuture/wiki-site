// Clerk authentication logic for genericPluginAuth
import { getClerkSecretKey } from '../../web/lib/auth/clerk-env';
import jwt from 'jsonwebtoken';

/**
 * Verifies Clerk JWT and returns user ID if valid.
 * @param token Clerk JWT
 * @returns userId or null
 */
export function verifyClerkToken(token: string): string | null {
  const secret = getClerkSecretKey();
  if (!secret) return null;
  try {
    const decoded = jwt.verify(token, secret) as { sub?: string };
    return decoded.sub || null;
  } catch {
    return null;
  }
}

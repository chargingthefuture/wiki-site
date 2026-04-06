// React Native hook for generic plugin authentication
// Uses the canonical shared logic for plugin auth

import { useEffect, useState } from 'react';
import { authenticatePluginUser, PluginAuthContext, PluginAuthResult } from '../../../../shared/auth/genericPluginAuth';

export function usePluginAuth(provider: PluginAuthContext['provider'], token?: string) {
  const [auth, setAuth] = useState<PluginAuthResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    authenticatePluginUser({ provider, token })
      .then((result) => {
        setAuth(result);
        setLoading(false);
      })
      .catch(() => {
        setAuth({ isAuthenticated: false, provider, error: 'Auth failed' });
        setLoading(false);
      });
  }, [provider, token]);

  return { auth, loading };
}

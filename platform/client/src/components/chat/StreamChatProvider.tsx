import React, { type ReactNode, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';

type Props = { children: ReactNode };

export function StreamChatProvider({ children }: Props) {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const resp = await fetch('/api/stream/token');
        if (!resp.ok) throw new Error('Failed to fetch stream token');
        const data = await resp.json();
        const { apiKey, token, user } = data;

        const c = new StreamChat(apiKey, {
          timeout: 60000,
        });

        await c.connectUser({ id: user.id, name: user.name, image: user.image || undefined }, token);

        if (mounted) {
          setClient(c);
          setReady(true);
        }
      } catch (err) {
        Sentry.captureException(err);
      }
    }

    init();

    return () => {
      mounted = false;
      if (client) {
        client.disconnectUser().catch(() => undefined);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => client, [client]);

  if (!ready || !value) return <>{/* lightweight placeholder while chat loads */}</>;

  return (
    <Chat client={value} theme="messaging dark">
      {children}
    </Chat>
  );
}

export default StreamChatProvider;

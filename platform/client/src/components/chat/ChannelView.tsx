import React, { useEffect, useMemo } from 'react';
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  TypingIndicator,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

function ModerationActions({ message }: any) {
  const handleReport = async () => {
    const messageId = message?.id;
    if (!messageId) {
      alert('Unable to report: message not available.');
      return;
    }

    try {
      await fetch('/api/stream/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, reason: 'user_report' }),
      });
      alert('Message reported. Moderators will review.');
    } catch (err) {
      console.error(err);
      alert('Failed to report message.');
    }
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      <button onClick={handleReport} className="text-rose-600">Report</button>
    </div>
  );
}

function CustomMessage({ message, ...props }: any) {
  if (!message) return null;

  const userId = message?.user?.id;
  const blocked = typeof window !== 'undefined' && userId ? !!localStorage.getItem(`blocked_${userId}`) : false;

  const handleBlock = () => {
    if (!userId) return;
    localStorage.setItem(`blocked_${userId}`, '1');
    window.location.reload();
  };

  if (blocked) {
    return (
      <div className="p-2 text-sm italic text-muted-foreground">Message hidden. <button onClick={() => { localStorage.removeItem(`blocked_${userId}`); window.location.reload(); }} className="underline">Unmute</button></div>
    );
  }

  return (
    <div className="p-2">
      <div className="text-sm">{message?.text}</div>
      <div className="mt-1 flex items-center justify-between">
        <ModerationActions message={message} />
        <button onClick={handleBlock} className="text-xs text-muted-foreground">Block</button>
      </div>
    </div>
  );
}

export default function ChannelView() {
  const { client } = useChatContext();
  const channel = useMemo(() => {
    if (!client) return null;
    return client.channel('messaging', 'community-support', { name: 'Community Support' });
  }, [client]);

  // Debug state: expose messages count and last message for troubleshooting
  const [debugMessagesCount, setDebugMessagesCount] = React.useState<number | null>(null);
  const [debugLastMessage, setDebugLastMessage] = React.useState<any>(null);

  // Ensure user is added to the channel server-side before connecting
  useEffect(() => {
    let mounted = true;
    if (!channel) return;
    (async () => {
      try {
        await fetch('/api/stream/join', { method: 'POST', credentials: 'same-origin' });
        // Ensure the channel is watched so messages are loaded into the client
        try {
          await channel.watch();
        } catch (watchErr) {
          console.warn('channel.watch() failed:', watchErr);
        }
        // set up event listeners to surface incoming messages
        try {
          const handleNew = (event: any) => {
            try {
              const msgs = channel.state?.messages || [];
              setDebugMessagesCount(msgs.length);
              setDebugLastMessage(msgs[msgs.length - 1] || null);
              console.debug('stream:event message.new', event, msgs[msgs.length - 1]);
            } catch (e) {
              console.error('debug handleNew error', e);
            }
          };

          channel.on && channel.on('message.new', handleNew);
          // also seed initial state
          const initialMsgs = channel.state?.messages || [];
          setDebugMessagesCount(initialMsgs.length);
          setDebugLastMessage(initialMsgs[initialMsgs.length - 1] || null);
        } catch (e) {
          console.warn('failed to attach message listeners', e);
        }
      } catch (err) {
        if (mounted) console.warn('Failed to join community channel via server:', err);
      }
    })();
    return () => { mounted = false; };
  }, [channel]);

  if (!channel) return <div className="p-4">Connecting…</div>;

  return (
    <Channel channel={channel} doAutoConnect>
      <div className="flex flex-col h-[60vh] md:h-[70vh]">
        <ChannelHeader />
        <div className="flex-1 overflow-auto">
          <MessageList Message={CustomMessage} />
        </div>
        {/* Debug panel (temporary) */}
        <div className="px-2 py-1 text-xs text-muted-foreground bg-slate-900 border-t border-slate-800">
          <div>Messages in channel: {debugMessagesCount ?? '—'}</div>
          <div className="truncate">Last message: {debugLastMessage ? JSON.stringify({ id: debugLastMessage.id, text: debugLastMessage.text, userId: debugLastMessage.user?.id }).slice(0, 200) : '—'}</div>
        </div>
        <div className="px-2 pb-2">
          <MessageInput focus />
        </div>
        <Thread />
        <div className="px-2 py-1 text-xs text-muted-foreground">
          <TypingIndicator />
        </div>
      </div>
    </Channel>
  );
}

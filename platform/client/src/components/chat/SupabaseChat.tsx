/**
 * Supabase Realtime Chat Component
 * 
 * Handles real-time messaging using Supabase realtime subscriptions
 * and REST API for posting messages.
 */

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { ChatMessage } from '@shared/schema';
import { formatChatName } from '@shared/schema';
import * as Sentry from '@sentry/react';
import { format } from 'date-fns';
import { ChatBadge } from './chat-badge';

interface Message extends ChatMessage {
  isSending?: boolean;
}

export default function SupabaseChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const resp = await fetch('/api/chat/messages?limit=50');
        if (!resp.ok) throw new Error('Failed to load messages');
        const data = await resp.json();
        setMessages(data);
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // In production, set up a polling interval to check for new messages
  // (Supabase realtime would be ideal, but this is simpler for MVP)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const resp = await fetch('/api/chat/messages?limit=50');
        if (!resp.ok) return;
        const data = await resp.json();
        setMessages(prev => {
          // Avoid duplicates by checking IDs
          const existingIds = new Set(prev.map(m => m.id));
          const newMessages = data.filter((m: ChatMessage) => !existingIds.has(m.id));
          return [...prev, ...newMessages];
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    const tempId = `temp_${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      channelId: 'community-support',
      userId: user.id,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      userImage: user.profileImageUrl || undefined,
      text: messageText,
      createdAt: new Date(),
      updatedAt: new Date(),
      isSending: true,
    };

    // Optimistic update
    const messageToSend = messageText.trim();
    setMessages(prev => [...prev, tempMessage]);
    setMessageText('');
    setSending(true);

    try {
      const resp = await fetch('/api/chat/messages', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageToSend }),
      });

      if (!resp.ok) {
        throw new Error('Failed to send message');
      }

      const sentMessage = await resp.json();
      setMessages(prev => prev.map(m => m.id === tempId ? sentMessage : m));
    } catch (err) {
      Sentry.captureException(err);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[60vh] md:h-[70vh] bg-card text-foreground">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading chat…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[60vh] md:h-[70vh] bg-card text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-background p-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Community Support Live Chat</h2>
          <ChatBadge testId="chat" />
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center text-muted-foreground h-full">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.userId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                  msg.userId === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                } ${msg.isSending ? 'opacity-50' : ''}`}
              >
                <p className="text-xs font-semibold mb-1">
                  {formatChatName(msg.firstName, msg.lastName)}
                </p>
                <p className="text-sm break-words">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {format(new Date(msg.createdAt), 'MMM d, yyyy')} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-border bg-background p-3 flex-shrink-0"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type message…"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            disabled={sending}
            className="flex-1 min-w-0 bg-muted text-foreground placeholder-muted-foreground rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!messageText.trim() || sending}
            className="flex-shrink-0 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground px-3 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors"
          >
            {sending ? '…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}

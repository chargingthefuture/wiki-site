"use client";

import { useEffect, useMemo, useState } from 'react';
import type { ChymeMessage, ChymeParticipant, ChymeRoomResponse } from '@/src/lib/chyme/types';

type RequestState = 'idle' | 'loading' | 'success' | 'error';

type JoinResult = {
  streamChannelId: string;
  streamUserId: string;
};

function errorMessageFromUnknown(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error';
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) {
    const message = typeof body?.message === 'string' ? body.message : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body as T;
}

export function ChymeShell() {
  const [roomState, setRoomState] = useState<ChymeRoomResponse | null>(null);
  const [messages, setMessages] = useState<ChymeMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loadState, setLoadState] = useState<RequestState>('idle');
  const [chatState, setChatState] = useState<RequestState>('idle');
  const [joinState, setJoinState] = useState<RequestState>('idle');
  const [deleteState, setDeleteState] = useState<RequestState>('idle');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [joinResult, setJoinResult] = useState<JoinResult | null>(null);

  const roomParticipants: ChymeParticipant[] = useMemo(() => roomState?.participants ?? [], [roomState]);

  async function loadRoomAndMessages() {
    setLoadState('loading');
    setErrorText(null);

    try {
      const room = await parseJsonResponse<ChymeRoomResponse>(await fetch('/api/chyme/room', { cache: 'no-store' }));
      const messagesResponse = await parseJsonResponse<{ roomKey: string; messages: ChymeMessage[] }>(
        await fetch('/api/chyme/messages?limit=100', { cache: 'no-store' }),
      );

      setRoomState(room);
      setMessages(messagesResponse.messages);
      setLoadState('success');
    } catch (error) {
      setErrorText(errorMessageFromUnknown(error));
      setLoadState('error');
    }
  }

  async function handleSendMessage() {
    const trimmed = messageText.trim();
    if (trimmed.length === 0) {
      setErrorText('Message cannot be empty.');
      return;
    }

    setChatState('loading');
    setErrorText(null);

    try {
      const response = await parseJsonResponse<{ ok: true; message: ChymeMessage }>(
        await fetch('/api/chyme/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: trimmed }),
        }),
      );

      setMessages((currentMessages) => [...currentMessages, response.message]);
      setMessageText('');
      setChatState('success');
    } catch (error) {
      setChatState('error');
      setErrorText(errorMessageFromUnknown(error));
    }
  }

  async function handleJoinCall() {
    setJoinState('loading');
    setErrorText(null);

    try {
      const response = await parseJsonResponse<{
        ok: true;
        streamChannelId: string;
        streamUserId: string;
      }>(
        await fetch('/api/chyme/join', {
          method: 'POST',
        }),
      );

      setJoinResult({
        streamChannelId: response.streamChannelId,
        streamUserId: response.streamUserId,
      });
      setRoomState((currentRoomState) => {
        if (!currentRoomState) {
          return currentRoomState;
        }

        return {
          ...currentRoomState,
          callActive: true,
        };
      });
      setJoinState('success');
    } catch (error) {
      setJoinState('error');
      setErrorText(errorMessageFromUnknown(error));
    }
  }

  async function handleDeleteChymeProfile() {
    setDeleteState('loading');
    setErrorText(null);

    try {
      await parseJsonResponse(await fetch('/api/account/chyme-profile', { method: 'DELETE' }));
      setDeleteState('success');
      await loadRoomAndMessages();
    } catch (error) {
      setDeleteState('error');
      setErrorText(errorMessageFromUnknown(error));
    }
  }

  async function handleRequestFullAccountDeletion() {
    setDeleteState('loading');
    setErrorText(null);

    try {
      await parseJsonResponse(await fetch('/api/account/full-account', { method: 'DELETE' }));
      setDeleteState('success');
    } catch (error) {
      setDeleteState('error');
      setErrorText(errorMessageFromUnknown(error));
    }
  }

  useEffect(() => {
    void loadRoomAndMessages();
  }, []);

  return (
    <main>
      <h1>Chyme</h1>
      <p>Room bootstrap, chat, call join, and deletion flows.</p>

      {errorText ? <p role="alert">Error: {errorText}</p> : null}

      <section>
        <h2>Room</h2>
        <p>Load state: {loadState}</p>
        <p>Room name: {roomState?.roomName ?? 'loading...'}</p>
        <p>Room key: {roomState?.roomKey ?? 'loading...'}</p>
        <p>Call active: {roomState?.callActive ? 'yes' : 'no'}</p>
      </section>

      <section>
        <h2>Participants ({roomParticipants.length})</h2>
        <ul>
          {roomParticipants.map((participant) => (
            <li key={participant.userId}>
              {participant.displayName} ({participant.role})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Chat</h2>
        <p>Message state: {chatState}</p>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              <strong>{message.displayName}</strong>: {message.text}
            </li>
          ))}
        </ul>

        <label htmlFor="chyme-message">Message</label>
        <input
          id="chyme-message"
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          maxLength={1000}
        />
        <button type="button" onClick={() => void handleSendMessage()} disabled={chatState === 'loading'}>
          Send
        </button>
      </section>

      <section>
        <h2>Join Chyme Call</h2>
        <p>Join state: {joinState}</p>
        {joinResult ? (
          <p>
            Joined as {joinResult.streamUserId} on channel {joinResult.streamChannelId}
          </p>
        ) : null}
        <button type="button" onClick={() => void handleJoinCall()} disabled={joinState === 'loading'}>
          Join Call
        </button>
      </section>

      <section>
        <h2>Deletion</h2>
        <p>Deletion state: {deleteState}</p>
        <button type="button" onClick={() => void handleDeleteChymeProfile()} disabled={deleteState === 'loading'}>
          Delete Chyme Data
        </button>
        <button type="button" onClick={() => void handleRequestFullAccountDeletion()} disabled={deleteState === 'loading'}>
          Delete Full Account
        </button>
      </section>
    </main>
  );
}

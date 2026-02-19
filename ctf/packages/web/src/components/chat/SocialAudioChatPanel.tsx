"use client";

import type { ChymeChatMessage } from "@ctf/shared";
import { getChymeChatMessages, sendChymeChatMessage } from "@ctf/shared";
import { useEffect, useState } from "react";

export function SocialAudioChatPanel() {
  const [messages, setMessages] = useState<ChymeChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      try {
        const loadedMessages = await getChymeChatMessages();
        if (mounted) {
          setMessages(loadedMessages);
        }
      } catch {
        if (mounted) {
          setStatus("Unable to load room chat.");
        }
      }
    };

    void loadMessages();

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const safeText = input.trim();
    if (!safeText) {
      return;
    }

    try {
      const createdMessage = await sendChymeChatMessage(safeText);
      setMessages((previous) => [...previous, createdMessage]);
      setInput("");
      setStatus("");
    } catch {
      setStatus("Unable to send message.");
    }
  };

  return (
    <div className="chat-panel">
      <header className="chat-panel-header">
        <h2>Chyme Room Chat</h2>
        <p>Companion text chat for social audio</p>
      </header>

      {status ? <p className="chat-status">{status}</p> : null}

      <div className="chat-message-list" role="log" aria-live="polite">
        {messages.map((message) => (
          <article key={message.id} className="chat-message">
            <p className="chat-author">{message.authorDisplayName}</p>
            <p>{message.text}</p>
          </article>
        ))}
      </div>

      <form className="chat-input-row" onSubmit={onSubmit}>
        <label htmlFor="chyme-chat-input" className="sr-only">
          Send message to Chyme room chat
        </label>
        <input
          id="chyme-chat-input"
          name="chyme-chat-input"
          type="text"
          placeholder="Send message"
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

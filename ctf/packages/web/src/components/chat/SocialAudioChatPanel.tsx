const chatMessages = [
  { id: "m1", author: "Ari", text: "Welcome to the Chyme voice room." },
  { id: "m2", author: "Noa", text: "Keeping this room focused and calm." },
  { id: "m3", author: "Kai", text: "Raise hand if you want to speak next." },
];

export function SocialAudioChatPanel() {
  return (
    <div className="chat-panel">
      <header className="chat-panel-header">
        <h2>Chyme Room Chat</h2>
        <p>Companion text chat for social audio</p>
      </header>

      <div className="chat-message-list" role="log" aria-live="polite">
        {chatMessages.map((message) => (
          <article key={message.id} className="chat-message">
            <p className="chat-author">{message.author}</p>
            <p>{message.text}</p>
          </article>
        ))}
      </div>

      <form className="chat-input-row" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="chyme-chat-input" className="sr-only">
          Send message to Chyme room chat
        </label>
        <input id="chyme-chat-input" name="chyme-chat-input" type="text" placeholder="Send message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

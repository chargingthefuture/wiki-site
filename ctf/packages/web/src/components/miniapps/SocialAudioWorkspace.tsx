interface SocialAudioWorkspaceProps {
  streamChatMauLimit: number;
  observabilityProvider: string;
}

const activeSpeakers = [
  { id: "1", name: "Ari", status: "Speaking" },
  { id: "2", name: "Noa", status: "Listening" },
  { id: "3", name: "Kai", status: "Listening" },
  { id: "4", name: "Remy", status: "Listening" },
];

export function SocialAudioWorkspace(props: SocialAudioWorkspaceProps) {
  return (
    <div className="workspace">
      <header className="workspace-header">
        <div>
          <p className="workspace-service-tag">Mini-App: Chyme</p>
          <h2>Chyme Social Audio Room</h2>
          <p className="workspace-subtitle">Simple clubhouse-style audio with low distraction.</p>
        </div>
        <button type="button" className="join-call-button">
          Join Call
        </button>
      </header>

      <section className="speaker-grid" aria-label="Current room participants">
        {activeSpeakers.map((speaker) => (
          <article key={speaker.id} className="speaker-card">
            <div className="speaker-avatar" aria-hidden="true">
              {speaker.name.slice(0, 1)}
            </div>
            <h3>{speaker.name}</h3>
            <p>{speaker.status}</p>
          </article>
        ))}
      </section>

      <footer className="workspace-footer">
        <p>Stream Chat MAU budget: {props.streamChatMauLimit}</p>
        <p>Observability: {props.observabilityProvider}</p>
      </footer>
    </div>
  );
}

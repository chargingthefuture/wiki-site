import { LeftNavigation } from "../navigation/LeftNavigation";
import { SocialAudioWorkspace } from "../miniapps/SocialAudioWorkspace";
import { SocialAudioChatPanel } from "../chat/SocialAudioChatPanel";

interface AppShellProps {
  streamChatMauLimit: number;
  observabilityProvider: string;
}

export function AppShell(props: AppShellProps) {
  return (
    <main className="shell" aria-label="TI Skills Economy application shell">
      <section className="shell-nav" aria-label="Primary navigation">
        <LeftNavigation />
      </section>

      <section className="shell-main" aria-label="Mini-app workspace">
        <SocialAudioWorkspace
          streamChatMauLimit={props.streamChatMauLimit}
          observabilityProvider={props.observabilityProvider}
        />
      </section>

      <section className="shell-chat" aria-label="Social audio room chat">
        <SocialAudioChatPanel />
      </section>
    </main>
  );
}

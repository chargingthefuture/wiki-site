import { LeftNavigation } from "../navigation/LeftNavigation";

interface AppShellProps {
  isAdmin?: boolean;
}

export function AppShell(props: AppShellProps) {
  return (
    <main className="shell" aria-label="TI Skills Economy application shell">
      <section className="shell-nav" aria-label="Primary navigation">
        <LeftNavigation />
      </section>
    </main>
  );
}

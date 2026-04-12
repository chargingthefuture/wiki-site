import { SocketRelay } from '@/components/mockups/survivor-hub/SocketRelay';

type SocketRelayShellProps = {
  userId: string;
  role: string | null;
  isAdmin: boolean;
};

export async function SocketRelayShell(props: SocketRelayShellProps) {
  void props;
  return <SocketRelay />;
}

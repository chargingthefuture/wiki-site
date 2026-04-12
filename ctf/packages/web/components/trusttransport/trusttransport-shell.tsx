import { TrustTransport } from '@/components/mockups/survivor-hub/TrustTransport';

type TrustTransportShellProps = {
  userId: string;
  isAdmin: boolean;
};

export async function TrustTransportShell(props: TrustTransportShellProps) {
  void props;
  return <TrustTransport />;
}

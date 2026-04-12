import { PeerProgramming } from '@/components/mockups/survivor-hub/PeerProgramming';

type PeerProgrammingShellProps = {
  userId: string;
  isAdmin: boolean;
};

export async function PeerProgrammingShell(props: PeerProgrammingShellProps) {
  void props;
  return <PeerProgramming />;
}

import { Directory } from '@/components/mockups/survivor-hub/Directory';

type DirectoryShellProps = {
  userId: string;
  isAdmin: boolean;
};

export async function DirectoryShell(props: DirectoryShellProps) {
  void props;
  return <Directory />;
}

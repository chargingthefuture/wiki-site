import { Foundation } from './Foundation';

type FoundationShellProps = {
  userId: string;
  isAdmin: boolean;
};

export async function FoundationShell(props: FoundationShellProps) {
  void props;
  return <Foundation />;
}
